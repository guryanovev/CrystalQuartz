import DialogViewBase from '../dialog-view-base';

import ViewModel from './activity-details-view-model';

import { ErrorsView } from '../common/errors-view';
// import { NullableDateView } from '../../main-content/nullable-date-view';
import { ActivityStateView } from '../../global/activities/activity-state-view';
import ActivityDetailsViewModel from './activity-details-view-model';
import { Value } from 'john-smith/view/components/value';
import { NullableDateView } from '../../main/main-content/nullable-date-view';
import { OnInit } from 'john-smith/view/hooks';
import { DomElement } from 'john-smith/view';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OptionalDisposables } from 'john-smith/common';

// import TEMPLATE from './activity-details.tmpl.html';

export default class ActivityDetailsView extends DialogViewBase<ViewModel> {
    constructor(viewModel: ActivityDetailsViewModel) {
        super(viewModel, 'Trigger fire info');
    }

    onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
        this.viewModel.loadDetails();

        return super.onInit(root, domEngine);
    }

    protected getBodyContent(): JSX.IElement {
        const activityModel = this.viewModel.activityModel;
        const duration = activityModel.duration;

        return <div class="dialog-content dialog-content-no-padding">
            <div class="properties-panel">
                <header>Summary</header>
                <table>
                    <tr>
                        <td>Fire status</td>
                        <td>
                            <Value view={ActivityStateView} model={activityModel.status}></Value>
                        </td>
                    </tr>
                    <tr>
                        <td>Trigger started at</td>
                        <td>
                            <Value view={NullableDateView} model={activityModel.startedAt}></Value>
                        </td>
                    </tr>
                    <tr>
                        <td>Trigger completed at</td>
                        <td>
                            <Value view={NullableDateView} model={activityModel.completedAt}></Value>
                        </td>
                    </tr>
                    <tr>
                        <td>Duration</td>
                        <td>
                            <span class="js_durationValue">{duration.value}</span>
                            <span class="js_durationUnit">{duration.measurementUnit}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>Fire instance ID</td>
                        <td class="js_fireInstanceId">{this.viewModel.fireInstanceId}</td>
                    </tr>
                </table>
            </div>

            <section>
                <Value view={ErrorsView} model={activityModel.errors}></Value>
            </section>
        </div>;
    }

// template = TEMPLATE;
    //
    // init(dom: js.IDom, viewModel:ViewModel) {
    //     super.init(dom, viewModel);
    //
    //     const
    //         activityModel = viewModel.activityModel,
    //         duration = activityModel.duration;
    //
    //     dom('.js_fireInstanceId').observes(viewModel.fireInstanceId);
    //     dom('.js_durationValue').observes(duration.value);
    //     dom('.js_durationUnit').observes(duration.measurementUnit);
    //
    //     dom('.js_startedAt').observes(activityModel.startedAt, NullableDateView);
    //     dom('.js_completedAt').observes(activityModel.completedAt, NullableDateView);
    //     dom('.js_errors').observes(activityModel.errors, ErrorsView);
    //     dom('.js_status').observes(activityModel.status, ActivityStateView);
    //
    //     viewModel.loadDetails();
    // }
}
