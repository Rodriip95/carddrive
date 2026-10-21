import { Color, Fog, Group, MathUtils, Mesh, PerspectiveCamera, Scene } from 'three';
import { createCameraFollow, frameCamera } from './camera';
import { loadCar } from './car';
import { loadTraffic } from './traffic';
import { createCollisions } from './collisions';
import { sceneConfig } from './config';
import { createWorld } from './world';
import { createRoad } from './road';
import { createScenarioObject } from './scenario-object';
import type { ScenarioConfig } from '../domain/scenario';
import type { ScenarioAction } from '../domain/scenario-controller';

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
    const scenarioObject = await createScenarioObject(car.groundY, scenario);
    objects.add(scenarioObject.object);
    road.setMarkingGap(scenarioObject.getMarkingGap());
    const assetWarning = scenarioObject.assetWarning;
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
      // Aplicamos la iluminación inicial después de encuadrar la cámara.
      world.update(0);
    }

    // Maniobra que el usuario debe ejecutar tras elegir la opción correcta.
    let action: ScenarioAction | null = null;
    let actionResult: 'success' | 'failure' | null = null;
    let bumpTooFast = false;

    function beginAction(next: ScenarioAction) {
      action = next;
      actionResult = null;
      bumpTooFast = false;
    }

    function evaluateAction() {
      if (!action || actionResult) return;
      // Distancia entre el frente del auto y la línea; el auto está en Z=0 mirando hacia +Z.
      const gap = scenarioObject.getDistance() - car.size.z / 2;
      const speed = road.getSpeed();
      if (scenario.visual.kind === 'speed-bump' && action.kind === 'slow-to') {
        // Se evalúa el paso completo, no la respuesta ni un temporizador.
        if (gap <= 1 && scenarioObject.getDistance() >= -car.size.z / 2 - 0.5 && speed > action.maxSpeed) bumpTooFast = true;
        if (scenarioObject.getDistance() < -car.size.z / 2 - 0.5) actionResult = bumpTooFast ? 'failure' : 'success';
      } else if (action.kind === 'stop-before-line') {
        if (gap <= 0) actionResult = 'failure';
        else if (speed < 0.05) actionResult = 'success';
      } else if (gap <= 1) {
        actionResult = speed <= action.maxSpeed ? 'success' : 'failure';
      }
    }

    // Pedal sostenido: acelera (1), frena (-1) o mantiene la velocidad (0).
    let lastPedal: -1 | 0 | 1 = 0;

    function drive(pedal: -1 | 0 | 1, delta: number, speedLimit: number) {
      if (pedal === 0) {
        // Al soltar el pedal mantenemos la velocidad actual en lugar de seguir hasta la objetivo.
        if (lastPedal !== 0) road.changeSpeed(road.getSpeed() - road.getTargetSpeed());
        lastPedal = 0;
        return;
      }
      lastPedal = pedal;
      const { accelerate, brake } = sceneConfig.pedals;
      const target = road.getTargetSpeed();
      const next = MathUtils.clamp(target + pedal * (pedal > 0 ? accelerate : brake) * delta, 0, speedLimit);
      road.changeSpeed(next - target);
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
        if (scenario.visual.kind === 'speed-bump') car.followSurface(step, road.getSpeed(), scenarioObject.getSurfaceHeight);
        evaluateAction();
      }
      cameraFollow.update(car.object.position, delta);
      road.setMarkingGap(scenarioObject.getMarkingGap());
      world.update(delta);
      car.updateLights(world.getNightAmount());
      const result = actionResult;
      if (result) { action = null; actionResult = null; }
      return { decisionReady, actionResult: result };
    }

    function resolveDecision(safeChoice: boolean) {
      // En la loma el contacto real gobierna la altura: elegir una opción no provoca un salto.
      if (scenario.visual.kind === 'speed-bump') return road.getTargetSpeed();
      if (safeChoice) {
        const event = scenario.events.safe;
        // Con maniobra, la velocidad ya la manejó el usuario; sin ella aplicamos la velocidad objetivo.
        if (!scenario.decision.action) road.changeSpeed(event.targetSpeed - road.getTargetSpeed());
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
      action = null;
      actionResult = null;
      bumpTooFast = false;
      road.reset();
      scenarioObject.reset();
      road.setMarkingGap(scenarioObject.getMarkingGap());
      car.reset();
      traffic.reset();
      cameraFollow.reset();
      world.reset();
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
      beginAction,
      drive,
      getSpeed: road.getSpeed,
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
