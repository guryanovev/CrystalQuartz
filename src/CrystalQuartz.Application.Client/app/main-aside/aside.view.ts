import { MainAsideViewModel } from './aside.view-model';

import TEMPLATE from './aside.tmpl.html';

export class MainAsideView implements js.IView<MainAsideViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: MainAsideViewModel) {
        dom('.js_uptimeValue').observes(viewModel.uptimeValue);
        dom('.js_uptimeMeasurementUnit').observes(viewModel.uptimeMeasurementUnit);

        dom('.js_totalJobs').observes(viewModel.jobsTotal);
        dom('.js_executedJobs').observes(viewModel.jobsExecuted);
        dom('.js_inProgressCount').observes(viewModel.inProgressCount);

        const $gaugeBody = dom('.gauge-body').$;
        dom.manager.manage(viewModel.inProgressCount.listen(value => {
            const angle = 180 * value / parseInt(viewModel.jobsTotal.getValue(), 10);

            $gaugeBody.css('transform', 'rotate(' + angle + 'deg)');
        }));
    }
}