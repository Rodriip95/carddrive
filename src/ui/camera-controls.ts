type CameraController = {
  setCorner: (index: number) => void;
  getCorner: () => number;
};

export function createCameraControls(container: HTMLElement, camera: CameraController) {
  const panel = document.createElement('section');
  panel.className = 'speed-controls camera-controls';
  panel.setAttribute('aria-label', 'Vista de la cámara');
  const label = document.createElement('span');
  label.textContent = 'Cámara';
  panel.appendChild(label);

  const names = ['Delantera izquierda', 'Delantera derecha', 'Trasera izquierda', 'Trasera derecha'];
  const symbols = ['↖', '↗', '↙', '↘'];
  const buttons = names.map((name, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = symbols[index];
    button.title = name;
    button.setAttribute('aria-label', `Vista ${name.toLowerCase()}`);
    button.addEventListener('click', () => {
      camera.setCorner(index);
      update();
    });
    panel.appendChild(button);
    return button;
  });

  function update() {
    buttons.forEach((button, index) => {
      button.setAttribute('aria-pressed', String(camera.getCorner() === index));
    });
  }
  update();
  container.appendChild(panel);
}
