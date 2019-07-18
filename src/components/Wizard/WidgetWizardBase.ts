import { uid } from 'quasar';
import Vue from 'vue';
import { Component, Emit, Prop } from 'vue-property-decorator';

import { DashboardItem, dashboardStore } from '@/store/dashboards';
import { featureStore } from '@/store/features';

export interface NavAction {
  label: string;
  click: Function;
  enabled: Function;
}

@Component
export default class WidgetWizardBase extends Vue {
  protected widgetId: string = uid();
  protected widgetTitle: string = '';

  @Prop({ type: String, required: true })
  public readonly featureId!: string;

  @Prop({ type: String, required: false })
  public readonly dashboardId!: string;

  @Emit()
  public back(): void { }

  @Emit()
  public close(): void { }

  protected get typeId(): string {
    return this.featureId;
  }

  protected get typeDisplayName(): string {
    return featureStore.displayNameById(this.typeId);
  }

  protected get defaultWidgetSize(): { cols: number; rows: number } {
    return featureStore.widgetSizeById(this.typeId);
  }

  protected async createItem(item: DashboardItem): Promise<void> {
    await dashboardStore.appendDashboardItem(item)
      .then(() => this.$q.notify({
        icon: 'mdi-check-all',
        color: 'positive',
        message: `Created ${featureStore.displayNameById(item.feature)} '${item.title}'`,
      }))
      .catch(e => this.$q.notify({
        icon: 'error',
        color: 'negative',
        message: `Failed to create widget: ${e.toString()}`,
      }))
      .finally(this.close);
  }
}
