import { SchedulerData } from './api';

import __keys from 'lodash/fp/keys';
import __flow from 'lodash/fp/flow'
import __filter from 'lodash/fp/filter'
import __map from 'lodash/fp/map'

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
                completedEvents = __map(x => ({ uniqueTriggerKey: x, eventType: EventType.Completed }))(completed),
                firedEvents = __map(x => ({ uniqueTriggerKey: x, eventType: EventType.Fired }))(fired),
                allEvents = completedEvents.concat(firedEvents);

            for (var j = 0; j < allEvents.length; j++) {
                this.realtimeBus.trigger(allEvents[j]);
            }

            this._currentInProgress = nextInProgress;
        }
    }

    private findDiff(primary: ITriggersHashSet, secondary: ITriggersHashSet): string[] {
        return __flow(
            __keys,
            __filter(x => !secondary[x]))(primary);
    }
}