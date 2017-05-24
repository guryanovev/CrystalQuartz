import { JobDetails } from '../../api';
import { PropertyView, PropertyWithTypeView } from '../property-view';

export class JobDetailsView implements js.IView<JobDetails> {
    template = "#JobDetailsView";

    init(dom: js.IDom, viewModel: JobDetails) {
        dom('.properties tbody').observes(viewModel.JobProperties, PropertyView);
        dom('.dataMap tbody').observes(viewModel.JobDataMap, PropertyWithTypeView);
    }
}