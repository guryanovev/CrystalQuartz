import { MainAsideViewModel } from './aside.view-model';

import TEMPLATE from './aside.tmpl.html';

export class MainAsideView implements js.IView<MainAsideViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: MainAsideViewModel) {
        dom('.value-number').observes(viewModel.uptimeValue);
        dom('.value-measurement-unit').observes(viewModel.uptimeMeasurementUnit);
    }
}