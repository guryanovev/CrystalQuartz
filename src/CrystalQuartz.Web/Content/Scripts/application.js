var ApplicationModel = (function () {
    function ApplicationModel() {
    }
    return ApplicationModel;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="Models.ts"/>
var ApplicationViewModel = (function () {
    function ApplicationViewModel() {
        this.schedulerName = js.observableValue();
    }
    ApplicationViewModel.prototype.setData = function (data) {
        this.schedulerName.setValue(data.Name);
    };
    return ApplicationViewModel;
})();
/// <reference path="../Definitions/jquery.d.ts"/>
/// <reference path="Models.ts"/>
var SchedulerService = (function () {
    function SchedulerService() {
    }
    SchedulerService.prototype.getData = function () {
        var data = {
            command: 'get_data'
        };

        return $.post('CrystalQuartzPanel.axd', data);
    };
    return SchedulerService;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Scripts/ViewModels.ts"/>
var ApplicationView = (function () {
    function ApplicationView() {
        this.template = "#ApplicationView";
    }
    ApplicationView.prototype.init = function (dom, viewModel) {
        dom('#schedulerName').observes(viewModel.schedulerName);
    };
    return ApplicationView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="Models.ts"/>
/// <reference path="ViewModels.ts"/>
/// <reference path="Services.ts"/>
/// <reference path="../Views/ApplicationView.ts"/>
var Application = (function () {
    function Application() {
    }
    Application.prototype.run = function () {
        var schedulerService = new SchedulerService();
        var applicationViewModel = new ApplicationViewModel();

        schedulerService.getData().done(function (data) {
            applicationViewModel.setData(data);
        });

        js.dom('#application').render(ApplicationView, applicationViewModel);
    };
    return Application;
})();

new Application().run();
