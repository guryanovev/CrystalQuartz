/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 

class TriggerView implements js.IView<TriggerViewModel> {
    template = "#TriggerView";

    init(dom: js.IDom, viewModel: TriggerViewModel) {
        dom('.name').observes(viewModel.name);
    }
}   