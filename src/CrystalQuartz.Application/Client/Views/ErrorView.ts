/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="TriggerView.ts"/> 
/// <reference path="_Propertry.ts"/> 

class ErrorView implements js.IView<ErrorViewModel> {
    template = '#ErrorView';

    init(dom: js.IDom, viewModel: ErrorViewModel) {
        viewModel.isActive.listen((value) => {
            if (value) {
                dom.$.fadeIn();
            } else {
                dom.$.fadeOut();
            }
        });

        viewModel.details.listen((value) => {
            if (value && value.length > 0) {
                dom('#errorDetails').$.show();
            } else {
                dom('#errorDetails').$.hide();
            }
        });

        dom('#errorDetails tbody').observes(viewModel.details, PropertyView);
        dom('#errorMessage').observes(viewModel.message);
        dom('.close').on('click').react(viewModel.clear);
    }
}    