'use strict'
// The game's dedicated server. The game page itself, unchanged, is served on loopback and run in headless Chromium in its
// server mode. Hook modules from HOOKS_DIR run inside the page against its hooks (globalThis.gameHooks). Every event goes
// out as a JSON line on stdout and, signed, to each webhook that wants it. A small HTTP API acts on the room.
// Configuration is the environment; see README.md.
const fs = require('fs'), path = require('path'), http = require('http'), crypto = require('crypto')

const env = process.env
const say = msg => process.stderr.write(msg + '\n')
const die = (msg, code = 2) => { say('server: ' + msg); process.exit(code) }
const sleep = ms => new Promise(ok => setTimeout(ok, ms))
const blank = v => v === undefined || v === ''
// a broadcast the game takes, as the page judges it too
const streamOk = u => { try { const p = new URL(u); return u.length <= 1024 && p.protocol === 'https:' && !p.username && !p.password } catch (e) { return false } }
// A setting's file. Its errors name the setting, never the path, which may be the secret itself given by mistake
const readFile = (f, what) => { try { return fs.readFileSync(f, 'utf8') } catch (e) { die(what + ': cannot read the file (' + (e.code || e.name) + ')') } }
const read = (f, what) => readFile(f, what).trim()
// A file of JSON. A fault is told by its line and column, never by the text around it, which may hold a secret
function readJson(f, what) {
  const text = readFile(f, what)
  try { return JSON.parse(text) } catch (e) { die(what + ': not valid JSON at ' + jsonFault(text, e)) }
}
// V8 gives most faults' line and column; an unexpected token is the last character of the shortest prefix that fails
// on something other than its end
function jsonFault(text, e) {
  const at = /\(line (\d+) column (\d+)\)/.exec(e.message)
  if (at) return 'line ' + at[1] + ', column ' + at[2]
  const ends = s => { try { JSON.parse(s); return true } catch (e) { const p = /at position (\d+)/.exec(e.message); return /end of JSON input/.test(e.message) || !!p && +p[1] >= s.length } }
  let lo = 0, hi = text.length, fault = text.length
  if (!ends(text)) { while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (ends(text.slice(0, mid))) lo = mid; else hi = mid } fault = hi - 1 }
  const lines = text.slice(0, fault).split('\n')
  return 'line ' + lines.length + ', column ' + (lines[lines.length - 1].length + 1)
}

// ---- configuration
const number = (k, lo, hi, whole) => {
  if (blank(env[k])) return undefined
  const n = Number(env[k])
  if (!(Number.isFinite(n) && n >= lo && n <= hi && (!whole || Number.isInteger(n)))) die(`${k} must be ${whole ? 'a whole number' : 'a number'} from ${lo} to ${hi}`)
  return n
}
// '*': every type; 'a,b': those; '-a,-b': every type but those
const types = (v, what) => {
  const list = (Array.isArray(v) ? v : String(v).split(',')).map(s => String(s).trim()).filter(Boolean)
  if (!list.length) die(what + ': no event types')
  if (list.length === 1 && list[0] === '*') return () => true
  const no = list.filter(s => s.startsWith('-')).map(s => s.slice(1)), yes = list.filter(s => !s.startsWith('-'))
  if (no.length && yes.length) die(what + ': list the types to send, or the types to leave out, not both')
  return no.length ? t => !no.includes(t) : t => yes.includes(t)
}
const WEBHOOK_DEFAULT = '-damage,-chat'
function webhook(h, where, secretFile) {
  if (!h || typeof h !== 'object') die(where + ': a webhook is { url, secret | secretFile, events }')
  let u
  try { u = new URL(h.url) } catch (e) { die(where + ': its url is not a URL') }
  if (u.protocol !== 'https:') die(where + ': a webhook url must be https')
  const file = h.secretFile ?? ''
  if (typeof file !== 'string') die(secretFile + ' must be a path')
  const secret = file ? read(file, secretFile) : h.secret
  if (typeof secret !== 'string' || !secret.trim()) die(where + ': needs a secret, a string (secret, or secretFile)')
  return new Webhook(u.href, u.origin, secret, types(h.events ?? WEBHOOK_DEFAULT, where))
}
function webhooks() {
  const out = [], file = env.WEBHOOKS_FILE || '/config/webhooks.json'
  if (fs.existsSync(file)) {
    const list = readJson(file, file)
    if (!Array.isArray(list)) die(file + ' must hold a list of webhooks')
    list.forEach((h, i) => out.push(webhook(h, file + ' #' + (i + 1), file + ' #' + (i + 1) + ': its secretFile')))
  } else if (!blank(env.WEBHOOKS_FILE)) die('WEBHOOKS_FILE: no such file')
  if (!blank(env.WEBHOOK_URL))
    out.push(webhook({ url: env.WEBHOOK_URL, secret: env.WEBHOOK_SECRET, secretFile: env.WEBHOOK_SECRET_FILE, events: env.WEBHOOK_EVENTS }, 'WEBHOOK_URL', 'WEBHOOK_SECRET_FILE'))
  return out
}

