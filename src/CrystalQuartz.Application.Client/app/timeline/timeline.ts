import { ITimelineSlotOptions, ITimelineActivityOptions, ITimelineGlobalActivityOptions } from './common';
import TimelineSlot from './timeline-slot';
import TimelineTicks from './timeline-ticks';
import TimelineActivity from './timeline-activity';
import { TimelineGlobalActivity } from './timeline-global-activity';
import {Timer} from "../global/timer";

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

    constructor(
        public timelineSizeMilliseconds: number) { }

    init() {
        this.ticks.init();
        this.updateInterval();
        this._timeRef = setInterval(() => {
            this.updateInterval();
        }, 1000);
    }

    private actvitySelectionRequestHandler(slot: TimelineSlot, activity: TimelineActivity, isSelected: boolean) {
        if (isSelected) {
            const currentSelection = this.selectedActivity.getValue();
            if (!currentSelection || currentSelection.activity !== activity) {
                this.selectedActivity.setValue({
                    activity: activity,
                    slot: slot
                });    
            }

            this.preserveCurrentSelection();
        } else {
            this.resetCurrentSelection();
        }
    }

    preserveCurrentSelection() {
        this._resetSelectionTimer.reset();

        // if (this._resetSelectionTimer) {
        //     clearTimeout(this._resetSelectionTimer);
        //     this._resetSelectionTimer = null;
        // }
    }

    resetCurrentSelection() {
        this._resetSelectionTimer.schedule(() => {
            this.selectedActivity.setValue(null);
        }, 2000);
    }

    addSlot(slotOptions: ITimelineSlotOptions) {
        var result = new TimelineSlot(slotOptions);
        this.slots.add(result);
        return result;
    };

    removeSlot(slot: TimelineSlot) {
        this.slots.remove(slot);
    }

    addActivity(slot: TimelineSlot, activityOptions: ITimelineActivityOptions): TimelineActivity {
        var actualActivity = slot.add(activityOptions, (activity, isSelected) => this.actvitySelectionRequestHandler(slot, activity, isSelected));
        this.recalculateSlot(slot, this.range.getValue());

        return actualActivity;
    }

    addGlobalActivity(options: ITimelineGlobalActivityOptions) {
        const activity = new TimelineGlobalActivity(options, isSelected => this.actvitySelectionRequestHandler(null, activity, isSelected));

        this.globalSlot.activities.add(activity);
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
        return <TimelineGlobalActivity[]> this.globalSlot.activities.getValue();
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

        if (!slot.recalculate(range)) {
            // we can handle empty slot case here
        }
    };
}