var DateData = (function () {
    function DateData() {
    }
    return DateData;
})();

var NullableDate = (function () {
    function NullableDate(date) {
        this.date = date;
        this._isEmpty = date == null;
    }
    NullableDate.prototype.isEmpty = function () {
        return this._isEmpty;
    };

    NullableDate.prototype.getDateString = function () {
        return this.date.ServerDateStr;
    };
    return NullableDate;
})();

var ApplicationModel = (function () {
    function ApplicationModel() {
    }
    return ApplicationModel;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>
/// <reference path="Models.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ApplicationViewModel = (function () {
    function ApplicationViewModel() {
        this.scheduler = js.observableValue();
        this.jobGroups = js.observableList();
    }
    ApplicationViewModel.prototype.setData = function (data) {
        var schedulerViewModel = new SchedulerViewModel();
        schedulerViewModel.name = data.Name;
        schedulerViewModel.instanceId = data.InstanceId;
        schedulerViewModel.status = data.Status;
        schedulerViewModel.runningSince = new NullableDate(data.RunningSince);
        schedulerViewModel.jobsTotal = data.JobsTotal;
        schedulerViewModel.jobsExecuted = data.JobsExecuted;
        schedulerViewModel.canStart = data.CanStart;
        schedulerViewModel.canShutdown = data.CanShutdown;
        schedulerViewModel.isRemote = data.IsRemote;
        schedulerViewModel.schedulerType = data.SchedulerTypeName;

        var groups = _.map(data.JobGroups, function (group) {
            return new JobGroupViewModel(group);
        });

        this.scheduler.setValue(schedulerViewModel);
        this.jobGroups.setValue(groups);
    };
    return ApplicationViewModel;
})();

var SchedulerViewModel = (function () {
    function SchedulerViewModel() {
    }
    return SchedulerViewModel;
})();

var ManagableActivityViewModel = (function () {
    function ManagableActivityViewModel(activity) {
        this.status = js.observableValue();
        this.canStart = js.observableValue();
        this.canPause = js.observableValue();
        this.name = activity.Name;
        this.status.setValue(activity.Status);
        this.canStart.setValue(activity.CanStart);
        this.canPause.setValue(activity.CanPause);
    }
    return ManagableActivityViewModel;
})();

var JobGroupViewModel = (function (_super) {
    __extends(JobGroupViewModel, _super);
    function JobGroupViewModel(group) {
        _super.call(this, group);
        this.jobs = js.observableList();

        var jobs = _.map(group.Jobs, function (job) {
            return new JobViewModel(job);
        });

        this.jobs.setValue(jobs);
    }
    return JobGroupViewModel;
})(ManagableActivityViewModel);

var JobViewModel = (function (_super) {
    __extends(JobViewModel, _super);
    function JobViewModel(job) {
        _super.call(this, job);
        this.triggers = js.observableList();

        var triggers = _.map(job.Triggers, function (trigger) {
            return new TriggerViewModel(trigger);
        });

        this.triggers.setValue(triggers);
    }
    return JobViewModel;
})(ManagableActivityViewModel);

var TriggerViewModel = (function (_super) {
    __extends(TriggerViewModel, _super);
    function TriggerViewModel(trigger) {
        _super.call(this, trigger);
        this.startDate = js.observableValue();
        this.endDate = js.observableValue();
        this.previousFireDate = js.observableValue();
        this.nextFireDate = js.observableValue();

        this.startDate.setValue(new NullableDate(trigger.StartDate));
        this.endDate.setValue(new NullableDate(trigger.EndDate));
        this.previousFireDate.setValue(new NullableDate(trigger.PreviousFireDate));
        this.nextFireDate.setValue(new NullableDate(trigger.NextFireDate));
    }
    return TriggerViewModel;
})(ManagableActivityViewModel);
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
var SchedulerView = (function () {
    function SchedulerView() {
        this.template = "#SchedulerView";
    }
    SchedulerView.prototype.init = function (dom, viewModel) {
        dom('.schedulerName').observes(viewModel.name);
        dom('.instanceId').observes(viewModel.instanceId);
        dom('.isRemote').observes(viewModel.isRemote);
        dom('.schedulerType').observes(viewModel.schedulerType);
        dom('.runningSince').observes(viewModel.runningSince, NullableDateView);
        dom('.totalJobs').observes(viewModel.jobsTotal);
        dom('.executedJobs').observes(viewModel.jobsExecuted);

        dom('.status span').$.addClass(viewModel.status).attr('title', 'Status: ' + viewModel.status);
    };
    return SchedulerView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Scripts/ViewModels.ts"/>
/// <reference path="SchedulerView.ts"/>
var NullableDateView = (function () {
    function NullableDateView() {
        this.template = '<span cass="date"></span>';
    }
    NullableDateView.prototype.init = function (dom, value) {
        if (value.isEmpty()) {
            dom.$.append('<span class="none">[none]</span>');
        } else {
            dom.$.append(value.getDateString());
        }
    };
    return NullableDateView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Scripts/ViewModels.ts"/>
/// <reference path="_NullableDate.ts"/>
var TriggerView = (function () {
    function TriggerView() {
        this.template = "#TriggerView";
    }
    TriggerView.prototype.init = function (dom, viewModel) {
        dom('.name').observes(viewModel.name);
        dom('.startDate').observes(viewModel.startDate, NullableDateView);
        dom('.endDate').observes(viewModel.endDate, NullableDateView);
        dom('.previousFireDate').observes(viewModel.previousFireDate, NullableDateView);
        dom('.nextFireDate').observes(viewModel.nextFireDate, NullableDateView);
    };
    return TriggerView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Scripts/ViewModels.ts"/>
/// <reference path="TriggerView.ts"/>
var JobView = (function () {
    function JobView() {
        this.template = "#JobView";
    }
    JobView.prototype.init = function (dom, viewModel) {
        dom('header h3').observes(viewModel.name);
        dom('.triggers tbody').observes(viewModel.triggers, TriggerView);
    };
    return JobView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Scripts/ViewModels.ts"/>
/// <reference path="JobView.ts"/>
var JobGroupView = (function () {
    function JobGroupView() {
        this.template = "#JobGroupView";
    }
    JobGroupView.prototype.init = function (dom, viewModel) {
        dom('header h2').observes(viewModel.name);
        dom('.content').observes(viewModel.jobs, JobView);
    };
    return JobGroupView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Scripts/ViewModels.ts"/>
/// <reference path="SchedulerView.ts"/>
/// <reference path="../Views/JobGroupView.ts"/>
var ApplicationView = (function () {
    function ApplicationView() {
        this.template = "#ApplicationView";
    }
    ApplicationView.prototype.init = function (dom, viewModel) {
        dom('#schedulerPropertiesContainer').observes(viewModel.scheduler, SchedulerView);
        dom('#jobsContainer').observes(viewModel.jobGroups, JobGroupView);
    };
    return ApplicationView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="Models.ts"/>
/// <reference path="ViewModels.ts"/>
/// <reference path="Services.ts"/>
/// <reference path="../Views/_NullableDate.ts"/>
/// <reference path="../Views/ApplicationView.ts"/>
/// <reference path="../Views/SchedulerView.ts"/>
var Application = (function () {
    function Application() {
    }
    Application.prototype.run = function () {
        var schedulerService = new SchedulerService();
        var applicationViewModel = new ApplicationViewModel();

        js.dom('#application').render(ApplicationView, applicationViewModel);

        schedulerService.getData().done(function (data) {
            applicationViewModel.setData(data);
        });
    };
    return Application;
})();

new Application().run();
