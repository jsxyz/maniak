# Dedicated server

The MANIAK's dedicated server, as a Docker image. Players play The MANIAK against the freaks of Faustland, and the
server keeps a room open for them around the clock. It runs the game page itself, the same file players open, in
headless Chromium and in the page's own server mode (the landing page's *Run a server*). Players join from the public
game page with the room code. Your own code can watch the game and act on it: hook modules run inside the page, every
event goes to stdout as a JSON line and to any webhooks you register, and a small HTTP API kicks, announces and changes
the match.

## Run it

```sh
docker run -d --name maniak --network host --restart unless-stopped ghcr.io/jsxyz/maniak-server
docker logs maniak
```

The log names the room and its join link:

```
Room K7XQ2M  Faustland  seed 3501965595  join: https://jsxyz.github.io/maniak/#K7XQ2M
```

Faustland, the city, grows from the seed. Run the server with `SEED` set to one you liked to play that city again.

The image is rebuilt from this repository whenever the game changes, so `latest` always runs the game players open. Each
build is also tagged with its commit's sha. To build it yourself instead, from the repository root:

```sh
docker build -f server/Dockerfile -t maniak-server .
```

Run it with `--network host`. Players connect to the server directly over WebRTC, and host networking lets them reach it
at the machine's own addresses. Behind Docker's own NAT (a bridge network) each player's link has to be made through that
NAT too, which can fail. The server needs the internet: the page loads its libraries from a CDN and finds players through
the public PeerJS signaling server.

Chromium picks the server's WebRTC ports from the system's ephemeral range (on Linux 32768–60999, unless
`net.ipv4.ip_local_port_range` says otherwise), so a firewall on the machine must let in UDP across that range.

`docker stop` closes the room cleanly. The players are told the host left, and the last events go out first.

## Configure it

Everything is an environment variable (`-e NAME=value`).

