import { ObservableList } from 'john-smith/reactive';
import {
  ActivityInteractionRequest,
  IRange,
  ITimelineActivityOptions,
  ITimelineSlotOptions,
} from './common';
import TimelineActivity from './timeline-activity';

export default class TimelineSlot {
  public activities = new ObservableList<TimelineActivity>();

  public key: string;

  public constructor(options: ITimelineSlotOptions) {
    this.key = options.key;
  }

  public add(
    activity: ITimelineActivityOptions,
    selectionRequestCallback: (
      activity: TimelineActivity,
      requestType: ActivityInteractionRequest
    ) => void
  ) {
    const result: TimelineActivity = new TimelineActivity(activity, (requestType) =>
      selectionRequestCallback(result, requestType)
    );

    this.activities.add(result);

    return result;
  }

  public remove(activity: TimelineActivity) {
    this.activities.remove(activity);
  }

  /**
   * Removes all activities from the slot
   */
  public clear() {
    this.activities.clear();
  }

  public isEmpty() {
    return this.activities.getValue().length === 0;
  }

  public isBusy() {
    return !!this.findCurrentActivity();
  }

  public recalculate(range: IRange): { isEmpty: boolean; removedActivities: TimelineActivity[] } {
    const activities = this.activities.getValue();
    const rangeStart = range.start;
    const rangeEnd = range.end;
    const removed = [];

    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];

      if (!activity.recalculate(rangeStart, rangeEnd)) {
        this.activities.remove(activity);
        removed.push(activity);
      }
    }

    return {
      isEmpty: this.isEmpty(),
      removedActivities: removed,
    };
  }

  public findActivityBy(key: string) {
    const activities = this.activities.getValue();
    for (let i = 0; i < activities.length; i++) {
      if (activities[i].key === key) {
        return activities[i];
      }
    }

    return null;
  }

  public requestCurrentActivityDetails() {
    const currentActivity = this.findCurrentActivity();
    if (currentActivity) {
      currentActivity.requestDetails();
    }
  }

  private findCurrentActivity(): TimelineActivity | null {
    const activities = this.activities.getValue();

    for (let i = activities.length - 1; i >= 0; i--) {
      if (!activities[i].completedAt) {
        return activities[i];
      }
    }

    return null;
  }
}
