<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';

import WidgetBase from '@/components/WidgetBase';

import { CountdownConfig, CountdownSession } from './types';

@Component
export default class CountdownWidget extends WidgetBase<CountdownConfig> {
  readonly FULL_DASH_ARRAY: number = 283;
  readonly WARNING_THRESHOLD: number = 10;
  readonly ALERT_THRESHOLD: number = 5;

  readonly COLOR_CODES: any = {
    info: {
      color: 'green',
    },
    warning: {
      color: 'orange',
      threshold: this.WARNING_THRESHOLD,
    },
    alert: {
      color: 'red',
      threshold: this.ALERT_THRESHOLD,
    },
  }

  timePassed: number = 0;
  timerInterval: NodeJS.Timeout | null = null;
  timeLeft: number = 0;
  timeStarted: Date | null = null;
  timeLimit = 20000;
  formattedTimeLeft: string = '';
  timeStopped: Date | null = null;
  stoppedDuration: number = 0;

  get session(): CountdownSession | null {
    return this.config.session;
  }

  get running(): boolean {
    return !!this.session?.running;
  }

  get timeFraction(): number {
    const rawTimeFraction = this.timeLeft / this.timeLimit;
    return rawTimeFraction - (1 / this.timeLimit) * (1 - rawTimeFraction);
  }

  /* get timeLeft(): number {
    return this.timeLimit - this.timePassed;
  }*/

  /*set timeLeft(seconds: number) {
    this.timeLeft = seconds;
  }*/

  /*get formattedTimeLeft(): string {
    const timeLeft: number = this.timeLeft;
    const minutes: number = Math.floor(timeLeft / 60);
    let seconds: any = timeLeft % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }*/

  /*set formattedTimeLeft(timeLeft: string) {
    this.formattedTimeLeft = timeLeft;
  }*/

  get circleDasharray(): string {
    return `${(this.timeFraction * this.FULL_DASH_ARRAY).toFixed(0)} 283`;
  }

  get remainingPathColor() {
    const { alert, warning, info } = this.COLOR_CODES;

    if (this.timeLeft <= alert.threshold) {
      return alert.color;
    } else if (this.timeLeft <= warning.threshold) {
      return warning.color;
    } else {
      return info.color;
    }
  }

  endInterval() {
    if (this.timerInterval) {
      this.timeStopped = new Date();
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  start(): void {
    if (this.timeStopped) {
      this.stoppedDuration += (new Date().getTime() - this.timeStopped.getTime());
      this.timeStopped = null;
    } else if (this.timeStarted) {
      return;
    } else {
      this.timeStarted = new Date();
      this.stoppedDuration = 0;
    }

    this.timerInterval = setInterval(this.tick, 10);
  }

  stop(): void {
    if (!this.timeStarted) {
      return;
    }

    this.endInterval();
    this.timeStopped = new Date();
  }

  reset(): void {

  }

  tick(): void {
    if (this.timeStarted === null) {
      return;
    }

    const now = new Date();
    const endTime = new Date(this.timeStarted.getTime() + this.timeLimit);
    const remainingTimeMS = endTime.getTime() - now.getTime() + this.stoppedDuration;

    if (remainingTimeMS < 0) {
      this.endInterval();
      return;
    }

    const remainingTime: Date = new Date(remainingTimeMS);
    const hour = remainingTime.getUTCHours().toString().padStart(2, '0');
    const min = remainingTime.getUTCMinutes().toString().padStart(2, '0');
    const sec = remainingTime.getUTCSeconds().toString().padStart(2, '0');
    const ms = Math.floor(remainingTime.getUTCMilliseconds() / 100).toString().padStart(1, '0');
    this.formattedTimeLeft = `${hour}:${min}:${sec}.${ms}`;
  }
}
</script>

<template>
  <CardWrapper v-bind="{context}">
    <template #toolbar>
      <component :is="toolbarComponent" :crud="crud" />
    </template>
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45" />
          <path
            :stroke-dasharray="circleDasharray"
            class="base-timer__path-remaining"
            :class="remainingPathColor"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          />
        </g>
      </svg>
      <span class="base-timer__label">{{ formattedTimeLeft }}</span>
      <div class="col-break" />
      <div class="col row justify-center">
        <q-btn flat label="Start / Resume" @click="start" />
        <q-btn flat label="Stop" @click="stop" />
        <q-btn flat label="Reset" @click="reset" />
      </div>
    </div>
  </CardWrapper>
</template>

<style scoped lang="scss">
.base-timer {
  position: relative;
  width: 300px;
  height: 300px;

  &__svg {
    transform: scaleX(-1);
  }

  &__circle {
    fill: none;
    stroke: none;
  }

  &__path-elapsed {
    stroke-width: 7px;
    stroke: grey;
  }

  &__path-remaining {
    stroke-width: 7px;
    stroke-linecap: round;
    transform: rotate(90deg);
    transform-origin: center;
    transition: 1s linear all;
    fill-rule: nonzero;
    stroke: currentColor;

    &.green {
      color: rgb(65, 184, 131);
    }

    &.orange {
      color: orange;
    }

    &.red {
      color: red;
    }
  }

  &__label {
    position: absolute;
    width: 300px;
    height: 300px;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
  }
}
</style>
