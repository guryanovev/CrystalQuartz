/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="TriggerView.ts"/> 
/// <reference path="JobDetailsView.ts"/> 

class JobView implements js.IView<JobViewModel> {
    template = "#JobView";

    init(dom: js.IDom, viewModel: JobViewModel) {
        dom('.title').observes(viewModel.name);
        dom('.triggers tbody').observes(viewModel.triggers, TriggerView);
        dom('.detailsContainer').observes(viewModel.details, JobDetailsView);
        dom('.statusContainer').observes(viewModel, ActivityStatusView2);

        dom('.loadDetails').on('click').react(viewModel.loadJobDetails);
    }
}   