/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/>

class TriggerDialogView implements js.IView<TriggerDialogViewModel> {
    template = '#TriggerDialogView';

    init(dom: js.IDom, viewModel: TriggerDialogViewModel) {
        dom('.cancel').on('click').react(viewModel.cancel);
        dom('.save').on('click').react(viewModel.save);
    }
}