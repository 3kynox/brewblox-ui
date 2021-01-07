import { featureStore } from '@/store/features';

import Stopwatch from './Stopwatch';
import Countdown from './Countdown';
import Webframe from './Webframe';

export default {
  install() {
    featureStore.registerWidget(Stopwatch);
    featureStore.registerWidget(Countdown);
    featureStore.registerWidget(Webframe);
  },
};
