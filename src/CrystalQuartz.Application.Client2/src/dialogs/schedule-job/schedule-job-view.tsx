// import TEMPLATE from './schedule-job.tmpl.html';
import { Value } from 'john-smith/view/components';
import DialogViewBase from '../dialog-view-base';
import { ConfigarationState, ScheduleJobViewModel } from './schedule-job-view-model';
import { DomElement } from 'john-smith/view';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OptionalDisposables } from 'john-smith/common';
import { GroupConfigurationStepView } from './steps/group-configuration-step-view';
import { GroupConfigurationStep } from './steps/group-configuration-step';

// import __each from 'lodash/each';

// import {CHANGE_DOM_DISPLAY} from './steps/view-commons';
// import {GroupConfigurationStepView} from './steps/group-configuration-step-view';
// import {JobConfigurationStepView} from './steps/job-configuration-step-view';
// import {TriggerConfigurationStepView} from './steps/trigger-configuration-step-view';
// import {GroupConfigurationStep} from './steps/group-configuration-step';

export class ScheduleJobView extends DialogViewBase<ScheduleJobViewModel> {
    constructor(viewModel: ScheduleJobViewModel) {
        super(viewModel, 'Schedule Job');
    }


    onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
        this.viewModel.initState();

        return super.onInit(root, domEngine);
    }

    protected getBodyContent(): JSX.IElement {
        return <div class="dialog-content dialog-content-no-padding">
            <Value view={state => {
                if (state === 'ready') {
                    return <div class="js_stateReady">
                        <Value view={currentStep => {
                            if (currentStep.code === 'group') {
                                return <Value view={GroupConfigurationStepView} model={currentStep as GroupConfigurationStep}></Value>
                            }
                        }} model={this.viewModel.currentStep}></Value>
                        <div class="js_stepGroup"></div>

                        <div class="js_stepJob"></div>

                        <div class="js_stepTrigger"></div>
                    </div>;
                }

                if (state === ConfigarationState.Error) {
                    return <div class="js_stateError dialog-global-error">
                        Can not schedule a job as no allowed job types provided. <br/>
                        Please make sure you configured allowed job types.
                    </div>;
                }

                return <div class="js_stateLoading dialog-loading-message">Loading...</div>
            }} model={this.viewModel.state}></Value>
        </div>;
    }


    protected getFooterContent(): JSX.IElement {
        return <footer class="cq-dialog-footer">
            <a href="#" class="js_backButton button pull-left" _click={this.viewModel.goNextOrSave}>
                <Value view={nextStep => {
                    if (nextStep) {
                        return <span>Next &rarr;</span>;
                    }

                    return <span>Save</span>;
                }} model={this.viewModel.nextStep}></Value>
            </a>

            <a href="#" class="js_nextButton button button-primary pull-right"></a>
        </footer>;
    }

// template = TEMPLATE;
    //
    // init(dom: js.IDom, viewModel: ScheduleJobViewModel): void {
    //     super.init(dom, viewModel);
    //
    //     const
    //         $nextButton = dom('.js_nextButton'),
    //         $backButton = dom('.js_backButton');
    //
    //     const steps = [
    //         { code: 'group', dom: dom('.js_stepGroup'), view: GroupConfigurationStepView },
    //         { code: 'job', dom: dom('.js_stepJob'), view: JobConfigurationStepView },
    //         { code: 'trigger', dom: dom('.js_stepTrigger'), view: TriggerConfigurationStepView }
    //     ];
    //
    //     const states = [
    //         { code: 'loading', dom: dom('.js_stateLoading') },
    //         { code: 'ready', dom: dom('.js_stateReady') },
    //         { code: 'error', dom: dom('.js_stateError') }
    //     ];
    //
    //     const renderedSteps: { [code: string]: boolean } = {};
    //
    //     dom.manager.manage(viewModel.state.listen(state => {
    //         CHANGE_DOM_DISPLAY(states, state);
    //     }));
    //
    //     dom.manager.manage(viewModel.currentStep.listen(currentStep => {
    //         if (!currentStep) {
    //             return;
    //         }
    //
    //         CHANGE_DOM_DISPLAY(steps, currentStep.code);
    //
    //         __each(steps, step => {
    //             if (step.code === currentStep.code && !renderedSteps[step.code]) {
    //                 var t = step.dom.render(step.view, currentStep);
    //                 t.init();
    //
    //                 renderedSteps[step.code] = true;
    //             }
    //         });
    //     }));
    //
    //     dom.manager.manage(viewModel.nextStep.listen(step => {
    //         $nextButton.$.html(step ? 'Next &rarr;' : 'Save');
    //     }));
    //
    //     dom.manager.manage(viewModel.previousStep.listen(step => {
    //         $backButton.$.html(step ? '&larr; ' + step.navigationLabel : 'Cancel');
    //     }));
    //
    //     $nextButton.on('click').react(() => {
    //         //            if (viewModel.isSaving.getValue()) {
    //         //                return;
    //         //            }
    //
    //         const isValid = viewModel.goNextOrSave();
    //         if (!isValid) {
    //             $nextButton.$.addClass("effects-shake");
    //             setTimeout(() => {
    //                 $nextButton.$.removeClass("effects-shake");
    //             }, 2000);
    //         }
    //     });
    //
    //     //$nextButton.on('click').react(viewModel.goNextOrSave);
    //     $backButton.on('click').react(viewModel.goBackOrCancel);
    // }
}
