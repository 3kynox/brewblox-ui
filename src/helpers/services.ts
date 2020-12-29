import isString from 'lodash/isString';
import VueRouter from 'vue-router';

import { createDialog } from '@/helpers/dialog';
import notify from '@/helpers/notify';
import { featureStore } from '@/store/features';
import { Service, serviceStore, ServiceStub } from '@/store/services';


export async function startCreateService(stub: ServiceStub, router: VueRouter): Promise<void> {
  const feature = featureStore.serviceById(stub.type);
  if (feature === null) {
    notify.error(`Unknown service type '${stub.type}'`);
    return;
  }
  if (serviceStore.serviceIds.includes(stub.id)) {
    notify.error(`Service '${stub.id}' already exists`);
    return;
  }

  if (isString(feature.wizard)) {
    createDialog({
      component: 'WizardDialog',
      initialWizard: feature.wizard,
      initialProps: { stub },
    });
  }
  else {
    const service = await feature.wizard(stub);
    await serviceStore.appendService(service);
    notify.done(`Added ${feature.title} '${service.id}'`);
    router.push(`/service/${service.id}`);
  }
}

export function startChangeServiceTitle(service: Service): void {
  createDialog({
    component: 'InputDialog',
    title: 'Rename service',
    message: 'This changes the service display name, not its unique identifier.',
    value: service.title,
  })
    .onOk(async (newTitle: string) => {
      const oldTitle = service.title;
      if (!newTitle || oldTitle === newTitle) {
        return;
      }

      await serviceStore.saveService({ ...service, title: newTitle });
      notify.done(`Renamed service '${oldTitle}' to '${newTitle}'`);
    });
}

export function startRemoveService(service: Service, router: VueRouter): void {
  createDialog({
    component: 'ConfirmDialog',
    title: 'Remove service',
    message: `Are you sure you want to remove ${service.title}?`,
    ok: 'Confirm',
    cancel: 'Cancel',
  })
    .onOk(() => {
      if (router.currentRoute.path === `/service/${service.id}`) {
        router.replace('/');
      }
      serviceStore.removeService(service);
    });
}
