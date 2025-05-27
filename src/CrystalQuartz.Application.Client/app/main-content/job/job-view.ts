import { JobViewModel } from './job-view-model';

import { ActivityView } from '../activity-view';
import { TriggerView } from '../trigger/trigger-view';

import TEMPLATE from './job.tmpl.html';

import Action from '../../global/actions/action';
import Separator from '../../global/actions/separator';

export class JobView extends ActivityView<JobViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: JobViewModel) {
        super.init(dom, viewModel);

        dom('.triggers').observes(viewModel.triggers, TriggerView);
        dom('.js_viewDetails').on('click').react(viewModel.loadJobDetails);        
        if (viewModel.environment.IsReadOnly) {dom('.js_shown').$.hide();};
    }

    composeActions(viewModel: JobViewModel): (Action | Separator)[] {
        return [
            viewModel.pauseAction,
            viewModel.resumeAction,
            new Separator(),
            viewModel.executeNowAction,
            viewModel.addTriggerAction,
            new Separator(),
            viewModel.deleteAction
        ];
    }
}