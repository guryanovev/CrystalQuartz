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

        var $status = dom('.status span').$;
        viewModel.status.listen((newValue: string, oldValue?: string) => {
            if (oldValue) {
                $status.removeClass(oldValue);
            }

            if (newValue) {
                $status.addClass(newValue);
            }

            $status.attr('title', 'Status: ' + viewModel.status);
        }, true);

        dom('#startSchedulerButton').on('click').react(viewModel.startScheduler);
        dom('#stopSchedulerButton').on('click').react(() => {
            if (confirm('Are you sure you want to shutdown scheduler?')) {
                viewModel.stopScheduler();
            }
        });
    }
} 