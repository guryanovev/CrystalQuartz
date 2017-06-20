import { ApplicationModel } from './application-model';
import { CommandService } from './services';
import { GetDataCommand } from './commands/global-commands';
import { SchedulerData, Job, Trigger } from './api';

import __filter from 'lodash/filter';
import __flatten from 'lodash/flatten';
import __map from 'lodash/map';
import __compact from 'lodash/compact';
import __first from 'lodash/first';

export class DataLoader {
    private static DEFAULT_UPDATE_INTERVAL = 30000; // 30sec
    private static MAX_UPDATE_INTERVAL = 300000;    // 5min
    private static MIN_UPDATE_INTERVAL = 10000;     // 10sec

    private _autoUpdateTimes: number;

    constructor(
        private applicationModel,
        private commandService) {

        applicationModel.onDataChanged.listen(data => this.setData(data));
        applicationModel.onDataInvalidate.listen(data => this.updateData());
    }

    start() {
        this.updateData();
    }

    private setData(data: SchedulerData) {
        this.scheduleAutoUpdate(data);
    }

    scheduleAutoUpdate(data: SchedulerData) {
        var nextUpdateDate = this.getLastActivityFireDate(data) || this.getDefaultUpdateDate();
        
        clearTimeout(this._autoUpdateTimes);

        var now = new Date(),
            sleepInterval = this.calculateSleepInterval(nextUpdateDate),
            actualUpdateDate = new Date(now.getTime() + sleepInterval),
            message = 'next update at ' + actualUpdateDate.toTimeString();

        this.applicationModel.autoUpdateMessage.setValue(message);

        this._autoUpdateTimes = setTimeout(() => {
            this.applicationModel.autoUpdateMessage.setValue('updating...');
            this.updateData();
        }, sleepInterval);
    }

    private calculateSleepInterval(nextUpdateDate: Date) {
        var now = new Date(),
            sleepInterval = nextUpdateDate.getTime() - now.getTime();

        if (sleepInterval < 0) {
            // updateDate is in the past, the scheduler is probably not started yet
            return DataLoader.DEFAULT_UPDATE_INTERVAL;
        }

        if (sleepInterval < DataLoader.MIN_UPDATE_INTERVAL) {
            // the delay interval is too small
            // we need to extend it to avoid huge amount of queries
            return DataLoader.MIN_UPDATE_INTERVAL;
        }

        if (sleepInterval > DataLoader.MAX_UPDATE_INTERVAL) {
            // the interval is too big
            return DataLoader.MAX_UPDATE_INTERVAL;
        }

        return sleepInterval;
    }

    private updateData() {
        this.commandService
            .executeCommand(new GetDataCommand())
            .done((data) => this.applicationModel.setData(data));
    }

    private getDefaultUpdateDate() {
        var now = new Date();
        now.setSeconds(now.getSeconds() + 30);
        return now;
    }

    private getLastActivityFireDate(data: SchedulerData): Date {
        if (data.Status !== 'started') {
            return null;
        }

        var allJobs = __flatten(__map(data.JobGroups, group => group.Jobs)),
            allTriggers = __flatten(__map(allJobs, (job: Job) => job.Triggers)),
            activeTriggers = __filter(allTriggers, (trigger: Trigger) => trigger.Status.Code === 'active'),
            nextFireDates = __compact(__map(activeTriggers, (trigger: Trigger) => trigger.NextFireDate == null ? null : trigger.NextFireDate));

        return nextFireDates.length > 0 ? new Date(__first(nextFireDates)) : null;
    }
}