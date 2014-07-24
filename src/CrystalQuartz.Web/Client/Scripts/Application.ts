/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="Models.ts"/>
/// <reference path="ViewModels.ts"/>
/// <reference path="Services.ts"/>
/// <reference path="../Views/_NullableDate.ts"/>
/// <reference path="../Views/ApplicationView.ts"/>
/// <reference path="../Views/SchedulerView.ts"/>

class Application {
    run() {
        var applicationModel = new ApplicationModel();

        var schedulerService = new SchedulerService();
        var applicationViewModel = new ApplicationViewModel(applicationModel, schedulerService);
        
        js.dom('#application').render(ApplicationView, applicationViewModel);

        schedulerService.getData().done(data => {
            applicationModel.setData(data);
        }).then(() => schedulerService.executeCommand(new GetEnvironmentDataCommand()).done(data => applicationViewModel.setEnvoronmentData(data)));
    }
}

new Application().run();