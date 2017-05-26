import ViewModel from './header-view-model';

import TEMPLATE from './header.tmpl.html';

export default class MainHeaderView implements js.IView<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: ViewModel) {
        
    }
}