/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="SchedulerView.ts"/> 
/// <reference path="ErrorView.ts"/> 
/// <reference path="../Views/JobGroupView.ts"/> 
/// <reference path="../Views/CommandProgressView.ts"/> 

class ApplicationView implements js.IView<ApplicationViewModel> {
    template = "#ApplicationView";

    init(dom: js.IDom, viewModel: ApplicationViewModel) {
        viewModel.environment.listen((value) => {
            if (value) {
                dom('#selfVersion').$.text(value.SelfVersion);
                dom('#quartzVersion').$.text(value.QuartzVersion);
                dom('#dotNetVersion').$.text(value.DotNetVersion);

                if (value.CustomCssUrl) {
                    var fileref = $("<link/>");
                    fileref.attr("rel", "stylesheet");
                    fileref.attr("type", "text/css");
                    fileref.attr("href", value.CustomCssUrl);

                    dom.$.closest('html').find('head').append(fileref);
                }
            }
        });

        dom('#schedulerName').observes(viewModel.scheduler.name);

        dom('#schedulerPropertiesContainer').observes(viewModel.scheduler, SchedulerView);
        dom('#jobsContainer').observes(viewModel.jobGroups, JobGroupView);

        dom('#commandIndicator').render(CommandProgressView, viewModel.getCommandProgress());
        dom('#error').render(ErrorView, viewModel.getError());
        dom('#autoUpdateMessage').observes(viewModel.autoUpdateMessage);

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