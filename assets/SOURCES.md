# Characters (cards #10 and #23)

Every file below is made for The MANIAK from public-domain (CC0 1.0) sources. No other third-party content is in these files.

| File | What it is | Made from | License |
|---|---|---|---|
| `maniak.<hash>.glb` | The Maniak: one skinned mesh with one material, LOD0/1/2 (50,590 / 12,140 / 3,793 triangles), 68 joints (the shared 65 plus `cape_01`-`cape_03`), sockets `grip_l`, `grip_r` and `mouth`. 2048 WebP colour, normal and occlusion/roughness/metal maps | Quaternius "Universal Base Characters" (Superhero male body), sculpted, costumed, textured and baked for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `civ_m_suit.<hash>.glb`, `civ_m_coat.<hash>.glb`, `civ_m_worker.<hash>.glb` | Male pedestrians in 1930s and 40s city clothes: a pinstriped double-breasted suit and fedora; a belted trench coat over a suit; a vest over rolled shirt sleeves and a flat cap. The garments are modelled cloth (shells, collars, lapels, belts, cuffs, coat skirts). LOD0/1/2 (about 8.2-8.9k / 5.6-6.1k / 1.9-2.1k triangles), the shared 65-joint skeleton, 1024 WebP colour and 512 WebP normal maps | Quaternius "Universal Base Characters" (Superhero male body, hair, beard), re-proportioned and dressed for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `civ_f_dress.<hash>.glb`, `civ_f_coat.<hash>.glb` | Female pedestrians: a belted dress with a full skirt and a collar; a belted coat with lapels and a cloche hat. LOD0/1/2 (about 9.1-9.4k / 6.3-6.5k / 2.2k triangles) | Quaternius "Universal Base Characters" (Superhero female body, hair), re-proportioned and dressed for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `civ_freak.<hash>.glb`, `civ_brute.<hash>.glb` | Stand-in bodies for the Freak and the Brute: a hunched, gaunt, pale Freak in a long ragged coat and fedora; a broad Brute in shirt, suspenders, butcher's apron and flat cap. LOD0/1/2 (about 8.6k / 5.9k / 2.0k and 8.4k / 5.8k / 2.0k triangles) | Quaternius "Universal Base Characters" (Superhero male body, hair, beard), re-proportioned, sculpted and dressed for The MANIAK | CC0 1.0 (source); modifications CC0 1.0 |
| `anims.<hash>.glb` | 40 animation clips on the shared skeleton, no mesh | 32 clips retargeted from Quaternius "Universal Animation Library" and "Universal Animation Library 2" (Standard); 8 authored for The MANIAK on top of them (haymaker, smash_charge, smash_air, smash_land, block_whirl, chain_hang, chain_reel, whistle) | CC0 1.0 |
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
