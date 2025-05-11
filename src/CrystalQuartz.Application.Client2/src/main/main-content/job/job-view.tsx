import { JobViewModel } from './job-view-model';
import { TriggerView } from '../trigger/trigger-view';
import Action from '../../../global/actions/action';
import Separator from '../../../global/actions/separator';
import { View } from 'john-smith/view';
import { List, Value } from 'john-smith/view/components';
import { ActivityStatusView } from '../activity-status-view';
import ActionView from '../../../global/actions/action-view';

export class JobView implements View {

    constructor(private readonly viewModel: JobViewModel) {
    }

    // todo single root
    template() {
        const actions = [
                this.viewModel.pauseAction,
                this.viewModel.resumeAction,
                new Separator(),
                this.viewModel.executeNowAction,
                this.viewModel.addTriggerAction,
                new Separator(),
                this.viewModel.deleteAction
            ];

        return <section class="job-wrapper">
            <div class="data-row data-row-job">
                <section class="primary-data">
                    <div class="status">
                        <Value view={ActivityStatusView} model={this.viewModel}></Value>
                    </div>

                    <div class="actions dropdown">
                        <a href="#" class="actions-toggle dropdown-toggle" data-bs-toggle="dropdown"><span
                            class="caret"></span></a>
                        <ul class="js_actions dropdown-menu">
                            <List view={ActionView} model={actions}></List>
                        </ul>
                    </div>

                    <div class="data-container">
                        <a href="#" class="data-item ellipsis-link js_viewDetails" _click={this.viewModel.loadJobDetails}>
                            <span class="name">{this.viewModel.name}</span>
                        </a>
                    </div>
                </section>
                <section class="timeline-data timeline-data-filler"></section>
            </div>

            <section class="triggers">
                <List view={TriggerView} model={this.viewModel.triggers}></List>
            </section>
        </section>;
    }

    // init(dom: js.IDom, viewModel: JobViewModel) {
    //     super.init(dom, viewModel);
    //
    //     dom('.triggers').observes(viewModel.triggers, TriggerView);
    //     dom('.js_viewDetails').on('click').react(viewModel.loadJobDetails);
    // }
    //
    // composeActions(viewModel: JobViewModel): (Action | Separator)[] {
    //     return ;
    // }
}
