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

  timeLimit = 20;
  timePassed: number = 0;
  timerInterval: any = null;

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

  get timeLeft(): number {
    return this.timeLimit - this.timePassed;
  }

  get formattedTimeLeft(): string {
    const timeLeft: number = this.timeLeft;
    const minutes: number = Math.floor(timeLeft / 60);
    let seconds: any = timeLeft % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

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

  onTimesUp() {
    clearInterval(this.timerInterval);
    // eslint-disable-next-line no-console
    console.log('it pass here!');
  }

  startTimer() {
    this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
  }

  @Watch('timeLeft')
  remainingTime(newValue): void {
    if (newValue === 0) {
      this.onTimesUp();
    }
  }

  mounted(): void {
    this.startTimer();
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
