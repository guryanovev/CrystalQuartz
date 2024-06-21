import { ITimelineTickItem } from './common';
import { ObservableList, ObservableValue } from 'john-smith/reactive';

export default class TimelineTicks {
    items = new ObservableList<ITimelineTickItem>();
    shift = new ObservableValue<number>(0);

    millisecondsPerTick: number;
    tickWidthPercent: number;

    constructor(
        private ticksCount: number,
        private timelineSizeMilliseconds: number) {

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
