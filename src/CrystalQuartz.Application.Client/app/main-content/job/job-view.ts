import { Job } from '../../api';

import { JobViewModel } from './job-view-model';

import { ActivityView } from '../activity-view';
import { NullableDateView } from '../nullable-date-view';
import { TriggerView } from '../trigger/trigger-view';

import TEMPLATE from './job.tmpl.html';

export class JobView extends ActivityView<Job> {
    template = <string>TEMPLATE;

    init(dom: js.IDom, viewModel: JobViewModel) {
        super.init(dom, viewModel);

        dom('.triggers').observes(viewModel.triggers, TriggerView);
        dom('.actions .execute').on('click').react(viewModel.executeNow);
        dom('.addTrigger').on('click').react(viewModel.addTrigger);

        dom('.name').on('click').react(viewModel.loadJobDetails);
    }
}