import DialogViewBase from '../dialog-view-base';

import ViewModel from './job-details-view-model';
import PropertyView from '../common/property-view';

import TEMPLATE from './job-details.tmpl.html';

export default class JobDetailsView extends DialogViewBase<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel:ViewModel) {
        super.init(dom, viewModel);

        dom('.js_summary').observes(viewModel.summary, PropertyView);

        viewModel.loadDetails();
    }
}