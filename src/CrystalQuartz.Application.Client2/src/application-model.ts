import { SchedulerData, Job, JobGroup } from './api';
import {SchedulerExplorer} from './scheduler-explorer';
import { ObservableValue } from 'john-smith/reactive';
import { Event } from 'john-smith/reactive/event';

export class ApplicationModel implements SchedulerExplorer {
    private _currentData: SchedulerData | null = null;

    schedulerName = new ObservableValue<string>('');
    autoUpdateMessage = new ObservableValue<string>('');
    isOffline = new ObservableValue<boolean>(false);

    inProgressCount = new ObservableValue<number>(0);

    onDataChanged = new Event<SchedulerData>();
    onDataInvalidate = new Event<any>();

    offlineSince: number | null = null;

    setData(data: SchedulerData) {
        this._currentData = data;

        this.onDataChanged.trigger(data);
        if (data && data.Name && this.schedulerName.getValue() !== data.Name) {
            this.schedulerName.setValue(data.Name);
        }

        const inProgressValue = (data.InProgress || []).length;
        if (this.inProgressCount.getValue() !== inProgressValue) {
            this.inProgressCount.setValue(inProgressValue);
        }
    }

    getData() {
        return this._currentData;
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

    listGroups(): JobGroup[] {
        if (this._currentData) {
            return this._currentData.JobGroups;
        }

        return [];
    }
}
