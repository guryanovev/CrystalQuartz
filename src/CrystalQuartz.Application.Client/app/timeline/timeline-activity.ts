import {
    IActivitySize,
    ITimelineActivityOptions
} from './common';

export default class TimelineActivity {
    position = new js.ObservableValue<IActivitySize>();

    key: string;
    startedAt: number;
    completedAt: number;

    constructor(private options: ITimelineActivityOptions) {
        this.key = options.key;

        this.startedAt = options.startedAt;
        this.completedAt = options.completedAt;
    }

    complete(date?: number) {
        this.completedAt = date || new Date().getTime();
    };

    recalculate(rangeStart: number, rangeEnd: number) {
        const rangeWidth = rangeEnd - rangeStart,

              activityStart = this.startedAt,
              activityComplete = this.completedAt || rangeEnd,

              isOutOfViewport = activityStart <= rangeStart && activityComplete <= rangeStart;

        if (isOutOfViewport) {
            return false;
        }

        const viewPortActivityStart = activityStart < rangeStart ? rangeStart : activityStart;

        this.position.setValue({
            left: 100 * (viewPortActivityStart - rangeStart) / rangeWidth,
            width: 100 * (activityComplete - viewPortActivityStart) / rangeWidth
        });

        return true;
    };
}