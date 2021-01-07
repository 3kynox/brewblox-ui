import { ref } from '@/helpers/component-ref';
import { WidgetFeature } from '@/store/features';

import widget from './CountdownWidget.vue';
import { CountdownConfig } from './types';

const feature: WidgetFeature<CountdownConfig> = {
  id: 'Countdown',
  title: 'Countdown',
  component: ref(widget),
  wizard: true,
  widgetSize: {
    cols: 4,
    rows: 4,
  },
  generateConfig: () => ({
    session: null,
  }),
};

export default feature;
