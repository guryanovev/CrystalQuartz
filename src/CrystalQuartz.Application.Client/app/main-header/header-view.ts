import ViewModel from './header-view-model';

import TimelineCaptionsView from '../timeline/timeline-captions-view';

import TEMPLATE from './header.tmpl.html';

export default class MainHeaderView implements js.IView<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: ViewModel) {
        dom('.js_schedulerName').observes(viewModel.name);
        dom('.ticks-container').render(TimelineCaptionsView, viewModel.timeline);

        const $status = dom('.js_schedulerStatus').$,
              startSchedulerDom = dom('.js_startScheduler'),
              shutdownSchedulerDom = dom('.js_shutdownScheduler');

        dom.manager.manage(
            viewModel.canStart.listen(canStart => {
                if (canStart) {
                    startSchedulerDom.$
                        .addClass('highlight')
                        .removeClass('disabled')
                        .prop('disabled', false);
                } else {
                    startSchedulerDom.$
                        .addClass('disabled')
                        .removeClass('highlight')
                        .prop('disabled', true);
                }
            }));

        dom.manager.manage(
            viewModel.canShutdown.listen(canShutdown => {
                if (canShutdown) {
                    shutdownSchedulerDom.$.removeClass('disabled');
                } else {
                    shutdownSchedulerDom.$.addClass('disabled');
                }
            }));


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

        startSchedulerDom.on('click').react(viewModel.startScheduler);
        shutdownSchedulerDom.on('click').react(() => {
            if (confirm('Are you sure you want to shutdown scheduler?')) {
                viewModel.stopScheduler();
            }
        });
    }
}