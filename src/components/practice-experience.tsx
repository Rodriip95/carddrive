'use client';

import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { createDrivingExperience } from '../scene/app';
import { createScenarioController } from '../domain/scenario-controller';
import { scenarios as allScenarios } from '../content/scenarios';
import { getModule } from '../content/modules';
import DrivingScene from './three/driving-scene';
import { DrivingHud } from './DrivingHud';
import { ScenarioIllustration } from './ScenarioIllustration';
import { useLearningProgress } from './ProgressProvider';

type DrivingExperienceApi = Awaited<ReturnType<typeof createDrivingExperience>>;

export default function PracticeExperience({ moduleId, initialScenarioId }: { moduleId?: string; initialScenarioId?: string }) {
  // En modo módulo la práctica sigue la secuencia del módulo; sin módulo, el usuario elige.
  const learningModule = moduleId ? getModule(moduleId) : undefined;
  const scenarios = learningModule
    ? learningModule.scenarioIds.flatMap((id) => allScenarios.find((item) => item.id === id) ?? [])
    : allScenarios;
  const { progress, recordScenarioCompletion } = useLearningProgress();
  const [speed, setSpeed] = useState(8);
  const [night, setNight] = useState(false);
  const [experience, setExperience] = useState<DrivingExperienceApi | null>(null);
  const [sceneLoadState, setSceneLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const [practiceMode, setPracticeMode] = useState<'3d' | 'sin-3d'>('3d');
  const [selectedScenarioId, setSelectedScenarioId] = useState(scenarios.find((item) => item.id === initialScenarioId)?.id ?? scenarios[0]?.id ?? '');
  const [assetWarning, setAssetWarning] = useState<string | null>(null);
  const [controller] = useState(createScenarioController);
  const [showingConsequence, setShowingConsequence] = useState(false);
  const consequenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Pedal sostenido (botón o teclado). Se lee en cada fotograma, por eso es un ref y no estado.
  const pedalRef = useRef<-1 | 0 | 1>(0);
  const scenario = useSyncExternalStore(controller.subscribe, controller.getState, controller.getState);
  const selectedScenario = scenarios.find((item) => item.id === selectedScenarioId) ?? scenarios[0];
  const speedLimit = selectedScenario?.maxSpeed ?? 32;
  const isTextMode = practiceMode === 'sin-3d';
  const isDriving = scenario.status === 'conduciendo';
  const isAction = scenario.status === 'accion';
  const canDrive = isDriving || isAction;

  useEffect(() => {
    const canvas = document.createElement('canvas');
    let canRenderThree = false;
    try {
      const context = canvas.getContext('webgl2');
      canRenderThree = Boolean(context);
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      canRenderThree = false;
    }
    setWebglAvailable(canRenderThree);
    if (!canRenderThree) {
      setPracticeMode('sin-3d');
      setSceneLoadState('ready');
      controller.reset();
    }
  }, [controller]);

  const handleReady = useCallback((nextExperience: DrivingExperienceApi | null) => {
    setExperience(nextExperience);
  }, []);

  const handleSceneLoadStateChange = useCallback((state: 'loading' | 'ready' | 'error') => {
    setSceneLoadState(state);
    if (state === 'error') {
      setPracticeMode('sin-3d');
      controller.reset();
    }
  }, [controller]);

  const handleAssetWarning = useCallback((warning: string | null) => setAssetWarning(warning), []);

  useEffect(() => () => {
    if (consequenceTimer.current) clearTimeout(consequenceTimer.current);
  }, []);

  // Si dejamos de poder conducir, soltamos los pedales para no arrastrar una pulsación vieja.
  useEffect(() => {
    if (!canDrive) pedalRef.current = 0;
  }, [canDrive]);

  // Guardamos el avance del módulo cuando la situación termina bien (decisión + maniobra).
  useEffect(() => {
    if (moduleId && selectedScenario && scenario.status === 'resultado' && scenario.correct) {
      recordScenarioCompletion(moduleId, selectedScenario.id);
    }
  }, [scenario, moduleId, selectedScenario, recordScenarioCompletion]);

  function clearConsequence() {
    if (consequenceTimer.current) clearTimeout(consequenceTimer.current);
    consequenceTimer.current = null;
    setShowingConsequence(false);
  }

  // Aplica el efecto en la escena (impacto o parada segura) y lo deja correr un momento.
  function playConsequence(safe: boolean) {
    if (!experience || !selectedScenario) return;
    experience.resolveDecision(safe);
    if (consequenceTimer.current) clearTimeout(consequenceTimer.current);
    setShowingConsequence(true);
    consequenceTimer.current = setTimeout(() => {
      consequenceTimer.current = null;
      setShowingConsequence(false);
    }, safe && selectedScenario.events.safe.effect === 'stop' ? selectedScenario.events.safe.settleMs : 1500);
  }

  const presentScenarioDecision = useCallback(() => {
    if (selectedScenario) controller.presentDecision(selectedScenario.decision);
  }, [controller, selectedScenario]);

  // La escena avisa cuando la maniobra se cumplió o falló.
  const handleActionResult = useCallback((success: boolean) => {
    const result = controller.completeAction(success);
    if (result.status === 'resultado') playConsequence(success);
  }, [controller, experience, selectedScenario]);

  function moveLane(direction: -1 | 1) {
    if (!experience || !canDrive) return;
    experience.changeLane(direction * experience.getScreenRight());
  }

  // Teclado: flechas o WASD. Arriba/abajo son pedales; izquierda/derecha cambian de carril.
  useEffect(() => {
    if (isTextMode || !canDrive) return;
    const pedalKeys: Record<string, -1 | 1> = { ArrowUp: 1, w: 1, W: 1, ArrowDown: -1, s: -1, S: -1 };
    const laneKeys: Record<string, -1 | 1> = { ArrowLeft: -1, a: -1, A: -1, ArrowRight: 1, d: 1, D: 1 };

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;
      if (event.key in pedalKeys) {
        event.preventDefault();
        pedalRef.current = pedalKeys[event.key]!;
      } else if (event.key in laneKeys && !event.repeat) {
        event.preventDefault();
        moveLane(laneKeys[event.key]!);
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.key in pedalKeys && pedalRef.current === pedalKeys[event.key]) pedalRef.current = 0;
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isTextMode, canDrive, experience]);

  function restartScenario() {
    clearConsequence();
    const initialSpeed = experience?.reset() ?? 8;
    setSpeed(Math.round(initialSpeed));
    setNight(false);
    controller.reset();
  }

  function goToScenario(id: string) {
    clearConsequence();
    setSelectedScenarioId(id);
    setAssetWarning(null);
    controller.reset();
  }

  function changePracticeMode(mode: '3d' | 'sin-3d') {
    if (mode === '3d' && (!webglAvailable || sceneLoadState === 'error')) return;
    clearConsequence();
    setExperience(null);
    setSpeed(8);
    setNight(false);
    setAssetWarning(null);
    setSceneLoadState(mode === '3d' ? 'loading' : 'ready');
    setPracticeMode(mode);
    controller.reset();
  }

  function startScenario() {
    if (!selectedScenario) return;
    controller.start();
    if (isTextMode) controller.presentDecision(selectedScenario.decision);
  }

  function chooseOption(optionId: string) {
    const result = controller.decide(optionId);
    if (result.status === 'accion') {
      // Sin 3D no se puede manejar: la maniobra se da por comprendida.
      if (isTextMode) controller.completeAction(true);
      else experience?.beginAction(result.action);
      return;
    }
    if (result.status === 'resultado' && !isTextMode) playConsequence(result.correct);
  }

  if (!selectedScenario) {
    return <p className="notice-card">Este módulo todavía no tiene situaciones de práctica.</p>;
  }

  const currentIndex = scenarios.findIndex((item) => item.id === selectedScenario.id);
  const nextScenario = scenarios[currentIndex + 1];
  const moduleProgress = progress.modules.find((item) => item.moduleId === moduleId);
  const completedInModule = scenarios.filter((item) => moduleProgress?.completedScenarioIds.includes(item.id)).length;

  const modeSelector = (
    <div className="practice-mode-switch" role="group" aria-label="Modo de práctica">
      <button type="button" aria-pressed={!isTextMode} disabled={!webglAvailable || sceneLoadState === 'error'} onClick={() => changePracticeMode('3d')}>Experiencia 3D</button>
      <button type="button" aria-pressed={isTextMode} onClick={() => changePracticeMode('sin-3d')}>Modo sin 3D</button>
    </div>
  );

  const moduleBar = learningModule && (
    <p className="practice-module-bar">
      <strong>{learningModule.title}</strong> · situación {currentIndex + 1} de {scenarios.length} · {completedInModule} completadas
    </p>
  );

  // Selector libre o, en modo módulo, lista fija de la secuencia.
  const scenarioPicker = (
    <>
      <label className="scenario-picker-label" htmlFor="scenario-picker">Elegí una situación para practicar</label>
      <select id="scenario-picker" className="scenario-picker" value={selectedScenarioId} onChange={(event) => goToScenario(event.target.value)}>
        {scenarios.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select>
    </>
  );

  const sourceBlock = selectedScenario.source && (
    <div className="answer-source">
      <strong>Fuente: </strong>
      <a href={selectedScenario.source.url} target="_blank" rel="noreferrer">{selectedScenario.source.title}</a>
      <span>{selectedScenario.source.publisher} · {selectedScenario.source.jurisdiction}</span>
      <span>{selectedScenario.source.reference}</span>
    </div>
  );

  // Botón para avanzar en el módulo cuando la situación salió bien.
  const moduleNext = learningModule && scenario.status === 'resultado' && scenario.correct && (
    nextScenario
      ? <button type="button" className="answer-button" onClick={() => goToScenario(nextScenario.id)}>Siguiente situación →</button>
      : <Link className="primary-link" href={`/lecciones/${learningModule.id}`}>Volver al listado de situaciones</Link>
  );

  const failureMessage = scenario.status === 'resultado' && scenario.failure === 'accion'
    ? scenario.decision.action?.failureMessage
    : null;

  if (isTextMode) {
    return (
      <section className="practice-shell" aria-label="Práctica de manejo">
        {modeSelector}
        {moduleBar}
        {webglAvailable === false && <p className="practice-mode-notice" role="status">Este navegador no dispone de WebGL 2. La práctica continúa en modo sin 3D.</p>}
        {sceneLoadState === 'error' && <p className="practice-mode-notice" role="alert">No se pudo cargar la escena 3D. Podés completar la práctica en el modo sin 3D.</p>}
        <div className="text-practice" aria-labelledby="text-practice-title">
          <p className="eyebrow">ALTERNATIVA SIN CANVAS</p>
          <h2 id="text-practice-title">{selectedScenario.title}</h2>
          <ScenarioIllustration scenario={selectedScenario} />
          {scenario.status === 'inicio' && <>
            <p>{selectedScenario.intro}</p>
            {scenarioPicker}
            <button type="button" className="answer-button" onClick={startScenario}>Iniciar situación</button>
          </>}
          {scenario.status === 'decision' && <section className="text-practice-decision" aria-labelledby="text-decision-title" aria-live="polite" aria-atomic="true">
            <h3 id="text-decision-title">¿Qué harías?</h3>
            <p>{scenario.decision.prompt}</p>
            <div className="scenario-options">
              {scenario.decision.options.map((option) => <button key={option.id} type="button" className="scenario-option" onClick={() => chooseOption(option.id)}>{option.label}</button>)}
            </div>
          </section>}
          {scenario.status === 'resultado' && <section className={`text-practice-result ${scenario.correct ? 'is-correct' : 'is-incorrect'}`} role="status" aria-live="polite">
            <h3>{scenario.correct ? 'Buena decisión' : 'Revisemos la situación'}</h3>
            <p>{scenario.decision.explanation}</p>
            {sourceBlock}
            {moduleNext}
            <button type="button" className="answer-button" onClick={() => controller.reset()}>{learningModule ? 'Repetir situación' : 'Practicar otra situación'}</button>
          </section>}
        </div>
      </section>
    );
  }

  return (
    <section className="practice-shell" aria-label="Simulador 3D de conducción">
      {modeSelector}
      {moduleBar}
      {webglAvailable === false && <p className="practice-mode-notice" role="status">Este navegador no dispone de WebGL 2. La práctica continúa en modo sin 3D.</p>}
      <div className={`practice-canvas${scenario.status === 'decision' ? ' scene-decision' : ''}`}>
        {webglAvailable && <Canvas shadows="basic" camera={{ position: [4, 3.5, 7], fov: 45 }}>
          <DrivingScene
            pedalRef={pedalRef}
            speedLimit={speedLimit}
            night={night}
            running={canDrive || showingConsequence}
            controlsEnabled={canDrive}
            scenario={selectedScenario}
            onReady={handleReady}
            onLoadStateChange={handleSceneLoadStateChange}
            onDecisionReady={presentScenarioDecision}
            onActionResult={handleActionResult}
            onSpeedChange={setSpeed}
            onAssetWarning={handleAssetWarning}
          />
        </Canvas>}
        {(!webglAvailable || sceneLoadState === 'loading') && <p className="canvas-status" role="status">{webglAvailable ? 'Cargando el auto…' : 'Comprobando compatibilidad 3D…'}</p>}
        {sceneLoadState === 'error' && <p className="canvas-status canvas-status-error" role="alert">No se pudo cargar la escena. Recargá la página para intentarlo de nuevo.</p>}
        {canDrive && <DrivingHud
          speed={speed}
          speedLimit={speedLimit}
          night={night}
          instruction={scenario.status === 'accion' ? scenario.action.instruction : null}
          canPause={isDriving}
          canSteerLeft={Boolean(experience?.canChangeLane(-experience.getScreenRight()))}
          canSteerRight={Boolean(experience?.canChangeLane(experience.getScreenRight()))}
          pedalRef={pedalRef}
          onSteer={moveLane}
          onToggleNight={() => setNight((current) => !current)}
          onRotateCamera={(direction) => experience?.rotateCamera(direction)}
          onPause={() => controller.pause()}
        />}
        {!canDrive && <div className="scenario-overlay">
          {assetWarning && <p className="scenario-asset-warning" role="status">{assetWarning}</p>}
          {scenario.status === 'inicio' && <section className="scenario-panel" aria-labelledby="scenario-title">
            <p className="eyebrow">Escenario de conducción</p>
            <h2 id="scenario-title">{selectedScenario.title}</h2>
            <p>{selectedScenario.intro}</p>
            {scenarioPicker}
            <p className="scenario-hint">Controles: pedales de freno y acelerador abajo a la derecha (o ↑ ↓), cambio de carril abajo a la izquierda (o ← →).</p>
            <button type="button" className="answer-button" onClick={startScenario} disabled={sceneLoadState !== 'ready'}>Iniciar escenario</button>
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
            <p className="eyebrow">Resultado</p>
            <h2 id="scenario-title">{scenario.correct ? 'Buena decisión' : failureMessage ? 'Elegiste bien, pero faltó la maniobra' : 'Revisemos la situación'}</h2>
            {failureMessage && <p>{failureMessage}</p>}
            <p>{scenario.decision.explanation}</p>
            {sourceBlock}
            {moduleNext}
            {!learningModule && scenario.correct && selectedScenario.events.safe.effect !== 'stop' && <button type="button" className="answer-button" onClick={() => controller.continueDriving()}>Continuar conduciendo</button>}
            <button type="button" className="secondary-button" onClick={restartScenario}>{scenario.correct ? 'Repetir escenario' : 'Intentar de nuevo'}</button>
          </section>}
        </div>}
      </div>
    </section>
  );
}
