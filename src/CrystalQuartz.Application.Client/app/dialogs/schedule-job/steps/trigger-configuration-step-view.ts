import TEMPLATE from './trigger-configuration-step.tmpl.html';
import { SelectOptionView } from '../../common/select-option-view';
import { CHANGE_DOM_DISPLAY } from './view-commons';
import { JobConfigurationStep } from './job-configuration-step';
import { JobType } from './job-configuration-step';
import {TriggerConfigurationStep} from './trigger-configuration-step';
import {JobDataMapItemView} from '../../common/job-data-map-item-view';
import {RENDER_VALIDATOR} from '../../common/validation/render-validator';

export class TriggerConfigurationStepView implements js.IView<TriggerConfigurationStep> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: TriggerConfigurationStep): void {
        dom('.triggerName').observes(viewModel.triggerName);
        dom('.triggerType').observes(viewModel.triggerType);
        dom('.repeatForever').observes(viewModel.repeatForever);

        var $repeatCount = dom('.repeatCount');
        dom('.repeatIntervalType').observes(viewModel.repeatIntervalType);

        RENDER_VALIDATOR(
            dom('.cronExpression'),
            dom('.cronExpressionContainer'),
            viewModel.cronExpression,
            viewModel.validators);

        RENDER_VALIDATOR(
            dom('.repeatInterval'),
            dom('.repeatIntervalContainer'),
            viewModel.repeatInterval,
            viewModel.validators);

        RENDER_VALIDATOR(
            dom('.repeatCount'),
            dom('.repeatCountContainer'),
            viewModel.repeatCount,
            viewModel.validators);

        var $simpleTriggerDetails = dom('.simpleTriggerDetails');
        var $cronTriggerDetails = dom('.cronTriggerDetails');

        var triggersUi = [
            { code: 'Simple', dom: $simpleTriggerDetails },
            { code: 'Cron', dom: $cronTriggerDetails }
        ];

        dom.manager.manage(viewModel.triggerType.listen(value => {
            CHANGE_DOM_DISPLAY(triggersUi, value);

//            for (var i = 0; i < triggersUi.length; i++) {
//                var triggerData = triggersUi[i];
//                if (triggerData.code === value) {
//                    triggerData.element.show();
//                } else {
//                    triggerData.element.hide();
//                }
//            }
        }));

//        const $saveButton = dom('.save');
//        dom('.cancel').on('click').react(viewModel.cancel);
//        $saveButton.on('click').react(() => {
//            if (viewModel.isSaving.getValue()) {
//                return;
//            }
//
//            const isValid = viewModel.save();
//            if (!isValid) {
//                $saveButton.$.addClass("effects-shake");
//                setTimeout(() => {
//                    $saveButton.$.removeClass("effects-shake");
//                }, 2000);
//            }
//        });

        dom.manager.manage(viewModel.repeatForever.listen(value => {
            $repeatCount.$.prop('disabled', value);
        }));

//        var saveText;
//        viewModel.isSaving.listen((value: boolean) => {
//            if (value) {
//                saveText = $saveButton.$.text();
//                $saveButton.$.text('...');
//            } else if (saveText) {
//                $saveButton.$.text(saveText);
//            }
//        });

        viewModel.repeatIntervalType.setValue('Milliseconds'); // todo: move to vm
        viewModel.triggerType.setValue('Simple');

        RENDER_VALIDATOR(
            dom('.js_jobDataKey'),
            dom('.js_jobDataKeyContainer'),
            viewModel.newJobDataKey,
            viewModel.validators,
            { bidirectional: true, event: 'keyup' });

        let $jobDataMapSection = dom('.js_jobDataMapSection');
        let $jobDataMap = dom('.js_jobDataMap');
        $jobDataMap.observes(viewModel.jobDataMap, JobDataMapItemView);

        let $addJobDataKeyButton = dom('.js_addJobDataMapItem');
        $addJobDataKeyButton.on('click').react(viewModel.addJobDataMapItem);

        dom.manager.manage(viewModel.canAddJobDataKey.listen(value => $addJobDataKeyButton.$.prop('disabled', !value)));
        dom.manager.manage(viewModel.jobDataMap.count().listen(itemsCount => {
            $jobDataMapSection.$.css('display', itemsCount > 0 ? 'block' : 'none');
        }));
    }
}