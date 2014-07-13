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
        this.message = 'Loading scheduler data';
    }
    return GetDataCommand;
})(AbstractCommand);

var StartSchedulerCommand = (function (_super) {
    __extends(StartSchedulerCommand, _super);
    function StartSchedulerCommand() {
        _super.call(this);

        this.code = 'start_scheduler';
        this.message = 'Starting the scheduler';
    }
    return StartSchedulerCommand;
})(AbstractCommand);

var StopSchedulerCommand = (function (_super) {
    __extends(StopSchedulerCommand, _super);
    function StopSchedulerCommand() {
        _super.call(this);

        this.code = 'stop_scheduler';
        this.message = 'Stopping the scheduler';
    }
    return StopSchedulerCommand;
})(AbstractCommand);

var PauseTriggerCommand = (function (_super) {
    __extends(PauseTriggerCommand, _super);
    function PauseTriggerCommand(group, trigger) {
        _super.call(this);

        this.code = 'pause_trigger';
        this.message = 'Pausing trigger';
        this.data = {
            group: group,
            trigger: trigger
        };
    }
    return PauseTriggerCommand;
})(AbstractCommand);

var ResumeTriggerCommand = (function (_super) {
    __extends(ResumeTriggerCommand, _super);
    function ResumeTriggerCommand(group, trigger) {
        _super.call(this);

        this.code = 'resume_trigger';
        this.message = 'Resuming trigger';
        this.data = {
            group: group,
            trigger: trigger
        };
    }
    return ResumeTriggerCommand;
})(AbstractCommand);

var GetJobDetailsCommand = (function (_super) {
    __extends(GetJobDetailsCommand, _super);
    function GetJobDetailsCommand(group, job) {
        _super.call(this);

        this.code = 'get_job_details';
        this.message = 'Loading job details';
        this.data = {
            group: group,
            job: job
        };
    }
    return GetJobDetailsCommand;
})(AbstractCommand);
/// <reference path="../Definitions/jquery.d.ts"/>
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>
/// <reference path="Models.ts"/>
var SchedulerService = (function () {
    function SchedulerService() {
        this.onCommandStart = new js.Event();
        this.onCommandComplete = new js.Event();
    }
    SchedulerService.prototype.getData = function () {
        return this.executeCommand(new GetDataCommand());
    };

    SchedulerService.prototype.executeCommand = function (command) {
        var _this = this;
        var data = _.assign(command.data, { command: command.code });

        this.onCommandStart.trigger(command);

        return $.post('CrystalQuartzPanel.axd', data).done(function (result) {
            _this.onCommandComplete.trigger(command);
            return result;
        });
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
        this.jobGroups = js.observableList();
        this.scheduler = new SchedulerViewModel(commandService);
        this.commandProgress = new CommandProgressViewModel(commandService);
    }
    ApplicationViewModel.prototype.setData = function (data) {
        var _this = this;
        var groups = _.map(data.JobGroups, function (group) {
            return new JobGroupViewModel(group, _this.commandService);
        });

        this.scheduler.updateFrom(data);
        this.jobGroups.setValue(groups);
    };

    ApplicationViewModel.prototype.getCommandProgress = function () {
        return new CommandProgressViewModel(this.commandService);
    };
    return ApplicationViewModel;
})();

