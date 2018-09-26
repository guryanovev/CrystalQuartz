import DialogViewBase from '../dialog-view-base';

import ViewModel from './activity-details-view-model';

import { ErrorsView } from '../common/errors-view';
import { NullableDateView } from '../../main-content/nullable-date-view';
import { ActivityStateView } from '../../global/activities/activity-state-view';

import TEMPLATE from './activity-details.tmpl.html';

import __map from 'lodash/map';
import __flatMap from 'lodash/flatMap';

export default class ActivityDetailsView extends DialogViewBase<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel:ViewModel) {
        super.init(dom, viewModel);

        const
            activityModel = viewModel.activityModel,
            duration = activityModel.duration;

        dom('.js_fireInstanceId').observes(viewModel.fireInstanceId);
        dom('.js_durationValue').observes(duration.value);
        dom('.js_durationUnit').observes(duration.measurementUnit);

        dom('.js_startedAt').observes(activityModel.startedAt, NullableDateView);
        dom('.js_completedAt').observes(activityModel.completedAt, NullableDateView);
        dom('.js_errors').observes(activityModel.errors, ErrorsView);
        dom('.js_status').observes(activityModel.status, ActivityStateView);

        /*
        dom.manager.manage(activityModel.status.listen(statusValue => {
            const statusDataValue = statusData[statusValue];
            $status.$.text(statusDataValue.title);
        }));
        */

        //dom('.js_jobDataMap').observes(viewModel.jobDataMap, PropertyValueView);

        //dom('.js_jobDataMap').observes(viewModel.jobDataMap, (value: PropertyValue) => IS_SINGLE(value) ? null : FlatObjectRootView);

        viewModel.loadDetails();
    }
}