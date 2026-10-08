import { BoxGeometry, Group, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { sceneConfig } from './config';

export function createRoad(groundY: number) {
  const { width, length, markerSpacing } = sceneConfig.road;
  const object = new Group();
  object.position.y = groundY;

  function surface(surfaceWidth: number, surfaceLength: number, color: number, y: number) {
    const mesh = new Mesh(
      new PlaneGeometry(surfaceWidth, surfaceLength),
      new MeshStandardMaterial({ color, roughness: 1 }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = y;
    mesh.receiveShadow = true;
    object.add(mesh);
    return mesh;
  }

  // Planos horizontales: el camino recorre el eje Z y su ancho ocupa el eje X.
  surface(600, 600, 0x728c50, -0.04);
  surface(width + 0.8, length, 0xb9ae91, -0.02);
  surface(width, length, 0x343b43, 0);
  for (const side of [-1, 1]) {
    const edge = surface(0.09, length, 0xf4eedc, 0.01);
    edge.position.x = side * (width / 2 - 0.2);
  }

  const markers: Mesh[] = [];
  const dashGeometry = new PlaneGeometry(0.12, 2.5);
  const dashMaterial = new MeshStandardMaterial({ color: 0xffe5a0 });
  const postGeometry = new BoxGeometry(0.12, 0.65, 0.12);
  const postMaterial = new MeshStandardMaterial({ color: 0xf4eedc });
  const count = Math.ceil(length / markerSpacing);
  const loopLength = count * markerSpacing;

  for (let i = 0; i < count; i++) {
    // Dos líneas dejan un carril central despejado para el auto.
    for (const side of [-1, 1]) {
      const dash = new Mesh(dashGeometry, dashMaterial);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(side * width / 6, 0.012, 0);
      const post = new Mesh(postGeometry, postMaterial);
      post.position.set(side * (width / 2 + 0.5), 0.325, 0);
      object.add(dash, post);
      markers.push(dash, post);
    }
  }

  const direction = Math.sign(sceneConfig.road.speed) || -1;
  let speed = Math.min(Math.abs(sceneConfig.road.speed), sceneConfig.road.maxSpeed);
  let targetSpeed = speed;
  let offset = 0;

  function changeSpeed(change: number) {
    targetSpeed = Math.max(0, Math.min(sceneConfig.road.maxSpeed, targetSpeed + change));
  }

  function update(delta: number) {
    // Integramos la distancia: cambiar de velocidad no reposiciona las marcas.
    const difference = targetSpeed - speed;
    const acceleration = Math.max(0.001, sceneConfig.road.acceleration);
    const transitionTime = Math.min(delta, Math.abs(difference) / acceleration);
    const nextSpeed = speed + Math.sign(difference) * acceleration * transitionTime;
    const distance = (speed + nextSpeed) / 2 * transitionTime + nextSpeed * (delta - transitionTime);
    speed = nextSpeed;
    offset = (offset + distance * direction) % loopLength;
    markers.forEach((marker, index) => {
      const initialZ = Math.floor(index / 4) * markerSpacing;
      // El módulo recicla las marcas fuera de vista sin crear objetos cada fotograma.
      marker.position.z = ((initialZ + offset) % loopLength + loopLength) % loopLength - loopLength / 2;
    });
  }
  update(0);
  return { object, update, changeSpeed, getSpeed: () => speed, getTargetSpeed: () => targetSpeed };
}
