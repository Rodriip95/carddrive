export type ScenarioOption = {
  id: string;
  label: string;
};

export type ScenarioDecision = {
  id: string;
  prompt: string;
  options: ScenarioOption[];
  correctOptionId: string;
  explanation: string;
};

export type ScenarioState =
  | { status: 'inicio' }
  | { status: 'conduciendo' }
  | { status: 'pausa' }
  | { status: 'decision'; decision: ScenarioDecision }
  | {
      status: 'resultado';
      decision: ScenarioDecision;
      selectedOptionId: string;
      correct: boolean;
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
    return transition({
      status: 'resultado',
      decision: state.decision,
      selectedOptionId: optionId,
      correct: optionId === state.decision.correctOptionId,
    });
  }

  function continueDriving() {
    return transition(state.status === 'resultado' ? { status: 'conduciendo' } : state);
  }

  function reset() {
    return transition({ status: 'inicio' });
  }

  return { getState: () => state, subscribe, start, pause, resume, presentDecision, decide, continueDriving, reset };
}
