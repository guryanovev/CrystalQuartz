import ViewModel from './scheduler-details-view-model';

import PropertyView from '../common/property-view';

import TEMPLATE from './scheduler-details.tmpl.html';

export default class SchedulerDetailsView implements js.IView<ViewModel>{
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: ViewModel) {
        dom('.js_close').on('click').react(viewModel.cancel); /* todo: base class */

        dom.$.addClass('showing');
        setTimeout(() => {
            dom.$.removeClass('showing');    
        }, 10);

        /* ===================================== */

        dom('.js_summary').observes(viewModel.summary, PropertyView);
        dom('.js_status').observes(viewModel.status, PropertyView);
        dom('.js_jobStore').observes(viewModel.jobStore, PropertyView);
        dom('.js_threadPool').observes(viewModel.threadPool, PropertyView);

        viewModel.loadDetails();
    }
}