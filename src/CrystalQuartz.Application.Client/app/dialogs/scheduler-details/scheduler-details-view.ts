import ViewModel from './scheduler-details-view-model';

import ViewBase from '../dialog-view-base';
import PropertyView from '../common/property-view';

import TEMPLATE from './scheduler-details.tmpl.html';

export default class SchedulerDetailsView extends ViewBase<ViewModel>{
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: ViewModel) {
        super.init(dom, viewModel);

        dom('.js_summary').observes(viewModel.summary, PropertyView);
        dom('.js_status').observes(viewModel.status, PropertyView);
        dom('.js_jobStore').observes(viewModel.jobStore, PropertyView);
        dom('.js_threadPool').observes(viewModel.threadPool, PropertyView);

        viewModel.loadDetails();
    }
}