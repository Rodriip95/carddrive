import { Color, DirectionalLight, Fog, HemisphereLight, Scene } from 'three';
import { sceneConfig } from './config';
import type { PerspectiveCamera } from 'three';
import { createSky } from './sky';

export function createWorld() {
  const scene = new Scene();
  scene.background = new Color(sceneConfig.background);
  // La niebla mezcla el paisaje con el cielo antes del final de la carretera.
  scene.fog = new Fog(sceneConfig.background, 25, 90);
  const ambientLight = new HemisphereLight(0xffffff, 0x475569, 2);
  scene.add(ambientLight);
  const sunlight = new DirectionalLight(0xffffff, 3);
  sunlight.position.set(3, 4, 5);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(2048, 2048);
  // Concentramos los píxeles de sombra alrededor del auto, no en toda la carretera.
  const shadowExtent = sceneConfig.car.size * 1.3 + sceneConfig.road.width / 3;
  sunlight.shadow.camera.left = -shadowExtent;
  sunlight.shadow.camera.right = shadowExtent;
  sunlight.shadow.camera.top = shadowExtent;
  sunlight.shadow.camera.bottom = -shadowExtent;
  sunlight.shadow.camera.near = 0.5;
  sunlight.shadow.camera.far = 20;
  sunlight.shadow.camera.updateProjectionMatrix();
  // Un desplazamiento grande separa visualmente la sombra de las ruedas.
  sunlight.shadow.normalBias = 0.002;
  sunlight.shadow.bias = -0.00002;
  scene.add(sunlight);
  const sky = createSky();
  scene.add(sky.object);
  let nightAmount = 0;
  let targetNight = 0;
  const dayColor = new Color(sceneConfig.background);
  const sunsetColor = new Color(0xc58b85);
  const nightColor = new Color(0x080f24);
  const dayAmbient = new Color(0xffffff);
  const nightAmbient = new Color(0x8aa9df);
  const dayGround = new Color(0x475569);
  const nightGround = new Color(0x182033);
  const moonlightColor = new Color(0x9cbcff);

  function setNight(night: boolean) {
    targetNight = night ? 1 : 0;
  }

  function update(delta: number, camera: PerspectiveCamera) {
    // Interpolación exponencial: se puede invertir la transición sin saltos de color.
    const blend = 1 - Math.exp(-5 * delta / Math.max(sceneConfig.sky.transitionSeconds, 0.001));
    nightAmount += (targetNight - nightAmount) * blend;
    const background = scene.background as Color;
    if (nightAmount < 0.5) background.lerpColors(dayColor, sunsetColor, nightAmount * 2);
    else background.lerpColors(sunsetColor, nightColor, (nightAmount - 0.5) * 2);
    (scene.fog as Fog).color.copy(background);
    ambientLight.color.lerpColors(dayAmbient, nightAmbient, nightAmount);
    ambientLight.groundColor.lerpColors(dayGround, nightGround, nightAmount);
    ambientLight.intensity = 2 + (0.65 - 2) * nightAmount;
    sunlight.color.lerpColors(dayAmbient, moonlightColor, nightAmount);
    sunlight.intensity = 3 + (0.8 - 3) * nightAmount;
    sky.update(nightAmount, camera);
  }

  return { scene, setNight, update, getNightAmount: () => nightAmount };
}
