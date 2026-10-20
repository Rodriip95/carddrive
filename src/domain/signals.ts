import type { QuestionSource } from './learning';

export type SignalClass = 'advertencia' | 'reglamentaria';
export type SignalShape = 'triangle' | 'diamond' | 'circle' | 'octagon';
export type SignalSymbol =
  | 'train' | 'curve-left' | 'pedestrian' | 'narrowing' | 'bump' | 'roundabout'
  | 'no-advance' | 'no-entry' | 'no-left-turn' | 'no-overtake' | 'speed-limit' | 'stop' | 'yield';

export interface TrafficSignal {
  id: string;
  code: string;
  name: string;
  signalClass: SignalClass;
  recognition: {
    shape: SignalShape;
    symbol: SignalSymbol;
    description: string;
  };
  meaning: string;
  legalEffect: string;
  source: QuestionSource;
}
