/// <reference path="../Definitions/jquery.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

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

var AbstractCommand = (function () {
    function AbstractCommand() {
        this.data = {};
    }
    return AbstractCommand;
})();

var GetDataCommand = (function (_super) {
    __extends(GetDataCommand, _super);
    function GetDataCommand() {
        _super.call(this);

        this.code = 'get_data';
    }
    return GetDataCommand;
})(AbstractCommand);

var StartSchedulerCommand = (function (_super) {
    __extends(StartSchedulerCommand, _super);
    function StartSchedulerCommand() {
        _super.call(this);

        this.code = 'start_scheduler';
    }
    return StartSchedulerCommand;
})(AbstractCommand);
/// <reference path="../Definitions/jquery.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>
/// <reference path="Models.ts"/>
var SchedulerService = (function () {
    function SchedulerService() {
    }
    SchedulerService.prototype.getData = function () {
        //        var data = {
        //            command: 'get_data'
        //        };
        //
        //        return $.post('CrystalQuartzPanel.axd', data);
        return this.executeCommand(new GetDataCommand());
    };

    SchedulerService.prototype.executeCommand = function (command) {
        return $.post('CrystalQuartzPanel.axd', _.assign(command.data, { command: command.code }));
    };
    return SchedulerService;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>
/// <reference path="Models.ts"/>
/// <reference path="Services.ts"/>
var ApplicationViewModel = (function () {
    function ApplicationViewModel(commandService) {
        this.commandService = commandService;
        this.scheduler = js.observableValue();
        this.jobGroups = js.observableList();
    }
    ApplicationViewModel.prototype.setData = function (data) {
        var schedulerViewModel = new SchedulerViewModel(data, this.commandService);
        var groups = _.map(data.JobGroups, function (group) {
            return new JobGroupViewModel(group);
        });

        this.scheduler.setValue(schedulerViewModel);
        this.jobGroups.setValue(groups);
    };
    return ApplicationViewModel;
})();

var SchedulerViewModel = (function () {
    function SchedulerViewModel(data, commandService) {
        this.commandService = commandService;
        this.name = js.observableValue();
        this.instanceId = js.observableValue();
        this.status = js.observableValue();
        this.runningSince = js.observableValue();
        this.jobsTotal = js.observableValue();
        this.jobsExecuted = js.observableValue();
        this.canStart = js.observableValue();
        this.canShutdown = js.observableValue();
        this.isRemote = js.observableValue();
        this.schedulerType = js.observableValue();
        this.updateFrom(data);
    }
    SchedulerViewModel.prototype.updateFrom = function (data) {
        this.name.setValue(data.Name);
        this.instanceId.setValue(data.InstanceId);
        this.status.setValue(data.Status);
        this.runningSince.setValue(new NullableDate(data.RunningSince));
        this.jobsTotal.setValue(data.JobsTotal);
        this.jobsExecuted.setValue(data.JobsExecuted);
        this.canStart.setValue(data.CanStart);
        this.canShutdown.setValue(data.CanShutdown);
        this.isRemote.setValue(data.IsRemote);
        this.schedulerType.setValue(data.SchedulerTypeName);
    };

    SchedulerViewModel.prototype.startScheduler = function () {
        var _this = this;
        this.commandService.executeCommand(new StartSchedulerCommand()).done(function (data) {
            return _this.updateFrom(data);
        });
    };
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

        var $status = dom('.status span').$;
        viewModel.status.listen(function (newValue, oldValue) {
            if (oldValue) {
                $status.removeClass(oldValue);
            }

            if (newValue) {
                $status.addClass(newValue);
            }

            $status.attr('title', 'Status: ' + viewModel.status);
        }, true);

        dom('#startSchedulerButton').on('click').react(viewModel.startScheduler);
    };
    return SchedulerView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Scripts/ViewModels.ts"/>
/// <reference path="SchedulerView.ts"/>
var NullableDateView = (function () {
    function NullableDateView() {
        this.template = '<span class="cq-date"></span>';
    }
    NullableDateView.prototype.init = function (dom, value) {
        if (value.isEmpty()) {
            dom.$.append('<span class="cq-none">[none]</span>');
        } else {
            dom.$.append(value.getDateString());
        }
    };
    return NullableDateView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Scripts/ViewModels.ts"/>
/// <reference path="SchedulerView.ts"/>
var ActivityStatusView = (function () {
    function ActivityStatusView() {
        this.template = '<span class="$activity.Status.ToString().ToLower()">' + '<img title="Status: $activity.Status" alt = "$activity.Status" src = "" >' + '</span>';
    }
    ActivityStatusView.prototype.init = function (dom, value) {
        dom.$.addClass(value.Code);
        dom('img').$.attr('title', 'Status: ' + value.Name).attr('alt', value.Name).attr('src', 'CrystalQuartzPanel.axd?path=Images.status' + value.Name + '.png');
    };
    return ActivityStatusView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Scripts/ViewModels.ts"/>
/// <reference path="_NullableDate.ts"/>
/// <reference path="_ActivityStatus.ts"/>
var TriggerView = (function () {
    function TriggerView() {
        this.template = "#TriggerView";
    }
    TriggerView.prototype.init = function (dom, viewModel) {
        dom('.name').observes(viewModel.name);

        dom('.status').observes(viewModel.status, ActivityStatusView);
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
        var applicationViewModel = new ApplicationViewModel(schedulerService);

        js.dom('#application').render(ApplicationView, applicationViewModel);

        schedulerService.getData().done(function (data) {
            applicationViewModel.setData(data);
        });
    };
    return Application;
})();

new Application().run();
