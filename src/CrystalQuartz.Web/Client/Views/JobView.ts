/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 

class JobView implements js.IView<JobViewModel> {
    template = "#JobView";

    init(dom: js.IDom, viewModel: JobViewModel) {
        dom('header h3').observes(viewModel.name);
    }
}   