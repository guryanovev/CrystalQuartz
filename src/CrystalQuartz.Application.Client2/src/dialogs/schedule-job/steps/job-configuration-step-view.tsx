// import TEMPLATE from './job-configuration-step.tmpl.html';
// import { SelectOptionView } from '../../common/select-option-view';
// import { CHANGE_DOM_DISPLAY } from './view-commons';
// import { JobConfigurationStep } from './job-configuration-step';
// import { JobType } from './job-configuration-step';
// import {RENDER_VALIDATOR} from '../../common/validation/render-validator';
//

import { OptionalDisposables } from 'john-smith/common';
import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { List } from 'john-smith/view/components/list';
import { Value } from 'john-smith/view/components/value';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OnInit } from 'john-smith/view/hooks';
import { OptionView } from '../../common/job-data-map-item-view';
import { SelectOptionView } from '../../common/select-option-view';
import { ValidatorView } from '../../common/validation/validator-view';
import { JobConfigurationStep, JobType } from './job-configuration-step';

export class JobConfigurationStepView implements View, OnInit {
  constructor(private readonly viewModel: JobConfigurationStep) {}

  onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {}

  template(): HtmlDefinition {
    return (
      <div>
        <h2 class="dialog-header">Job Configuration</h2>
        <form class="cq-form form-horizontal">
          <div class="cq-form-group row">
            <label for="jobKind" class="col-sm-3 control-label">
              Job:
            </label>
            <div class="col-sm-9">
              <select
                id="jobKind"
                class="form-select form-select-sm"
                $value={this.viewModel.jobType}
              >
                <List view={SelectOptionView} model={this.viewModel.jobTypeOptions}></List>
              </select>
            </div>
          </div>

          <div class="cq-form-separator"></div>

          <Value
            view={(jobType) => {
              if (jobType === JobType.New) {
                return (
                  <div class="js_jobTypeNew">
                    <div class="cq-form-group row">
                      <label for="newJobName" class="col-sm-3 control-label">
                        Job Name:
                      </label>
                      <div class="col-sm-9">
                        <input
                          id="newJobName"
                          class="form-control form-control-sm"
                          $value={this.viewModel.newJobName}
                        />
                      </div>
                    </div>

                    <div class="cq-form-group row">
                      <label for="newJobClass" class="col-sm-3 control-label">
                        Job Class<sup>*</sup>:
                      </label>
                      <div class="col-sm-9">
                        <select
                          id="newJobClass"
                          class="form-select form-select-sm"
                          $value={this.viewModel.newJobClass}
                          $className={{
                            'cq-error-control': this.viewModel.newJobClassValidator.failed,
                          }}
                          _blur={() => this.viewModel.newJobClassValidator.makeDirty()}
                        >
                          <List
                            view={SelectOptionView}
                            model={this.viewModel.allowedJobTypes}
                          ></List>
                        </select>
                        <Value
                          view={ValidatorView}
                          model={this.viewModel.newJobClassValidator}
                        ></Value>
                      </div>
                    </div>
                  </div>
                );
              }

              if (jobType === JobType.Existing) {
                const existingJobValidator = this.viewModel.selectedJobValidator;

                return (
                  <div class="cq-form-group row">
                    <label for="existingJob" class="col-sm-3 control-label">
                      Existing Job<sup>*</sup>:
                    </label>
                    <div class="col-sm-9 js_existingJobContainer">
                      <select
                        id="existingJob"
                        class="form-select form-select-sm"
                        $value={this.viewModel.selectedJob}
                        $className={{ 'cq-error-control': existingJobValidator.failed }}
                        _blur={() => existingJobValidator.makeDirty()}
                      >
                        <List view={SelectOptionView} model={this.viewModel.existingJobs}></List>
                      </select>
                      <Value view={ValidatorView} model={existingJobValidator}></Value>
                    </div>
                  </div>
                );
              }
            }}
            model={this.viewModel.jobType}
          ></Value>
        </form>
      </div>
    );
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
