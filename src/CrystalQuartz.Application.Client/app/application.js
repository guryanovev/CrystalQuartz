"use strict";
require("../lib/john-smith");
var TestView = (function () {
    function TestView() {
        this.template = '<div>Hello, Application!</div>';
    }
    TestView.prototype.init = function (dom, viewModel) {
    };
    return TestView;
}());
var Application = (function () {
    function Application() {
    }
    Application.prototype.run = function () {
        /*
        var applicationModel = new ApplicationModel();

        var schedulerService = new SchedulerService();
        var applicationViewModel = new ApplicationViewModel(applicationModel, schedulerService);*/
        js.dom('#application').render(TestView, {});
        /*
        schedulerService.getData().done(data => {
            applicationModel.setData(data);
        }).then(() => schedulerService.executeCommand(new GetEnvironmentDataCommand()).done(data => applicationViewModel.setEnvoronmentData(data)));
        */
    };
    return Application;
}());
exports.Application = Application;
//# sourceMappingURL=application.js.map