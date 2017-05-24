import { ManagableActivity } from '../api';
import { ManagableActivityViewModel } from './activity-view-model';

export default class ActivitiesSynschronizer<TActivity extends ManagableActivity, TActivityViewModel extends ManagableActivityViewModel<any>> {
    constructor(
        private identityChecker: (activity: TActivity, activityViewModel: TActivityViewModel) => boolean,
        private mapper: (activity: TActivity) => TActivityViewModel,
        private list: js.ObservableList<TActivityViewModel>) {
    }

    sync(activities: TActivity[]) {
        var existingActivities: TActivityViewModel[] = this.list.getValue();
        var deletedActivities = _.filter(
            existingActivities,
            viewModel => _.every(activities, activity => this.areNotEqual(activity, viewModel)));

        var addedActivities = _.filter(
            activities,
            activity => _.every(existingActivities, viewModel => this.areNotEqual(activity, viewModel)));

        var updatedActivities = _.filter(
            existingActivities,
            viewModel => _.some(activities, activity => this.areEqual(activity, viewModel)));

        var addedViewModels = _.map(addedActivities, this.mapper);

        var finder = (viewModel: TActivityViewModel) => _.find(activities, activity => this.areEqual(activity, viewModel));

        _.each(deletedActivities, viewModel => this.list.remove(viewModel));
        _.each(addedViewModels, viewModel => {
            viewModel.updateFrom(finder(viewModel));
            this.list.add(viewModel);
        });
        _.each(updatedActivities, viewModel => viewModel.updateFrom(finder(viewModel)));
    }

    private areEqual(activity: TActivity, activityViewModel: TActivityViewModel) {
        return this.identityChecker(activity, activityViewModel);
    }

    private areNotEqual(activity: TActivity, activityViewModel: TActivityViewModel) {
        return !this.identityChecker(activity, activityViewModel);
    }
}