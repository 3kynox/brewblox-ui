import { Widget } from '@/store/dashboards';

export interface CountdownSession {
  timeStarted: number;
  timeStopped: number | null;
  stoppedDuration: number;
  running: boolean;
}

export interface CountdownConfig {
  session: CountdownSession | null;
}

export type CountdownWidget = Widget<CountdownConfig>;
