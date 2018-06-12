import { ApplicationModel } from './application-model';
import { CommandService, ErrorInfo } from './services';
import { GetDataCommand } from './commands/global-commands';
import { SchedulerData, Job, Trigger, ActivityStatus } from './api';

import __filter from 'lodash/filter';
import __flatten from 'lodash/flatten';
import __map from 'lodash/map';
import __compact from 'lodash/compact';
import __min from 'lodash/min';

import {Timer} from "./global/timer";

export class DataLoader {
    private static DEFAULT_UPDATE_INTERVAL = 30000;                 // 30sec
    private static MAX_UPDATE_INTERVAL = 300000;                    // 5min
    private static MIN_UPDATE_INTERVAL = 10000;                     // 10sec
    private static DEFAULT_UPDATE_INTERVAL_IN_PROGRESS = 20000;     // 20sec

    private _autoUpdateTimer = new Timer();

    constructor(
        private applicationModel: ApplicationModel,
        private commandService: CommandService) {

        applicationModel.onDataChanged.listen(data => this.setData(data));
        applicationModel.onDataInvalidate.listen(data => this.invalidateData());
        applicationModel.isOffline.listen(isOffline => {
            if (isOffline) {
                this.goOffline()
            }
        });
    }

    start() {
        this.updateData();
    }

    private goOffline() {
        this.resetTimer();
    }

    private invalidateData() {
        this.resetTimer();
        this.updateData();
    }

    private setData(data: SchedulerData) {
        this.resetTimer();

        const
            nextUpdateDate = this.calculateNextUpdateDate(data),
            sleepInterval = this.calculateSleepInterval(nextUpdateDate);

        this.scheduleUpdateIn(sleepInterval);
    }

    private scheduleRecovery() {
        this.scheduleUpdateIn(DataLoader.DEFAULT_UPDATE_INTERVAL);
    }

    private scheduleUpdateIn(sleepInterval) {
        const now = new Date(),
              actualUpdateDate = new Date(now.getTime() + sleepInterval),
              message = 'next update at ' + actualUpdateDate.toTimeString();

        this.applicationModel.autoUpdateMessage.setValue(message);

        this._autoUpdateTimer.schedule(() => {
            this.updateData();
        }, sleepInterval);
    }

    private resetTimer() {
        this._autoUpdateTimer.reset();
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
        this.applicationModel.autoUpdateMessage.setValue('updating...');
        this.commandService
            .executeCommand(new GetDataCommand())
            .fail((error: ErrorInfo) => {
                if (!error.disconnected) {
                    this.scheduleRecovery();
                }

                // we do not schedule recovery
                // if server is not available as
                // this should be done by
                // Offline Mode Screen
            })
            .done((data) => {
                this.applicationModel.setData(data);
            });
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

        const
            allJobs = __flatten(__map(data.JobGroups, group => group.Jobs)),
            allTriggers = __flatten(__map(allJobs, (job: Job) => job.Triggers)),
            activeTriggers = __filter(allTriggers, (trigger: Trigger) => trigger.Status === ActivityStatus.Active),
            nextFireDates = __compact(__map(activeTriggers, (trigger: Trigger) => trigger.NextFireDate == null ? null : trigger.NextFireDate));

        return nextFireDates.length > 0 ? new Date(__min(nextFireDates)) : null;
    }

    private getExecutingNowBasedUpdateDate(data: SchedulerData): Date {
        if (data.InProgress && data.InProgress.length > 0) {
            return this.nowPlusMilliseconds(DataLoader.DEFAULT_UPDATE_INTERVAL_IN_PROGRESS);
        }

        return null;
    }

    private calculateNextUpdateDate(data: SchedulerData): Date {
        const
            inProgressBasedUpdateDate = this.getExecutingNowBasedUpdateDate(data),
            triggersBasedUpdateDate = this.getLastActivityFireDate(data) || this.getDefaultUpdateDate();

        if (inProgressBasedUpdateDate && triggersBasedUpdateDate.getTime() > inProgressBasedUpdateDate.getTime()) {
            return inProgressBasedUpdateDate;
        }

        return triggersBasedUpdateDate;
    }

    private nowPlusMilliseconds(value: number) {
        return new Date(new Date().getTime() + value);
    }
}