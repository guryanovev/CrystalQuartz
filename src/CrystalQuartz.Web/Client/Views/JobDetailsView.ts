/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="TriggerView.ts"/> 
/// <reference path="_Propertry.ts"/> 

class JobDetailsView implements js.IView<JobDetails> {
    template = "#JobDetailsView";

    init(dom: js.IDom, viewModel: JobDetails) {
        dom('.properties').observes(viewModel.JobProperties, PropertyView);
    }
}   