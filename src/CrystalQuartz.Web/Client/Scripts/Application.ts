/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="Models.ts"/>
/// <reference path="ViewModels.ts"/>
/// <reference path="Services.ts"/>
/// <reference path="../Views/ApplicationView.ts"/>

class Application {
    run() {
        var schedulerService = new SchedulerService();
        var applicationViewModel = new ApplicationViewModel();

        schedulerService.getData().done(data => {
            applicationViewModel.setData(data);
        });
        
        js.dom('#application').render(ApplicationView, applicationViewModel);
    }
}

new Application().run();