| Variable | Default | |
|---|---|---|
| `LEVEL` | `Faustland` | Faustland is the only world, so leave it unset. Any other level stops the server ("Faustland is the only world.") |
| `FRAGS` | `0` | kills to win, 0–200; 0 is no limit, so the match runs on with no rounds |
| `MINUTES` | `0` | length of a match, 0–60; 0 is untimed |
| `ENEMIES` | `3` | computer-run enemies: Freaks, and the bigger, slower Brutes |
| `SEED` | fresh each run | the city's seed, a whole number from 0 to 4294967295. The same seed builds the same city, so a seed you like can be played again. The log and `GET /status` name the seed in play, and `POST /command` with `/seed 42` (or `/seed random`) rebuilds the city from another. A `GAME_FILE` without seeded cities ignores it and says so |
| `ROOM_CODE` | random | a fixed room code, 6 characters of `ABCDEFGHJKMNPQRSTUVWXYZ23456789`, so the join link stays the same. Codes leave out 0, 1, I, L and O, which are easy to misread, so `FAUST1` is refused and the server exits 2. Codes are this game's own: another game's server may use the same one |
| `SERVER_NAME` | `The server` | the name players see when it kicks them |
| `JOIN_URL` | the public game page | printed with `#` and the room code as the join link |
| `HOOKS_DIR` | `/hooks` | hook modules |
| `STDOUT_EVENTS` | `*` | the event types written to stdout |
| `WEBHOOK_URL`, `WEBHOOK_SECRET` (or `WEBHOOK_SECRET_FILE`), `WEBHOOK_EVENTS` | | one webhook |
| `WEBHOOKS_FILE` | `/config/webhooks.json` | several webhooks |
| `ACTION_HOST`, `ACTION_PORT` | `127.0.0.1`, `8080` | the action API; port 0 turns it off |
| `ACTION_TOKEN` (or `ACTION_TOKEN_FILE`) | | required whenever `ACTION_HOST` is not loopback |
| `GAME_FILE` | the game in the image | run another copy of the game, mounted into the container |
| `BROADCAST_URL` | | a stream for the city's screens (see Broadcasts) |
| `WORLD_DIR` | | a directory (a volume) where the city's changes are kept, in tiles (see Keeping the city's changes) |
| `R2_ENDPOINT`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` (or `R2_SECRET_ACCESS_KEY_FILE`) | | a bucket on Cloudflare R2 (or any S3-compatible store) where they are kept too; `R2_REGION` (default `auto`) and `R2_PREFIX` (default none) |

Every game is free-for-all: players fight the enemies and each other. `MODE` is gone; a server started with it still
starts, says the setting is ignored, and plays free-for-all.

An event type list is `*` for every type, a comma list such as `kill,player.join`, or a list of types to leave out such as
`-damage,-chat`.

## Keeping the city's changes

Glass the players break, the street lamps and traffic signals they shoot out or knock over, and the craters they leave
stay that way. Set `WORLD_DIR` to a directory on a volume, and the server keeps them there, so a server started again on the
same seed finds the city as it was left:

```sh
docker run -d --name maniak --network host -v maniak-world:/world -e WORLD_DIR=/world -e SEED=3501965595 ghcr.io/jsxyz/maniak-server
```

The world is kept in tiles of 960 m. The page reads a tile in as players come near it and lets it go a minute after the
last of them has left, so only the parts in play are held, however big the world grows. A city's tiles are files in a
directory of its own (`world-<seed>-<size>-p<version>/t-<x>-<z>.json`, beside a small `manifest.json`). The version is
the city plan's: a game whose city is planned differently keeps its changes apart, and a changed city starts clean.

Set the four R2 variables as well, or instead, to keep them in a bucket, as objects under `R2_PREFIX` named the same way:
then a server on another machine, or a fresh container without the volume, finds them there. With R2 set, `WORLD_DIR` holds
only the tiles in play, so the disk stays small however big the world: a tile let go is dropped from it once R2 has its last
version. A save R2 doesn't take is tried again every 30 s and when the server stops, and, with `WORLD_DIR`, after a restart.
The server signs each request itself; the access key needs read and write on the bucket. `R2_ENDPOINT` is the bucket's S3 API
address (`https://<account>.r2.cloudflarestorage.com`); other S3-compatible stores work too, with `R2_REGION` set to theirs.
With none of these set, nothing is kept.

The page saves a changed tile a few seconds after the change, and the server saves once more when it stops. A tile that can't
be read is left as it is and read again later: the server never writes over what it couldn't read. A city kept whole by an
earlier server (`world-<seed>-<size>.json`) is read once and written out as tiles, and the old file or object stays. A host
playing in a browser keeps the same tiles in the browser, and can save the whole city to a file and load one back from the
menu. The log has a line a minute on what was saved and read while it goes on, and one line for each trouble with the store.

To see a save go through without waiting for a player, send the host's chat command `/saveworld` (through the action API:
`POST /command` with `{"line": "/saveworld"}`). The server saves at once and says how it went, R2's answer with it:
`world: /saveworld: saved: 1 written (to WORLD_DIR); R2 took 1, its last answer 200`.

## Events

Each event is one JSON object, the same on stdout and to a webhook:

```json
{"id":"6f1c…","type":"kill","ts":1795030120.52,"seq":41,"game":"maniak","match":"90aa2b7d…",
 "data":{"killer":{"id":1,"name":"Ann","kind":"player","character":"The Maniak"},
         "victim":{"id":101,"name":"Freak","kind":"enemy","character":"Freak"},"weapon":"Haymaker"}}
```

