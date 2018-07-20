import { JobGroup } from '../../api';
import { JobGroupViewModel } from './job-group-view-model';

import { ActivityView } from '../activity-view';
import { JobView } from '../job/job-view';

import Action from '../../global/actions/action';
import Separator from '../../global/actions/separator';

import TEMPLATE from './job-group.tmpl.html';

export class JobGroupView extends ActivityView<JobGroupViewModel> {
    template = <string>TEMPLATE;

    init(dom: js.IDom, viewModel: JobGroupViewModel) {
        super.init(dom, viewModel);
        dom('.js_jobs').observes(viewModel.jobs, JobView);
        /*
        dom.onUnrender().listen(() => {
            dom.$.fadeOut();
        });*/
    }

    composeActions(viewModel: JobGroupViewModel): [Action | Separator] {
        return [
            viewModel.pauseAction,
            viewModel.resumeAction,
            new Separator(),
            viewModel.deleteAction
        ];
    }
}  