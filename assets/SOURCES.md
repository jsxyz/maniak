# Characters (cards #10 and #23)

Every file below is made for The MANIAK from public-domain (CC0 1.0) sources. No other third-party content is in these files.

| File | What it is | Made from | License |
|---|---|---|---|
| `maniak.<hash>.glb` | The Maniak: one skinned mesh with one material, LOD0/1/2 (50,590 / 12,140 / 3,793 triangles), 68 joints (the shared 65 plus `cape_01`-`cape_03`), sockets `grip_l`, `grip_r` and `mouth`. The middle of the cape's top edge arcs up to the collar behind his neck (card #36). His name is lettered down his body (the cowl's M band, then A, N, I and A K) and down both forearms (A N I A K, from the wrist; card #41). 2048 WebP colour, normal and occlusion/roughness/metal maps | Quaternius "Universal Base Characters" (Superhero male body), sculpted, costumed, textured and baked for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `civ_m_suit.<hash>.glb`, `civ_m_coat.<hash>.glb`, `civ_m_worker.<hash>.glb` | Male pedestrians in 1930s and 40s city clothes: a pinstriped double-breasted suit, fedora and black cap-toe oxfords; a belted trench coat over a suit, with brown wingtip brogues; a vest over rolled shirt sleeves, a flat cap and laced brown work boots. The garments are modelled cloth (shells, collars, lapels, belts, cuffs, coat skirts) and the shoes are modelled (a last with a welted sole, a heel block, a toe box that bends with the ball). LOD0/1/2 (about 7.9-8.6k / 5.5-5.9k / 1.9-2.0k triangles), the shared 65-joint skeleton with a grip socket in each hand, 1024 WebP colour, 512 WebP normal and 256 WebP occlusion/roughness/metal maps | Quaternius "Universal Base Characters" (Superhero male body, hair, beard), re-proportioned and dressed for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `civ_f_dress.<hash>.glb`, `civ_f_coat.<hash>.glb` | Female pedestrians: a belted dress with a full skirt and a collar, and court shoes with a low block heel and an instep strap; a belted coat with lapels, a cloche hat and heeled oxfords. Modelled shoes as above. LOD0/1/2 (about 8.9-9.1k / 6.1-6.3k / 2.1k triangles), skeleton, grip sockets and maps as above | Quaternius "Universal Base Characters" (Superhero female body, hair), re-proportioned and dressed for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `civ_freak.<hash>.glb`, `civ_brute.<hash>.glb` | Stand-in bodies for the Freak and the Brute: a hunched, gaunt, pale Freak in a long ragged coat, fedora and worn, scuffed shoes; a broad Brute in shirt, suspenders, butcher's apron, flat cap and heavy laced work boots. Modelled shoes as above. LOD0/1/2 (about 8.3k / 5.8k / 2.0k and 8.1k / 5.6k / 1.9k triangles), skeleton, grip sockets and maps as above | Quaternius "Universal Base Characters" (Superhero male body, hair, beard), re-proportioned, sculpted and dressed for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `anims.<hash>.glb` | 40 animation clips on the shared skeleton, no mesh | 32 clips retargeted from Quaternius "Universal Animation Library" and "Universal Animation Library 2" (Standard); 8 authored for The MANIAK on top of them (haymaker, smash_charge, smash_air, smash_land, block_whirl, chain_hang, chain_reel, whistle) | CC0 1.0 |
| `maniak_moves.<hash>.glb` | The Maniak's own clips on the shared skeleton, no mesh: `maniak_sprint` (cards #30 and #48), a fast, powerful sprint (a 0.46 s cycle, keyed at 60 fps; a lean from the ankles, arms driving, a push-off behind him and a low recovery, the pelvis shifting and dipping over each stance foot), its planted feet carried back at 5.867 statures/s; `maniak_run` (card #43), his run at his walking pace (a 0.72 s cycle, keyed at 60 fps; a forward lean, arms driving, the pelvis sinking into each plant), its planted feet carried back at 2.265 statures/s | The upper bodies from Quaternius "Universal Animation Library" `Sprint_Loop` and `Jog_Fwd_Loop` (the library's `sprint` and `run` clips in `anims.<hash>.glb`), their arm drive amplified; the legs solved for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `maniak_strikes.<hash>.glb` | The Maniak's punches on the shared skeleton, no mesh (card #51), whole-body and keyed at 60 fps, his feet planted where his idle stands them: `maniak_jab`, `maniak_cross` and `maniak_hook`, each thrown from a guard and back in it, and `maniak_haymaker`, a wide looping power hook (the weight loaded onto the rear foot and the torso coiled, the hips then shoulders turning through, the rear heel pivoting on the ball, a follow-through, then the guard) | Authored for The MANIAK on his own skeleton (key poses solved by inverse kinematics), standing on the footing of the shared `idle` clip (Quaternius "Universal Animation Library") | CC0 1.0 |
| `maniak_grab.9845e572.glb` | The Maniak's hands in the interaction system (card #55): grab, hold, hold by the scruff, pull, throw and punt clips on his skeleton. Authored for maniak in Node (`clips55.mjs`, keyed poses solved by IK, packed with gltfpack). No meshes. | Made for maniak | CC0 |
| `maniak_carhits.<hash>.glb` | The Maniak's low strikes into a car on the shared skeleton, no mesh (card #57), whole-body and keyed at 60 fps, his feet planted where his idle stands them: `maniak_car_jab`, `maniak_car_cross`, `maniak_car_hook` and `maniak_car_haymaker`, body shots driven down and forward into a car door at about 0.85 m (knees bent, the torso pitched forward, the head on the target), on the timings and strike frames of his punches | Authored for The MANIAK on his own skeleton with card #51's authoring tool (key poses solved by inverse kinematics), standing on the footing of the shared `idle` clip (Quaternius "Universal Animation Library") | CC0 1.0 |
| `maniak_car.<hash>.glb` | The Maniak's car, a custom muscle car, long, low and wide (5.36 x 2.12 x 1.42 m). Two boxy headlight towers on the nose, each with an octagonal lamp, chrome bands and its own bumper block; an "M" on the grille between them; a long hood with a scoop; a raked windscreen; side pipes; huge tyres, wider at the rear, on deep-dish five-spoke mags. A bolted roof hatch over the passenger seat (node `hatch`, pivot on its hinge) and the passenger's ejector seat (node `eject_seat`, pivot at its base, with a pull handle, rails and a rocket pack) are their own nodes, as are the four wheels (`wheel_fl`, `wheel_fr`, `wheel_rl`, `wheel_rr` on two meshes, plus `wheel_front_lod1` and `wheel_rear_lod1`). Body LOD0/1/2 14,804 / 4,736 / 1,455 triangles, a wheel 2,876 / 862, the seat 964, the hatch 444, the glass its own material. 2048 WebP colour, 1024 WebP normal and occlusion/roughness/metal, and a 512 WebP emissive map (the lamps), baked in Cycles | Made for The MANIAK (modelled procedurally in Blender) | CC0 1.0 |
| `civ_alistair.e1c2a10b.glb` | The Maniak's disguise: a big, heavy-shouldered man with his own face bare and neat dark hair, in a long off-white overcoat (collar, grey-faced lapels with dark piping, belt and a slit skirt to mid-calf, lined in light cloth) over a white shirt and a modelled dark tie, dark trousers with turn-ups, and black oxfords. The coat skirt hangs from two extra bones, `skirt_l` and `skirt_r` (rest pose identical to the thighs'), that the game swings itself. Modelled shoes as above. LOD0/1/2 (about 8.2k / 5.7k / 1.9k triangles), the shared skeleton plus the two skirt bones (67 joints), 2048 WebP colour, 512 WebP normal and 256 WebP occlusion/roughness/metal maps | Quaternius "Universal Base Characters" (Superhero male body, hair), re-proportioned and dressed for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `props.<hash>.glb` | The cinderblock (with a `chain_anchor` node) and one chain link | Made for The MANIAK | CC0 1.0 |

