import { JobGroup } from '../../api';
import { JobGroupViewModel } from './job-group-view-model';

import { ActivityView } from '../activity-view';
import { JobView } from '../job/job-view';

import TEMPLATE from './job-group.tmpl.html';

export class JobGroupView extends ActivityView<JobGroup> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: JobGroupViewModel) {
        super.init(dom, viewModel);
        dom('.children').observes(viewModel.jobs, JobView);
        dom.onUnrender().listen(() => {
            dom.$.fadeOut();
        });
    }
}  