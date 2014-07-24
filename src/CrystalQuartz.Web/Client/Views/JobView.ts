/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="AbstractActivityView.ts"/> 
/// <reference path="TriggerView.ts"/> 
/// <reference path="JobDetailsView.ts"/> 

class JobView extends ActivityView<Job> {
    template = "#JobView";

    init(dom: js.IDom, viewModel: JobViewModel) {
        super.init(dom, viewModel);

        var $$hideDetails = dom('.hideDetails');

        viewModel.details.listen((value) => {
            if (value) {
                $$hideDetails.$.fadeIn();
            } else {
                $$hideDetails.$.fadeOut();
            }
        });

        dom('.triggers tbody').observes(viewModel.triggers, TriggerView);
        dom('.detailsContainer').observes(viewModel.details, JobDetailsView);

        dom('.loadDetails').on('click').react(viewModel.loadJobDetails);
        dom('.actions .execute').on('click').react(viewModel.executeNow);
        
        $$hideDetails.on('click').react(viewModel.clearJobDetails);
    }
}   