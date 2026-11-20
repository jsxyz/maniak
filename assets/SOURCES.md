# Characters (cards #10 and #23)

Every file below is made for The MANIAK from public-domain (CC0 1.0) sources. No other third-party content is in these files.

| File | What it is | Made from | License |
|---|---|---|---|
| `maniak.<hash>.glb` | The Maniak: one skinned mesh with one material, LOD0/1/2 (50,590 / 12,140 / 3,793 triangles), 68 joints (the shared 65 plus `cape_01`-`cape_03`), sockets `grip_l`, `grip_r` and `mouth`. 2048 WebP colour, normal and occlusion/roughness/metal maps | Quaternius "Universal Base Characters" (Superhero male body), sculpted, costumed, textured and baked for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `civ_m_suit.<hash>.glb`, `civ_m_coat.<hash>.glb`, `civ_m_worker.<hash>.glb` | Male pedestrians in 1930s and 40s city clothes: a pinstriped double-breasted suit, fedora and black cap-toe oxfords; a belted trench coat over a suit, with brown wingtip brogues; a vest over rolled shirt sleeves, a flat cap and laced brown work boots. The garments are modelled cloth (shells, collars, lapels, belts, cuffs, coat skirts) and the shoes are modelled (a last with a welted sole, a heel block, a toe box that bends with the ball). LOD0/1/2 (about 7.9-8.6k / 5.5-5.9k / 1.9-2.0k triangles), the shared 65-joint skeleton, 1024 WebP colour, 512 WebP normal and 256 WebP occlusion/roughness/metal maps | Quaternius "Universal Base Characters" (Superhero male body, hair, beard), re-proportioned and dressed for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `civ_f_dress.<hash>.glb`, `civ_f_coat.<hash>.glb` | Female pedestrians: a belted dress with a full skirt and a collar, and court shoes with a low block heel and an instep strap; a belted coat with lapels, a cloche hat and heeled oxfords. Modelled shoes as above. LOD0/1/2 (about 8.9-9.1k / 6.1-6.3k / 2.1k triangles), maps as above | Quaternius "Universal Base Characters" (Superhero female body, hair), re-proportioned and dressed for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `civ_freak.<hash>.glb`, `civ_brute.<hash>.glb` | Stand-in bodies for the Freak and the Brute: a hunched, gaunt, pale Freak in a long ragged coat, fedora and worn, scuffed shoes; a broad Brute in shirt, suspenders, butcher's apron, flat cap and heavy laced work boots. Modelled shoes as above. LOD0/1/2 (about 8.3k / 5.8k / 2.0k and 8.1k / 5.6k / 1.9k triangles), maps as above | Quaternius "Universal Base Characters" (Superhero male body, hair, beard), re-proportioned, sculpted and dressed for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `anims.<hash>.glb` | 40 animation clips on the shared skeleton, no mesh | 32 clips retargeted from Quaternius "Universal Animation Library" and "Universal Animation Library 2" (Standard); 8 authored for The MANIAK on top of them (haymaker, smash_charge, smash_air, smash_land, block_whirl, chain_hang, chain_reel, whistle) | CC0 1.0 |
| `maniak_moves.<hash>.glb` | The Maniak's own clips on the shared skeleton, no mesh (card #30): `maniak_sprint`, an aggressive sprint (a 0.45 s cycle, keyed at 60 fps; hard lean, arms driving, a heel-kick and high-knee recovery, the pelvis dropping into each plant), its planted feet carried back at 5.867 statures/s | The upper body from Quaternius "Universal Animation Library" `Sprint_Loop` (the library's `sprint` clip in `anims.<hash>.glb`), its arm drive and twist amplified; the legs solved for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
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
| `pram.<hash>.glb` | A 1930s-40s coach-built pram: a navy tub with cream pinstripes and a chrome rim, a bellows hood with its hinges, C-springs on a chrome chassis, a handle with a cream grip, a knitted apron and the baby's bonnet; four spoked wheels as separate parts. LOD0 and LOD1 parts (about 8.8k and 3.1k triangles). A 64 px palette texture | Made for The MANIAK (modelled procedurally in Blender) | CC0 1.0 |
| `pigeon.<hash>.glb` | A feral rock pigeon: slate head, green and purple neck sheen, blue-grey body, two black wing bars, dark tail band, orange eyes, coral feet (vertex colours), an 11-bone rig, and clips idle, peck, walk, fly and glide. LOD0/1/2 (about 2.2k / 0.75k / 0.22k triangles) | Made for The MANIAK (modelled, rigged and animated procedurally in Blender) | CC0 1.0 |
| `dog.<hash>.glb` | A medium street dog: a brown-and-tan mutt with a dark saddle and cream chest, fur streaks in its 1024 WebP colour and 512 WebP normal maps, a leather collar with a brass tag; clips walk, run, idle, sniff, eat, flinch, jump (the source pack's) and sit (authored for The MANIAK). LOD0/1/2 (about 6.7k / 2.4k / 0.9k triangles), 49 joints | Quaternius "Ultimate Animated Animal Pack" (the Husky), rescaled, subdivided, unwrapped, repainted, given a collar and a sit clip for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `anims_street.<hash>.glb` | 14 clips on the shared 65-joint skeleton, no mesh: riding a bicycle and stopped astride it (one pair per male pedestrian body, its feet on the pedals and hands on the grips by IK on that body's bone lengths), pushing a pram and standing with it (one pair per female body), walking and standing with a dog's lead, fleeing with the arms up, and cowering | Authored for The MANIAK on top of the shared clips (walk, idle, drive, sprint, crouch), which come from Quaternius "Universal Animation Library" 1 and 2 | CC0 1.0 |

Source pack, by Quaternius and dedicated to the public domain under CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/):
- Ultimate Animated Animal Pack (Husky, glTF), from quaternius.com/packs/ultimateanimatedanimals.html; the file was taken from its poly.pizza listing, which marks it CC0 1.0