// ---- webhooks: one request in flight each, so events arrive in order; a failed one is sent again, the same bytes, until
// five minutes after it happened. Each attempt carries its own timestamp and signature.
const BACKOFF_S = [1, 5, 30, 60], GIVE_UP_MS = 5 * 60000, QUEUE_MAX = 10000, ATTEMPT_MS = 10000
class Webhook {
  constructor(url, origin, secret, wants) {
    Object.assign(this, { url, origin, wants, queue: [], busy: false, delivered: 0, dropped: 0, failing: '', toldDrops: 0 })
    Object.defineProperty(this, 'secret', { value: secret, enumerable: false })
  }
  push(e) {
    this.queue.push(e)
    if (this.queue.length > QUEUE_MAX) { this.queue.splice(this.busy ? 1 : 0, 1); this.drop('the queue is full') }
    this.run()
  }
  drop(why) {
    this.dropped++
    if (Date.now() - this.toldDrops > 10000) { this.toldDrops = Date.now(); say(`webhook ${this.origin}: dropped an event (${why}); ${this.dropped} so far`) }
  }
  async run() {
    if (this.busy) return
    this.busy = true
    while (this.queue.length) {
      const e = this.queue[0]
      if (Date.now() - e.at > GIVE_UP_MS) { this.queue.shift(); this.drop('not delivered within five minutes'); continue }
      if (await this.post(e)) {
        this.queue.shift(); this.delivered++
        if (this.failing) { this.failing = ''; say(`webhook ${this.origin}: delivering again`) }
        continue
      }
      if (!this.failing) say(`webhook ${this.origin}: ${this.why}; trying again`)
      this.failing = this.why
      await sleep(Math.min(BACKOFF_S[Math.min(e.tries, BACKOFF_S.length) - 1] * 1000, Math.max(0, e.at + GIVE_UP_MS - Date.now())))
    }
    this.busy = false
  }
  async post(e) {
    e.tries++
    const ts = String(Math.floor(Date.now() / 1000))
    const signature = 'sha256=' + crypto.createHmac('sha256', this.secret).update(ts + '.' + e.body).digest('hex')
    try {
      const r = await fetch(this.url, { method: 'POST', body: e.body, redirect: 'manual', signal: AbortSignal.timeout(ATTEMPT_MS),
        headers: { 'Content-Type': 'application/json', 'X-Game-Event-Id': e.id, 'X-Game-Timestamp': ts, 'X-Game-Signature': signature } })
      await r.arrayBuffer().catch(() => {})
      if (r.status >= 200 && r.status < 300) return true
      this.why = 'answered ' + r.status
    } catch (err) {
      this.why = err.name === 'TimeoutError' ? 'no answer in ' + ATTEMPT_MS / 1000 + ' s' : 'unreachable (' + (err.cause?.code || err.name) + ')'
    }
    return false
  }
  get status() { return { origin: this.origin, queued: this.queue.length, delivered: this.delivered, dropped: this.dropped, failing: this.failing || null } }
}

const CFG = {
  game: env.GAME_FILE || path.join(__dirname, 'game.html'),
  joinUrl: env.JOIN_URL || '',
  hooksDir: path.resolve(env.HOOKS_DIR || '/hooks'),
  broadcast: blank(env.BROADCAST_URL) ? '' : streamOk(env.BROADCAST_URL) ? env.BROADCAST_URL
    : die('BROADCAST_URL: an https URL with no credentials in it, at most 1024 characters'),
  stdout: types(env.STDOUT_EVENTS || '*', 'STDOUT_EVENTS'),
  serve: Object.fromEntries(Object.entries({
    code: env.ROOM_CODE, level: env.LEVEL, name: env.SERVER_NAME,
    frags: number('FRAGS', 0, 200, true), minutes: number('MINUTES', 0, 60), enemies: number('ENEMIES', 0, 100, true),
    // the city's seed, so a seed liked once can be played again; unset, each match gets a fresh one. Passed only when set,
    // so a copy of the game without seeds still serves
    seed: number('SEED', 0, 4294967295, true),
  }).filter(([, v]) => !blank(v))),
  api: { host: env.ACTION_HOST || '127.0.0.1', port: number('ACTION_PORT', 0, 65535, true) ?? 8080,
         token: env.ACTION_TOKEN_FILE ? read(env.ACTION_TOKEN_FILE, 'ACTION_TOKEN_FILE') || die('ACTION_TOKEN_FILE: the file is empty') : env.ACTION_TOKEN || '' },
}
if (!blank(env.MODE)) say('MODE: the setting is gone, and every game is free-for-all; MODE=' + JSON.stringify(env.MODE).slice(0, 40) + ' is ignored')
const HOOKS = webhooks()
const LOOPBACK = /^(127\.\d+\.\d+\.\d+|::1|localhost)$/
if (CFG.api.port && !LOOPBACK.test(CFG.api.host) && !CFG.api.token)
  die(`the action API on ${CFG.api.host} is beyond loopback: set ACTION_TOKEN or ACTION_TOKEN_FILE, or keep ACTION_HOST=127.0.0.1`)
