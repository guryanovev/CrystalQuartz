import {
    IRange,
    ITimelineSlotOptions,
    ITimelineActivityOptions,
    ActivityInteractionRequest
} from './common';

import TimelineActivity from './timeline-activity';

export default class TimelineSlot {
    activities = new js.ObservableList<TimelineActivity>();

    key: string;

    constructor(options:ITimelineSlotOptions) {
        this.key = options.key;
    }

    add(activity:ITimelineActivityOptions, selectionRequestCallback: (activity: TimelineActivity, requestType: ActivityInteractionRequest) => void) {
        const result = new TimelineActivity(activity, requestType => selectionRequestCallback(result, requestType));
        this.activities.add(result);

        return result;
    };

    remove(activity: TimelineActivity) {
        this.activities.remove(activity);
    };

    /**
     * Removes all activities from the slot
     */
    clear() {
        this.activities.clear();
    }

    isEmpty() {
        return this.activities.getValue().length === 0;
    };

    isBusy() {
        return !!this.findCurrentActivity();
    }

    recalculate(range: IRange) : { isEmpty: boolean, removedActivities: TimelineActivity[] } {
        const activities = this.activities.getValue(),
              rangeStart = range.start,
              rangeEnd = range.end,
              removed = [];

        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];

            if (!activity.recalculate(rangeStart, rangeEnd)) {
                this.activities.remove(activity);
                removed.push(activity);
            }
        }

        return {
            isEmpty: this.isEmpty(),
            removedActivities: removed
        };
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

    requestCurrentActivityDetails() {
        const currentActivity = this.findCurrentActivity();
        if (currentActivity) {
            currentActivity.requestDetails();
        }
    }

    private findCurrentActivity(): TimelineActivity {
        const activities = this.activities.getValue();

        for (var i = activities.length - 1; i >= 0; i--) {
            if (!activities[i].completedAt) {
                return activities[i];
            }
        }

        return null;
    }
};