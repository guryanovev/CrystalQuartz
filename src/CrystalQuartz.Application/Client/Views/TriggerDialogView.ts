/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/>

class TriggerDialogView implements js.IView<TriggerDialogViewModel> {
    template = '#TriggerDialogView';

    init(dom: js.IDom, viewModel: TriggerDialogViewModel) {
        dom('.triggerName').observes(viewModel.triggerName);
        dom('.triggerType').observes(viewModel.triggerType);
        dom('.repeatForever').observes(viewModel.repeatForever);

        var $repeatCount = dom('.repeatCount');
        $repeatCount.observes(viewModel.repeatCount);
        dom('.repeatInterval').observes(viewModel.repeatInterval);
        dom('.repeatIntervalType').observes(viewModel.repeatIntervalType);
        dom('.cronExpression').observes(viewModel.cronExpression);

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

        var $$root = dom.root.$;
        dom('.cancel').on('click').react(viewModel.cancel);
        dom('.save').on('click').react(() => {
            var validationResult = viewModel.save();
            for (var field in validationResult) {
                var $field = $$root.find('.' + field);
                $field.addClass('cq-error-control');
                $field.parent().append('<div class="validation-message">' + validationResult[field] + '</div>');
            }
        });

        viewModel.repeatForever.listen(value => {
            $repeatCount.$.prop('disabled', value);
        });

        viewModel.repeatIntervalType.setValue('Milliseconds');
        viewModel.triggerType.setValue('Simple');
    }
}