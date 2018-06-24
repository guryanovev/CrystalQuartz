import {ActivityStatus, SchedulerEventScope, SchedulerEventType, SchedulerStatus} from "../app/api";
import __filter from 'lodash/filter';
import __map from 'lodash/map';
import __each from 'lodash/each';
import __keys from 'lodash/keys';
import __min from 'lodash/min';
import __flatMap from 'lodash/flatMap';
import __some from 'lodash/some';
import __find from 'lodash/find';
import {Timer} from "../app/global/timer";

export type ScheduleTrigger = { repeatInterval: number, duration: number, initialDelay?: number, pause?: boolean };
export type ScheduleJob = { [name:string]: ScheduleTrigger };
export type ScheduleGroup = { [name: string]: ScheduleJob };
export type Schedule = { [name:string]: ScheduleGroup };

export abstract class Activity {
    protected constructor(public name: string) {
    }

    abstract getStatus(): ActivityStatus;
    abstract setStatus(status: ActivityStatus);
}

export abstract class CompositeActivity extends Activity {
    protected constructor(name: string) {
        super(name);
    }

    abstract getNestedActivities(): Activity[];

    getStatus(): ActivityStatus {
        let
            activeCount = 0,
            pausedCount = 0;

        const
            activities = this.getNestedActivities(),
            activitiesCount = activities.length;

        for (let i = 0; i < activitiesCount; i++) {
            const
                activity = activities[i],
                status = activity.getStatus();

            if (status === ActivityStatus.Mixed) {
                return ActivityStatus.Mixed;
            } else if (status === ActivityStatus.Active){
                activeCount++;
            } else if (status === ActivityStatus.Paused){
                pausedCount++;
            }
        }

        console.log(this.name, 'status', activeCount, pausedCount);

        if (activeCount === activitiesCount) {
            return ActivityStatus.Active;
        }

        if (pausedCount === activitiesCount) {
            return ActivityStatus.Paused;
        }

        return ActivityStatus.Mixed;
    }

    setStatus(status: ActivityStatus) {
        __each(this.getNestedActivities(), a => a.setStatus(status));
    }
}

export class JobGroup extends CompositeActivity {
    constructor(
        name: string,
        public jobs: Job[]){

        super(name);
    }

    getNestedActivities() {
        return this.jobs;
    }

    findJob(jobName: string) {
        return __find(this.jobs, j => j.name === jobName);
    }
}

export class Job extends CompositeActivity{
    constructor(
        name: string,
        public triggers: Trigger[]){

        super(name);
    }

    getNestedActivities() {
        return this.triggers;
    }
}

export class Trigger extends Activity {
    nextFireDate: number;
    previousFireDate: number;

    constructor(
        name: string,
        public status: ActivityStatus,
        public repeatInterval: number,
        public duration: number,
        public initialDelay: number){

        super(name);
    }

    getStatus() {
        return this.status;
    }

    setStatus(status: ActivityStatus) {
        this.status = status;
    }
}

export class SchedulerEvent {
    constructor(
        public id: number,
        public date: number,
        public scope: SchedulerEventScope,
        public eventType: SchedulerEventType,
        public itemKey: string,
        public fireInstanceId?: string
    ){}
}

export class FakeScheduler {
    startedAt: number|null = null;
    status:SchedulerStatus = SchedulerStatus.Ready;

    private _groups: JobGroup[];
    private _triggers: Trigger[];
    private _events: SchedulerEvent[] = [];

    private _fireInstanceId = 1;
    private _latestEventId = 1;

    private _timer = new Timer();

    jobsExecuted = 0;
    inProgress: { trigger: Trigger, fireInstanceId: string, startedAt: number }[] = [];

    constructor(
        public name: string,
        private schedule: Schedule
    ) {}

    init() {
        const
            mapTrigger = (name: string, trigger: ScheduleTrigger) => new Trigger(
                name,
                trigger.pause ? ActivityStatus.Paused : ActivityStatus.Active,
                trigger.repeatInterval,
                trigger.duration,
                trigger.initialDelay || 0),

            mapJob = (name: string, data: ScheduleJob) => new Job(
                name,
                __map(__keys(data), key => mapTrigger(key, data[key]))),

            mapJobGroup = (name: string, data: ScheduleGroup) => new JobGroup(
                name,
                __map(__keys(data), key => mapJob(key, data[key])));

        this._groups = __map(
            __keys(this.schedule),
            key => mapJobGroup(key, this.schedule[key]));

        this._triggers = __flatMap(
            this._groups,
            g => __flatMap(g.jobs, j => j.triggers));
    }

    start() {
        this.startedAt = new Date().getTime();
        this.status = SchedulerStatus.Started;

        __each(this._triggers, t => {
            t.nextFireDate = this.startedAt + t.initialDelay;
        });

        this.doStateCheck();
    }

    getData() {
        return {
            name: this.name,
            groups: this._groups
        };
    }

    findEvents(minEventId: number) {
        return __filter(this._events, ev => ev.id > minEventId);
    }

