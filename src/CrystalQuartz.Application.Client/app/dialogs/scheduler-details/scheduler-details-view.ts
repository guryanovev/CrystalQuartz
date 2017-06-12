import ViewModel from './scheduler-details-view-model';

import TEMPLATE from './scheduler-details.tmpl.html';

export default class SchedulerDetailsView implements js.IView<ViewModel>{
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: ViewModel) {
        dom('.js_close').on('click').react(viewModel.cancel);

        dom.$.addClass('showing');
        setTimeout(() => {
            dom.$.removeClass('showing');    
        }, 10);
    }
}