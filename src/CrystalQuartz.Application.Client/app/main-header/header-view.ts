import ViewModel from './header-view-model';

import TimelineCaptionsView from '../timeline/timeline-captions-view';

import TEMPLATE from './header.tmpl.html';

export default class MainHeaderView implements js.IView<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: ViewModel) {
        dom('.js_schedulerName').observes(viewModel.name);
        dom('.ticks-container').render(TimelineCaptionsView, viewModel.timeline);

        const $status = dom('.js_schedulerStatus').$;

        dom.manager.manage(
            viewModel.status.listen((newValue: string, oldValue?: string) => {
                if (oldValue) {
                    $status.removeClass(oldValue);
                }

                if (newValue) {
                    $status.addClass(newValue);
                }

                $status.attr('title', 'Scheduler is ' + newValue);
            }, true));
    }
}