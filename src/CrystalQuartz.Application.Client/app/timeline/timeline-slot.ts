import { IRange } from './common';

import TimelineActivity from './timeline-activity';

export default class TimelineSlot {
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

    remove(activity: TimelineActivity) {
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

    recalculate(range: IRange) {
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