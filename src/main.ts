import './style.css';
import { startScene } from './scene/app';

const container = document.querySelector<HTMLDivElement>('#app');
if (!container) throw new Error('No se encontró el contenedor #app.');

void startScene(container);
