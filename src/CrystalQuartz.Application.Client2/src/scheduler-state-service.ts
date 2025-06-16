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

  public realtimeBus = new Event<IRealtimeTriggerEvent>();

  public synsFrom(data: SchedulerData) {
    if (data.InProgress) {
      const nextInProgress: ITriggersHashSet = {};

      for (let i = 0; i < data.InProgress.length; i++) {
        nextInProgress[data.InProgress[i].UniqueTriggerKey] = true;
      }

      const completed = this.findDiff(this._currentInProgress, nextInProgress);
      const fired = this.findDiff(nextInProgress, this._currentInProgress);
      const completedEvents = completed.map((x: string) => ({
        uniqueTriggerKey: x,
        eventType: EventType.Completed,
      }));
      const firedEvents = fired.map((x: string) => ({
        uniqueTriggerKey: x,
        eventType: EventType.Fired,
      }));
      const allEvents = completedEvents.concat(firedEvents);

      for (let j = 0; j < allEvents.length; j++) {
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
