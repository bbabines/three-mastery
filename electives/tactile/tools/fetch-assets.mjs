// Downloads the Tactile materials elective's materials and lighting files from Poly Haven and
// ambientCG (all CC0: free for any use, no credit needed) into assets/tactile. Each Poly Haven
// material gets three maps: color
// (Diffuse), an OpenGL-style normal map (nor_gl), and the packed map Poly Haven calls "arm" (red:
// ambient occlusion, green: roughness, blue: metalness, the layout three.js reads).
//
//   node electives/tactile/tools/fetch-assets.mjs          the files the pages use
//   node electives/tactile/tools/fetch-assets.mjs --vet    also 1K normal and height maps, for
//                                                          checking normal map direction (vet/, not committed)
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Resolution per material: big real-world tiles (a 2 m concrete scan) need 4K to stay sharp up close;
// small ones (a 25 cm fabric swatch) are sharp at 2K. electives/tactile/catalog.ts has the reasons.
export const MATERIALS = {
  leather_red_02: '2k',
  brown_leather: '1k', // kept as a cautionary example: its normal map's green channel doesn't match its height
  scuba_suede: '2k',
  velour_velvet: '2k',
  denim_fabric_06: '2k',
  wood_table_001: '4k',
  blue_metal_plate: '4k',
  marble_01: '4k',
};
export const HDRIS = ['studio_small_09', 'cyclorama_hard_light', 'overcast_soil_puresky', 'christmas_photo_studio_01', 'blue_photo_studio'];

const outDir = 'assets/tactile';
const vet = process.argv.includes('--vet');

// Skips files already on disk; pass --force to download everything again.
async function save(url, path) {
  if (existsSync(path) && !process.argv.includes('--force')) return;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  writeFileSync(path, Buffer.from(await response.arrayBuffer()));
  console.log(response.status, path);
}

for (const [id, resolution] of Object.entries(MATERIALS)) {
  const files = await (await fetch(`https://api.polyhaven.com/files/${id}`)).json();
  const folder = join(outDir, 'materials', id);
  mkdirSync(folder, { recursive: true });
  // A material sold in several colors stores them as coll1, coll2, ... instead of Diffuse; take the first.
  const color = files.Diffuse ?? files.coll1;
  for (const [map, name] of [[color, 'color'], [files.nor_gl, 'normal'], [files.arm, 'arm']]) {
    await save(map[resolution].jpg.url, join(folder, `${name}.jpg`));
  }
  if (vet) {
    const vetFolder = join(outDir, 'vet', id);
    mkdirSync(vetFolder, { recursive: true });
    await save(files.nor_gl['1k'].jpg.url, join(vetFolder, 'normal_1k.jpg'));
    await save(files.Displacement['1k'].png?.url ?? files.Displacement['1k'].jpg.url, join(vetFolder, 'height_1k.png'));
  }
}

// Materials Poly Haven doesn't have, from ambientCG (also CC0). Each comes as a zip of separate maps:
// color, an OpenGL-style normal map, and roughness, with no packed map and no ambient occlusion.
export const AMBIENTCG = {
  Leather039: '2K', // a real leather suede, photogrammetry; Poly Haven's only suede is a neoprene microsuede
  Concrete034: '4K', // smooth cast concrete, 110 × 55 cm; Poly Haven's concretes are 2 m and up, floors and walls
};

for (const [id, resolution] of Object.entries(AMBIENTCG)) {
  const folder = join(outDir, 'materials', id);
  if (existsSync(join(folder, 'color.jpg')) && !process.argv.includes('--force')) continue;
  mkdirSync(folder, { recursive: true });
  const zipFolder = join(outDir, 'vet', id);
  mkdirSync(zipFolder, { recursive: true });
  const zip = join(zipFolder, `${resolution}.zip`);
  await save(`https://ambientcg.com/get?file=${id}_${resolution}-JPG.zip`, zip);
  execFileSync('unzip', ['-o', '-q', '-d', zipFolder, zip]);
  for (const [map, name] of [['Color', 'color'], ['NormalGL', 'normal'], ['Roughness', 'roughness']]) {
    copyFileSync(join(zipFolder, `${id}_${resolution}-JPG_${map}.jpg`), join(folder, `${name}.jpg`));
    console.log('copied', join(folder, `${name}.jpg`));
  }
}

mkdirSync(join(outDir, 'hdr'), { recursive: true });
for (const id of HDRIS) {
  const files = await (await fetch(`https://api.polyhaven.com/files/${id}`)).json();
  await save(files.hdri['2k'].hdr.url, join(outDir, 'hdr', `${id}_2k.hdr`));
}
