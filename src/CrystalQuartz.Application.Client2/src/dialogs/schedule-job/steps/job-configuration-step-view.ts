// import TEMPLATE from './job-configuration-step.tmpl.html';
// import { SelectOptionView } from '../../common/select-option-view';
// import { CHANGE_DOM_DISPLAY } from './view-commons';
// import { JobConfigurationStep } from './job-configuration-step';
// import { JobType } from './job-configuration-step';
// import {RENDER_VALIDATOR} from '../../common/validation/render-validator';
//
// export class JobConfigurationStepView implements js.IView<JobConfigurationStep> {
//     template = TEMPLATE;
//
//     init(dom: js.IDom, viewModel: JobConfigurationStep): void {
//         const jobTypes = [
//             { code: JobType.Existing, dom: dom('.js_jobTypeExisting') },
//             { code: JobType.New, dom: dom('.js_jobTypeNew') }
//         ];
//
//         dom('.js_jobKindSelect').observes(viewModel.jobTypeOptions, SelectOptionView);
//         dom('.js_jobKindSelect').observes(viewModel.jobType, { bidirectional: true });
//
//         dom('.js_existingJobSelect').observes(viewModel.existingJobs, SelectOptionView);
//         //dom('.js_existingJobSelect').observes(viewModel.selectedJob, { bidirectional: true });
//
//         dom.manager.manage(viewModel.jobType.listen(currentJobType => {
//             CHANGE_DOM_DISPLAY(jobTypes, currentJobType);
//         }));
//
//         dom('.js_newJobClassSelect').observes(viewModel.allowedJobTypes, SelectOptionView);
//
//         dom('.js_newJobNameInput').observes(viewModel.newJobName, { bidirectional: true });
//
//         RENDER_VALIDATOR(
//             dom('.js_existingJobSelect'),
//             dom('.js_existingJobContainer'),
//             viewModel.selectedJob,
//             viewModel.validators);
//
//         RENDER_VALIDATOR(
//             dom('.js_newJobClassSelect'),
//             dom('.js_newJobClassContainer'),
//             viewModel.newJobClass,
//             viewModel.validators);
//     }
// }