Source packs, all by Quaternius and dedicated to the public domain under CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/), each with its license file:
- Universal Base Characters [Standard], from quaternius.itch.io/universal-base-characters
- Universal Animation Library [Standard], from opengameart.org/content/universal-animation-library
- Universal Animation Library 2 [Standard], from opengameart.org/content/universal-animation-library-2

# Faust's monument head (card #19)

### faust_head.f3c3c979.glb — Faust's monument head (card #19)

- **What it is:** the colossal head of Faust in front of the floating globe. Three LOD meshes (`lod0`, `lod1`, `lod2`; the lower two are simplified subsets of `lod0` that keep its vertex attributes), one material in use (`faust_stone`), plus a second material `faust_skin` exposed through `KHR_materials_variants` (variants `stone`, `skin`). Embedded WebP maps: two 2048² base colours (stone, skin), a 2048² normal map, a 1024² occlusion/roughness map (ORM) and a 512² emissive map (the eyes).
- **Source of the base geometry:** the MakeHuman project's base mesh `hm08` and its morph targets (macro details, face modifiers, expression units), from the project's public repository `makehumancommunity/makehuman` (`makehuman/data/3dobjs/base.obj`, `makehuman/data/targets/...`). MakeHuman's assets are released under **CC0 1.0** (the repository's `LICENSE.ASSETS.md`, and the header of each asset file). These are artist-made generic models, not scans of a person.
- **Made for maniak:** Faust's likeness was built from those targets (an original fictional face), then subdivided; the neck extension, the skin folds, the sculpted hair (grown locks unioned as a distance field), the eyes and every texture are procedural work made for maniak.
- **License:** CC0 1.0 for the MakeHuman-derived geometry; the rest is made for maniak.

