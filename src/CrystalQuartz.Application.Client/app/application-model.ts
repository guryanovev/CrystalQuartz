import { SchedulerData, Job } from './api';

export class ApplicationModel {
    onDataChanged = new js.Event<SchedulerData>();
    onAddTrigger = new js.Event<Job>();

    setData(data: SchedulerData) {
        this.onDataChanged.trigger(data);
    }

    addTriggerFor(job: Job) {
        this.onAddTrigger.trigger(job);
    }
}