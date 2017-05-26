import { IActivitySize } from './common';

export default class TimelineActivity {
    position = new js.ObservableValue<IActivitySize>();
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