# The comic's villains (card #7)

Every file below is made for The MANIAK from public-domain (CC0 1.0) sources: the same Quaternius packs as cards #10 and #23
(listed above). The likenesses are original sculpts after the comic's written descriptions; nothing is traced or copied from
the comic's art. No other third-party content is in these files.

| File | What it is | Made from | License |
|---|---|---|---|
| `teardrop.<hash>.glb` | A Teardrop, Misery Master's henchman: lean, in a black suit with a white shirt and black tie, black gloves, a bowler hat and black dress shoes; white greasepaint with dark-rimmed eyes and a black teardrop under his right eye, and a big white teardrop on his back. LOD0/1/2 (8,860 / 5,610 / 1,919 triangles), the shared 65-joint skeleton, sockets `grip_l` and `grip_r`. 1024 WebP colour, 512 WebP normal and 256 WebP occlusion/roughness/metal maps | Quaternius "Universal Base Characters" (Superhero male body, hair), re-proportioned, dressed and painted for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `misery_master.<hash>.glb` | Misery Master: tall and slender in an ivory suit with a black tie, an ivory top hat with a black band, a black domino mask, a ponytail, and a wide carved grin with modelled teeth, gums and mouth; black dress shoes. LOD0/1/2 (16,219 / 10,272 / 3,514 triangles), skeleton, sockets and maps as above | Quaternius "Universal Base Characters" (Superhero male body, hair), re-proportioned, sculpted (face, grin), dressed and painted for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `tony.<hash>.glb` | Tony: heavy-set, in a double-breasted pinstripe suit with a red tie and a white pocket square, a fedora, stubble and dark dress shoes. LOD0/1/2 (8,819 / 5,585 / 1,911 triangles), skeleton, sockets and maps as above | Quaternius "Universal Base Characters" (Superhero male body, hair), re-proportioned, dressed and painted for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `thug.<hash>.glb` | Tony's thug: broad and heavy-armed, in a short leather jacket worn open over a roll-neck sweater, a flat cap, stubble and laced work boots. LOD0/1/2 (10,048 / 6,364 / 2,177 triangles), skeleton, sockets and maps as above | Quaternius "Universal Base Characters" (Superhero male body, hair), re-proportioned, dressed and painted for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `pacifier.<hash>.glb` | A Pacifier soldier: a closed helmet with a dark visor, a plate carrier with webbing, magazine pouches and a stencilled ring-and-P insignia, shoulder and knee pads, gloves and tall boots. LOD0/1/2 (8,289 / 5,249 / 1,795 triangles), skeleton, sockets and maps as above | Quaternius "Universal Base Characters" (Superhero male body), re-proportioned, armoured and painted for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `freak_anims.<hash>.glb` | 8 clips for the villains' weapons on the shared skeleton, no mesh: knife_idle, knife_a, knife_b, knife_lunge, bat_idle, bat_swing, rifle_idle, rifle_shoot | knife_a, knife_b and knife_lunge retargeted from Quaternius "Universal Animation Library" (Sword_Attack) and "Universal Animation Library 2" (Sword_Regular_A, Sword_Regular_B); knife_idle is "Universal Animation Library" Sword_Idle with the head lifted, and bat_idle, bat_swing, rifle_idle and rifle_shoot are authored for The MANIAK on the shared idle | CC0 1.0 |

