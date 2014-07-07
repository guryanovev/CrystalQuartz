/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 

class ApplicationView implements js.IView<ApplicationViewModel> {
    template = "#ApplicationView";

    init(dom: js.IDom, viewModel: ApplicationViewModel) {
        dom('#schedulerName').observes(viewModel.schedulerName);
    }
}