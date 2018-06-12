import { SchedulerData, Job } from './api';

export class ApplicationModel {
    autoUpdateMessage = new js.ObservableValue<string>();
    isOffline = new js.ObservableValue<boolean>();

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

    goOffline(){
        if (!this.isOffline.getValue()) {
            this.isOffline.setValue(true);
        }

        this.autoUpdateMessage.setValue('offline');
    }

    goOnline() {
        if (!!this.isOffline.getValue()) {
            this.isOffline.setValue(false);
        }
    }
}