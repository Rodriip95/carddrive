import { BoxGeometry, Group, MathUtils, Mesh, MeshStandardMaterial, Object3D, Raycaster, SpotLight, Vector3 } from 'three';
import { sceneConfig } from './config';

export function createCarLights(car: Group, size: Vector3) {
  const object = new Group();
  const frontMaterial = new MeshStandardMaterial({
    color: 0xffefd0, emissive: 0xffe6b0, emissiveIntensity: 0, roughness: 0.2,
  });
  const rearMaterial = new MeshStandardMaterial({
    color: 0x8b1018, emissive: 0xff1525, emissiveIntensity: 0, roughness: 0.1,
  });
  const beams: SpotLight[] = [];
  const geometry = new BoxGeometry(size.x * 0.16, size.y * 0.09, 0.025);
  const raycaster = new Raycaster();
  car.updateMatrixWorld(true);

  for (const end of [1, -1]) {
    for (const side of [-1, 1]) {
      const x = side * size.x * 0.34;
      const y = size.y * sceneConfig.car.lights.height;
      // Buscamos la superficie del GLB para no dejar las luces flotando delante del paragolpes.
      raycaster.set(new Vector3(x, y, end * (size.z + 1)), new Vector3(0, 0, -end));
      const hit = raycaster.intersectObject(car, true)[0];
      const z = (hit?.point.z ?? end * size.z / 2) + end * 0.02;
      const lamp = new Mesh(geometry, end === 1 ? frontMaterial : rearMaterial);
      lamp.position.set(x, y, z);
      object.add(lamp);

      if (end === 1) {
        // +Z es la parte delantera de este GLB. El haz apunta hacia el asfalto.
        const beam = new SpotLight(0xffefd0, 0, 20, Math.PI / 7, 0.65, 2);
        beam.position.set(x, y, z + 0.03);
        const target = new Object3D();
        target.position.set(x, -size.y / 2, z + 8);
        beam.target = target;
        object.add(beam, target);
        beams.push(beam);
      }
    }
  }

  function update(nightAmount: number) {
    // Encendido progresivo durante el atardecer; funciona también con el auto detenido.
    const strength = MathUtils.smoothstep(nightAmount, 0.2, 0.85);
    frontMaterial.emissiveIntensity = strength * 3;
    rearMaterial.emissiveIntensity = strength * 2;
    for (const beam of beams) beam.intensity = strength * sceneConfig.car.lights.intensity;
  }

  return { object, update };
}