var SchedulerViewModel = (function () {
    function SchedulerViewModel(commandService) {
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

    SchedulerViewModel.prototype.stopScheduler = function () {
        var _this = this;
        this.commandService.executeCommand(new StopSchedulerCommand()).done(function (data) {
            return _this.updateFrom(data);
        });
    };
    return SchedulerViewModel;
})();

var ManagableActivityViewModel = (function () {
    function ManagableActivityViewModel(activity, commandService) {
        this.commandService = commandService;
        this.status = js.observableValue();
        this.canStart = js.observableValue();
        this.canPause = js.observableValue();
        this.name = activity.Name;
        this.updateFromActivity(activity);
    }
    ManagableActivityViewModel.prototype.updateFromActivity = function (activity) {
        this.status.setValue(activity.Status);
        this.canStart.setValue(activity.CanStart);
        this.canPause.setValue(activity.CanPause);
    };
    return ManagableActivityViewModel;
})();

var JobGroupViewModel = (function (_super) {
    __extends(JobGroupViewModel, _super);
    function JobGroupViewModel(group, commandService) {
        _super.call(this, group, commandService);
        this.jobs = js.observableList();

        var jobs = _.map(group.Jobs, function (job) {
            return new JobViewModel(job, group, commandService);
        });

        this.jobs.setValue(jobs);
    }
    return JobGroupViewModel;
})(ManagableActivityViewModel);

var JobViewModel = (function (_super) {
    __extends(JobViewModel, _super);
    function JobViewModel(job, group, commandService) {
        _super.call(this, job, commandService);
        this.group = group;
        this.triggers = js.observableList();
        this.details = js.observableValue();

        var triggers = _.map(job.Triggers, function (trigger) {
            return new TriggerViewModel(trigger, job, commandService);
        });

        this.triggers.setValue(triggers);
    }
    JobViewModel.prototype.loadJobDetails = function () {
        var _this = this;
        this.commandService.executeCommand(new GetJobDetailsCommand(this.group.Name, this.name)).done(function (details) {
            return _this.details.setValue(details);
        });
    };
    return JobViewModel;
})(ManagableActivityViewModel);

var TriggerViewModel = (function (_super) {
    __extends(TriggerViewModel, _super);
    function TriggerViewModel(trigger, job, commandService) {
        _super.call(this, trigger, commandService);
        this.job = job;
        this.startDate = js.observableValue();
        this.endDate = js.observableValue();
        this.previousFireDate = js.observableValue();
        this.nextFireDate = js.observableValue();

        this.updateFrom(trigger);
    }
    TriggerViewModel.prototype.resume = function () {
        var _this = this;
        this.commandService.executeCommand(new ResumeTriggerCommand(this.job.GroupName, this.name)).done(function (triggerData) {
            return _this.updateFrom(triggerData.Trigger);
        });
    };

    TriggerViewModel.prototype.pause = function () {
        var _this = this;
        this.commandService.executeCommand(new PauseTriggerCommand(this.job.GroupName, this.name)).done(function (triggerData) {
            return _this.updateFrom(triggerData.Trigger);
        });
    };

    TriggerViewModel.prototype.updateFrom = function (trigger) {
        this.updateFromActivity(trigger);

        this.startDate.setValue(new NullableDate(trigger.StartDate));
        this.endDate.setValue(new NullableDate(trigger.EndDate));
        this.previousFireDate.setValue(new NullableDate(trigger.PreviousFireDate));
        this.nextFireDate.setValue(new NullableDate(trigger.NextFireDate));
    };
    return TriggerViewModel;
})(ManagableActivityViewModel);

var CommandProgressViewModel = (function () {
    function CommandProgressViewModel(commandService) {
        var _this = this;
        this.commandService = commandService;
        this._commands = [];
        this.active = js.observableValue();
        this.commandsCount = js.observableValue();
        this.currentCommand = js.observableValue();
        commandService.onCommandStart.listen(function (command) {
            return _this.addCommand(command);
        });
        commandService.onCommandComplete.listen(function (command) {
            return _this.removeCommand(command);
        });
    }
    CommandProgressViewModel.prototype.addCommand = function (command) {
        this._commands.push(command);
        this.updateState();
    };

    CommandProgressViewModel.prototype.removeCommand = function (command) {
        this._commands = _.filter(this._commands, function (c) {
            return c !== command;
        });
        this.updateState();
    };

    CommandProgressViewModel.prototype.updateState = function () {
        this.active.setValue(this._commands.length > 0);
        this.commandsCount.setValue(this._commands.length);
        if (this._commands.length > 0) {
            this.currentCommand.setValue(_.last(this._commands).message);
        }
    };
    return CommandProgressViewModel;
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
        dom('#stopSchedulerButton').on('click').react(function () {
            if (confirm('Are you sure you want to shutdown scheduler?')) {
                viewModel.stopScheduler();
            }
        });
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

        dom('.actions .pause').on('click').react(viewModel.pause);
        dom('.actions .resume').on('click').react(viewModel.resume);
    };
    return TriggerView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Scripts/ViewModels.ts"/>
/// <reference path="../Scripts/Models.ts"/>
/// <reference path="SchedulerView.ts"/>
var PropertyView = (function () {
    function PropertyView() {
        this.template = '<tr>' + '<td class="name"></td>' + '<td class="value"></td>' + '</tr>';
    }
    PropertyView.prototype.init = function (dom, value) {
        dom('.name').observes(value.Name);
        dom('.value').observes(value.Value);
    };
    return PropertyView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Scripts/ViewModels.ts"/>
/// <reference path="TriggerView.ts"/>
/// <reference path="_Propertry.ts"/>
var JobDetailsView = (function () {
    function JobDetailsView() {
        this.template = "#JobDetailsView";
    }
    JobDetailsView.prototype.init = function (dom, viewModel) {
        dom('.properties').observes(viewModel.JobProperties, PropertyView);
    };
    return JobDetailsView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Scripts/ViewModels.ts"/>
/// <reference path="TriggerView.ts"/>
/// <reference path="JobDetailsView.ts"/>
var JobView = (function () {
    function JobView() {
        this.template = "#JobView";
    }
    JobView.prototype.init = function (dom, viewModel) {
        dom('.title').observes(viewModel.name);
        dom('.triggers tbody').observes(viewModel.triggers, TriggerView);
        dom('.detailsContainer').observes(viewModel.details, JobDetailsView);

        dom('.loadDetails').on('click').react(viewModel.loadJobDetails);
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
var CommandProgressView = (function () {
    function CommandProgressView() {
        this.template = '<section class="cq-busy">' + '<div class="cq-busy-image">' + '<img src="CrystalQuartzPanel.axd?path=Images.loading.gif"/>' + '</div>' + '<div id="currentCommand" class="cq-current-command"></div>' + '</section>';
    }
    CommandProgressView.prototype.init = function (dom, viewModel) {
        dom('#currentCommand').observes(viewModel.currentCommand);

        viewModel.active.listen((function (value) {
            if (value) {
                dom.$.fadeIn();
                dom.$.fadeIn();
            } else {
                setTimeout(function () {
                    dom.$.fadeOut();
                    dom.$.fadeOut();
                }, 1000);
            }
        }));
    };
    return CommandProgressView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Scripts/ViewModels.ts"/>
/// <reference path="SchedulerView.ts"/>
/// <reference path="../Views/JobGroupView.ts"/>
/// <reference path="../Views/CommandProgressView.ts"/>
var ApplicationView = (function () {
    function ApplicationView() {
        this.template = "#ApplicationView";
    }
    ApplicationView.prototype.init = function (dom, viewModel) {
        dom('#schedulerName').observes(viewModel.scheduler.name);

        dom('#schedulerPropertiesContainer').observes(viewModel.scheduler, SchedulerView);
        dom('#jobsContainer').observes(viewModel.jobGroups, JobGroupView);

        dom('#commandIndicator').render(CommandProgressView, viewModel.getCommandProgress());

        var $status = dom('#schedulerStatus').$;
        viewModel.scheduler.status.listen(function (newValue, oldValue) {
            if (oldValue) {
                $status.removeClass(oldValue);
            }

            if (newValue) {
                $status.addClass(newValue);
            }

            $status.attr('title', 'Status: ' + newValue);
        }, true);
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
