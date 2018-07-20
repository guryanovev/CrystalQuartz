import { SchedulerData, Job } from './api';

export class ApplicationModel {
    schedulerName = new js.ObservableValue<string>();
    autoUpdateMessage = new js.ObservableValue<string>();
    isOffline = new js.ObservableValue<boolean>();

    inProgressCount = new js.ObservableValue<number>();

    onDataChanged = new js.Event<SchedulerData>();
    onDataInvalidate = new js.Event<any>();

    offlineSince: number;

    setData(data: SchedulerData) {
        this.onDataChanged.trigger(data);
        if (data && data.Name && this.schedulerName.getValue() !== data.Name) {
            this.schedulerName.setValue(data.Name);
        }

        const inProgressValue = (data.InProgress || []).length;
        if (this.inProgressCount.getValue() !== inProgressValue) {
            this.inProgressCount.setValue(inProgressValue);
        }
    }

    /**
     * Causes application to reload all job gorups, jobs and triggers.
     */
    invalidateData() {
        this.onDataInvalidate.trigger(null);
    }

    goOffline(){
        this.offlineSince = new Date().getTime();
        if (!this.isOffline.getValue()) {
            this.isOffline.setValue(true);
        }

        this.autoUpdateMessage.setValue('offline');
    }

    goOnline() {
        this.offlineSince = null;
        if (!!this.isOffline.getValue()) {
            this.isOffline.setValue(false);
        }
    }
}