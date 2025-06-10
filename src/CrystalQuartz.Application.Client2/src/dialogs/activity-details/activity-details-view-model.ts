import { Disposable } from 'john-smith/common';
import TimelineActivity from '../../timeline/timeline-activity';
import { TimelineActivityViewModel } from '../../timeline/timeline-activity-view-model';
import { DialogViewModel } from '../dialog-view-model';

export default class ActivityDetailsViewModel extends DialogViewModel<any> implements Disposable {
  readonly activityModel: TimelineActivityViewModel;
  readonly fireInstanceId: string;

  constructor(activity: TimelineActivity) {
    super();

    this.activityModel = new TimelineActivityViewModel(activity);
    this.fireInstanceId = activity.key!; // todo
  }

  public loadDetails() {
    this.activityModel.init();
  }

  public dispose() {
    this.activityModel.dispose();
  }
}
