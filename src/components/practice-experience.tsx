'use client';

import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Suspense, useMemo, useState } from 'react';
import { createLaneChange } from '../scene/lane-change';
import DrivingScene from './three/driving-scene';

export default function PracticeExperience() {
  const [speed, setSpeed] = useState(8);
  const [night, setNight] = useState(false);
  const laneChange = useMemo(() => createLaneChange(2.2, 24, 1), []);

  return (
    <section className="practice-shell" aria-label="Simulador 3D de conducción">
      <div className="practice-canvas">
        <Canvas shadows="basic" camera={{ position: [4, 3.5, 7], fov: 42 }}>
          <Suspense fallback={<Html center><p className="canvas-loading" role="status">Cargando el vehículo…</p></Html>}>
            <DrivingScene speed={speed} night={night} laneChange={laneChange} />
          </Suspense>
        </Canvas>
      </div>
      <div className="practice-controls" aria-label="Controles de práctica">
        <p>Velocidad: {speed} km/h</p>
        <button type="button" onClick={() => setSpeed((current) => Math.min(32, current + 4))} disabled={speed >= 32}>Acelerar</button>
        <button type="button" onClick={() => setSpeed((current) => Math.max(0, current - 4))} disabled={speed <= 0}>Frenar</button>
        <button type="button" onClick={() => laneChange.changeLane(-1)} disabled={!laneChange.canChange(-1)}>Moverse a la izquierda</button>
        <button type="button" onClick={() => laneChange.changeLane(1)} disabled={!laneChange.canChange(1)}>Moverse a la derecha</button>
        <button type="button" onClick={() => setNight((current) => !current)}>{night ? 'Cambiar a día' : 'Cambiar a noche'}</button>
      </div>
    </section>
  );
}
