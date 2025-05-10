import { Value, List } from 'john-smith/view/components';
import ViewModel from './header-view-model';

// import TimelineCaptionsView from '../timeline/timeline-captions-view';
// import CommandProgressView from '../command-progress/command-progress-view';
// import ActionView from '../global/actions/action-view';
// import ActionsUtils from '../global/actions/actions-utils';
// import Action from '../global/actions/action';
// import Separator from '../global/actions/separator';

// import TEMPLATE from './header.tmpl.html';
import { HtmlDefinition, View } from 'john-smith/view';
import CommandProgressView from '../../command-progress/command-progress-view';
import { map } from 'john-smith/reactive/transformers/map';
import ActionView from '../../global/actions/action-view';
import TimelineCaptionsView from '../../timeline/timeline-captions-view';
import Action from '../../global/actions/action';
import Separator from '../../global/actions/separator';
// import Error = types.Error;
// import TimelineCaptionsView from '../../timeline/timeline-captions-view';
// import CommandProgressView from '../../command-progress/command-progress-view';
// import Action from '../../global/actions/action';
// import Separator from '../../global/actions/separator';
// import ActionsUtils from '../../global/actions/actions-utils';
// import ActionView from '../../global/actions/action-view';

export default class MainHeaderView implements View {
    constructor(
        private readonly viewModel: ViewModel
    ) {
    }

    template(): HtmlDefinition {
        const schedulerStatusTitle = map(
            this.viewModel.status,
            status => status === null
                ? ''
                : 'Scheduler is ' + status
        );

        const secondaryActions: (Action | Separator)[] = [
            this.viewModel.pauseAllAction,
            this.viewModel.resumeAllAction,
            new Separator(),
            this.viewModel.standbyAction,
            this.viewModel.shutdownAction
        ];

        return <div class="main-header">
            <section class="scheduler-header">
                <div class="scheduler-caption">
                    <div class="status">
                        <span class="scheduler-status js_schedulerStatus" $className={this.viewModel.status} title={schedulerStatusTitle}></span>
                    </div>

                    <a href="#" class="scheduler-name js_viewDetails ellipsis-container" _click={this.viewModel.showSchedulerDetails}>
                        <span>{this.viewModel.name}&nbsp;</span>
                        <span class="ellipsis">...</span>
                    </a>
                </div>

                <div class="scheduler-toolbar">
                    <ul class="js_primaryActions list-unstyled primary-actions">
                        <Value view={ActionView} model={this.viewModel.startAction}></Value>
                    </ul>

                    <ul class="js_scheduleJob list-unstyled schedule-job-actions">
                        <Value view={ActionView} model={this.viewModel.scheduleJobAction}></Value>
                    </ul>

                    <ul class="list-unstyled secondary-actions">
                        <li class="actions dropdown">
                            <a href="#" class="actions-toggle dropdown-toggle" data-bs-toggle="dropdown"></a>

                            <ul class="js_actions list-unstyled dropdown-menu">
                                <List view={ActionView} model={secondaryActions}></List>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div class="command-progress-container">
                    <Value view={CommandProgressView} model={this.viewModel.commandProgress}></Value>
                </div>
            </section>

            <section class="data-header">
                <section class="primary-data">
                    <div class="status"></div>
                    <div class="actions"></div>

                    <div class="data-container">
                        <section class="data-header-item">Trigger</section>
                        <section class="data-header-item">Schedule</section>
                        <section class="data-header-item">Start Date</section>
                        <section class="data-header-item">End Date</section>
                        <section class="data-header-item">Previous Fire Date</section>
                        <section class="data-header-item">Next Fire Date</section>
                    </div>
                </section>

                <div id="ticksCaptions" class="ticks-container">
                    <Value view={TimelineCaptionsView} model={this.viewModel.timeline}></Value>
                </div>
            </section>
        </div>;
    }

    // init(dom: js.IDom, viewModel: ViewModel) {
    //     dom('.ticks-container').render(TimelineCaptionsView, viewModel.timeline);
    //
    //     dom('.js_viewDetails').on('click').react(viewModel.showSchedulerDetails);
    //
    //     const actions: [Action | Separator] = [
    //         viewModel.pauseAllAction,
    //         viewModel.resumeAllAction,
    //         new Separator(),
    //         viewModel.standbyAction,
    //         viewModel.shutdownAction
    //     ];
    //
    //     ActionsUtils.render(dom('.js_actions'), actions);
    //
    //     dom('.js_primaryActions').render(ActionView, viewModel.startAction);
    //
    //     dom('.js_scheduleJob').render(ActionView, viewModel.scheduleJobAction);
    // }
}