    private doStateCheck() {
        console.log('state check');

        this._timer.reset();

        const
            now = new Date().getTime(),

            triggersToStop = __filter(this.inProgress, item => {
                return now - item.startedAt > item.trigger.duration;
            });


        __each(triggersToStop, item => {
            const index = this.inProgress.indexOf(item);
            this.inProgress.splice(index, 1);
            this.jobsExecuted++;
            this.pushEvent(SchedulerEventScope.Trigger, SchedulerEventType.Complete, item.trigger.name, item.fireInstanceId);
        });

        const triggersToStart = __filter(this._triggers, trigger => {
           return trigger.status === ActivityStatus.Active &&
                  trigger.nextFireDate <= now &&
                  !this.isInProgress(trigger);
        });

        console.log('triggers to start', triggersToStart);

        __each(triggersToStart, trigger => {
            const fireInstanceId = (this._fireInstanceId++).toString();

            trigger.previousFireDate = now;
            trigger.nextFireDate = now + trigger.repeatInterval;

            this.inProgress.push({
                trigger: trigger,
                startedAt: now,
                fireInstanceId: fireInstanceId
            });

            this.pushEvent(SchedulerEventScope.Trigger, SchedulerEventType.Fired, trigger.name, fireInstanceId);
        });

        let nextUpdateAt: number|null = null;

        if (this.inProgress.length > 0) {
            nextUpdateAt = __min(__map(this.inProgress, item => item.startedAt + item.trigger.duration));

            console.log(1, nextUpdateAt);
        }

        const activeTriggers:Trigger[] = __filter<Trigger>(this._triggers, trigger => trigger.status === ActivityStatus.Active && trigger.nextFireDate);
        if (activeTriggers.length > 0) {
            const nextTriggerFireAt = __min(__map(activeTriggers, item => item.nextFireDate));

            console.log(2, nextTriggerFireAt);
            nextUpdateAt = nextUpdateAt === null ? nextTriggerFireAt : Math.min(nextUpdateAt, nextTriggerFireAt);
        }

        if (nextUpdateAt === null) {
            this.status = SchedulerStatus.Empty;
        } else {
            const nextUpdateIn = nextUpdateAt - now;

            console.log('next update in', nextUpdateIn);

            this._timer.schedule(
                () => this.doStateCheck(),
                nextUpdateIn)
        }
    }

    private isInProgress(trigger: Trigger) {
        return __some(this.inProgress, item => item.trigger === trigger);
    }

    private pushEvent(scope: SchedulerEventScope, eventType: SchedulerEventType, itemKey: string, fireInstanceId?: string) {
        this._events.push({
            id: this._latestEventId++,
            date: new Date().getTime(),
            scope: scope,
            eventType: eventType,
            itemKey: itemKey,
            fireInstanceId: fireInstanceId
        });

        while (this._events.length > 1000) {
            this._events.splice(0, 1);
        }
    }

    private findTrigger(triggerName: string) {
        const result = __filter(this._triggers, t => t.name === triggerName);
        return result.length > 0 ? result[0] : null;
    }

    private findGroup(groupName: string) {
        const result = __filter(this._groups, t => t.name === groupName);
        return result.length > 0 ? result[0] : null;
    }

    private changeTriggerStatus(triggerName: string, status: ActivityStatus) {
        const trigger = this.findTrigger(triggerName);
        if (trigger) {
            trigger.setStatus(status);
        }

        this.doStateCheck();
    }

    private changeJobStatus(groupName: string, jobName: string, status: ActivityStatus) {
        const group: JobGroup = this.findGroup(groupName);
        if (group) {
            const job = group.findJob(jobName);
            job.setStatus(status);
            this.doStateCheck();
        }
    }

    private changeGroupStatus(groupName: string, status: ActivityStatus) {
        const group: JobGroup = this.findGroup(groupName);
        if (group) {
            group.setStatus(status);
            this.doStateCheck();
        }
    }

    resumeTrigger(triggerName: string) {
        this.changeTriggerStatus(triggerName, ActivityStatus.Active);
    }

    pauseTrigger(triggerName: string) {
        this.changeTriggerStatus(triggerName, ActivityStatus.Paused);
    }

    deleteTrigger(triggerName: string) {
        const trigger = this.findTrigger(triggerName);
        if (trigger) {
            const index = this._triggers.indexOf(trigger);
            this._triggers.splice(index, 1);

            const allJobs = __flatMap(this._groups, g => g.jobs);

            __each(allJobs, job => {
                const triggerIndex = job.triggers.indexOf(trigger);
                if (triggerIndex > -1) {
                    job.triggers.splice(triggerIndex, 1);
                }
            });
        }
    }

    pauseJob(groupName: string, jobName: string) {
        this.changeJobStatus(groupName, jobName, ActivityStatus.Paused);
    }

    resumeJob(groupName: string, jobName: string) {
        this.changeJobStatus(groupName, jobName, ActivityStatus.Active);
    }
}