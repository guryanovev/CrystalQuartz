import DialogViewBase from '../dialog-view-base';

import ViewModel from './job-details-view-model';

import TEMPLATE from './job-details.tmpl.html';

export default class JobDetailsView extends DialogViewBase<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel:ViewModel) {
        super.init(dom, viewModel);
    }
}