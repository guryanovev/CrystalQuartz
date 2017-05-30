import { ITimelineSlotOptions, ITimelineActivityOptions } from './common';
import TimelineSlot from './timeline-slot';
import TimelineTicks from './timeline-ticks';
import TimelineActivity from './timeline-activity';

export default class Timeline {
    _timeRef = null;

    timelineSizeMilliseconds = 1000 * 60 * 60;

    range = new js.ObservableValue();
    slots = new js.ObservableList<TimelineSlot>();
    ticks = new TimelineTicks(10, this.timelineSizeMilliseconds);

    init() {
        this.ticks.init();
        this.updateInterval();
        this._timeRef = setInterval(() => {
            this.updateInterval();
        }, 1000);
    }

    addSlot(slotOptions: ITimelineSlotOptions) {
        var result = new TimelineSlot(slotOptions);
        this.slots.add(result);
        return result;
    };

    addActivity(slot: TimelineSlot, activityOptions: ITimelineActivityOptions): TimelineActivity {
        var actualActivity = slot.add(activityOptions);
        this.recalculateSlot(slot, this.range.getValue());
        return actualActivity;
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
    }

    private recalculateSlot(slot, range) {
        if (!range) {
            return;
        }

        if (!slot.recalculate(range)) {
            this.slots.remove(slot);
        }
    };
}