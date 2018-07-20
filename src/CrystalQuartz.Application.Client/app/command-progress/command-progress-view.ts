import ViewModel from './command-progress-view-model';

import TEMPLATE from './command-progress.tmpl.html';

export default class CommandProgressView implements js.IView<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: ViewModel) {
        dom('.js_commandMessage').observes(viewModel.currentCommand);

        var timer = null;
        viewModel.active.listen((value => {
            if (value) {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                dom.$.stop().show();
            } else {
                timer = setTimeout(() => {
                    dom.$.fadeOut();
                }, 1000);
            }
        }));
    }
}