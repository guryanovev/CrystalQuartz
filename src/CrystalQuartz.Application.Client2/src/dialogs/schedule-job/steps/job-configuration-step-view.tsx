// import TEMPLATE from './job-configuration-step.tmpl.html';
// import { SelectOptionView } from '../../common/select-option-view';
// import { CHANGE_DOM_DISPLAY } from './view-commons';
// import { JobConfigurationStep } from './job-configuration-step';
// import { JobType } from './job-configuration-step';
// import {RENDER_VALIDATOR} from '../../common/validation/render-validator';
//

import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { OnInit } from 'john-smith/view/hooks';
import { JobConfigurationStep } from './job-configuration-step';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OptionalDisposables } from 'john-smith/common';

export class JobConfigurationStepView implements View, OnInit {
    constructor(
        private readonly viewModel: JobConfigurationStep
    ) {
    }

    onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
    }

    template(): HtmlDefinition {
        return <div>
            <h2 class="dialog-header">Job Configuration</h2>
            <form class="cq-form form-horizontal">
                <div class="form-group form-group-sm">
                    <label for="jobKind" class="col-sm-3 control-label">Job:</label>
                    <div class="col-sm-9">
                        <select id="jobKind" class="form-control js_jobKindSelect"></select>
                    </div>
                </div>

                <div class="cq-form-separator"></div>

                <div class="form-group form-group-sm js_jobTypeExisting">
                    <label for="existingJob" class="col-sm-3 control-label">Existing Job<sup>*</sup>:</label>
                    <div class="col-sm-9 js_existingJobContainer">
                        <select id="existingJob" class="form-control js_existingJobSelect"></select>
                    </div>
                </div>

                <div class="js_jobTypeNew">
                    <div class="form-group form-group-sm">
                        <label for="newJobName" class="col-sm-3 control-label">Job Name:</label>
                        <div class="col-sm-9">
                            <input id="newJobName" class="form-control js_newJobNameInput"/>
                        </div>
                    </div>

                    <div class="form-group form-group-sm">
                        <label for="newJobClass" class="col-sm-3 control-label">Job Class<sup>*</sup>:</label>
                        <div class="col-sm-9 js_newJobClassContainer">
                            <select id="newJobClass" class="form-control js_newJobClassSelect"></select>
                        </div>
                    </div>
                </div>
            </form>
        </div>;
    }
}

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
