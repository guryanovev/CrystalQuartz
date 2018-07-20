import { ManagableActivity } from '../api';
import { ManagableActivityViewModel } from './activity-view-model';

import __every from 'lodash/every';
import __filter from 'lodash/filter';
import __some from 'lodash/some';
import __map from 'lodash/map';
import __each from 'lodash/each';
import __find from 'lodash/find';

export default class ActivitiesSynschronizer<TActivity extends ManagableActivity, TActivityViewModel extends ManagableActivityViewModel<any>> {
    constructor(
        private identityChecker: (activity: TActivity, activityViewModel: TActivityViewModel) => boolean,
        private mapper: (activity: TActivity) => TActivityViewModel,
        private list: js.ObservableList<TActivityViewModel>) {
    }

    sync(activities: TActivity[]) {
        const
            existingActivities: TActivityViewModel[] = this.list.getValue(),

            deletedActivities = __filter(
                existingActivities,
                viewModel => __every(activities, activity => this.areNotEqual(activity, viewModel))),

            addedActivities = __filter(
                activities,
                activity => __every(existingActivities, viewModel => this.areNotEqual(activity, viewModel))),

            updatedActivities = __filter(
                existingActivities,
                viewModel => __some<TActivity>(activities, activity => this.areEqual(activity, viewModel))),

            addedViewModels = __map(addedActivities, this.mapper),

            finder = (viewModel: TActivityViewModel) => __find(activities, activity => this.areEqual(activity, viewModel));

        __each(deletedActivities, viewModel => this.list.remove(viewModel));
        __each(addedViewModels, viewModel => {
            viewModel.updateFrom(finder(viewModel));
            this.list.add(viewModel);
        });
        __each(updatedActivities, viewModel => viewModel.updateFrom(finder(viewModel)));
    }

    private areEqual(activity: TActivity, activityViewModel: TActivityViewModel) {
        return this.identityChecker(activity, activityViewModel);
    }

    private areNotEqual(activity: TActivity, activityViewModel: TActivityViewModel) {
        return !this.identityChecker(activity, activityViewModel);
    }
}