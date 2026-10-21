'use client';

import { useState } from 'react';
import type { MutableRefObject, ReactNode } from 'react';

type Pedal = -1 | 0 | 1;

// Botón que actúa mientras se mantiene presionado, como un pedal real.
function PedalButton({ pedal, pedalRef, className, label, children }: {
  pedal: Pedal;
  pedalRef: MutableRefObject<Pedal>;
  className: string;
  label: string;
  children: ReactNode;
}) {
  const [pressed, setPressed] = useState(false);

  function release() {
    if (pedalRef.current === pedal) pedalRef.current = 0;
    setPressed(false);
  }

  return (
    <button
      type="button"
      className={`hud-button ${className}${pressed ? ' is-pressed' : ''}`}
      aria-label={label}
      onPointerDown={(event) => {
        // La captura mantiene el pedal activo aunque el dedo se salga del botón.
        event.currentTarget.setPointerCapture(event.pointerId);
        pedalRef.current = pedal;
        setPressed(true);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      onContextMenu={(event) => event.preventDefault()}
    >
      {children}
    </button>
  );
}

export function DrivingHud({ speed, speedLimit, night, instruction, canPause, canSteerLeft, canSteerRight, pedalRef, onSteer, onToggleNight, onRotateCamera, onPause }: {
  speed: number;
  speedLimit: number;
  night: boolean;
  instruction: string | null;
  canPause: boolean;
  canSteerLeft: boolean;
  canSteerRight: boolean;
  pedalRef: MutableRefObject<Pedal>;
  onSteer: (direction: -1 | 1) => void;
  onToggleNight: () => void;
  onRotateCamera: (direction: -1 | 1) => void;
  onPause: () => void;
}) {
  return (
    <div className="driving-hud">
      <div className="hud-speed" role="status" aria-label={`Velocidad ${speed} kilómetros por hora`}>
        <strong>{speed}</strong>
        <span>km/h</span>
        <small>máx. {speedLimit}</small>
      </div>

      {instruction && (
        <p className="hud-instruction" role="status" aria-live="polite">
          <strong>Ahora hacelo:</strong> {instruction}
        </p>
      )}

      <div className="hud-tools" role="group" aria-label="Vista">
        <button type="button" className="hud-button hud-small" onClick={() => onRotateCamera(-1)} aria-label="Girar cámara a la izquierda" title="Girar cámara a la izquierda">⟲</button>
        <button type="button" className="hud-button hud-small" onClick={() => onRotateCamera(1)} aria-label="Girar cámara a la derecha" title="Girar cámara a la derecha">⟳</button>
        <button type="button" className="hud-button hud-small" onClick={onToggleNight} aria-pressed={night} aria-label={night ? 'Cambiar a día' : 'Cambiar a noche'} title={night ? 'Cambiar a día' : 'Cambiar a noche'}>{night ? '☀' : '☾'}</button>
        {canPause && <button type="button" className="hud-button hud-small" onClick={onPause} aria-label="Pausar" title="Pausar">❚❚</button>}
      </div>

      <div className="hud-steering" role="group" aria-label="Volante">
        <button type="button" className="hud-button hud-steer" onClick={() => onSteer(-1)} disabled={!canSteerLeft} aria-label="Moverse a la izquierda" title="Izquierda (←)">◀</button>
        <button type="button" className="hud-button hud-steer" onClick={() => onSteer(1)} disabled={!canSteerRight} aria-label="Moverse a la derecha" title="Derecha (→)">▶</button>
      </div>

      <div className="hud-pedals" role="group" aria-label="Pedales">
        <PedalButton pedal={-1} pedalRef={pedalRef} className="hud-brake" label="Freno (mantener presionado)">
          <span>Freno</span><small>↓ / S</small>
        </PedalButton>
        <PedalButton pedal={1} pedalRef={pedalRef} className="hud-gas" label="Acelerador (mantener presionado)">
          <span>Acelerar</span><small>↑ / W</small>
        </PedalButton>
      </div>
    </div>
  );
}
