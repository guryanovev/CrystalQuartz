import { ITimelineSlotOptions, ITimelineActivityOptions, ITimelineGlobalActivityOptions, ActivityInteractionRequest } from './common';
import TimelineSlot from './timeline-slot';
import TimelineTicks from './timeline-ticks';
import TimelineActivity from './timeline-activity';
import { TimelineGlobalActivity } from './timeline-global-activity';
import { Timer } from "../global/timers/timer";

import __each from 'lodash/each';

export interface ISelectedActivityData {
    activity: TimelineActivity;
    slot: TimelineSlot;
}

export default class Timeline {
    private _timeRef = null;
    private _resetSelectionTimer = new Timer();

    globalSlot = new TimelineSlot({ key: ' timeline_global' });

    range = new js.ObservableValue();
    slots = new js.ObservableList<TimelineSlot>();
    ticks = new TimelineTicks(10, this.timelineSizeMilliseconds);

    selectedActivity = new js.ObservableValue<ISelectedActivityData>();
    detailsRequested = new js.Event<TimelineActivity>();

    /**
     * We remember the activity that is displayed
     * in the tooltip or details dialog to update
     * it in case of removing of the corresponding
     * slot from the timeline.
     */
    preservedActivity: TimelineActivity = null;

    constructor(
        public timelineSizeMilliseconds: number) { }

    init() {
        this.ticks.init();
        this.updateInterval();
        this._timeRef = setInterval(() => {
            this.updateInterval();
        }, 1000);
    }

    private activityInteractionRequestHandler(slot: TimelineSlot, activity: TimelineActivity, requestType: ActivityInteractionRequest) {
        switch (requestType) {
            case ActivityInteractionRequest.ShowTooltip:
                {
                    const currentSelection = this.selectedActivity.getValue();
                    if (!currentSelection || currentSelection.activity !== activity) {
                        this.preservedActivity = activity;
                        this.selectedActivity.setValue({
                            activity: activity,
                            slot: slot
                        });
                    }

                    this.preserveCurrentSelection();

                    break;
                }

            case ActivityInteractionRequest.HideTooltip:
                {
                    this.resetCurrentSelection();
                    break;
                }

            case ActivityInteractionRequest.ShowDetails:
                {
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

    preserveCurrentSelection() {
        this._resetSelectionTimer.reset();
    }

    resetCurrentSelection() {
        this._resetSelectionTimer.schedule(() => {
            this.hideTooltip();
        }, 2000);
    }

    addSlot(slotOptions: ITimelineSlotOptions) {
        const result = new TimelineSlot(slotOptions);
        this.slots.add(result);
        return result;
    };

    removeSlot(slot: TimelineSlot) {
        this.slots.remove(slot);
    }

    addActivity(slot: TimelineSlot, activityOptions: ITimelineActivityOptions): TimelineActivity {
        var actualActivity = slot.add(
            activityOptions,
            (activity, requestType) => this.activityInteractionRequestHandler(slot, activity, requestType));

        this.recalculateSlot(slot, this.range.getValue());

        return actualActivity;
    }

    addGlobalActivity(options: ITimelineGlobalActivityOptions) {
        const activity = new TimelineGlobalActivity(
            options,
            requestType => this.activityInteractionRequestHandler(null, activity, requestType));

        this.globalSlot.activities.add(activity);
        this.recalculateSlot(this.globalSlot, this.range.getValue());

        return activity;
    }

    findSlotBy(key: string): TimelineSlot {
        var slots = this.slots.getValue();
        for (var i = 0; i < slots.length; i++) {
            if (slots[i].key === key) {
                return slots[i];
            }
        }

        return null;
    }

    getGlobalActivities(): TimelineGlobalActivity[] {
        return <TimelineGlobalActivity[]>this.globalSlot.activities.getValue();
    }

    clearSlots() {
        var slots = this.slots.getValue();
        for (var i = 0; i < slots.length; i++) {
            slots[i].clear();
        }
    }

    private updateInterval() {
        var now = new Date().getTime(),
            start = now - this.timelineSizeMilliseconds,
            range = {
                start: start,
                end: now
            };

        this.range.setValue(range);
        this.ticks.update(start, now);

        var slots = this.slots.getValue();
        for (var i = 0; i < slots.length; i++) {
            this.recalculateSlot(slots[i], range);
        }

        this.recalculateSlot(this.globalSlot, range);
    }

    private recalculateSlot(slot, range) {
        if (!range) {
            return;
        }

        const
            slotRecalculateResult = slot.recalculate(range),
            currentTooltipActivityData = this.selectedActivity.getValue();

        if (currentTooltipActivityData && currentTooltipActivityData.slot === slot) {
            /**
             * We need to check if visible tooltip's
             * activity is not the one that has just been
             * removed from the timeline.
             */

            __each(slotRecalculateResult.removedActivities || [], x => {
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