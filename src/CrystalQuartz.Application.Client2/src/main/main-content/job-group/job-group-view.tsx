import { JobGroup } from '../../../api';
import { JobGroupViewModel } from './job-group-view-model';

import { JobView } from '../job/job-view';

import Action from '../../../global/actions/action';
import Separator from '../../../global/actions/separator';

import { View } from 'john-smith/view';
import { List, Value } from 'john-smith/view/components';
import { ActivityStatusView } from '../activity-status-view';
import ActionView from '../../../global/actions/action-view';
import { SmoothUnrenderHandler } from '../../../utils/view/smooth-unrender';
import { OnUnrender } from 'john-smith/view/hooks';

export class JobGroupView implements View, OnUnrender {
    private readonly _unrenderHandler = new SmoothUnrenderHandler(1000);

    constructor(private readonly viewModel: JobGroupViewModel) {
    }

    public onUnrender(unrender: () => void): void {
        this._unrenderHandler.onUnrender(unrender);
    }

    template() {
        const actions = [
                this.viewModel.pauseAction,
                this.viewModel.resumeAction,
                new Separator(),
                this.viewModel.scheduleJobAction,
                new Separator(),
                this.viewModel.deleteAction
            ];

        return <section class="job-group-wrapper cq-data-row-wrapper" $className={{ 'removing': this._unrenderHandler.removing }}>
            <div class="data-row data-row-job-group">
                <section class="primary-data">
                    <div class="status"><Value view={ActivityStatusView} model={this.viewModel}></Value></div>

                    <section class="actions dropdown">
                        <a href="#" class="actions-toggle dropdown-toggle" data-bs-toggle="dropdown"></a>
                        <ul class="js_actions dropdown-menu">
                            <List view={ActionView} model={actions}></List>
                        </ul>
                    </section>

                    <div class="data-container">
                        <section class="data-group name">{this.viewModel.name}</section>
                    </div>
                </section>

                <section class="timeline-data timeline-data-filler"></section>
            </div>

            <section class="jobs js_jobs">
                <List view={JobView} model={this.viewModel.jobs}></List>
            </section>
        </section>;
    }

    // init(dom: js.IDom, viewModel: JobGroupViewModel) {
    //     super.init(dom, viewModel);
    //     dom('.js_jobs').observes(viewModel.jobs, JobView);
    // }
    //
    // composeActions(viewModel: JobGroupViewModel): (Action | Separator)[] {
    //     return [
    //         viewModel.pauseAction,
    //         viewModel.resumeAction,
    //         new Separator(),
    //         viewModel.scheduleJobAction,
    //         new Separator(),
    //         viewModel.deleteAction
    //     ];
    // }
}  
