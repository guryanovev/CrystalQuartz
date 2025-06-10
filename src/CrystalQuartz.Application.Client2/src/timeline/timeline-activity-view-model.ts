import { Disposable } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';
import { ErrorMessage, NullableDate } from '../api';
import { ActivityState } from '../global/activities/activity-state';
import { Duration } from '../global/duration';
import TimelineActivity from './timeline-activity';

/**
 * A view model for timeline activity to share
 * some logic between tooltip and details dialog.
 */
export class TimelineActivityViewModel implements Disposable {
  private _disposables: Disposable[];

  duration: Duration;
  startedAt: NullableDate;
  completedAt: ObservableValue<NullableDate>;
  status: ObservableValue<ActivityState | null>;
  errors: ObservableValue<ErrorMessage[] | null>;

  constructor(private activity: TimelineActivity) {
    this.duration = new Duration(activity.startedAt, activity.completedAt);
    this.startedAt = new NullableDate(activity.startedAt ?? null);
    this.completedAt = new ObservableValue<NullableDate>(
      new NullableDate(activity.completedAt ?? null)
    );
    this.status = new ObservableValue<ActivityState | null>(null);
    this.errors = new ObservableValue<ErrorMessage[] | null>(null);

    this.refreshStatus(activity);

    this._disposables = [
      this.duration,
      activity.completed.listen(() => {
        this.duration.setEndDate(activity.completedAt!);
        this.completedAt.setValue(new NullableDate(activity.completedAt ?? null));
        this.errors.setValue(activity.errors);
        this.refreshStatus(activity);
      }),
    ];
  }

  init() {
    this.duration.init();
    this.completedAt.setValue(new NullableDate(this.activity.completedAt ?? null));
    this.errors.setValue(this.activity.errors);
  }

  dispose() {
    this._disposables.forEach((x) => x.dispose());
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