// ---- the city's changes (card #46; in tiles since card #70): broken glass, lamps knocked out, craters, and whatever else the
// game keeps, saved where this server runs. The page names each thing it keeps: a city's tiles (world-<seed>-<size>/t-<x>-<z>,
// 960 m of the world each: the page reads a tile in as players come near it and lets it go when they leave, so only what is
// in play is held), its manifest (world-<seed>-<size>/manifest, written after its tiles), or a whole city saved before the
// tiles (world-<seed>-<size>, read once and written out as tiles). WORLD_DIR, a directory (a volume), keeps them as files, a
// city's tiles in its own directory; R2 keeps them as objects under R2_PREFIX (R2_ENDPOINT, R2_BUCKET, R2_ACCESS_KEY_ID and
// R2_SECRET_ACCESS_KEY or its _FILE; R2_REGION, default auto). With R2 set, WORLD_DIR holds only what is in play: a tile the
// page lets go is dropped from it once R2 has its last version. Neither set: nothing is kept. A save R2 didn't take is tried
// again every 30 s and when the server stops, and (with WORLD_DIR) after a restart. Each request to R2 is signed (AWS
// Signature Version 4), with no library; its secret is never printed, and neither are the paths.
const WORLD_KEY = /^world-\d{1,10}-\d{1,2}(-p\d{1,3})?(\/(manifest|t-(-?\d{1,4})-(-?\d{1,4})))?$/      // -p: the plan's content version
const WORLD_DIR = blank(env.WORLD_DIR) ? '' : path.resolve(env.WORLD_DIR)
// made if missing, but only the last directory (a volume's mount gives the rest): a recursive mkdir can loop on a special
// filesystem's parents
if (WORLD_DIR) try { if (!fs.existsSync(WORLD_DIR)) fs.mkdirSync(WORLD_DIR); fs.accessSync(WORLD_DIR, fs.constants.W_OK) } catch (e) { die('WORLD_DIR: cannot write there (' + (e.code || e.name) + ')') }
const R2 = (() => {
  const names = ['R2_ENDPOINT', 'R2_BUCKET', 'R2_ACCESS_KEY_ID'], given = names.filter(k => !blank(env[k]))
  const secret = env.R2_SECRET_ACCESS_KEY_FILE ? read(env.R2_SECRET_ACCESS_KEY_FILE, 'R2_SECRET_ACCESS_KEY_FILE') : env.R2_SECRET_ACCESS_KEY || ''
  if (!given.length && !secret) return null
  if (given.length < names.length || !secret) die('R2: set R2_ENDPOINT, R2_BUCKET, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY (or R2_SECRET_ACCESS_KEY_FILE), or none of them')
  let u
  try { u = new URL(env.R2_ENDPOINT) } catch (e) { die('R2_ENDPOINT: not a URL') }
  if (u.protocol !== 'https:' && !(u.protocol === 'http:' && LOOPBACK.test(u.hostname))) die('R2_ENDPOINT: an https URL (http only on loopback, for a stand-in)')
  if (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(env.R2_BUCKET)) die('R2_BUCKET: not a bucket name')
  const r = { origin: u.origin, host: u.host, bucket: env.R2_BUCKET, id: env.R2_ACCESS_KEY_ID, region: env.R2_REGION || 'auto', prefix: (env.R2_PREFIX || '').replace(/^\/+/, '') }
  Object.defineProperty(r, 'secret', { value: secret, enumerable: false })
  return r
})()
const sha256 = d => crypto.createHash('sha256').update(d).digest('hex'), hmac = (k, d) => crypto.createHmac('sha256', k).update(d).digest()
// one signed request to R2 for a kept thing's object: GET it, or PUT a body
function r2Request(method, name, body) {
  const t = new Date().toISOString().replace(/[-:]|\.\d{3}/g, ''), day = t.slice(0, 8), scope = day + '/' + R2.region + '/s3/aws4_request'
  const esc = s => encodeURIComponent(s).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
  const uri = '/' + [R2.bucket, ...(R2.prefix + name + '.json').split('/')].map(esc).join('/'), hash = sha256(body || '')
  const headers = { host: R2.host, 'x-amz-content-sha256': hash, 'x-amz-date': t, ...body ? { 'content-type': 'application/json' } : {} }
  const names = Object.keys(headers).sort(), signed = names.join(';')
  const canonical = [method, uri, '', ...names.map(n => n + ':' + headers[n]), '', signed, hash].join('\n')
  const key = hmac(hmac(hmac(hmac('AWS4' + R2.secret, day), R2.region), 's3'), 'aws4_request')
  const signature = crypto.createHmac('sha256', key).update(['AWS4-HMAC-SHA256', t, scope, sha256(canonical)].join('\n')).digest('hex')
  headers.authorization = 'AWS4-HMAC-SHA256 Credential=' + R2.id + '/' + scope + ', SignedHeaders=' + signed + ', Signature=' + signature
  delete headers.host
  return fetch(R2.origin + uri, { method, headers, body, signal: AbortSignal.timeout(15000) })
}
const worldStatus = { saves: 0, loads: 0, absent: 0, failed: 0, dropped: 0, r2Puts: 0, r2Gets: 0, failing: '', waiting: 0, r2Last: '' }
const worldFile = name => path.join(WORLD_DIR, name + '.json')
// a trouble said once until it clears (each kind on its own), so a long R2 outage is one line, not one a tile
const worldTrouble = new Map()
function worldSay(kind, msg) { if (worldTrouble.get(kind) !== msg) { worldTrouble.set(kind, msg); say(msg) } }
function worldClear(kind, msg) { if (worldTrouble.has(kind)) { worldTrouble.delete(kind); if (msg) say(msg) } }
// R2's writes, in order for each name: the newest body a name waits with (r2Latest) is what is written next, so an old write
// can never land on a newer one; a write R2 didn't take stays waiting (and is listed in WORLD_DIR/r2-waiting.json, to be
// tried again after a restart) until a try takes it
const r2Latest = new Map(), r2Chains = new Map(), R2_WAITING = WORLD_DIR && path.join(WORLD_DIR, 'r2-waiting.json')
async function r2Put(name, body) {
  try {
    const r = await r2Request('PUT', name, body)
    await r.arrayBuffer().catch(() => {})
    worldStatus.r2Last = String(r.status)
    if (r.status >= 200 && r.status < 300) { worldStatus.r2Puts++; worldClear('r2put', 'world: R2 takes saves again'); return true }
    worldSay('r2put', 'world: R2 answered ' + r.status + ' to a save')
  } catch (e) { const why = e.name === 'TimeoutError' ? 'gave no answer in 15 s' : 'is unreachable (' + (e.cause?.code || e.name) + ')'; worldStatus.r2Last = why; worldSay('r2put', 'world: R2 ' + why + ' for a save') }
  return false
}
function r2Write(name, body) {
  r2Latest.set(name, body); r2Waiting()                 // listed before the try: a stop that kills it mid-write loses nothing
  const p = (r2Chains.get(name) || Promise.resolve()).then(async () => {
    const newest = r2Latest.get(name)
    if (newest === undefined) return true                  // a write before this one took the newest already
    const ok = await r2Put(name, newest)
    if (ok && r2Latest.get(name) === newest) r2Latest.delete(name)
    return ok
  })
  r2Chains.set(name, p.catch(() => false))
  return p.then(ok => { r2Waiting(); return ok }, () => { r2Waiting(); return false })
}
let r2WaitingSaid = ''
function r2Waiting() {
  worldStatus.waiting = r2Latest.size
  if (r2Latest.size && !r2Retry) r2Retry = setTimeout(r2RetryAll, 30000)
  if (!R2_WAITING) return
  const list = JSON.stringify([...r2Latest.keys()].sort())
  if (list === r2WaitingSaid) return
  r2WaitingSaid = list
  try { if (r2Latest.size) fs.writeFileSync(R2_WAITING, list); else if (fs.existsSync(R2_WAITING)) fs.unlinkSync(R2_WAITING) } catch (e) {}
}
let r2Retry = null
async function r2RetryAll() {
  r2Retry = null
  await Promise.all([...r2Latest.keys()].map(name => r2Write(name, r2Latest.get(name))))
}
// after a restart: what R2 hadn't taken before it, from the files (the newest copies)
if (R2 && R2_WAITING) try {
  for (const name of JSON.parse(fs.readFileSync(R2_WAITING, 'utf8'))) if (typeof name === 'string' && WORLD_KEY.test(name)) try { r2Latest.set(name, fs.readFileSync(worldFile(name), 'utf8')) } catch (e) {}
  if (r2Latest.size) { say('world: ' + r2Latest.size + (r2Latest.size === 1 ? ' save' : ' saves') + ' R2 hadn\'t taken before the restart: trying again'); setTimeout(r2RetryAll, 1000) }
} catch (e) {}
// the page saves a kept thing: its file (written whole, then moved into place) and its R2 object; true when either took it
// (one R2 didn't take is tried again, as above)
async function worldSave(name, json) {
  if (typeof name !== 'string' || !WORLD_KEY.test(name) || typeof json !== 'string' || json.length > 64 << 20) return false
  let ok = false
  if (WORLD_DIR) try {
    const f = worldFile(name), dir = path.dirname(f), tmp = f + '.' + process.pid + '.tmp'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    fs.writeFileSync(tmp, json); fs.renameSync(tmp, f); ok = true; worldClear('file')
  } catch (e) { worldSay('file', 'world: cannot write a save (' + (e.code || e.name) + ')') }
  // with its file written, R2 is written behind (a stop doesn't wait on a slow R2: the file and the waiting list keep it);
  // with no file, R2 is the save
  if (R2) { if (ok) r2Write(name, json); else ok = await r2Write(name, json) }
  if (ok) worldStatus.saves++
  worldTick()
  return ok
}
// the page reads a kept thing: { text }, { absent: true } when there is none (a tile nothing has changed in), or { failed }
// when it couldn't be read: the page then leaves it as it is and tries again, and never writes over it
async function worldGet(name) {
  if (typeof name !== 'string' || !WORLD_KEY.test(name)) return { failed: 'not a name of the world\'s' }
  const done = r => { worldStatus[r.text !== undefined ? 'loads' : r.absent ? 'absent' : 'failed']++; worldTick(); return r }
  if (WORLD_DIR) try { return done({ text: fs.readFileSync(worldFile(name), 'utf8') }) }
  catch (e) { if (e.code !== 'ENOENT') { worldSay('fileread', 'world: cannot read a save (' + (e.code || e.name) + ')'); return done({ failed: 'its file (' + (e.code || e.name) + ')' }) } }
  if (!R2) return done({ absent: true })
  if (r2Latest.has(name)) return done({ text: r2Latest.get(name) })        // the newest, still waiting for R2
  try {
    const r = await r2Request('GET', name)
    if (r.status === 200) { const text = await r.text(); worldStatus.r2Gets++; worldClear('r2get', 'world: R2 answers loads again'); return done({ text }) }
    await r.arrayBuffer().catch(() => {})
    if (r.status === 404) { worldClear('r2get', 'world: R2 answers loads again'); return done({ absent: true }) }
    worldSay('r2get', 'world: R2 answered ' + r.status + ' to a load')
    return done({ failed: 'R2 answered ' + r.status })
  } catch (e) {
    const why = e.name === 'TimeoutError' ? 'gave no answer in 15 s' : 'is unreachable (' + (e.cause?.code || e.name) + ')'
    worldSay('r2get', 'world: R2 ' + why + ' for a load')
    return done({ failed: 'R2 ' + why })
  }
}
// the page before the tiles read a city whole: its text, or null for none (and for a failure: that page couldn't tell)
async function worldLoad(name) { const r = await worldGet(name); return r.text ?? null }
// the page let a tile go: with R2 set, its file is dropped once R2 has its last version (WORLD_DIR then holds only what is
// in play); true when dropped
async function worldDrop(name) {
  if (!WORLD_DIR || !R2 || typeof name !== 'string' || !WORLD_KEY.test(name) || !name.includes('/t-')) return false
  await (r2Chains.get(name) || Promise.resolve())
  if (r2Latest.has(name)) return false
  try { fs.unlinkSync(worldFile(name)); worldStatus.dropped++; worldTick(); return true } catch (e) { return false }
}
// when the server stops (after the page's last save): R2 gets one more try at whatever it hasn't taken, for up to 6 s (a
// container's stop gives about 10)
async function worldFlush() {
  if (!R2) return
  clearTimeout(r2Retry); r2Retry = null
  if (r2Latest.size) await Promise.race([r2RetryAll(), sleep(6000)])
  if (r2Latest.size) say('world: R2 didn\'t take ' + r2Latest.size + (r2Latest.size === 1 ? ' save' : ' saves') + (R2_WAITING ? '; the files keep them, tried again after a restart' : ': they are lost'))
}
// a line a minute while things are kept or read: what this server did with the world since the last
let worldLast = '', worldLineAt = 0
function worldTick() {
  if (!WORLD_DIR && !R2 || Date.now() - worldLineAt < 60000) return
  const s = worldStatus, line = 'saved ' + s.saves + ', read ' + s.loads + ' (none there ' + s.absent + ', failed ' + s.failed + ')' + (R2 ? ', R2 waiting ' + s.waiting : '') + (WORLD_DIR && R2 ? ', files dropped ' + s.dropped : '')
  if (line === worldLast) return
  worldLast = line; worldLineAt = Date.now(); say('world: ' + line)
}
// /saveworld (the host's chat command, so the action API's POST /command reaches it): the page saves now, R2's answers are
// awaited, and one line says how it went
async function worldSaveNow() {
  if (!WORLD_DIR && !R2) { say('world: /saveworld: nothing is kept (neither WORLD_DIR nor R2 is set)'); return 'nothing is kept: neither WORLD_DIR nor R2 is set' }
  const before = { ...worldStatus }, t0 = Date.now(), within = (p, ms) => Promise.race([p, sleep(Math.max(0, ms))])
  say('world: /saveworld: the page saves now')
  let ok = false, late = ''
  try { ok = await within(page.evaluate(() => gameHooks.saveWorld?.()).then(v => !!v), 10000) } catch (e) {}
  if (ok === undefined) { ok = false; late = '; the page\'s save didn\'t finish in 10 s' }
  say('world: /saveworld: ' + (worldStatus.saves - before.saves) + ' written' + (R2 && r2Chains.size ? ', R2 PUTs sent: ' + (worldStatus.r2Puts - before.r2Puts + r2Latest.size) : ''))
  if (R2 && await within(Promise.all([...r2Chains.values()]).then(() => true), 10000 - (Date.now() - t0)) !== true) late += '; R2 hadn\'t answered every PUT in 10 s'
  const s = worldStatus, wrote = s.saves - before.saves
  const line = (ok ? 'saved' : 'not saved') + late + ': ' + wrote + ' written' + (WORLD_DIR ? ' (to WORLD_DIR)' : '') +
    (R2 ? '; R2 took ' + (s.r2Puts - before.r2Puts) + (s.r2Last ? ', its last answer ' + s.r2Last : '') + (r2Latest.size ? ', ' + r2Latest.size + ' waiting for it' : '') : '')
  say('world: /saveworld: ' + line)
  return line
}
if (WORLD_DIR || R2) say('world: the city\'s changes are kept' + (WORLD_DIR ? ' in WORLD_DIR' : '') + (WORLD_DIR && R2 ? ' and' : '') + (R2 ? ' in R2' + (WORLD_DIR ? ' (WORLD_DIR holding only what is in play)' : '') : '') + ', in tiles')

