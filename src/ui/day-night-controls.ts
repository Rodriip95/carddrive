export function createDayNightControls(container: HTMLElement, setNight: (night: boolean) => void) {
  let night = false;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'day-night-toggle';

  function update() {
    button.textContent = night ? '☀ Cambiar a día' : '☾ Cambiar a noche';
    button.setAttribute('aria-label', button.textContent);
    setNight(night);
  }

  button.addEventListener('click', () => {
    night = !night;
    update();
  });
  update();
  container.appendChild(button);
}
