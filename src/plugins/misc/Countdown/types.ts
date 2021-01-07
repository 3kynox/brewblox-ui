import { Widget } from '@/store/dashboards';

export interface CountdownSession {
  rawTimeFraction: number;
  running: boolean;
}

export interface CountdownConfig {
  session: CountdownSession | null;
}

export type CountdownWidget = Widget<CountdownConfig>;