let html
try { html = fs.readFileSync(CFG.game) } catch (e) { die((env.GAME_FILE ? 'GAME_FILE' : 'the game') + ': cannot read the file (' + e.code + ')') }

// ---- the page, served on loopback: the game, and the hook modules under /hooks/
const unescaped = s => { try { return decodeURIComponent(s) } catch (e) { return '' } }
// the game's asset data (models, textures; versioned names), from assets/ beside the game file (ASSETS_DIR to put it
// elsewhere): the page asks for assets/<name>, as on the published site
const ASSETS_DIR = blank(env.ASSETS_DIR) ? path.join(path.dirname(CFG.game), 'assets') : path.resolve(env.ASSETS_DIR)
const ASSET_TYPES = { '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ktx2': 'image/ktx2', '.json': 'application/json', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav',
  '.wasm': 'application/wasm' }
function serveFiles() {
  let assets = 0
  try { assets = fs.readdirSync(ASSETS_DIR).filter(n => ASSET_TYPES[path.extname(n).toLowerCase()]).length } catch (e) {}
  say(assets ? 'assets: ' + assets + ' files beside the game' : 'assets: none beside the game file (the page fetches them from the published site)')
  const files = http.createServer((req, res) => {
    const u = URL.parse(req.url, 'http://localhost'), type = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json' }
    if (req.method !== 'GET') { res.writeHead(405); return res.end() }
    if (u?.pathname === '/') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); return res.end(html) }
    const m = u && /^\/hooks\/(.+)$/.exec(u.pathname), f = m && path.resolve(CFG.hooksDir, unescaped(m[1]))
    if (f && f.startsWith(CFG.hooksDir + path.sep) && type[path.extname(f)] && fs.existsSync(f) && fs.statSync(f).isFile()) {
      res.writeHead(200, { 'Content-Type': type[path.extname(f)] + '; charset=utf-8', 'Cache-Control': 'no-store' }); return res.end(fs.readFileSync(f))
    }
    const a = u && /^\/assets\/([A-Za-z0-9][A-Za-z0-9._-]*)$/.exec(u.pathname), af = a && path.join(ASSETS_DIR, a[1]), at = af && ASSET_TYPES[path.extname(af).toLowerCase()]
    if (at) try { const st = fs.statSync(af); if (st.isFile()) { res.writeHead(200, { 'Content-Type': at, 'Content-Length': st.size, 'Cache-Control': 'public, max-age=31536000, immutable' }); return fs.createReadStream(af).pipe(res) } } catch (e) {}
    res.writeHead(404); res.end()
  })
  return new Promise(ok => files.listen(0, '127.0.0.1', () => ok(files.address().port)))
}

