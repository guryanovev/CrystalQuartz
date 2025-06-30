import { Disposable, OptionalDisposables } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';
import { map } from 'john-smith/reactive/transformers/map';
import { DomElement } from 'john-smith/view';
import { Null, Value } from 'john-smith/view/components';
import { DomEngine } from 'john-smith/view/dom-engine';
import DialogViewBase from '../dialog-view-base';
import { ConfigurationState, ScheduleJobViewModel } from './schedule-job-view-model';
import { GroupConfigurationStep } from './steps/group-configuration-step';
import { GroupConfigurationStepView } from './steps/group-configuration-step-view';
import { JobConfigurationStep } from './steps/job-configuration-step';
import { JobConfigurationStepView } from './steps/job-configuration-step-view';
import { TriggerConfigurationStep } from './steps/trigger-configuration-step';
import { TriggerConfigurationStepView } from './steps/trigger-configuration-step-view';

export class ScheduleJobView
  extends DialogViewBase<boolean, ScheduleJobViewModel>
  implements Disposable
{
  public constructor(viewModel: ScheduleJobViewModel) {
    super(viewModel, 'Schedule Job');
  }

  public onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
    this.viewModel.initState();

    return super.onInit(root, domEngine);
  }

  public dispose() {
    this.viewModel.dispose();
  }

  protected getBodyContent(): JSX.IElement {
    return (
      <div class="dialog-content dialog-content-no-padding">
        <Value
          view={(state) => {
            if (state === 'ready') {
              return (
                <div class="js_stateReady">
                  <Value
                    view={(currentStep) => {
                      if (currentStep.code === 'group') {
                        return (
                          <Value
                            view={GroupConfigurationStepView}
                            model={currentStep as GroupConfigurationStep}
                          ></Value>
                        );
                      }

                      if (currentStep.code === 'job') {
                        return (
                          <Value
                            view={JobConfigurationStepView}
                            model={currentStep as JobConfigurationStep}
                          ></Value>
                        );
                      }

                      if (currentStep.code === 'trigger') {
                        return (
                          <Value
                            view={TriggerConfigurationStepView}
                            model={currentStep as TriggerConfigurationStep}
                          ></Value>
                        );
                      }
                    }}
                    model={this.viewModel.currentStep}
                  ></Value>
                  <div class="js_stepGroup"></div>

                  <div class="js_stepJob"></div>

                  <div class="js_stepTrigger"></div>
                </div>
              );
            }

            if (state === ConfigurationState.Error) {
              return (
                <div class="js_stateError dialog-global-error">
                  Can not schedule a job as no allowed job types provided. <br />
                  Please make sure you configured allowed job types.
                </div>
              );
            }

            return <div class="js_stateLoading dialog-loading-message">Loading...</div>;
          }}
          model={this.viewModel.state}
        ></Value>
      </div>
    );
  }

  protected getFooterContent(): JSX.IElement {
    const backButtonLabel = map(this.viewModel.previousStep, (prevStep) => {
      if (prevStep === null) {
        return 'Cancel';
      }

      return '← ' + prevStep.navigationLabel;
    });

    const shaking = new ObservableValue<boolean>(false);
    let shakingTimer: ReturnType<typeof setTimeout> | null = null;

    const clickHandler = () => {
      if (!this.viewModel.goNextOrSave()) {
        shaking.setValue(true);

        if (shakingTimer !== null) {
          clearTimeout(shakingTimer);
        }

        shakingTimer = setTimeout(() => {
          shaking.setValue(false);
          shakingTimer = null;
        }, 1000);
      }
    };

    return (
      <footer class="cq-dialog-footer">
        <a href="#" class="btn btn-secondary" _click={this.viewModel.goBackOrCancel}>
          {backButtonLabel}
        </a>
        <span class="flex-fill"></span>
        <button
          class="btn btn-primary"
          disabled={map(this.viewModel.isSaving, (saving) => (saving ? 'disabled' : undefined))}
          $className={{ 'effects-shake': shaking }}
          _click={clickHandler}
        >
          <Null view={() => <span>Save</span>} model={this.viewModel.nextStep}></Null>
          <Value view={() => <span>Next &rarr;</span>} model={this.viewModel.nextStep}></Value>
        </button>
      </footer>
    );
  }
}
