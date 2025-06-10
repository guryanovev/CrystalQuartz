import { OptionalDisposables } from 'john-smith/common';
import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { List, Value } from 'john-smith/view/components';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OnInit } from 'john-smith/view/hooks';
import { OptionView } from '../../common/job-data-map-item-view';
// import TEMPLATE from './group-configuration-step.tmpl.html';
import { SelectOptionView } from '../../common/select-option-view';
import { ValidatorView } from '../../common/validation/validator-view';
import { GroupConfigurationStep, JobGroupType } from './group-configuration-step';

// import { CHANGE_DOM_DISPLAY } from './view-commons';

// import { RENDER_VALIDATOR } from '../../common/validation/render-validator';

export class GroupConfigurationStepView implements View, OnInit {
  constructor(private readonly viewModel: GroupConfigurationStep) {}

  onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {}

  template(): HtmlDefinition {
    // const jobGroupTypes = [
    //     { code: JobGroupType.Existing, dom: dom('.js_jobGroupTypeExisting') },
    //     { code: JobGroupType.New, dom: dom('.js_jobGroupTypeNew') }
    // ];

    return (
      <div>
        <h2 class="dialog-header">Job Group Configuration {this.viewModel.jobGroupType}</h2>
        <form class="cq-form form-horizontal">
          <div class="row cq-form-group">
            <label for="jobGroupType" class="col col-sm-3 control-label">
              Job Group:
            </label>
            <div class="col col-sm-9">
              <select
                id="jobGroupType"
                class="form-control form-control-sm js_jobGroupSelect"
                $value={this.viewModel.jobGroupType}
              >
                <List view={SelectOptionView} model={this.viewModel.jobGroupTypeOptions}></List>
              </select>
            </div>
          </div>

          <div class="cq-form-separator"></div>

          <Value
            view={(jobGroupType) => {
              if (jobGroupType === JobGroupType.Existing) {
                const existingGroupValidator = this.viewModel.validators.findFor(
                  this.viewModel.selectedJobGroup
                );

                return (
                  <div class="row cq-form-group">
                    <label for="existingJobGroup" class="col col-sm-3 control-label">
                      Existing Job Group<sup>*</sup>:
                    </label>

                    <div class="col col-sm-9">
                      <select
                        id="existingJobGroup"
                        class="form-control form-control-sm"
                        $value={this.viewModel.selectedJobGroup}
                        $className={{
                          'cq-error-control':
                            existingGroupValidator == null ? false : existingGroupValidator.failed,
                        }}
                        _blur={() => existingGroupValidator?.makeDirty()}
                      >
                        <List
                          view={SelectOptionView}
                          model={this.viewModel.existingJobGroups}
                        ></List>
                      </select>
                      <Value view={ValidatorView} model={existingGroupValidator}></Value>
                    </div>
                  </div>
                );
              }

              if (jobGroupType === JobGroupType.New) {
                return (
                  <div class="row cq-form-group">
                    <label for="newJobGroup" class="col col-sm-3 control-label">
                      New Job Group:
                    </label>
                    <div class="col col-sm-9">
                      <input
                        id="newJobGroup"
                        class="form-control form-control-sm"
                        $value={this.viewModel.newJobGroup}
                      />
                    </div>
                  </div>
                );
              }
            }}
            model={this.viewModel.jobGroupType}
          ></Value>
        </form>
      </div>
    );
  }

  // init(dom: js.IDom, viewModel: GroupConfigurationStep): void {

  //
  //     dom('.js_jobGroupSelect').observes(viewModel.jobGroupType, { bidirectional: true });
  //     dom('.js_jobGroupSelect').observes(viewModel.jobGroupTypeOptions, SelectOptionView);
  //
  //     dom.manager.manage(viewModel.jobGroupType.listen(currentJobGroupType => {
  //         CHANGE_DOM_DISPLAY(jobGroupTypes, currentJobGroupType);
  //     }));
  //
  //     dom('.js_existingJobGroupSelect').observes(viewModel.existingJobGroups, SelectOptionView);
  //
  //     dom('.js_newJobGroupInput').observes(viewModel.newJobGroup, { bidirectional: true });
  //
  //     RENDER_VALIDATOR(
  //         dom('.js_existingJobGroupSelect'),
  //         dom('.js_existingJobGroupContainer'),
  //         viewModel.selectedJobGroup,
  //         viewModel.validators);
  // }
}
