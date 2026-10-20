import type { ScenarioDecision } from './scenario-controller';

export type ScenarioConfig = {
  id: string;
  title: string;
  intro: string;
  decision: ScenarioDecision;
  visual: {
    kind: 'speed-bump' | 'pedestrian-crossing';
    label: string;
    asset?: string;
  };
  trigger: { kind: 'distance'; startDistance: number; decisionDistance: number };
  events: {
    safe: { targetSpeed: number; bounce: number; shake: number };
    unsafe: { bounce: number; shake: number };
  };
};
