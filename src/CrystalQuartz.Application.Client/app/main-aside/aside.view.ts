import { MainAsideViewModel } from './aside.view-model';

import TEMPLATE from './aside.tmpl.html';

export class MainAsideView implements js.IView<MainAsideViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: MainAsideViewModel) {
        //dom('.js_uptimeValue').observes(viewModel.uptimeValue, { encode: false });
        dom('.js_uptimeMeasurementUnit').observes(viewModel.uptimeMeasurementUnit);

        dom('.js_totalJobs').observes(viewModel.jobsTotal);
        dom('.js_executedJobs').observes(viewModel.jobsExecuted);
        dom('.js_inProgressCount').observes(viewModel.inProgressCount);

        const $gaugeBody = dom('.gauge-body').$;
        dom.manager.manage(viewModel.inProgressCount.listen(value => {
            const angle = 180 * value / parseInt(viewModel.jobsTotal.getValue(), 10);

            $gaugeBody.css('transform', 'rotate(' + Math.min(angle, 180) + 'deg)');
        }));

        const $uptimeValue = dom('.js_uptimeValue').$;
        dom.manager.manage(viewModel.uptimeValue.listen(value => {
            if (value === null) {
                $uptimeValue.addClass('empty');
                $uptimeValue.text('none');
            } else {
                $uptimeValue.removeClass('empty');
                $uptimeValue.text(value);
            }
        }));
    }
}