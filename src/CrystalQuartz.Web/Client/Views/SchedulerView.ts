/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 

class SchedulerView implements js.IView<SchedulerViewModel> {
    template = "#SchedulerView";

    init(dom: js.IDom, viewModel: SchedulerViewModel) {
        dom('.schedulerName').observes(viewModel.name);
        dom('.instanceId').observes(viewModel.instanceId);
        dom('.isRemote').observes(viewModel.isRemote);
        dom('.schedulerType').observes(viewModel.schedulerType);
        dom('.runningSince').observes(viewModel.runningSince, NullableDateView);
        dom('.totalJobs').observes(viewModel.jobsTotal);
        dom('.executedJobs').observes(viewModel.jobsExecuted);

        dom('.status span').$
            .addClass(viewModel.status)
            .attr('title', 'Status: ' + viewModel.status);
    }
} 