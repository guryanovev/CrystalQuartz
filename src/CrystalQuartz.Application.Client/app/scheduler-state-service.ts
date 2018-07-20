import { SchedulerData } from './api';

import __keys from 'lodash/keys';
import __filter from 'lodash/filter'
import __map from 'lodash/map'

export enum EventType {
    Fired,
    Completed
}

export interface IRealtimeTriggerEvent {
    uniqueTriggerKey: string;
    eventType: EventType;
}

interface ITriggersHashSet {
    [uniqueTriggerKey: string]: boolean;
}

export interface ISchedulerStateService {
    realtimeBus: js.Event<IRealtimeTriggerEvent>;
}

export class SchedulerStateService implements ISchedulerStateService {
    private _currentInProgress: ITriggersHashSet = {};

    realtimeBus = new js.Event<IRealtimeTriggerEvent>();

    synsFrom(data: SchedulerData) {
        if (data.InProgress) {
            const nextInProgress: ITriggersHashSet = {};

            for (var i = 0; i < data.InProgress.length; i++) {
                nextInProgress[data.InProgress[i].UniqueTriggerKey] = true;
            }

            const
                completed = this.findDiff(this._currentInProgress, nextInProgress),
                fired = this.findDiff(nextInProgress, this._currentInProgress),
                completedEvents = __map(completed, (x:string) => ({ uniqueTriggerKey: x, eventType: EventType.Completed })),
                firedEvents = __map(fired, (x: string) => ({ uniqueTriggerKey: x, eventType: EventType.Fired })),
                allEvents = completedEvents.concat(firedEvents);

            for (var j = 0; j < allEvents.length; j++) {
                this.realtimeBus.trigger(allEvents[j]);
            }

            this._currentInProgress = nextInProgress;
        }
    }

    private findDiff(primary: ITriggersHashSet, secondary: ITriggersHashSet): string[] {
        const keys: string[] = __keys(primary);

        return __filter(keys, (key: string) => !secondary[key]);

        /*__flow(
            __keys,
            __filter((x:string) => !secondary[x]))(primary);*/
    }
}