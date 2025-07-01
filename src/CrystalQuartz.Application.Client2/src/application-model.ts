import { ObservableValue } from 'john-smith/reactive';
import { Event } from 'john-smith/reactive/event';
import { JobGroup, SchedulerData } from './api';
import { SchedulerExplorer } from './scheduler-explorer';

export class ApplicationModel implements SchedulerExplorer {
  private _currentData: SchedulerData | null = null;

  public schedulerName = new ObservableValue<string>('');
  public autoUpdateMessage = new ObservableValue<string>('');
  public isOffline = new ObservableValue<boolean>(false);

  public inProgressCount = new ObservableValue<number>(0);

  public onDataChanged = new Event<SchedulerData>();
  public onDataInvalidate = new Event<void>();

  public offlineSince: number | null = null;

  public setData(data: SchedulerData) {
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

  public getData() {
    return this._currentData;
  }

  /**
   * Causes application to reload all job gorups, jobs and triggers.
   */
  public invalidateData() {
    this.onDataInvalidate.trigger();
  }

  public goOffline() {
    this.offlineSince = new Date().getTime();
    if (!this.isOffline.getValue()) {
      this.isOffline.setValue(true);
    }

    this.autoUpdateMessage.setValue('offline');
  }

  public goOnline() {
    this.offlineSince = null;
    if (this.isOffline.getValue()) {
      this.isOffline.setValue(false);
    }
  }

  public listGroups(): JobGroup[] {
    if (this._currentData) {
      return this._currentData.JobGroups;
    }

    return [];
  }
}
