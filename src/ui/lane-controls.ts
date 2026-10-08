type LaneController = {
  changeLane: (direction: number) => void;
  canChangeLane: (direction: number) => boolean;
};

export function createLaneControls(container: HTMLElement, car: LaneController, getScreenRight: () => number) {
  const panel = document.createElement('section');
  panel.className = 'speed-controls lane-controls';
  panel.setAttribute('aria-label', 'Cambio de carril');
  const label = document.createElement('span');
  label.textContent = 'Carril';

  function button(symbol: string, label: string, direction: number) {
    const element = document.createElement('button');
    element.type = 'button';
    element.textContent = symbol;
    element.setAttribute('aria-label', label);
    element.title = label;
    element.addEventListener('click', () => {
      car.changeLane(direction * getScreenRight());
      update();
    });
    return element;
  }

  const left = button('←', 'Cambiar al carril de la izquierda', -1);
  const right = button('→', 'Cambiar al carril de la derecha', 1);
  panel.append(label, left, right);
  container.appendChild(panel);

  function update() {
    left.disabled = !car.canChangeLane(-getScreenRight());
    right.disabled = !car.canChangeLane(getScreenRight());
  }
  update();
  return { update };
}
