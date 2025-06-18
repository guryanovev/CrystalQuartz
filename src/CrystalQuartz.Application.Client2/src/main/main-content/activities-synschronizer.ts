import { ObservableList } from 'john-smith/reactive';
import { ManagableActivity } from '../../api';
import { ManagableActivityViewModel } from './activity-view-model';

export default class ActivitiesSynschronizer<
  TActivity extends ManagableActivity,
  TActivityViewModel extends ManagableActivityViewModel<TActivity>,
> {
  public constructor(
    private identityChecker: (
      activity: TActivity,
      activityViewModel: TActivityViewModel
    ) => boolean,
    private mapper: (activity: TActivity) => TActivityViewModel,
    private list: ObservableList<TActivityViewModel>
  ) {}

  public sync(activities: TActivity[]) {
    const existingActivities: TActivityViewModel[] = this.list.getValue();
    const deletedActivities = existingActivities.filter((viewModel) =>
      activities.every((activity) => this.areNotEqual(activity, viewModel))
    );
    const addedActivities = activities.filter((activity) =>
      existingActivities.every((viewModel) => this.areNotEqual(activity, viewModel))
    );
    const updatedActivities = existingActivities.filter((viewModel) =>
      activities.some((activity) => this.areEqual(activity, viewModel))
    );
    const addedViewModels = addedActivities.map(this.mapper);
    const finder = (viewModel: TActivityViewModel): TActivity | undefined =>
      activities.find((activity) => this.areEqual(activity, viewModel));

    deletedActivities.forEach((viewModel) => this.list.remove(viewModel));
    addedViewModels.forEach((viewModel) => {
      const activity = finder(viewModel);

      if (activity !== undefined) {
        viewModel.updateFrom(activity);
      }

      this.list.add(viewModel);
    });

    updatedActivities.forEach((viewModel) => {
      const activity = finder(viewModel);
      if (activity !== undefined) {
        viewModel.updateFrom(activity);
      }
    });
  }

  private areEqual(activity: TActivity, activityViewModel: TActivityViewModel) {
    return this.identityChecker(activity, activityViewModel);
  }

  private areNotEqual(activity: TActivity, activityViewModel: TActivityViewModel) {
    return !this.identityChecker(activity, activityViewModel);
  }
}
