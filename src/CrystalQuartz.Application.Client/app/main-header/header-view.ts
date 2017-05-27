import ViewModel from './header-view-model';

import TimelineCaptionsView from '../timeline/timeline-captions-view';

import TEMPLATE from './header.tmpl.html';

export default class MainHeaderView implements js.IView<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: ViewModel) {
        dom('.ticks-container').render(TimelineCaptionsView, viewModel.timeline);
    }
}