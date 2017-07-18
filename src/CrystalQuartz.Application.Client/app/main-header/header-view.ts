import ViewModel from './header-view-model';

import TimelineCaptionsView from '../timeline/timeline-captions-view';
import CommandProgressView from '../command-progress/command-progress-view';
import ActionView from '../global/actions/action-view';
import ActionsUtils from '../global/actions/actions-utils';
import Action from '../global/actions/action';
import Separator from '../global/actions/separator';

import TEMPLATE from './header.tmpl.html';

export default class MainHeaderView implements js.IView<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: ViewModel) {
        dom('.js_schedulerName').observes(viewModel.name);
        dom('.ticks-container').render(TimelineCaptionsView, viewModel.timeline);
        dom('.js_commandProgress').render(CommandProgressView, viewModel.commandProgress);

        dom('.js_viewDetails').on('click').react(viewModel.showSchedulerDetails);

        const actions: [Action | Separator] = [
            viewModel.pauseAllAction,
            viewModel.resumeAllAction,
            new Separator(),
            viewModel.standbyAction,
            viewModel.shutdownAction
        ];

        ActionsUtils.render(dom('.js_actions'), actions);

        dom('.js_primaryActions').render(ActionView, viewModel.startAction);

//        const js_standby = dom('.js_standby');
//
//        js_standby.className('disabled').observes(viewModel.canStandby);

        const $status = dom('.js_schedulerStatus').$ /*,
              startSchedulerDom = dom('.js_startScheduler'),
              shutdownSchedulerDom = dom('.js_shutdownScheduler')*/;

//        dom.manager.manage(
//            viewModel.canStart.listen(canStart => {
//                if (canStart) {
//                    startSchedulerDom.$
//                        .addClass('highlight')
//                        .removeClass('disabled')
//                        .prop('disabled', false);
//                } else {
//                    startSchedulerDom.$
//                        .addClass('disabled')
//                        .removeClass('highlight')
//                        .prop('disabled', true);
//                }
//            }));

        /*
        dom.manager.manage(
            viewModel.canShutdown.listen(canShutdown => {
                if (canShutdown) {
                    shutdownSchedulerDom.$.removeClass('disabled');
                } else {
                    shutdownSchedulerDom.$.addClass('disabled');
                }
            }));*/
        
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

        //startSchedulerDom.on('click').react(viewModel.startScheduler);

        /*
        shutdownSchedulerDom.on('click').react(() => {
            if (confirm('Are you sure you want to shutdown scheduler?')) {
                viewModel.stopScheduler();
            }
        });*/
    }
}