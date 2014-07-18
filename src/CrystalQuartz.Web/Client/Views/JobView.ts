/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="AbstractActivityView.ts"/> 
/// <reference path="TriggerView.ts"/> 
/// <reference path="JobDetailsView.ts"/> 

class JobView extends ActivityView<Job> {
    template = "#JobView";

    init(dom: js.IDom, viewModel: JobViewModel) {
        super.init(dom, viewModel);

//        dom('.title').observes(viewModel.name);
        dom('.triggers tbody').observes(viewModel.triggers, TriggerView);
        dom('.detailsContainer').observes(viewModel.details, JobDetailsView);
//        dom('.statusContainer').observes(viewModel, ActivityStatusView2);

        dom('.loadDetails').on('click').react(viewModel.loadJobDetails);
//        dom('.actions .pause').on('click').react(viewModel.pause);
//        dom('.actions .resume').on('click').react(viewModel.resume);
        dom('.actions .execute').on('click').react(viewModel.executeNow);
    }
}   