`id` is unique to the event. `ts` is when it happened, in unix seconds. `seq` rises with every event of a server run.
`match` is a random id for the match it happened in. Wherever a person appears it is `{id, name, kind, character}`:
- `kind` is `player`, `enemy`, or `ally` (a computer-run team-mate a player fields, with `owner`, that player's id).
- `id` belongs to whoever has it now and is given to someone else after they leave.

| Type | Data |
|---|---|
| `ping` | `reason` (`start`, or `request` from the action API), `players`, `enemies`, `level`, `uptime` |
| `match.start` | `level`, `mode` (always `ffa`, kept for consumers that read it), `fragLimit`, `minutes` |
| `match.end` | `reason` (`frags`, `time`, `restart`, `stop`), `winner` (or null), `standings` with `kills` each |
| `player.join` | `player` |
| `player.leave` | `player`, `reason`: `left` (it went), `kicked`, `timeout` (the host heard nothing from it for 12 s once it plays, or for 60 s while it is still loading), `dropped` (its link failed). A guest let go is told why on its screen before the link closes |
| `player.rename` | `player`, `was` |
| `kill` | `killer`, `victim`, `weapon`; `via`, the team-mate who struck for its owner |
| `death` | `victim`, `weapon`: a death nobody is credited with |
| `chat` | `player`, `text`, `action` (an emote) |
| `damage` | `victim`, `attacker` (or null), `weapon`, `amount`, `hp` |
| `spawn` | `who`: a respawn, or an enemy arriving |
| `pickup` | `player`, `item`, `kind` (`gun`, `power`, `heal`) |
| `broadcast.start` | `origin`: a broadcast started, or switched to a stream from there |
| `broadcast.stop` | `origin` |

Every `match.start` is followed by one `match.end`. A restart, a new city seed or the room emptying ends it as
`restart`. Hook modules can add types of their own.

**Names and chat are typed by players.** They are capped (16 and 160 characters) and stripped of control and colour
codes, but not authenticated and not unique. Escape them wherever you show them, and never treat them as identity. No
event carries the room code, the room's only credential.

## Broadcasts

`BROADCAST_URL`, `POST /broadcast` or a hook's `broadcast(url)` names a stream for screens on Faustland's buildings.
Faustland has no screens yet: `GET /status` names the stream's origin and the `broadcast.start` and `broadcast.stop`
events go out, but players see it only once the city's facades carry it. The server only names it. Each player's own
browser fetches and plays it, so **the stream's server sees every player's address**. A player can turn broadcasts off
in the settings.

- The URL must be https, and the stream's server must allow the game's page (`https://jsxyz.github.io`) by CORS.
  Without that, the screens keep their idle look, and each player is told why once.
- HLS (an `.m3u8` URL) plays through hls.js, at the best rendition 360 lines tall or less, else the smallest. MP4 and
  WebM play as the browser plays them. A stream over 1920x1080 is refused.
- To broadcast from OBS you need a server that takes its stream and serves it as HLS over https with CORS. That isn't
  part of this image.

## Webhooks

The server POSTs each event as its JSON body to every webhook that wants its type, one at a time and in order. Any 2xx
answer is delivery. Otherwise it tries again after 1, 5, 30 and then every 60 seconds, with the same body, until five
minutes after the event, then drops it. A webhook holds at most 10,000 waiting events, dropping the oldest first. Drops
are counted on stderr. Only https URLs are accepted, and a webhook gets every type but `damage` and `chat` unless you
list its types.

Headers: `Content-Type: application/json`, `X-Game-Event-Id`, `X-Game-Timestamp` (unix seconds of this attempt) and
`X-Game-Signature: sha256=` followed by the hex HMAC-SHA256 of `<X-Game-Timestamp>.<raw body>` under the webhook's
secret. To check a delivery, compute the HMAC over the exact bytes received and compare it in constant time. Refuse a
timestamp more than a few minutes off. Ignore an event id you have seen before.

```js
const want = 'sha256=' + crypto.createHmac('sha256', secret).update(ts + '.').update(rawBody).digest('hex')
const ok = sig.length === want.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want))
```

Several webhooks go in a mounted file (`-v ./webhooks.json:/config/webhooks.json:ro`):

```json
[{ "url": "https://example.com/game-events", "secretFile": "/run/secrets/game-events", "events": "*" },
 { "url": "https://example.org/kills", "secret": "…", "events": ["kill", "match.end"] }]
```

The secret is never printed, and stderr names a webhook only by its origin.

## Hook modules

Mount a directory at `/hooks` (`-v ./hooks:/hooks:ro`). Each `.js` or `.mjs` file directly in it is loaded, in name
order, as an ES module into the game page before the room opens. Its default export is called with the hooks:

```js
// hooks/welcome.mjs
export default function (hooks) {
  hooks.on('player.join', ({ player }) => hooks.tell(player.id, 'Welcome, ' + player.name))
  hooks.filter('chat', ({ text }) => /\bspoiler\b/i.test(text) ? false : undefined)
  hooks.on('kill', ({ killer, victim }) => {
    if (victim.kind === 'enemy' && victim.character === 'Brute') hooks.announce(killer.name + ' flattened a Brute')
  })
}
```

- `on(type, fn)` calls `fn(data, { type, match })` for each event of a type, or of every type with `'*'`, and returns a
  function that removes it.
- `filter(kind, fn)` asks `fn(data, { type, match })` before the host takes something from a player:
  - `join`: a joining player, and a player's new name (`rename` is true);
  - `chat`: a chat line it would pass on;
  - `hit`: a hit it would deal.

  Return `false` to refuse, `{ name }`, `{ text }` or `{ damage }` to change it, and anything else to let it pass.
  A refused player is let go, a refused line goes nowhere, and a refused hit does no harm at all. Every player is
  The Maniak, so a `character` that a `join` filter returns is ignored, and events still give players
  `"character": "The Maniak"`.
- `emit(type, data)` sends an event of your own, a lowercase dotted name such as `league.goal`, with at most 8 KB of
  JSON. Your other hooks, stdout and the webhooks get it like any event.
- `announce(text)`, `tell(id, text)` and `kick(id or name)` act on players. So do `command('/bots 4')` (any chat
  command, returning the lines it printed), `setLevel('Faustland')` (the only world, so it changes nothing; any other
  level is refused), `setFragLimit(n)`, `setMatchMinutes(n)`, `setEnemies(n)`, `restart()` and `broadcast(url)` (an
  https URL, or null to stop). Each returns false when refused.
- `players()` lists everyone in the game. `room()` describes the room, its code included. `seed()` is the city's seed.

Hooks run in the middle of the game's own work, so keep them quick. A hook that throws is skipped and counted, and the
game goes on. Whatever hooks send players is held to a player's own limits: a line is at most 160 characters, eight may go at
once, and after that one each quarter second. A module may `fetch()` other services, which CORS governs, or emit an
event and let a webhook carry it.

## Action API

It listens on `127.0.0.1:8080` inside the container, so with `--network host` it is the machine's own loopback, open to
any program on that machine. It is for programs: a request with an `Origin` header is refused. Bound anywhere else
(`ACTION_HOST=0.0.0.0`) it needs `Authorization: Bearer <ACTION_TOKEN>` on every request, and the server refuses to start
without a token. A token set on loopback is required there too.

| Request | Body | |
|---|---|---|
| `GET /health` | | 200 while the room is open (the image's health check) |
| `GET /status` | | the room: code, join link, level, seed (when the game has one), limits, players, webhook queues |
| `GET /players` | | everyone in the game |
| `POST /ping` | | sends a `ping` event |
| `POST /announce` | `{"text"}` | a line to every player |
| `POST /tell` | `{"id", "text"}` | a line to one player |
| `POST /kick` | `{"id"}` or `{"name"}` | |
| `POST /command` | `{"line"}` | a chat command, such as `/bots 4`; answers the lines it printed |
| `POST /level` | `{"level"}` | `Faustland` (or 1) only, which changes nothing; any other level answers `done: false` |
| `POST /frags` | `{"frags"}` | |
| `POST /minutes` | `{"minutes"}` | |
| `POST /enemies` | `{"enemies"}` | |
| `POST /restart` | | |
| `POST /broadcast` | `{"url"}` | starts or switches the broadcast; `{"url": null}` stops it |

```sh
curl -s -X POST http://127.0.0.1:8080/announce -d '{"text":"Double points this round"}'
```
