import ViewModel from './trigger-dialog-view-model';
import { Validators } from './trigger-dialog-view-model';

import ViewBase from '../dialog-view-base';
import { JobDataMapItemView } from '../common/job-data-map-item-view';

import TEMPLATE from './trigger-dialog.tmpl.html';

class ValidationError implements js.IView<string> {
    template = '<li></li>';

    init(dom: js.IDom, viewModel: string) {
        dom('li').observes(viewModel);
    }
}

class ValidatorView implements js.IView<{ errors: js.IObservable<string[]> }> {
    template = '<ul class="cq-validator"></ul>';
    init(dom: js.IDom, viewModel: { errors: js.IObservable<string[]> }) {
        dom('ul').observes(viewModel.errors, ValidationError);
    }
}

export default class TriggerDialogView extends ViewBase<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: ViewModel) {
        super.init(dom, viewModel);

        dom('.triggerName').observes(viewModel.triggerName);
        dom('.triggerType').observes(viewModel.triggerType);
        dom('.repeatForever').observes(viewModel.repeatForever);

        var $repeatCount = dom('.repeatCount');
        dom('.repeatIntervalType').observes(viewModel.repeatIntervalType);

        this.valueAndValidator(
            dom('.cronExpression'),
            dom('.cronExpressionContainer'),
            viewModel.cronExpression,
            viewModel.validators);

        this.valueAndValidator(
            dom('.repeatInterval'),
            dom('.repeatIntervalContainer'),
            viewModel.repeatInterval,
            viewModel.validators);

        this.valueAndValidator(
            dom('.repeatCount'),
            dom('.repeatCountContainer'),
            viewModel.repeatCount,
            viewModel.validators);

        var $simpleTriggerDetails = dom('.simpleTriggerDetails');
        var $cronTriggerDetails = dom('.cronTriggerDetails');

        var triggersUi = [
            { code: 'Simple', element: $simpleTriggerDetails.$ },
            { code: 'Cron', element: $cronTriggerDetails.$ }
        ];

        viewModel.triggerType.listen(value => {
            for (var i = 0; i < triggersUi.length; i++) {
                var triggerData = triggersUi[i];
                if (triggerData.code === value) {
                    triggerData.element.show();
                } else {
                    triggerData.element.hide();
                }
            }
        });

        const $saveButton = dom('.save');
        dom('.cancel').on('click').react(viewModel.cancel);
        $saveButton.on('click').react(() => {
            if (viewModel.isSaving.getValue()) {
                return;
            }

            const isValid = viewModel.save();
            if (!isValid) {
                $saveButton.$.addClass("effects-shake");
                setTimeout(() => {
                    $saveButton.$.removeClass("effects-shake");
                }, 2000);
            }
        });

        viewModel.repeatForever.listen(value => {
            $repeatCount.$.prop('disabled', value);
        });

        var saveText;
        viewModel.isSaving.listen((value: boolean) => {
            if (value) {
                saveText = $saveButton.$.text();
                $saveButton.$.text('...');
            } else if (saveText) {
                $saveButton.$.text(saveText);
            }
        });

        viewModel.repeatIntervalType.setValue('Milliseconds');
        viewModel.triggerType.setValue('Simple');

        //dom('.js_jobDataKey').observes(viewModel.newJobDataKey, { bidirectional: true, event: 'keyup' });

        this.valueAndValidator(
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

    private valueAndValidator(
        dom: js.IListenerDom,
        validatorDom: js.IListenerDom,
        source: js.IObservable<any>,
        validators: Validators,
        observationOptions: js.ListenerOptions = null) {

        dom.observes(source, observationOptions);
        var sourceValidator = validators.findFor(source);
        if (sourceValidator) {
            validatorDom.render(ValidatorView, <any>{ errors: sourceValidator.errors });

            sourceValidator.errors.listen(errors => {
                if (errors && errors.length > 0) {
                    dom.$.addClass('cq-error-control');
                } else {
                    dom.$.removeClass('cq-error-control');
                }
            });

            dom.on((observationOptions ? observationOptions.event : null) || 'blur').react(sourceValidator.makeDirty, sourceValidator);
        }
    }
}