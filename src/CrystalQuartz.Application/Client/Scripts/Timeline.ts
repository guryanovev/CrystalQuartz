/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>

interface IRange {
    start: number;
    end: number;
}

class TimelineActivity {
    position = new js.ObservableValue<{ left: number, width: number }>();
    key: string;

    constructor(private data: any) {
        this.key = data.key;
    }

    getStartDate() {
        return this.data.startedAt;
    }

    getCompleteDate() {
        return this.data.completedAt;
    }

    complete(date?: number) {
        this.data.completedAt = date || new Date().getTime();
    };

    recalculate(rangeStart, rangeEnd) {
        var rangeWidth = rangeEnd - rangeStart,
            activityStart = this.getStartDate(),
            activityComplete = this.getCompleteDate() || rangeEnd,
            isOutOfViewport = activityStart <= rangeStart && activityComplete <= rangeStart;

        if (isOutOfViewport) {
            return false;
        }

        var viewPortActivityStart = activityStart < rangeStart ? rangeStart : activityStart;

        this.position.setValue({
            left: 100 * (viewPortActivityStart - rangeStart) / rangeWidth,
            width: 100 * (activityComplete - viewPortActivityStart) / rangeWidth
        });

        return true;
    };
}

class TimelineSlot {
    activities = new js.ObservableList<TimelineActivity>();

    title: string;
    key: string;

    constructor(options) {
        options = options || {};    

        this.title = options.title;
        this.key = options.key;
    }

    add(activity /* todo: activity options typings */) {
        var result = new TimelineActivity(activity);
        this.activities.add(result);

        return result;
    };

    remove(activity:TimelineActivity) {
        this.activities.remove(activity);
    };

    isEmpty() {
        return this.activities.getValue().length === 0;
    };

    isBusy() {
        var activities = this.activities.getValue();

        for (var i = 0; i < activities.length; i++) {
            if (!activities[i].getCompleteDate()) {
                return true;
            }
        }

        return false;
    }

    recalculate(range:IRange) {
        var activities = this.activities.getValue(),
            rangeStart = range.start,
            rangeEnd = range.end;

        for (var i = 0; i < activities.length; i++) {
            var activity = activities[i];

            if (!activity.recalculate(rangeStart, rangeEnd)) {
                this.activities.remove(activity);
                if (this.isEmpty()) {
                    return false;
                }
            }
        }

        return true;
    }

    findActivityBy(key: string) {
        const activities = this.activities.getValue();
        for (var i = 0; i < activities.length; i++) {
            if (activities[i].key === key) {
                return activities[i];
            }
        }

        return null;
    }
};

interface ITimelineTickItem {
    tickDate: number;
    width: number;
}

class TimelineTicks {
    items = new js.ObservableList<ITimelineTickItem>();
    shift = new js.ObservableValue<number>();

    millisecondsPerTick: number;
    tickWidthPercent: number;

    constructor(
        private ticksCount,
        private timelineSizeMilliseconds) {

        this.millisecondsPerTick = timelineSizeMilliseconds / (ticksCount);
        this.tickWidthPercent = 100 / (ticksCount + 1);
    }

    init() {
        var now = Math.ceil(new Date().getTime() / this.millisecondsPerTick) * this.millisecondsPerTick,
            items = [];

        for (var i = 0; i < this.ticksCount + 1; i++) {
            var tickDate = now - this.millisecondsPerTick * (this.ticksCount - i + 1);

            items.push({
                tickDate: tickDate,
                width: this.tickWidthPercent
            });
        }

        this.items.setValue(items);
        this.calculateShift(now);
    };

    update(start: number, end: number) {
        var currentItems = this.items.getValue();
        if (!currentItems) {
            return;
        }

        this.removeOutdatedTicks(start, currentItems);

        if (this.items.getValue().length === 0) {
            this.init();
        } else {
            var edgeTick = this.items.getValue()[this.items.getValue().length - 1];

            while (edgeTick.tickDate + this.millisecondsPerTick / 2 < end) {
                var newTick = {
                    tickDate: edgeTick.tickDate + this.millisecondsPerTick,
                    width: this.tickWidthPercent
                };

                this.items.add(newTick);

                edgeTick = newTick;
            }
        }

        this.calculateShift(new Date().getTime());
    };

    private getEdgeTick() {
        return this.items.getValue()[this.items.getValue().length - 1];
    }

    private calculateShift(endDate: number) {
        var edgeTick = this.getEdgeTick(),
            shiftMilliseconds = endDate - edgeTick.tickDate + this.millisecondsPerTick / 2,
            shiftPercent = 100 * shiftMilliseconds / this.timelineSizeMilliseconds;

        this.shift.setValue(shiftPercent);
    };

    private removeOutdatedTicks(startDate: number, items: ITimelineTickItem[]) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.tickDate + this.millisecondsPerTick / 2 < startDate) {
                this.items.remove(item);
            } else {
                return;
            }
        }
    }
};

class Timeline {
    _timeRef = null;

    timelineSizeMilliseconds = 1000 * 60 * 60;

    range = new js.ObservableValue();
    slots = new js.ObservableList<TimelineSlot>();
    ticks = new TimelineTicks(20, this.timelineSizeMilliseconds);

    init() {
        this.ticks.init();
        this.updateInterval();
        this._timeRef = setInterval(() => {
            this.updateInterval();
        }, 1000);
    }

    addSlot(slotKey /* todo: slot options typings */) {
        var result = new TimelineSlot(slotKey);
        this.slots.add(result);
        return result;
    };

    addActivity(slot: TimelineSlot, activity /* todo: typings for activity options */): TimelineActivity {
        var actualActivity = slot.add(activity);
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
};