// ---- events: the page numbers them; each gets its id here, the same on stdout and on every webhook
process.stdout.on('error', () => {})
function onEvent(json) {
  let e
  try { e = JSON.parse(json) } catch (err) { return }
  const id = crypto.randomUUID(), body = JSON.stringify({ id, type: e.type, ts: e.ts, seq: e.seq, game: 'maniak', match: e.match, data: e.data })
  if (CFG.stdout(e.type)) process.stdout.write(body + '\n')
  for (const h of HOOKS) if (h.wants(e.type)) h.push({ id, body, at: e.ts * 1000, tries: 0 })
}
// in the page: every event, numbered in the order the page makes them, and the bridge's own ping
const BRIDGE = () => {
  let seq = 0
  const out = (type, match, data) => globalThis.serverOut(JSON.stringify({ type, ts: Date.now() / 1000, seq: ++seq, match, data }))
  gameHooks.on('*', (data, meta) => out(meta.type, meta.match, data))
  globalThis.serverPing = reason => { const r = gameHooks.room(); out('ping', r.match, { reason, players: r.players, enemies: r.enemies, level: r.level, uptime: r.uptime }) }
}

// ---- the action API: loopback unless a token guards it; programs only, so a request a browser sends (Origin) is refused
function actionApi(page, seeds) {
  if (!CFG.api.port) return say('action API: off')
  const want = CFG.api.token && crypto.createHash('sha256').update(CFG.api.token).digest()
  const hosts = new Set(['127.0.0.1', 'localhost', '[::1]'].map(h => h + ':' + CFG.api.port))
  // the page answers when its main thread is free. Until it has answered once (it is still starting: building the city,
  // compiling), only the room's state is asked of it, and everything else is answered at once; after that, a call that
  // doesn't come back in 10 s is answered for it. Either way: 503, { ok: false, error }
  let answered = false
  const busy = msg => Object.assign(new Error(msg), { busy: true })
  const act = (name, ...args) => {
    if (!answered && name !== 'room') return Promise.reject(busy('the game page is still starting'))
    let timer
    return Promise.race([page.evaluate(([n, a]) => gameHooks[n](...a), [name, args]).then(v => { answered = true; return v }),
      new Promise((ok, no) => { timer = setTimeout(() => no(busy(answered ? 'the game page did not answer in 10 s' : 'the game page is still starting')), 10000) })])
      .finally(() => clearTimeout(timer))
  }
  // its first answer, asked for until it comes
  ;(async () => { while (!answered && !stopping) { await act('room').catch(() => {}); if (!answered) await sleep(1000) } })()
  const ROUTES = {
    'GET /health': async () => [(await act('room')).open ? 200 : 503, {}],
    'GET /status': async () => { const r = await act('room'), seed = seeds ? await act('seed') : undefined
      return [200, { code: r.code, link: CFG.joinUrl ? CFG.joinUrl + '#' + r.code : '', level: r.level, mode: r.mode, fragLimit: r.fragLimit, minutes: r.minutes,
        match: r.match, players: r.players, enemies: r.enemies, uptime: r.uptime, signaling: r.signaling, hookFailures: r.hookFailures,
        lastHookFailure: r.lastHookFailure, broadcast: r.broadcast, ...(seed === undefined ? {} : { seed }), webhooks: HOOKS.map(h => h.status) }] },
    'GET /players': async () => [200, { players: await act('players') }],
    'POST /ping': async () => { await page.evaluate(() => serverPing('request')); return [200, {}] },
    'POST /announce': async b => [200, { done: await act('announce', b.text) }],
    'POST /tell': async b => [200, { done: await act('tell', b.id, b.text) }],
    'POST /kick': async b => [200, { done: await act('kick', b.id ?? b.name) }],
    'POST /command': async b => { const lines = await act('command', b.line); return [200, { done: lines !== false, lines: lines || [] }] },
    'POST /level': async b => [200, { done: await act('setLevel', b.level) }],
    'POST /frags': async b => [200, { done: await act('setFragLimit', b.frags) }],
    'POST /minutes': async b => [200, { done: await act('setMatchMinutes', b.minutes) }],
    'POST /enemies': async b => [200, { done: await act('setEnemies', b.enemies) }],
    'POST /restart': async () => [200, { done: await act('restart') }],
    'POST /broadcast': async b => [200, { done: await act('broadcast', b.url ?? null) }],
  }
  const api = http.createServer((req, res) => {
    const send = (code, o) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify({ ok: code === 200, ...o }) + '\n') }
    if (req.headers.origin !== undefined) return send(403, { error: 'requests from a browser page are refused' })
    if (want) {
      const t = /^Bearer (.+)$/.exec(req.headers.authorization || '')
      if (!t || !crypto.timingSafeEqual(crypto.createHash('sha256').update(t[1]).digest(), want)) return send(401, { error: 'needs Authorization: Bearer <ACTION_TOKEN>' })
    } else if (!hosts.has(req.headers.host)) return send(403, { error: 'unexpected Host' })
    const u = URL.parse(req.url, 'http://localhost'), route = u && ROUTES[req.method + ' ' + u.pathname]
    if (!route) return send(u && Object.keys(ROUTES).some(k => k.endsWith(' ' + u.pathname)) ? 405 : 404, { error: 'no such action' })
    let raw = ''
    req.setEncoding('utf8')
    req.on('data', d => { raw += d; if (raw.length > 16384) { send(413, { error: 'body too large' }); req.destroy() } })
    req.on('end', async () => {
      if (res.headersSent) return
      let body = {}
      if (raw.trim()) try { body = JSON.parse(raw) } catch (e) { return send(400, { error: 'the body is not JSON' }) }
      if (!body || typeof body !== 'object' || Array.isArray(body)) return send(400, { error: 'the body must be a JSON object' })
      try { const [code, o] = await route(body); send(code, o) }
      catch (e) { if (e?.busy) send(503, { ok: false, error: e.message }); else send(500, { error: String(e.message || e).slice(0, 200) }) }
    })
  })
  api.on('error', e => die('the action API cannot listen on ' + CFG.api.host + ':' + CFG.api.port + ': ' + e.code, 1))
  api.listen(CFG.api.port, CFG.api.host, () => say(`action API: http://${CFG.api.host.includes(':') ? '[' + CFG.api.host + ']' : CFG.api.host}:${CFG.api.port}/` + (want ? ' (bearer token)' : '')))
}

