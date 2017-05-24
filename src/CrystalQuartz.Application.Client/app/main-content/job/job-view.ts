import { Job } from '../../api';

import { JobViewModel } from './job-view-model';

import { ActivityView } from '../activity-view';
import { NullableDateView } from '../nullable-date-view';
import { TriggerView } from '../trigger/trigger-view';
import { JobDetailsView } from '../job-details/job-details-view';

import TEMPLATE from './job.tmpl.html';

export class JobView extends ActivityView<Job> {
    template = <string>TEMPLATE;

    init(dom: js.IDom, viewModel: JobViewModel) {
        super.init(dom, viewModel);

        var $$hideDetails = dom('.hideDetails');

        viewModel.details.listen((value) => {
            if (value) {
                $$hideDetails.$.fadeIn();
            } else {
                $$hideDetails.$.fadeOut();
            }
        });

        dom('.triggers').observes(viewModel.triggers, TriggerView);
        dom('.detailsContainer').observes(viewModel.details, JobDetailsView);

        dom('.loadDetails').on('click').react(viewModel.loadJobDetails);
        dom('.actions .execute').on('click').react(viewModel.executeNow);
        dom('.addTrigger').on('click').react(viewModel.addTrigger);

        $$hideDetails.on('click').react(viewModel.clearJobDetails);
    }
}