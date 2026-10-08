type CameraController = {
  rotate: (direction: -1 | 1) => void;
};

export function createCameraControls(container: HTMLElement, camera: CameraController) {
  const panel = document.createElement('section');
  panel.className = 'speed-controls camera-controls';
  panel.setAttribute('aria-label', 'Vista de la cámara');
  const label = document.createElement('span');
  label.textContent = 'Cámara';
  panel.appendChild(label);

  const directions = [-1, 1] as const;
  directions.forEach((direction) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = direction === -1 ? '←' : '→';
    button.title = direction === -1 ? 'Girar cámara hacia la izquierda' : 'Girar cámara hacia la derecha';
    button.setAttribute('aria-label', button.title);
    button.addEventListener('click', () => {
      camera.rotate(direction);
    });
    panel.appendChild(button);
  });
  container.appendChild(panel);
}
