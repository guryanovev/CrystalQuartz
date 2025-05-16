// import TEMPLATE from './trigger-configuration-step.tmpl.html';
import { SelectOptionView } from '../../common/select-option-view';
import { JobConfigurationStep } from './job-configuration-step';
import { JobType } from './job-configuration-step';
import {TriggerConfigurationStep} from './trigger-configuration-step';
import {JobDataMapItemView} from '../../common/job-data-map-item-view';
import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { OnInit } from 'john-smith/view/hooks';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OptionalDisposables } from 'john-smith/common';
import { Value } from 'john-smith/view/components/value';
import { map } from 'john-smith/reactive/transformers/map';
import { List } from 'john-smith/view/components/list';
import {ValidatorView} from "../../common/validation/validator-view";

export class TriggerConfigurationStepView implements View, OnInit {
    constructor(
        private readonly viewModel: TriggerConfigurationStep
    ) {
    }

    onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
    }

    template(): HtmlDefinition {
        return <div><h2 class="dialog-header">Trigger Configuration</h2>
        <form class="cq-form form-horizontal">
            <div class="cq-form-group row">
                <label for="triggerName" class="col col-sm-3 control-label">Trigger Name:</label>
                <div class="col-sm-9">
                    <input id="triggerName" type="text" class="triggerName form-control form-control-sm" $value={this.viewModel.triggerName}/>

                    <p class="cq-field-description">
                        Optional trigger friendly name. Quartz will generate a guid if empty.
                    </p>
                </div>
            </div>

            <div class="cq-form-separator"></div>

            <div class="cq-form-group row">
                <label for="triggerType" class="col col-sm-3 control-label">Trigger Type:</label>
                <div class="col col-sm-9">
                    <select id="triggerType" class="form-select form-select-sm triggerType" $value={this.viewModel.triggerType}>
                        <option value="Simple">Simple</option>
                        <option value="Cron">Cron</option>
                    </select>
                </div>
            </div>

            <Value view={triggerType => {
                if (triggerType === 'Simple') {
                    return <div class="simpleTriggerDetails">
                        <div class="cq-form-group row">
                            <label for="repeatCount" class="col col-sm-3 col-xs-12 control-label">
                                Repeat Count
                                <Value view={repeatForever => repeatForever ? undefined : <sup>*</sup>} model={this.viewModel.repeatForever}></Value>:
                            </label>
                            <div class="col col-sm-5 col-xs-8 repeatCountContainer">
                                <input
                                    id="repeatCount"
                                    type="text"
                                    class="form-control form-control-sm repeatCount"
                                    disabled={map(this.viewModel.repeatForever, value => value ? 'disabled' : undefined)}
                                    $className={{'cq-error-control': this.viewModel.repeatCountValidator.failed }}
                                    $value={this.viewModel.repeatCount}
                                />
                                <Value view={ValidatorView} model={this.viewModel.repeatCountValidator}></Value>
                            </div>
                            <div class="col col-sm-4 col-xs-4">
                                <div class="form-check">
                                    <input id="repeatForever"
                                           type="checkbox"
                                           class="form-check-input"
                                           $checked={this.viewModel.repeatForever}/>
                                    <label class="form-check-label" for="repeatForever">
                                        Repeat forever
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="cq-form-group row">
                            <label class="col col-sm-3 col-xs-12 control-label" for="repeatInterval">Repeat
                                Every<sup>*</sup>:</label>

                            <div class="col col-sm-5 col-xs-6 repeatIntervalContainer">
                                <input
                                    id="repeatInterval"
                                    type="text"
                                    class="form-control form-control-sm repeatInterval"
                                    $className={{'cq-error-control': this.viewModel.repeatIntervalValidator.failed }}
                                    $value={this.viewModel.repeatInterval}/>
                                <Value view={ValidatorView} model={this.viewModel.repeatIntervalValidator}></Value>
                            </div>

                            <div class="col col-sm-4 col-xs-6">
                                <select
                                    class="form-select form-select-sm repeatIntervalType"
                                    $value={this.viewModel.repeatIntervalType}>
                                    <option>Milliseconds</option>
                                    <option>Seconds</option>
                                    <option>Minutes</option>
                                    <option>Hours</option>
                                    <option>Days</option>
                                </select>
                            </div>
                        </div>
                    </div>;
                }

                if (triggerType === 'Cron') {
                    return <div class="cronTriggerDetails">
                        <div class="cq-form-group row">
                            <label for="cronExpression" class="col col-sm-3 control-label">Cron Expression<sup>*</sup>:</label>
                            <div class="col col-sm-9">
                                <input
                                    id="cronExpression"
                                    type="text"
                                    class="form-control form-control-sm cronExpression"
                                    $className={{'cq-error-control': this.viewModel.cronExpressionValidator.failed }}
                                    $value={this.viewModel.cronExpression}/>
                                <Value view={ValidatorView} model={this.viewModel.cronExpressionValidator}></Value>
                                <p class="cq-field-description">
                                    Read more about cron format at <a target="_blank"
                                                                      href="https://www.quartz-scheduler.net/documentation/quartz-2.x/tutorial/crontrigger.html">Quartz.NET
                                    docs</a>
                                </p>
                            </div>
                        </div>
                    </div>;
                }
            }} model={this.viewModel.triggerType}></Value>

            <div class="cq-form-separator"></div>

            <div class="cq-form-group row">
                <label for="cronExpression" class="col col-sm-3 control-label">Job Data Map:</label>

                <div class="col col-sm-5 js_jobDataKeyContainer">
                    <input
                        type="text"
                        class="js_jobDataKey form-control form-control-sm"
                        placeholder="Enter new key"
                        $value={[this.viewModel.newJobDataKey, 'input']}/>
                </div>

                <div class="col col-sm-4">
                    <button
                        class="btn btn-light btn-sm"
                        disabled={map(this.viewModel.canAddJobDataKey, value => value ? undefined : 'disabled')}
                        _click={() => this.viewModel.addJobDataMapItem()}>Add Key</button>
                </div>
            </div>

            <Value view={jobDataMapKeys => {
                if (jobDataMapKeys > 0) {
                    return <div class="cq-form-group row">
                        <section class="col col-sm-3"></section>
                        <section class="col col-sm-9">
                            <table class="job-data-map-input">
                                <thead>
                                <tr>
                                    <th>Key</th>
                                    <th>Type</th>
                                    <th>Value</th>
                                    <th class="job-data-remove"></th>
                                </tr>
                                </thead>
                                <tbody class="js_jobDataMap">
                                    <List view={JobDataMapItemView} model={this.viewModel.jobDataMap}></List>
                                </tbody>
                            </table>
                        </section>
                    </div>;
                }
            }} model={this.viewModel.jobDataMap.count()}></Value>
        </form>
        </div>;
    }
}

