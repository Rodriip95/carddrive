import { PCFSoftShadowMap, WebGLRenderer } from 'three';
import { createCamera, createCameraFollow, frameCamera } from './camera';
import { loadCar } from './car';
import { createWorld } from './world';
import { createRoad } from './road';
import { createSpeedControls } from '../ui/speed-controls';
import { createLaneControls } from '../ui/lane-controls';
import { createCameraControls } from '../ui/camera-controls';
import { createDayNightControls } from '../ui/day-night-controls';

export async function startScene(container: HTMLElement) {
  const status = document.createElement('p');
  status.className = 'scene-status';
  status.setAttribute('role', 'status');
  status.textContent = 'Cargando el auto…';
  container.appendChild(status);

  try {
    const { scene, setNight, update: updateWorld, getNightAmount } = createWorld();
    const camera = createCamera();
    const cameraFollow = createCameraFollow(camera);
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const car = await loadCar();
    scene.add(car.object);
    const road = createRoad(car.groundY);
    scene.add(road.object);
    const speedControls = createSpeedControls(container, road);
    createDayNightControls(container, setNight);
    const laneControls = createLaneControls(container, car, cameraFollow.getScreenRight);
    createCameraControls(container, cameraFollow);

    function resize() {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      frameCamera(camera, car.radius, width / height);
      cameraFollow.captureOffset();
      cameraFollow.update(car.object.position);
    }
    resize();
    window.addEventListener('resize', resize);
    status.remove();

    let previousTime = performance.now();
    // Three.js llama este callback cada fotograma; update modifica y render dibuja.
    renderer.setAnimationLoop(() => {
      const now = performance.now();
      // Evitamos un salto del camino al volver de una pestaña inactiva.
      const delta = Math.min((now - previousTime) / 1000, 0.1);
      previousTime = now;
      road.update(delta);
      car.update(delta, road.getSpeed());
      cameraFollow.update(car.object.position, delta);
      laneControls.update();
      updateWorld(delta, camera);
      car.updateLights(getNightAmount());
      speedControls.update();
      renderer.render(scene, camera);
    });
  } catch (error) {
    status.textContent = 'No se pudo mostrar el auto. Revisá la consola para ver el error.';
    console.error('Error al iniciar la escena:', error);
  }
}
