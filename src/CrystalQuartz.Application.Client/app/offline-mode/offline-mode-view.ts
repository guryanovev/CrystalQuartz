import TEMPLATE from './offline-mode.tmpl.html';
import { OfflineModeViewModel } from "./offline-mode-view-model";

export class OfflineModeView implements js.IView<OfflineModeViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: OfflineModeViewModel) {
        setTimeout(() => dom.root.$.addClass('visible'), 100);

        dom('.js_since').observes(viewModel.since);
        dom('.js_address').observes(viewModel.serverUrl);
        dom('.js_retryIn').observes(viewModel.retryIn);

        const
            $retryNow = dom('.js_retryNow');

        $retryNow.on('click').react(viewModel.retryNow);
        $retryNow.className('disabled').observes(viewModel.isInProgress);
    }
}