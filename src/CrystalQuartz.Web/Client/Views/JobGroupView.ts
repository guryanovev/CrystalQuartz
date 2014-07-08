/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 

class JobGroupView implements js.IView<JobGroupViewModel> {
    template = "#JobGroupView";

    init(dom: js.IDom, viewModel: JobGroupViewModel) {
        dom('header h2').observes(viewModel.name);
    }
}  