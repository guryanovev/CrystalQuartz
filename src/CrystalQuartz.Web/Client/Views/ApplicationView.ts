/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="SchedulerView.ts"/> 
/// <reference path="../Views/JobGroupView.ts"/> 
/// <reference path="../Views/CommandProgressView.ts"/> 

class ApplicationView implements js.IView<ApplicationViewModel> {
    template = "#ApplicationView";

    init(dom: js.IDom, viewModel: ApplicationViewModel) {
        dom('#schedulerName').observes(viewModel.scheduler.name);

        dom('#schedulerPropertiesContainer').observes(viewModel.scheduler, SchedulerView);
        dom('#jobsContainer').observes(viewModel.jobGroups, JobGroupView);

        dom('#commandIndicator').render(CommandProgressView, viewModel.getCommandProgress());

        var $status = dom('#schedulerStatus').$;
        viewModel.scheduler.status.listen((newValue: string, oldValue?: string) => {
            if (oldValue) {
                $status.removeClass(oldValue);
            }

            if (newValue) {
                $status.addClass(newValue);
            }

            $status.attr('title', 'Status: ' + newValue);
        }, true);
    }
}