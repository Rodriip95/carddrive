'use client';

import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { createDrivingExperience } from '../scene/app';
import { createScenarioController } from '../domain/scenario-controller';
import { scenarios } from '../content/scenarios';
import DrivingScene from './three/driving-scene';

type DrivingExperienceApi = Awaited<ReturnType<typeof createDrivingExperience>>;

export default function PracticeExperience() {
  const [speed, setSpeed] = useState(8);
  const [night, setNight] = useState(false);
  const [experience, setExperience] = useState<DrivingExperienceApi | null>(null);
  const [sceneLoadState, setSceneLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [selectedScenarioId, setSelectedScenarioId] = useState(scenarios[0].id);
  const [assetWarning, setAssetWarning] = useState<string | null>(null);
  const [controller] = useState(createScenarioController);
  const [showingConsequence, setShowingConsequence] = useState(false);
  const consequenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scenario = useSyncExternalStore(controller.subscribe, controller.getState, controller.getState);
  const selectedScenario = scenarios.find((item) => item.id === selectedScenarioId) ?? scenarios[0];
  const speedLimit = selectedScenario.maxSpeed ?? 32;

  const handleReady = useCallback((nextExperience: DrivingExperienceApi | null) => {
    setExperience(nextExperience);
  }, []);

  const handleSceneLoadStateChange = useCallback((state: 'loading' | 'ready' | 'error') => {
    setSceneLoadState(state);
  }, []);

  const presentScenarioDecision = useCallback(() => {
    controller.presentDecision(selectedScenario.decision);
  }, [controller, selectedScenario]);

  const handleAssetWarning = useCallback((warning: string | null) => setAssetWarning(warning), []);

  useEffect(() => () => {
    if (consequenceTimer.current) clearTimeout(consequenceTimer.current);
  }, []);

  useEffect(() => {
    setSpeed((current) => Math.min(current, speedLimit));
  }, [speedLimit]);

  function moveLane(direction: -1 | 1) {
    if (!experience) return;
    experience.changeLane(direction * experience.getScreenRight());
  }

  function restartScenario() {
    if (consequenceTimer.current) clearTimeout(consequenceTimer.current);
    consequenceTimer.current = null;
    setShowingConsequence(false);
    const initialSpeed = experience?.reset() ?? 8;
    setSpeed(initialSpeed);
    setNight(false);
    controller.reset();
  }

  function chooseOption(optionId: string) {
    const result = controller.decide(optionId);
    if (result.status !== 'resultado') return;
    const targetSpeed = experience?.resolveDecision(result.correct);
    if (targetSpeed !== undefined) setSpeed(targetSpeed);
    if (consequenceTimer.current) clearTimeout(consequenceTimer.current);
    setShowingConsequence(true);
    consequenceTimer.current = setTimeout(() => {
      consequenceTimer.current = null;
      setShowingConsequence(false);
    }, result.correct && selectedScenario.events.safe.effect === 'stop'
      ? selectedScenario.events.safe.settleMs
      : 1500);
  }

  const isDriving = scenario.status === 'conduciendo';

  return (
    <section className="practice-shell" aria-label="Simulador 3D de conducción">
      <div className={`practice-canvas${scenario.status === 'decision' ? ' scene-decision' : ''}`}>
        <Canvas shadows="basic" camera={{ position: [4, 3.5, 7], fov: 45 }}>
          <DrivingScene
            speed={speed}
            night={night}
            running={isDriving || showingConsequence}
            scenario={selectedScenario}
            onReady={handleReady}
            onLoadStateChange={handleSceneLoadStateChange}
            onDecisionReady={presentScenarioDecision}
            onAssetWarning={handleAssetWarning}
          />
        </Canvas>
        {sceneLoadState === 'loading' && <p className="canvas-status" role="status">Cargando los vehículos…</p>}
        {sceneLoadState === 'error' && <p className="canvas-status canvas-status-error" role="alert">No se pudo cargar la escena. Recargá la página para intentarlo de nuevo.</p>}
        {!isDriving && <div className="scenario-overlay">
          {assetWarning && <p className="scenario-asset-warning" role="status">{assetWarning}</p>}
          {scenario.status === 'inicio' && <section className="scenario-panel" aria-labelledby="scenario-title">
            <p className="eyebrow">Escenario de conducción</p>
            <h2 id="scenario-title">{selectedScenario.title}</h2>
            <p>{selectedScenario.intro}</p>
            <label className="scenario-picker-label" htmlFor="scenario-picker">Elegí una situación para practicar</label>
            <select id="scenario-picker" className="scenario-picker" value={selectedScenarioId} onChange={(event) => {
              setSelectedScenarioId(event.target.value);
              controller.reset();
              setAssetWarning(null);
            }}>
              {scenarios.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
            <button type="button" className="answer-button" onClick={() => controller.start()}>Iniciar escenario</button>
          </section>}
          {scenario.status === 'pausa' && <section className="scenario-panel" aria-labelledby="scenario-title">
            <p className="eyebrow">Escenario pausado</p>
            <h2 id="scenario-title">Tomate un momento</h2>
            <p>La carretera y los vehículos están detenidos.</p>
            <button type="button" className="answer-button" onClick={() => controller.resume()}>Continuar</button>
            <button type="button" className="secondary-button" onClick={restartScenario}>Reiniciar escenario</button>
          </section>}
          {scenario.status === 'decision' && <section className="scenario-panel" aria-labelledby="scenario-title">
            <p className="eyebrow">Decisión de conducción</p>
            <h2 id="scenario-title">{selectedScenario.title}: ¿qué harías?</h2>
            <p>{scenario.decision.prompt}</p>
            <div className="scenario-options">
              {scenario.decision.options.map((option) => <button key={option.id} type="button" className="scenario-option" onClick={() => chooseOption(option.id)}>{option.label}</button>)}
            </div>
          </section>}
          {scenario.status === 'resultado' && <section className="scenario-panel" aria-labelledby="scenario-title" aria-live="polite">
            <p className="eyebrow">Resultado de la decisión</p>
            <h2 id="scenario-title">{scenario.correct ? 'Buena decisión' : 'Revisemos la situación'}</h2>
            <p>{scenario.decision.explanation}</p>
            {selectedScenario.source && <div className="answer-source">
              <strong>Fuente: </strong>
              <a href={selectedScenario.source.url} target="_blank" rel="noreferrer">{selectedScenario.source.title}</a>
              <span>{selectedScenario.source.publisher} · {selectedScenario.source.jurisdiction}</span>
              <span>{selectedScenario.source.reference}</span>
            </div>}
            {scenario.correct || selectedScenario.events.safe.effect !== 'stop'
              ? <button type="button" className="answer-button" onClick={() => controller.continueDriving()}>Continuar conduciendo</button>
              : <p>La práctica queda detenida. Reiniciá para intentarlo de nuevo con la conducta segura.</p>}
            <button type="button" className="secondary-button" onClick={restartScenario}>Reiniciar escenario</button>
          </section>}
        </div>}
      </div>
      <div className="practice-controls" aria-label="Controles de práctica">
        <p>Velocidad: {speed} km/h</p>
        <button type="button" onClick={() => setSpeed((current) => Math.min(speedLimit, current + 4))} disabled={!isDriving || speed >= speedLimit}>Acelerar</button>
        <button type="button" onClick={() => setSpeed((current) => Math.max(0, current - 4))} disabled={!isDriving || speed <= 0}>Frenar</button>
        <button type="button" onClick={() => moveLane(-1)} disabled={!isDriving || !experience || !experience.canChangeLane(-experience.getScreenRight())}>Moverse a la izquierda</button>
        <button type="button" onClick={() => moveLane(1)} disabled={!isDriving || !experience || !experience.canChangeLane(experience.getScreenRight())}>Moverse a la derecha</button>
        <button type="button" onClick={() => experience?.rotateCamera(-1)} disabled={!isDriving || !experience} aria-label="Girar cámara a la izquierda">Girar cámara ←</button>
        <button type="button" onClick={() => experience?.rotateCamera(1)} disabled={!isDriving || !experience} aria-label="Girar cámara a la derecha">Girar cámara →</button>
        <button type="button" onClick={() => setNight((current) => !current)} disabled={!isDriving}>{night ? 'Cambiar a día' : 'Cambiar a noche'}</button>
        {isDriving && <>
          <button type="button" onClick={() => controller.pause()}>Pausar</button>
          <button type="button" onClick={restartScenario}>Reiniciar escenario</button>
        </>}
      </div>
    </section>
  );
}
