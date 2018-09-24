import { Duration } from '../global/duration';
import TimelineActivity from './timeline-activity';
import { ErrorMessage, NullableDate } from '../api';
import { ActivityState } from '../global/activities/activity-state';

import __each from 'lodash/each';

/**
 * A view model for timeline activity to share
 * some logic between tooltip and details dialog.
 */
export class TimelineActivityViewModel implements js.IDisposable {
    private _disposables: js.IDisposable[];

    duration: Duration;
    startedAt: NullableDate;
    completedAt: js.ObservableValue<NullableDate>;
    status: js.ObservableValue<ActivityState>;
    errors: js.ObservableValue<ErrorMessage[]>;

    constructor(private activity: TimelineActivity) {
        this.duration = new Duration(activity.startedAt, activity.completedAt);
        this.startedAt = new NullableDate(activity.startedAt);
        this.completedAt = new js.ObservableValue<NullableDate>();
        this.status = new js.ObservableValue<ActivityState>();
        this.errors = new js.ObservableValue<ErrorMessage[]>();

        this.refreshStatus(activity);

        this._disposables = [
            this.duration,
            activity.completed.listen(() => {
                this.duration.setEndDate(activity.completedAt);
                this.completedAt.setValue(new NullableDate(activity.completedAt));
                this.errors.setValue(activity.errors);
                this.refreshStatus(activity);
            })
        ];
    }

    init() {
        this.duration.init();
        this.completedAt.setValue(new NullableDate(this.activity.completedAt));
        this.errors.setValue(this.activity.errors);
    }

    dispose() {
        __each(this._disposables, x => x.dispose());
    }

    private refreshStatus(activity: TimelineActivity) {
        this.status.setValue(this.calculateStatus(activity));
    }

    private calculateStatus(activity: TimelineActivity) {
        if (!activity.completedAt) {
            return ActivityState.InProgress;
        }

        if (activity.faulted) {
            return ActivityState.Failure;
        }

        return ActivityState.Success;
    }
}