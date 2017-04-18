/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/>

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

class TriggerDialogView implements js.IView<TriggerDialogViewModel> {
    template = '#TriggerDialogView';

    init(dom: js.IDom, viewModel: TriggerDialogViewModel) {
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

        dom('.cancel').on('click').react(viewModel.cancel);
        dom('.save').on('click').react(() => {
            viewModel.save();
        });

        viewModel.repeatForever.listen(value => {
            $repeatCount.$.prop('disabled', value);
        });

        viewModel.repeatIntervalType.setValue('Milliseconds');
        viewModel.triggerType.setValue('Simple');
    }

    private valueAndValidator(
        dom: js.IListenerDom,
        validatorDom: js.IListenerDom,
        source: js.IObservable<any>,
        validators: Validators) {

        dom.observes(source);
        var sourceValidator = validators.findFor(source);
        if (sourceValidator) {
            validatorDom.render(ValidatorView, <any> { errors: sourceValidator.errors });

            sourceValidator.errors.listen(errors => {
                if (errors && errors.length > 0) {
                    dom.$.addClass('cq-error-control');
                } else {
                    dom.$.removeClass('cq-error-control');
                }
            });

            dom.on('blur').react(sourceValidator.makeDirty, sourceValidator);
        }
    }
}