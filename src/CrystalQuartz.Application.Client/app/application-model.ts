import { SchedulerData, Job } from './api';

export class ApplicationModel {
    autoUpdateMessage = new js.ObservableValue<string>();

    onDataChanged = new js.Event<SchedulerData>();
    onDataInvalidate = new js.Event<any>();

    setData(data: SchedulerData) {
        this.onDataChanged.trigger(data);
    }

    /**
     * Causes application to reload all job gorups, jobs and triggers.
     */
    invalidateData() {
        this.onDataInvalidate.trigger(null);
    }
}