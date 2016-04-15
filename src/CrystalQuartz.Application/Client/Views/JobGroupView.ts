/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="AbstractActivityView.ts"/> 
/// <reference path="JobView.ts"/> 
/// <reference path="_ActivityStatus.ts"/> 

class JobGroupView extends ActivityView<JobGroup> {
    template = "#JobGroupView";

    init(dom: js.IDom, viewModel: JobGroupViewModel) {
        super.init(dom, viewModel);
        dom('.content').observes(viewModel.jobs, JobView);
        dom.onUnrender().listen(() => {
            dom.$.fadeOut();
        });
    }
}  