/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="SchedulerView.ts"/> 
/// <reference path="../Views/JobGroupView.ts"/> 
/// <reference path="../Views/CommandProgressView.ts"/> 

class ApplicationView implements js.IView<ApplicationViewModel> {
    template = "#ApplicationView";

    init(dom: js.IDom, viewModel: ApplicationViewModel) {
        dom('#schedulerPropertiesContainer').observes(viewModel.scheduler, SchedulerView);
        dom('#jobsContainer').observes(viewModel.jobGroups, JobGroupView);

        dom('#dialogs').render(CommandProgressView, viewModel.getCommandProgress());
    }
}