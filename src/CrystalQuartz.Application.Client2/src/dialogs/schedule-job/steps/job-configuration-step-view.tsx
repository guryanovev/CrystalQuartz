import { Disposable, OptionalDisposables } from 'john-smith/common';
import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { List } from 'john-smith/view/components/list';
import { Value } from 'john-smith/view/components/value';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OnInit } from 'john-smith/view/hooks';
import { SelectOptionView } from '../../common/select-option-view';
import { ValidatorView } from '../../common/validation/validator-view';
import { JobConfigurationStep, JobType } from './job-configuration-step';

export class JobConfigurationStepView implements View, OnInit, Disposable {
  public constructor(private readonly viewModel: JobConfigurationStep) {}

  public onInit(_: DomElement | null, __: DomEngine): OptionalDisposables {}

  public dispose() {
    this.viewModel.dispose();
  }

  public template(): HtmlDefinition {
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
