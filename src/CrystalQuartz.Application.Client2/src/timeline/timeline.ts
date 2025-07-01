import { ObservableList, ObservableValue } from 'john-smith/reactive';
import { Event } from 'john-smith/reactive/event';
import { Timer } from '../global/timers/timer';
import {
  ActivityInteractionRequest,
  IRange,
  ITimelineActivityOptions,
  ITimelineGlobalActivityOptions,
  ITimelineSlotOptions,
} from './common';
import TimelineActivity from './timeline-activity';
import { TimelineGlobalActivity } from './timeline-global-activity';
import TimelineSlot from './timeline-slot';
import TimelineTicks from './timeline-ticks';

export interface ISelectedActivityData {
  activity: TimelineActivity;
  slot: TimelineSlot;
}

export default class Timeline {
  private _timeRef: ReturnType<typeof setInterval> | null = null;
  private _resetSelectionTimer = new Timer();

  public globalSlot = new TimelineSlot({ key: ' timeline_global' });

  public range = new ObservableValue<IRange | null>(null);
  public slots = new ObservableList<TimelineSlot>();
  public ticks = new TimelineTicks(10, this.timelineSizeMilliseconds);

  public selectedActivity = new ObservableValue<ISelectedActivityData | null>(null);
  public detailsRequested = new Event<TimelineActivity>();

  /**
   * We remember the activity that is displayed
   * in the tooltip or details dialog to update
   * it in case of removing of the corresponding
   * slot from the timeline.
   */
  public preservedActivity: TimelineActivity | null = null;

  public constructor(public timelineSizeMilliseconds: number) {}

  public init() {
    this.ticks.init();
    this.updateInterval();
    this._timeRef = setInterval(() => {
      this.updateInterval();
    }, 1000);
  }

  private activityInteractionRequestHandler(
    slot: TimelineSlot | null,
    activity: TimelineActivity,
    requestType: ActivityInteractionRequest
  ) {
    switch (requestType) {
      case ActivityInteractionRequest.ShowTooltip: {
        const currentSelection = this.selectedActivity.getValue();
        if (!currentSelection || currentSelection.activity !== activity) {
          this.preservedActivity = activity;
          this.selectedActivity.setValue({
            activity: activity,
            slot: slot!, // todo
          });
        }

        this.preserveCurrentSelection();

        break;
      }

      case ActivityInteractionRequest.HideTooltip: {
        this.resetCurrentSelection();
        break;
      }

      case ActivityInteractionRequest.ShowDetails: {
        /**
         * We hide current tooltip bacause it
         * does not make any sense to show it
         * if details dialog is visible.
         */
        this.hideTooltip();

        this.preservedActivity = activity;
        this.detailsRequested.trigger(activity);

        break;
      }
    }
  }

  public preserveCurrentSelection() {
    this._resetSelectionTimer.reset();
  }

  public resetCurrentSelection() {
    this._resetSelectionTimer.schedule(() => {
      this.hideTooltip();
    }, 2000);
  }

  public addSlot(slotOptions: ITimelineSlotOptions) {
    const result = new TimelineSlot(slotOptions);
    this.slots.add(result);
    return result;
  }

  public removeSlot(slot: TimelineSlot) {
    this.slots.remove(slot);
  }

  public addActivity(
    slot: TimelineSlot,
    activityOptions: ITimelineActivityOptions
  ): TimelineActivity {
    const actualActivity = slot.add(activityOptions, (activity, requestType) =>
      this.activityInteractionRequestHandler(slot, activity, requestType)
    );

    const range = this.range.getValue();
    this.recalculateSlot(slot, range);

    return actualActivity;
  }

  public addGlobalActivity(options: ITimelineGlobalActivityOptions) {
    const activity: TimelineGlobalActivity = new TimelineGlobalActivity(options, (requestType) =>
      this.activityInteractionRequestHandler(null, activity, requestType)
    );

    this.globalSlot.activities.add(activity);
    this.recalculateSlot(this.globalSlot, this.range.getValue());

    return activity;
  }

  public findSlotBy(key: string): TimelineSlot | null {
    const slots = this.slots.getValue();
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].key === key) {
        return slots[i];
      }
    }

    return null;
  }

  public getGlobalActivities(): TimelineGlobalActivity[] {
    return <TimelineGlobalActivity[]>this.globalSlot.activities.getValue();
  }

  public clearSlots() {
    const slots = this.slots.getValue();
    for (let i = 0; i < slots.length; i++) {
      slots[i].clear();
    }

    this.globalSlot.clear();
    this.hideTooltip();
  }

  private updateInterval() {
    const now = new Date().getTime();
    const start = now - this.timelineSizeMilliseconds;
    const range = {
      start: start,
      end: now,
    };

    this.range.setValue(range);
    this.ticks.update(start, now);

    const slots = this.slots.getValue();
    for (let i = 0; i < slots.length; i++) {
      this.recalculateSlot(slots[i], range);
    }

    this.recalculateSlot(this.globalSlot, range);
  }

  private recalculateSlot(slot: TimelineSlot, range: IRange | null) {
    if (!range) {
      return;
    }

    const slotRecalculateResult = slot.recalculate(range);
    const currentTooltipActivityData = this.selectedActivity.getValue();

    if (currentTooltipActivityData && currentTooltipActivityData.slot === slot) {
      /**
       * We need to check if visible tooltip's
       * activity is not the one that has just been
       * removed from the timeline.
       */

      (slotRecalculateResult.removedActivities || []).forEach((x) => {
        if (currentTooltipActivityData.activity === x) {
          this.hideTooltip();
        }
      });
    }
  }

  private hideTooltip() {
    this.selectedActivity.setValue(null);
    this.preservedActivity = null;
  }
}
