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

        var $$start = dom('#startSchedulerButton');
        var $$stop = dom('#stopSchedulerButton');
        var $$refresh = dom('#refreshData');

        viewModel.canStart.listen((value) => {
            if (value) {
                $$start.$.removeClass('disabled');
            } else {
                $$start.$.addClass('disabled');
            }
        });

        viewModel.canShutdown.listen((value) => {
            if (value) {
                $$stop.$.removeClass('disabled');
            } else {
                $$stop.$.addClass('disabled');
            }
        });

        $$start.on('click').react(viewModel.startScheduler);
        $$stop.on('click').react(() => {
            if (confirm('Are you sure you want to shutdown scheduler?')) {
                viewModel.stopScheduler();
            }
        });

        $$refresh.on('click').react(() => {
            viewModel.refreshData();
        });
    }

    private handleClick(link: js.IListenerDom, callback: () => void, viewModel: any) {
        var $link = link.$;
        link.on('click').react(() => {
            if (!$link.is('.disabled')) {
                callback.call(viewModel);
            }
        });
    }
} 