// export class TriggerConfigurationStepView implements js.IView<TriggerConfigurationStep> {
//     template = TEMPLATE;
//
//     init(dom: js.IDom, viewModel: TriggerConfigurationStep): void {
//         dom('.triggerName').observes(viewModel.triggerName);
//         dom('.triggerType').observes(viewModel.triggerType);
//         dom('.repeatForever').observes(viewModel.repeatForever);
//
//         var $repeatCount = dom('.repeatCount');
//         dom('.repeatIntervalType').observes(viewModel.repeatIntervalType);
//
//         RENDER_VALIDATOR(
//             dom('.cronExpression'),
//             dom('.cronExpressionContainer'),
//             viewModel.cronExpression,
//             viewModel.validators);
//
//         RENDER_VALIDATOR(
//             dom('.repeatInterval'),
//             dom('.repeatIntervalContainer'),
//             viewModel.repeatInterval,
//             viewModel.validators);
//
//         RENDER_VALIDATOR(
//             dom('.repeatCount'),
//             dom('.repeatCountContainer'),
//             viewModel.repeatCount,
//             viewModel.validators);
//
//         var $simpleTriggerDetails = dom('.simpleTriggerDetails');
//         var $cronTriggerDetails = dom('.cronTriggerDetails');
//
//         var triggersUi = [
//             { code: 'Simple', dom: $simpleTriggerDetails },
//             { code: 'Cron', dom: $cronTriggerDetails }
//         ];
//
//         dom.manager.manage(viewModel.triggerType.listen(value => {
//             CHANGE_DOM_DISPLAY(triggersUi, value);
//
// //            for (var i = 0; i < triggersUi.length; i++) {
// //                var triggerData = triggersUi[i];
// //                if (triggerData.code === value) {
// //                    triggerData.element.show();
// //                } else {
// //                    triggerData.element.hide();
// //                }
// //            }
//         }));
//
// //        const $saveButton = dom('.save');
// //        dom('.cancel').on('click').react(viewModel.cancel);
// //        $saveButton.on('click').react(() => {
// //            if (viewModel.isSaving.getValue()) {
// //                return;
// //            }
// //
// //            const isValid = viewModel.save();
// //            if (!isValid) {
// //                $saveButton.$.addClass("effects-shake");
// //                setTimeout(() => {
// //                    $saveButton.$.removeClass("effects-shake");
// //                }, 2000);
// //            }
// //        });
//
//         dom.manager.manage(viewModel.repeatForever.listen(value => {
//             $repeatCount.$.prop('disabled', value);
//         }));
//
// //        var saveText;
// //        viewModel.isSaving.listen((value: boolean) => {
// //            if (value) {
// //                saveText = $saveButton.$.text();
// //                $saveButton.$.text('...');
// //            } else if (saveText) {
// //                $saveButton.$.text(saveText);
// //            }
// //        });
//
//         viewModel.repeatIntervalType.setValue('Milliseconds'); // todo: move to vm
//         viewModel.triggerType.setValue('Simple');
//
//         RENDER_VALIDATOR(
//             dom('.js_jobDataKey'),
//             dom('.js_jobDataKeyContainer'),
//             viewModel.newJobDataKey,
//             viewModel.validators,
//             { bidirectional: true, event: 'keyup' });
//
//         let $jobDataMapSection = dom('.js_jobDataMapSection');
//         let $jobDataMap = dom('.js_jobDataMap');
//         $jobDataMap.observes(viewModel.jobDataMap, JobDataMapItemView);
//
//         let $addJobDataKeyButton = dom('.js_addJobDataMapItem');
//         $addJobDataKeyButton.on('click').react(viewModel.addJobDataMapItem);
//
//         dom.manager.manage(viewModel.canAddJobDataKey.listen(value => $addJobDataKeyButton.$.prop('disabled', !value)));
//         dom.manager.manage(viewModel.jobDataMap.count().listen(itemsCount => {
//             $jobDataMapSection.$.css('display', itemsCount > 0 ? 'block' : 'none');
//         }));
//     }
// }
