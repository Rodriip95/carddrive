import { sceneConfig } from '../scene/config';

type SpeedController = {
  changeSpeed: (change: number) => void;
  getSpeed: () => number;
  getTargetSpeed: () => number;
};

export function createSpeedControls(container: HTMLElement, road: SpeedController) {
  const panel = document.createElement('section');
  panel.className = 'speed-controls';
  panel.setAttribute('aria-label', 'Control de velocidad');

  const label = document.createElement('span');
  label.textContent = 'Velocidad';
  const value = document.createElement('span');
  value.className = 'speed-value';

  function button(symbol: string, label: string, change: number) {
    const element = document.createElement('button');
    element.type = 'button';
    element.textContent = symbol;
    element.setAttribute('aria-label', label);
    element.title = label;
    element.addEventListener('click', () => {
      road.changeSpeed(change);
      update();
    });
    return element;
  }

  const increase = button('↑', 'Aumentar velocidad', sceneConfig.road.speedStep);
  const decrease = button('↓', 'Reducir velocidad', -sceneConfig.road.speedStep);
  panel.append(label, value, increase, decrease);
  container.appendChild(panel);

  function update() {
    const text = `${road.getSpeed().toFixed(1)} u/s`;
    if (value.textContent !== text) value.textContent = text;
    increase.disabled = road.getTargetSpeed() >= sceneConfig.road.maxSpeed;
    decrease.disabled = road.getTargetSpeed() <= 0;
  }
  update();
  return { update };
}
