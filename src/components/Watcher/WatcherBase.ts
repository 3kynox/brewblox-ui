import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { Service, serviceStore } from '@/store/services';

@Component
export default class WatcherBase extends Vue {
  @Prop({ type: String, required: true })
  public readonly serviceId!: string;

  public get service(): Service {
    return serviceStore.serviceById(this.serviceId);
  }
}
