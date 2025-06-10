import { Event } from 'john-smith/reactive/event';
import { SchedulerData } from './api';

export enum EventType {
  Fired,
  Completed,
}

export interface IRealtimeTriggerEvent {
  uniqueTriggerKey: string;
  eventType: EventType;
}

interface ITriggersHashSet {
  [uniqueTriggerKey: string]: boolean;
}

export interface ISchedulerStateService {
  realtimeBus: Event<IRealtimeTriggerEvent>;
}

export class SchedulerStateService implements ISchedulerStateService {
  private _currentInProgress: ITriggersHashSet = {};

  realtimeBus = new Event<IRealtimeTriggerEvent>();

  synsFrom(data: SchedulerData) {
    if (data.InProgress) {
      const nextInProgress: ITriggersHashSet = {};

      for (var i = 0; i < data.InProgress.length; i++) {
        nextInProgress[data.InProgress[i].UniqueTriggerKey] = true;
      }

      const completed = this.findDiff(this._currentInProgress, nextInProgress),
        fired = this.findDiff(nextInProgress, this._currentInProgress),
        completedEvents = completed.map((x: string) => ({
          uniqueTriggerKey: x,
          eventType: EventType.Completed,
        })),
        firedEvents = fired.map((x: string) => ({
          uniqueTriggerKey: x,
          eventType: EventType.Fired,
        })),
        allEvents = completedEvents.concat(firedEvents);

      for (var j = 0; j < allEvents.length; j++) {
        this.realtimeBus.trigger(allEvents[j]);
      }

      this._currentInProgress = nextInProgress;
    }
  }

  private findDiff(primary: ITriggersHashSet, secondary: ITriggersHashSet): string[] {
    const keys: string[] = Object.keys(primary);

    return keys.filter((key: string) => !secondary[key]);
  }
}