// ---- run
let browser = null, stopping = false
async function stop(code) {
  if (stopping) return
  stopping = true
  say('server: stopping')
  if (WORLD_DIR || R2) try { await page?.evaluate(() => gameHooks.saveWorld?.()) } catch (e) {}
  if (WORLD_DIR || R2) await worldFlush().catch(() => {})
  try { await page?.evaluate(() => gameHooks.stop()) } catch (e) {}
  await sleep(500)                     // the guests' goodbye, and the match's end
  for (const until = Date.now() + 7000; HOOKS.some(h => h.queue.length) && Date.now() < until;) await sleep(100)
  for (const h of HOOKS) if (h.queue.length) say(`webhook ${h.origin}: ${h.queue.length} events not delivered`)
  await browser?.close().catch(() => {})
  process.exit(code)
}
for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => stop(0))
let page = null
;(async () => {
  const { chromium } = require('playwright')
  const port = await serveFiles()
  browser = await chromium.launch({ handleSIGINT: false, handleSIGTERM: false, handleSIGHUP: false, args: ['--use-angle=swiftshader', '--use-gl=angle', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
    '--disable-dev-shm-usage', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
    // guests on the same network reach the server by its own address
    '--disable-features=WebRtcHideLocalIpsWithMdns'] })
  browser.on('disconnected', () => { if (!stopping) die('the browser closed', 1) })
  page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage()
  page.on('crash', () => die('the game page crashed', 1))
  page.on('pageerror', e => say('page: ' + e.message))
  page.on('console', m => { if (m.type() === 'error') say('page: ' + m.text()) })
  await page.exposeFunction('serverOut', onEvent)
  if (WORLD_DIR || R2) { await page.exposeFunction('serverWorldSave', worldSave); await page.exposeFunction('serverWorldLoad', worldLoad)
    await page.exposeFunction('serverWorldGet', worldGet); await page.exposeFunction('serverWorldDrop', worldDrop) }
  await page.exposeFunction('serverWorldSaveNow', worldSaveNow)
  // the page knows it is a dedicated server from its first line: it fetches no models or textures it would never draw
  await page.addInitScript(() => { globalThis.MANIAK_SERVER = true })
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load', timeout: 180000 })
  await page.waitForFunction(() => globalThis.gameHooks?.room().ready || /fail|broke/i.test(document.getElementById('status')?.textContent || ''),
    null, { timeout: 180000, polling: 500 }).catch(() => {})
  const r0 = await page.evaluate(() => globalThis.gameHooks ? gameHooks.room() : null)
  if (!r0?.ready) die('the game did not start: ' + (r0?.status || await page.textContent('#status').catch(() => '') || 'no hooks in this copy of the game'), 1)
  await page.evaluate(BRIDGE)
  let mods = []
  try { if (fs.existsSync(CFG.hooksDir)) mods = fs.readdirSync(CFG.hooksDir).filter(f => /^[^.].*\.m?js$/.test(f) && fs.statSync(path.join(CFG.hooksDir, f)).isFile()).sort() }
  catch (e) { die('HOOKS_DIR: cannot read it (' + e.code + ')') }
  for (const f of mods) {
    const err = await page.evaluate(async url => {
      const slow = {}
      try {
        const m = await import(url)
        if (typeof m.default !== 'function') return 'it has no default export function'
        await Promise.race([m.default(gameHooks), new Promise((ok, no) => setTimeout(() => no(slow), 30000))])
        return ''
      } catch (e) {
        if (e === slow) return 'its setup took over 30 s'
        // the kind of error and where, never its message, which can quote the module
        const at = /^(\d+):(\d+)/.exec(String(e?.stack).split(url + ':')[1] || '')
        return 'a ' + (/^[A-Z][A-Za-z]{0,30}Error$/.test(e?.name) ? e.name : 'thrown value')
          + (at ? ' at line ' + at[1] + ', column ' + at[2] : e?.name === 'SyntaxError' ? ' (node --check on it shows where)' : '')
      }
    }, '/hooks/' + encodeURIComponent(f))
    if (err) die('hook module ' + f + ': ' + err, 1)
    say('hooks: ' + f)
  }
  const seeds = await page.evaluate(() => typeof gameHooks.seed === 'function')
  if (CFG.serve.seed !== undefined && !seeds) { say('SEED: this copy of the game has no city seed; it is ignored'); delete CFG.serve.seed }
  const why = await page.evaluate(o => { try { return gameHooks.serve(o) ? '' : 'the game is not on its landing page' } catch (e) { return e.message } }, CFG.serve)
  if (why) die('cannot serve: ' + why)
  let r = null, told = ''
  for (const t0 = Date.now(); ; await sleep(500)) {
    r = await page.evaluate(() => gameHooks.room())
    if (r.status !== told) { told = r.status; if (told) say('game: ' + told) }
    if (r.open) break
    if (/error|could not/i.test(r.status)) die('the room did not open', 1)
    if (Date.now() - t0 > 180000) die('the room did not open in 3 minutes', 1)
  }
  const seed = seeds ? await page.evaluate(() => gameHooks.seed()) : undefined
  say(`Room ${r.code}  ${r.level}` + (seed === undefined || seed === null ? '' : `  seed ${seed}`) + (CFG.joinUrl ? `  join: ${CFG.joinUrl}#${r.code}` : '  (set JOIN_URL to print a join link)'))
  await page.evaluate(() => serverPing('start'))
  if (CFG.broadcast) await page.evaluate(u => gameHooks.broadcast(u), CFG.broadcast)
  actionApi(page, seeds)
  for (let was = r.signaling; !stopping; await sleep(2000)) {
    r = await page.evaluate(() => gameHooks.room()).catch(e => { if (!stopping) throw e })
    if (stopping) return
    if (!r.serving) return stop(0)
    if (r.signaling !== was) { was = r.signaling; say('signaling: ' + was) }
  }
})().catch(e => { if (!stopping) die(String(e?.stack || e), 1) })
