import { Color, Fog, Group, Mesh, PerspectiveCamera, Scene } from 'three';
import { createCameraFollow, frameCamera } from './camera';
import { loadCar } from './car';
import { loadTraffic } from './traffic';
import { createCollisions } from './collisions';
import { sceneConfig } from './config';
import { createWorld } from './world';
import { createRoad } from './road';
import { createScenarioObject } from './scenario-object';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { ScenarioConfig } from '../domain/scenario';

export async function createDrivingExperience(scene: Scene, camera: PerspectiveCamera, scenario: ScenarioConfig) {
  const world = createWorld();
  // El fondo y la niebla pertenecen a la Scene que administra Canvas.
  scene.background = world.scene.background;
  scene.fog = world.scene.fog;
  const objects = new Group();
  objects.name = 'experiencia-de-conduccion';
  objects.add(...world.scene.children);
  scene.add(objects);

  function dispose() {
    scene.remove(objects);
    objects.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if ('map' in material && material.map) material.map.dispose();
          material.dispose();
        });
      }
    });
    if (scene.background === world.scene.background) scene.background = new Color(sceneConfig.background);
    if (scene.fog === world.scene.fog) scene.fog = new Fog(sceneConfig.background, 25, 90);
  }

  try {
    const cameraFollow = createCameraFollow(camera);
    const car = await loadCar();
    objects.add(car.object);
    const road = createRoad(car.groundY);
    objects.add(road.object);
    const scenarioObject = createScenarioObject(car.groundY, scenario);
    objects.add(scenarioObject.object);
    let assetWarning: string | null = null;
    if (scenario.visual.asset) {
      try {
        const asset = await new GLTFLoader().loadAsync(scenario.visual.asset);
        asset.scene.position.set(0, car.groundY, 0);
        asset.scene.scale.setScalar(1);
        objects.add(asset.scene);
      } catch {
        assetWarning = `No se pudo cargar el recurso «${scenario.visual.asset}». Se muestra el objeto educativo alternativo.`;
        console.warn(assetWarning);
      }
    }
    const traffic = await loadTraffic(car.groundY);
    objects.add(traffic.object);
    const collisions = createCollisions(car, traffic, road, cameraFollow);
    let viewportWidth = 1;
    let viewportHeight = 1;

    function resize(width: number, height: number) {
      viewportWidth = Math.max(width, 1);
      viewportHeight = Math.max(height, 1);
      frameCamera(camera, car.radius, viewportWidth / viewportHeight);
      cameraFollow.captureOffset();
      cameraFollow.update(car.object.position);
    }

    function update(delta: number) {
      const steps = Math.max(1, Math.ceil(delta / sceneConfig.collisions.maxStep));
      const step = delta / steps;
      let decisionReady = false;
      for (let i = 0; i < steps; i++) {
        collisions.capturePrevious();
        road.update(step);
        car.update(step, road.getSpeed());
        decisionReady = scenarioObject.update(step, road.getSpeed()) || decisionReady;
        traffic.update(step, road.getSpeed(), world.getNightAmount());
        collisions.resolve();
      }
      cameraFollow.update(car.object.position, delta);
      world.update(delta, camera);
      car.updateLights(world.getNightAmount());
      return decisionReady;
    }

    function resolveDecision(safeChoice: boolean) {
      if (safeChoice) {
        const event = scenario.events.safe;
        road.changeSpeed(event.targetSpeed - road.getTargetSpeed());
        if (event.effect === 'stop') {
          if (scenario.visual.kind === 'traffic-light') scenarioObject.waitForGreen();
        } else {
          car.triggerBump(event.bounce);
          cameraFollow.shake(event.shake);
        }
      } else {
        road.applyCollision();
        car.triggerBump(scenario.events.unsafe.bounce);
        cameraFollow.shake(scenario.events.unsafe.shake);
      }
      return road.getTargetSpeed();
    }

    function reset() {
      road.reset();
      scenarioObject.reset();
      car.reset();
      traffic.reset();
      cameraFollow.reset();
      world.reset(camera);
      car.updateLights(0);
      collisions.reset();
      resize(viewportWidth, viewportHeight);
      return road.getTargetSpeed();
    }

    return {
      update,
      assetWarning,
      resize,
      reset,
      resolveDecision,
      dispose,
      setNight: world.setNight,
      setSpeed: (speed: number) => road.changeSpeed(speed - road.getTargetSpeed()),
      changeLane: car.changeLane,
      canChangeLane: car.canChangeLane,
      getScreenRight: cameraFollow.getScreenRight,
      rotateCamera: cameraFollow.rotate,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
