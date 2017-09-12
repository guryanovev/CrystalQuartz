import {
    IRange,
    ITimelineSlotOptions,
    ITimelineActivityOptions
} from './common';

import TimelineActivity from './timeline-activity';

export default class TimelineSlot {
    activities = new js.ObservableList<TimelineActivity>();

    key: string;

    constructor(options:ITimelineSlotOptions) {
        this.key = options.key;
    }

    add(activity:ITimelineActivityOptions, selectionRequestCallback: (activity: TimelineActivity, isSelected: boolean) => void) {
        const result = new TimelineActivity(activity, isSelected => selectionRequestCallback(result, isSelected));
        this.activities.add(result);

        return result;
    };

    remove(activity: TimelineActivity) {
        this.activities.remove(activity);
    };

    isEmpty() {
        return this.activities.getValue().length === 0;
    };

    isBusy() {
        const activities = this.activities.getValue();

        for (var i = 0; i < activities.length; i++) {
            if (!activities[i].completedAt) {
                return true;
            }
        }

        return false;
    }

    recalculate(range: IRange) {
        const activities = this.activities.getValue(),
              rangeStart = range.start,
              rangeEnd = range.end;

        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];

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
        for (let i = 0; i < activities.length; i++) {
            if (activities[i].key === key) {
                return activities[i];
            }
        }

        return null;
    }
};