The held weapons (knife, bat, pipe, rifle) are drawn in the page from code (`PROP_MODELS`, `GUN_PROFILES`); they are not asset files.


# The Realistic look (card #25)

City surface textures for the Realistic look, each a pair: `real_<material>_c.<hash>.webp` holds the colour map with
ambient occlusion in its alpha, and `real_<material>_n.<hash>.webp` holds the normal map (OpenGL convention) in red and
green with roughness in blue. Each is 1024 px, resized from the 2K set and repacked for The MANIAK. All are from
ambientCG and dedicated to the public domain under CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/).

| Files | What it is | Made from | License |
|---|---|---|---|
| `real_stone_c.56b7c34a.webp`, `real_stone_n.82c6a8ce.webp` | Grey ashlar: Art Deco and Gothic towers, piers, cornices, crowns | ambientCG Bricks066 (https://ambientcg.com/view?id=Bricks066) | CC0 1.0 |
| `real_brick_c.42ff7300.webp`, `real_brick_n.fd17444c.webp` | Weathered brick: tenements | ambientCG Bricks097 (https://ambientcg.com/view?id=Bricks097) | CC0 1.0 |
| `real_concrete_c.687e9b94.webp`, `real_concrete_n.c6160c5a.webp` | Board-formed concrete: industry, roofs, and the sidewalk flags (their joints are drawn by the shader) | ambientCG Concrete031 (https://ambientcg.com/view?id=Concrete031) | CC0 1.0 |
| `real_asphalt_c.fd3c2e58.webp`, `real_asphalt_n.b5a93bdd.webp` | Road asphalt, wet in the look | ambientCG Asphalt025C (https://ambientcg.com/view?id=Asphalt025C) | CC0 1.0 |
| `real_setts_c.01d7b74b.webp`, `real_setts_n.d36c293d.webp` | Granite setts: plazas | ambientCG PavingStones070 (https://ambientcg.com/view?id=PavingStones070) | CC0 1.0 |
| `real_granite_c.a24732fb.webp`, `real_granite_n.46e169b8.webp` | Granite: podiums, kerbs | ambientCG Granite002A (https://ambientcg.com/view?id=Granite002A) | CC0 1.0 |

The look's sky, windows, rooms, shopfronts, neon, trims, puddles and light are made in its shaders for The MANIAK.

# Street life (card #26)

| File | What it is | Made from | License |
|---|---|---|---|
| `bike.<hash>.glb` | A 1930s-40s city roadster: black enamel diamond frame, fork and mudguards, chain guard, sprung leather saddle, swept-back bars with grips and a bell, lamp, rear carrier and reflector; 32-spoke wheels, crank and pedals as separate parts so the game can turn them. LOD0 and LOD1 parts (about 5.6k and 2.0k triangles a bicycle). A 64 px palette texture (colour and roughness/metal) | Made for The MANIAK (modelled procedurally in Blender) | CC0 1.0 |
| `pram.<hash>.glb` | A 1930s-40s coach-built pram: a navy tub with cream pinstripes and a chrome rim, a tall bellows hood with its hinges, C-springs on a chrome chassis, a handle with a cream grip, a knitted apron over a mattress; four spoked wheels as separate parts. The baby that rides in it is its own model (`baby.<hash>.glb`). LOD0 and LOD1 parts (about 8.4k and 3.0k triangles). A 64 px palette texture | Made for The MANIAK (modelled procedurally in Blender) | CC0 1.0 |
| `baby.<hash>.glb` | The baby in the pram (card #45): a baby's body with a man's face and a five o'clock shadow, a cigar in the corner of his mouth, a cotton bonnet with a ruffle and ribbon ties, a knitted romper, and a 1930s snub-nosed revolver in his right fist. One skinned mesh with one material, LOD0/1/2 (12,238 / 6,527 / 2,443 triangles), the shared 65-joint skeleton (the shared clips drive it), sockets `grip_l`, `grip_r`, `muzzle` and `cigar_tip`. 1024 WebP colour, 512 WebP normal and 256 WebP occlusion/roughness/metal maps | Quaternius "Universal Base Characters" (Superhero male body), re-proportioned to a baby, dressed and painted for The MANIAK; the bonnet, cigar and revolver modelled procedurally in Blender for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `pigeon.<hash>.glb` | A feral rock pigeon: slate head, green and purple neck sheen, blue-grey body, two black wing bars, dark tail band, orange eyes, coral feet (vertex colours), an 11-bone rig, and clips idle, peck, walk, fly and glide. LOD0/1/2 (about 2.2k / 0.75k / 0.22k triangles) | Made for The MANIAK (modelled, rigged and animated procedurally in Blender) | CC0 1.0 |
| `dog.<hash>.glb` | A medium street dog: a brown-and-tan mutt with a dark saddle and cream chest, fur streaks in its 1024 WebP colour and 512 WebP normal maps, a leather collar with a brass tag; clips walk, run, idle, sniff, eat, flinch, jump (the source pack's) and sit (authored for The MANIAK). LOD0/1/2 (about 6.7k / 2.4k / 0.9k triangles), 49 joints | Quaternius "Ultimate Animated Animal Pack" (the Husky), rescaled, subdivided, unwrapped, repainted, given a collar and a sit clip for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `anims_street.<hash>.glb` | 14 clips on the shared 65-joint skeleton, no mesh: riding a bicycle and stopped astride it (one pair per male pedestrian body, its feet on the pedals and hands on the grips by IK on that body's bone lengths), pushing a pram and standing with it (one pair per female body), walking and standing with a dog's lead, fleeing with the arms up, and cowering | Authored for The MANIAK on top of the shared clips (walk, idle, drive, sprint, crouch), which come from Quaternius "Universal Animation Library" 1 and 2 | CC0 1.0 |

Source pack, by Quaternius and dedicated to the public domain under CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/):
- Ultimate Animated Animal Pack (Husky, glTF), from quaternius.com/packs/ultimateanimatedanimals.html; the file was taken from its poly.pizza listing, which marks it CC0 1.0

# Period vehicles (card #44)

| File | What it is | Made from | License |
|---|---|---|---|
| `vehicles.<hash>.glb` | Faustland's 1930s-40s traffic, period designs with no real make, badge or lettering, each built on its fleet row's own width, length, height and axles. The models: a four-door sedan (separate teardrop fenders, running boards, an upright shield grille, freestanding bullet headlamps, a bustle trunk); the same sedan as a cab (a checker band and a lit roof sign) and as a beater (dented, rusted, a primer fender, a sagging bumper); a two-door fastback coupe with a rear-mounted spare; a streamlined speedster with skirted rear wheels and a waterfall grille; a delivery van with a rounded cab and a framed panel for a trade's sign; a stake truck with a long hood and a plank bed; an Art Deco city bus with a rounded bonnet, round-cornered windows and chrome speed lines. Each has LOD0/1/2 bodies (about 3.0-3.7k / 1.1-1.4k / 0.44-0.55k triangles; the bus 4.4k / 1.8k / 0.6k) and a burned-out shell (six shells, about 1.4-2.2k triangles). Whitewall and black wheels at LOD0/1/2 (336 / 160 / 48 triangles). Card #57's parts: each car's doors are their own nodes (`<style>_door_<fl|fr|rl|rr>_lod<k>_hinge<F|R>`, each node's origin on its hinge line), the bodies keep door-shaped openings with jambs and an inward cabin liner. One material: a 64 px palette (colour, occlusion/roughness/metal, and emission for the head, tail, marker and sign lamps; cell 9 is the glass, cell 32 torn bare steel). The game recolours its four paint cells per car | Made for The MANIAK (modelled procedurally in Blender) | CC0 1.0 |

# Faust's airships (card #5)

### zeppelin.59c58b16.glb: Faust's rooftop transit airship (card #5)

- **What it is:** an Art Deco passenger zeppelin for Faustland's rooftop transit lines. It has a gunmetal hull with crimson and chrome livery, a "DF" roundel, a walkable gondola with a cabin and open promenade decks either side, a bow gangway, cruciform tail fins, and four engine nacelles whose propellers are separate nodes that spin (`prop_0`..`prop_3`).
- **Structure:** three LODs in one GLB (`zep_lod0` 16,820, `zep_lod1` 3,636 and `zep_lod2` 1,132 triangles) and two materials (`zep_body`, `zep_glow`).
- **Maps:** a 1024² WebP base-colour atlas, a 1024² normal map, a 512² occlusion/roughness/metal map and a 64² emissive map. Meshopt-compressed, metres, nose toward -Z.
- **Made for maniak:** modelled from scratch with code (Blender and glTF-Transform). The textures, and the monogram drawn as shapes (no fonts), are procedural.
- **License:** CC0 1.0, made for The MANIAK. No third-party content.

### biplane.360a9509.glb: Faust's air-service biplane (card #5)

- **What it is:** a flyable two-seat, open-cockpit 1930s biplane in Faust's air-service livery: gunmetal fuselage, crimson wings with black Deco chevrons and "DF" roundels, and a radial engine in a chrome cowling.
- **Moving parts:** the propeller, ailerons, elevator and rudder are separate nodes, and an optional pilot figure sits in the rear cockpit.
- **Structure:** three LODs (`plane_lod0` 6,734, `plane_lod1` 2,698 and `plane_lod2` 668 triangles) and two materials (`plane_body`, `plane_glow`).
- **Maps:** a 1024² WebP base colour, a 1024² normal map, a 512² occlusion/roughness/metal map and a 64² glow map. Meshopt-compressed, metres, nose toward -Z.
- **Made for maniak:** generated with code (Blender and glTF-Transform). The textures, and the monogram drawn as shapes (no fonts), are procedural.
- **License:** CC0 1.0, made for The MANIAK. No third-party content.

# The monorail (card #60)

| File | What it is | Made from | License |
|---|---|---|---|
| `monorail_cars.<hash>.glb` | The monorail's cars in Faust's livery: a streamlined end car with a bullet nose, a cab windscreen, a chrome dorsal fin, headlamps and a brass "DF" monogram (5,198 triangles; LOD 1,280); a middle car (4,492; LOD 1,100); and a sliding door leaf with a porthole (260). Real doorways, a window band, an interior with benches, grab poles and a lit ceiling strip, and a skirt with a channel for the beam. Flat PBR materials, no textures | Made for The MANIAK: modelled procedurally in Blender (bpy scripts kept with the project) | CC0 1.0 |
| `monorail_track.<hash>.glb` | The track: a stepped Art Deco pylon plinth, a fluted column section that stretches to height, a T-head with saddles for the twin beams, a 1 m beam section with chrome guide rails and a red line, a streamlined buffer stop with a red lamp, and a switch-motor housing (LODs of each but the beam). Flat PBR materials, no textures | Made for The MANIAK: modelled procedurally in Blender | CC0 1.0 |
| `monorail_station.<hash>.glb` | The monorail's station kit, each part with a LOD: the Art Deco pavilion tower (13,906 triangles; LOD 4,920), with ziggurat setbacks, corner fins, a sunburst crown on a lit lantern and spire, tall fan windows, an entrance arch and "MONORAIL" in neon-tube capitals; a streamlined platform canopy with chrome ribs and a light strip; a bench, a lamp standard, a name-sign frame, a railing module, a glass lift cabin and a stair newel. Flat PBR materials, no textures | Made for The MANIAK: modelled procedurally in Blender (bpy scripts kept with the project) | CC0 1.0 |

Both files are original work. They contain no third-party meshes, textures, fonts or brand marks.


# The street performer (card #59)

The body is made for The MANIAK from public-domain (CC0 1.0) sources: the same Quaternius packs as cards #7, #10 and #23
(listed above). Its dances are retargeted from the CMU Graphics Lab Motion Capture Database, whose terms allow use in any
product (the raw data itself may not be resold). Its knife and tin cup are drawn by the page's own code, with no asset file.

| File | What it is | Made from | License |
|---|---|---|---|
| `street_performer.<hash>.glb` | The street performer: a ragged, homeless, slightly hunched figure in a long stained olive overcoat with a torn hem, holes and patches, worn over a moth-eaten grey sweater with a faded roll collar, patched trousers, dark gloves, worn boots and a crushed, battered brown top hat; long greasy hair and a scraggly beard, grimed skin. LOD0/1/2 (9,024 / 5,612 / 1,913 triangles), the shared 65-joint skeleton, sockets `grip_l` and `grip_r`. 1024 WebP colour, 512 WebP normal and 256 WebP occlusion/roughness/metal maps | Quaternius "Universal Base Characters" (Superhero male body, long hair, beard), re-proportioned, dressed and painted for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `performer_anims.<hash>.glb` | 9 clips for the street performer on the shared 65-joint skeleton, no mesh: `dance_charleston`, `dance_charleston_fancy`, `dance_lindy`, `dance_bear`, `dance_chicken` (in-place dance loops), `dance_walk` (a strutting dance step), `perf_demand` (shoving a tin cup at someone), `perf_stab_a`, `perf_stab_b` (knife stabs); a knife grip in the right hand and a cup grip in the left | The five dances are retargeted from CMU Graphics Lab Motion Capture Database trials 93_03 (charleston_01), 93_08 (xtra fancy charleston), 93_06 (lindyHop2), 55_12 (dancing bear, human subject) and 18_15 (chicken dance), in the B. Hahne "MotionBuilder-friendly" BVH conversion; each cut to a loop, crossfaded at the seam, smoothed, its yaw and root drift removed, and retargeted with a world-delta retarget written for The MANIAK. `dance_walk`, `perf_demand` and the stabs are authored for The MANIAK on the shared `walk` and `idle` clips, the knife grip copied from `freak_anims`' `knife_idle` | CMU motion capture data (mocap.cs.cmu.edu): free for all uses, including in commercial products; the raw data may not be resold. Authored clips and modifications CC0 1.0 |

# The Faustian enforcers (card #14)

Every file below is made for The MANIAK from public-domain (CC0 1.0) sources: the same Quaternius pack as cards #7, #10 and #23
(listed above). The likenesses are original designs after the comic's written setting (Art Deco, authoritarian, dark palette);
nothing is traced or copied from the comic's art. No other third-party content is in these files.

| File | What it is | Made from | License |
|---|---|---|---|
| `enforcer.<hash>.glb` | A Faustian enforcer, the regime's uniformed regular on foot: a black double-breasted knee-length greatcoat with a high stiff collar, oxblood collar tabs, cuffs and piping and brass buttons, an oxblood armband with a pale deco diamond on the left arm, a black Sam Browne belt with a brass buckle, cross strap and holster pouch, black gloves, tall polished black boots, a black peaked cap with an oxblood band, a short glossy visor and a brass badge; a stern clean-shaven face. LOD0/1/2 (9,638 / 6,105 / 2,088 triangles), the shared 65-joint skeleton, sockets `grip_l` and `grip_r`. 1024 WebP colour, 512 WebP normal and 256 WebP occlusion/roughness/metal maps | Quaternius "Universal Base Characters" (Superhero male body, hair), re-proportioned, dressed and painted for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
