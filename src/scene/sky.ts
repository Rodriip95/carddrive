import { Group, Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from 'three';
import type { PerspectiveCamera } from 'three';

export function createSky() {
  const object = new Group();
  const geometry = new SphereGeometry(2, 32, 16);
  // No reciben luz ni niebla: son los discos luminosos del fondo.
  const sun = new Mesh(geometry, new MeshBasicMaterial({ color: 0xffdf91, fog: false, toneMapped: false }));
  const moon = new Mesh(geometry, new MeshBasicMaterial({ color: 0xdde8ff, fog: false, toneMapped: false }));
  moon.scale.setScalar(0.8);
  object.add(sun, moon);
  const forward = new Vector3();
  const right = new Vector3();
  const up = new Vector3(0, 1, 0);
  let positioned = false;

  function update(nightAmount: number, camera: PerspectiveCamera) {
    if (!positioned) {
      // Usamos la vista inicial una sola vez; después quedan anclados al mundo.
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      right.crossVectors(forward, up).normalize();
      const distance = 100;
      const spread = Math.min(18, Math.tan(camera.fov * Math.PI / 360) * camera.aspect * distance * 0.4);
      sun.position.copy(camera.position).addScaledVector(forward, distance)
        .addScaledVector(right, -spread);
      moon.position.copy(camera.position).addScaledVector(forward, distance)
        .addScaledVector(right, spread);
      positioned = true;
    }
    sun.position.y = 9 - 22 * nightAmount;
    moon.position.y = -13 + 22 * nightAmount;
    // El terreno oculta naturalmente los astros al pasar bajo el horizonte.
    sun.visible = nightAmount < 0.65;
    moon.visible = nightAmount > 0.35;
  }

  return { object, update };
}
