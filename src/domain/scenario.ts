import type { ScenarioDecision } from './scenario-controller';
import type { QuestionSource } from './learning';

export type ScenarioConfig = {
  id: string;
  title: string;
  intro: string;
  decision: ScenarioDecision;
  visual: {
    kind: 'speed-bump' | 'pedestrian-crossing' | 'stop-intersection' | 'traffic-light' | 'priority-intersection';
    label: string;
    asset?: string;
  };
  trigger: { kind: 'distance'; startDistance: number; decisionDistance: number };
  events: {
    safe:
      | { effect: 'adjust-speed'; targetSpeed: number; bounce: number; shake: number }
      | { effect: 'stop'; targetSpeed: 0; settleMs: number };
    unsafe: { effect: 'impact'; bounce: number; shake: number };
  };
  maxSpeed?: number;
  source?: QuestionSource;
};
