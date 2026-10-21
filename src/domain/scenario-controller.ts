export type ScenarioOption = {
  id: string;
  label: string;
};

/** Maniobra que el usuario debe ejecutar con el auto después de elegir la opción correcta. */
export type ScenarioAction = {
  instruction: string;
  failureMessage: string;
} & (
  | { kind: 'stop-before-line' }
  | { kind: 'slow-to'; maxSpeed: number }
);

export type ScenarioDecision = {
  id: string;
  prompt: string;
  options: ScenarioOption[];
  correctOptionId: string;
  explanation: string;
  action?: ScenarioAction;
};

export type ScenarioState =
  | { status: 'inicio' }
  | { status: 'conduciendo' }
  | { status: 'pausa' }
  | { status: 'decision'; decision: ScenarioDecision }
  // Elegiste la opción correcta: ahora tenés que ejecutarla manejando.
  | { status: 'accion'; decision: ScenarioDecision; action: ScenarioAction; selectedOptionId: string }
  | {
      status: 'resultado';
      decision: ScenarioDecision;
      selectedOptionId: string;
      correct: boolean;
      // 'respuesta': eligió mal; 'accion': eligió bien pero no ejecutó la maniobra.
      failure?: 'respuesta' | 'accion';
    };

export function createScenarioController() {
  let state: ScenarioState = { status: 'inicio' };
  const listeners = new Set<() => void>();

  function transition(nextState: ScenarioState) {
    if (nextState === state) return state;
    state = nextState;
    listeners.forEach((listener) => listener());
    return state;
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function start() {
    return transition(state.status === 'inicio' ? { status: 'conduciendo' } : state);
  }

  function pause() {
    return transition(state.status === 'conduciendo' ? { status: 'pausa' } : state);
  }

  function resume() {
    return transition(state.status === 'pausa' ? { status: 'conduciendo' } : state);
  }

  function presentDecision(decision: ScenarioDecision) {
    return transition(state.status === 'conduciendo' ? { status: 'decision', decision } : state);
  }

  function decide(optionId: string) {
    if (state.status !== 'decision') return state;
    const optionExists = state.decision.options.some((option) => option.id === optionId);
    if (!optionExists) return state;
    const correct = optionId === state.decision.correctOptionId;
    if (correct && state.decision.action) {
      return transition({ status: 'accion', decision: state.decision, action: state.decision.action, selectedOptionId: optionId });
    }
    return transition({
      status: 'resultado',
      decision: state.decision,
      selectedOptionId: optionId,
      correct,
      failure: correct ? undefined : 'respuesta',
    });
  }

  function completeAction(success: boolean) {
    if (state.status !== 'accion') return state;
    return transition({
      status: 'resultado',
      decision: state.decision,
      selectedOptionId: state.selectedOptionId,
      correct: success,
      failure: success ? undefined : 'accion',
    });
  }

  function continueDriving() {
    return transition(state.status === 'resultado' ? { status: 'conduciendo' } : state);
  }

  function reset() {
    return transition({ status: 'inicio' });
  }

  return { getState: () => state, subscribe, start, pause, resume, presentDecision, decide, completeAction, continueDriving, reset };
}
