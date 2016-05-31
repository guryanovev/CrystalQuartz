/// <reference path="../Definitions/jquery.d.ts"/> 
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ApplicationModel = (function () {
    function ApplicationModel() {
        this.onDataChanged = new js.Event();
    }
    ApplicationModel.prototype.setData = function (data) {
        this.onDataChanged.trigger(data);
    };
    return ApplicationModel;
})();
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
var AbstractCommand = (function () {
    function AbstractCommand() {
        this.data = {};
    }
    return AbstractCommand;
})();
var GetEnvironmentDataCommand = (function (_super) {
    __extends(GetEnvironmentDataCommand, _super);
    function GetEnvironmentDataCommand() {
        _super.call(this);
        this.code = 'get_env';
        this.message = 'Loading environment data';
    }
    return GetEnvironmentDataCommand;
})(AbstractCommand);
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
/*
 * Group Commands
 */
var PauseGroupCommand = (function (_super) {
    __extends(PauseGroupCommand, _super);
    function PauseGroupCommand(group) {
        _super.call(this);
        this.code = 'pause_group';
        this.message = 'Pausing group';
        this.data = {
            group: group
        };
    }
    return PauseGroupCommand;
})(AbstractCommand);
var ResumeGroupCommand = (function (_super) {
    __extends(ResumeGroupCommand, _super);
    function ResumeGroupCommand(group) {
        _super.call(this);
        this.code = 'resume_group';
        this.message = 'Resuming group';
        this.data = {
            group: group
        };
    }
    return ResumeGroupCommand;
})(AbstractCommand);
var DeleteGroupCommand = (function (_super) {
    __extends(DeleteGroupCommand, _super);
    function DeleteGroupCommand(group) {
        _super.call(this);
        this.code = 'delete_group';
        this.message = 'Deleting group';
        this.data = {
            group: group
        };
    }
    return DeleteGroupCommand;
})(AbstractCommand);
/*
 * Job Commands
 */
var PauseJobCommand = (function (_super) {
    __extends(PauseJobCommand, _super);
    function PauseJobCommand(group, job) {
        _super.call(this);
        this.code = 'pause_job';
        this.message = 'Pausing job';
        this.data = {
            group: group,
            job: job
        };
    }
    return PauseJobCommand;
})(AbstractCommand);
var ResumeJobCommand = (function (_super) {
    __extends(ResumeJobCommand, _super);
    function ResumeJobCommand(group, job) {
        _super.call(this);
        this.code = 'resume_job';
        this.message = 'Resuming job';
        this.data = {
            group: group,
            job: job
        };
    }
    return ResumeJobCommand;
})(AbstractCommand);
var DeleteJobCommand = (function (_super) {
    __extends(DeleteJobCommand, _super);
    function DeleteJobCommand(group, job) {
        _super.call(this);
        this.code = 'delete_job';
        this.message = 'Deleting job';
        this.data = {
            group: group,
            job: job
        };
    }
    return DeleteJobCommand;
})(AbstractCommand);
var ExecuteNowCommand = (function (_super) {
    __extends(ExecuteNowCommand, _super);
    function ExecuteNowCommand(group, job) {
        _super.call(this);
        this.code = 'execute_job';
        this.message = 'Executing job';
        this.data = {
            group: group,
            job: job
        };
    }
    return ExecuteNowCommand;
})(AbstractCommand);
/*
 * Trigger Commands
 */
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
var DeleteTriggerCommand = (function (_super) {
    __extends(DeleteTriggerCommand, _super);
    function DeleteTriggerCommand(group, trigger) {
        _super.call(this);
        this.code = 'delete_trigger';
        this.message = 'Deleting trigger';
        this.data = {
            group: group,
            trigger: trigger
        };
    }
    return DeleteTriggerCommand;
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
        this.onCommandFailed = new js.Event();
    }
    SchedulerService.prototype.getData = function () {
        return this.executeCommand(new GetDataCommand());
    };
    SchedulerService.prototype.executeCommand = function (command) {
        var result = $.Deferred(), data = _.assign(command.data, { command: command.code }), that = this;
        this.onCommandStart.trigger(command);
        $.post('CrystalQuartzPanel.axd', data).done(function (response) {
            var comandResult = response;
            if (comandResult.Success) {
                result.resolve(response);
            }
            else {
                result.reject({
                    errorMessage: comandResult.ErrorMessage,
                    details: comandResult.ErrorDetails
                });
            }
            return response;
        }).fail(function () {
            result.reject({
                errorMessage: 'Unknown error while executing the command'
            });
        });
        return result.promise().always(function () {
            that.onCommandComplete.trigger(command);
        }).fail(function (response) {
            var comandResult = response;
            that.onCommandFailed.trigger(comandResult);
        });
    };
    return SchedulerService;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>
/// <reference path="Models.ts"/>
/// <reference path="Services.ts"/>
var ApplicationViewModel = (function () {
    function ApplicationViewModel(applicationModel, commandService) {
        var _this = this;
        this.applicationModel = applicationModel;
        this.commandService = commandService;
        this.jobGroups = js.observableList();
        this.environment = js.observableValue();
        this.autoUpdateMessage = js.observableValue();
        this.scheduler = new SchedulerViewModel(commandService, applicationModel);
        this.commandProgress = new CommandProgressViewModel(commandService);
        applicationModel.onDataChanged.listen(function (data) { return _this.setData(data); });
        this.groupsSynchronizer = new ActivitiesSynschronizer(function (group, groupViewModel) { return group.Name === groupViewModel.name; }, function (group) { return new JobGroupViewModel(group, _this.commandService, _this.applicationModel); }, this.jobGroups);
    }
    ApplicationViewModel.prototype.setData = function (data) {
        this.scheduler.updateFrom(data);
        this.groupsSynchronizer.sync(data.JobGroups);
        this.scheduleAutoUpdate(data);
    };
    ApplicationViewModel.prototype.getCommandProgress = function () {
        return this.commandProgress;
    };
    ApplicationViewModel.prototype.getError = function () {
        return new ErrorViewModel(this.commandService);
    };
    ApplicationViewModel.prototype.setEnvoronmentData = function (data) {
        this.environment.setValue(data);
    };
    ApplicationViewModel.prototype.scheduleAutoUpdate = function (data) {
        var _this = this;
        var nextUpdateDate = this.getLastActivityFireDate(data) || this.getDefaultUpdateDate();
        clearTimeout(this._autoUpdateTimes);
        var now = new Date();
        var sleepInterval = nextUpdateDate.getTime() - now.getTime();
        var message = '';
        if (sleepInterval < 0) {
            sleepInterval = ApplicationViewModel.DEFAULT_UPDATE_INTERVAL;
            nextUpdateDate.setSeconds(nextUpdateDate.getSeconds() + ApplicationViewModel.DEFAULT_UPDATE_INTERVAL / 1000);
        }
        message = 'next update at ' + nextUpdateDate.toTimeString();
        this.autoUpdateMessage.setValue(message);
        this._autoUpdateTimes = setTimeout(function () {
            _this.autoUpdateMessage.setValue('updating...');
            _this.updateData();
        }, sleepInterval);
    };
    ApplicationViewModel.prototype.updateData = function () {
        var _this = this;
        this.commandService.getData().done(function (data) { return _this.applicationModel.setData(data); });
    };
    ApplicationViewModel.prototype.getDefaultUpdateDate = function () {
        var now = new Date();
        now.setSeconds(now.getSeconds() + 30);
        return now;
    };
    ApplicationViewModel.prototype.getLastActivityFireDate = function (data) {
        if (data.Status !== 'started') {
            return null;
        }
        var allJobs = _.flatten(_.map(data.JobGroups, function (group) { return group.Jobs; })), allTriggers = _.flatten(_.map(allJobs, function (job) { return job.Triggers; })), activeTriggers = _.filter(allTriggers, function (trigger) { return trigger.Status.Code == 'active'; }), nextFireDates = _.compact(_.map(activeTriggers, function (trigger) { return trigger.NextFireDate == null ? null : trigger.NextFireDate.Ticks; }));
        return nextFireDates.length > 0 ? new Date(_.first(nextFireDates)) : null;
    };
    ApplicationViewModel.DEFAULT_UPDATE_INTERVAL = 30000; // 30sec
    return ApplicationViewModel;
})();
var ErrorViewModel = (function () {
    function ErrorViewModel(commandService) {
        this.commandService = commandService;
        this.message = js.observableValue();
        this.details = js.observableList();
        this.isActive = js.observableValue();
        this.isActive.setValue(false);
    }
    ErrorViewModel.prototype.initState = function () {
        var _this = this;
        this.commandService.onCommandFailed.listen(function (errorInfo) {
            _this.message.setValue(errorInfo.errorMessage);
            if (errorInfo.details) {
                _this.details.setValue(errorInfo.details);
            }
            else {
                _this.details.clear();
            }
            _this.isActive.setValue(true);
        });
    };
    ErrorViewModel.prototype.clear = function () {
        this.isActive.setValue(false);
    };
    return ErrorViewModel;
})();
var ActivitiesSynschronizer = (function () {
    function ActivitiesSynschronizer(identityChecker, mapper, list) {
        this.identityChecker = identityChecker;
        this.mapper = mapper;
        this.list = list;
    }
    ActivitiesSynschronizer.prototype.sync = function (activities) {
        var _this = this;
        var existingActivities = this.list.getValue();
        var deletedActivities = _.filter(existingActivities, function (viewModel) { return _.every(activities, function (activity) { return _this.areNotEqual(activity, viewModel); }); });
        var addedActivities = _.filter(activities, function (activity) { return _.every(existingActivities, function (viewModel) { return _this.areNotEqual(activity, viewModel); }); });
        var updatedActivities = _.filter(existingActivities, function (viewModel) { return _.some(activities, function (activity) { return _this.areEqual(activity, viewModel); }); });
        var addedViewModels = _.map(addedActivities, this.mapper);
        var finder = function (viewModel) { return _.find(activities, function (activity) { return _this.areEqual(activity, viewModel); }); };
        _.each(deletedActivities, function (viewModel) { return _this.list.remove(viewModel); });
        _.each(addedViewModels, function (viewModel) {
            viewModel.updateFrom(finder(viewModel));
            _this.list.add(viewModel);
        });
        _.each(updatedActivities, function (viewModel) { return viewModel.updateFrom(finder(viewModel)); });
    };
    ActivitiesSynschronizer.prototype.areEqual = function (activity, activityViewModel) {
        return this.identityChecker(activity, activityViewModel);
    };
    ActivitiesSynschronizer.prototype.areNotEqual = function (activity, activityViewModel) {
        return !this.identityChecker(activity, activityViewModel);
    };
    return ActivitiesSynschronizer;
})();
var SchedulerViewModel = (function () {
    function SchedulerViewModel(commandService, applicationModel) {
        this.commandService = commandService;
        this.applicationModel = applicationModel;
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
        this.commandService.executeCommand(new StartSchedulerCommand()).done(function (data) { return _this.applicationModel.setData(data); });
    };
    SchedulerViewModel.prototype.stopScheduler = function () {
        var _this = this;
        this.commandService.executeCommand(new StopSchedulerCommand()).done(function (data) { return _this.applicationModel.setData(data); });
    };
    SchedulerViewModel.prototype.refreshData = function () {
        var _this = this;
        this.commandService.executeCommand(new GetDataCommand()).done(function (data) { return _this.applicationModel.setData(data); });
    };
    return SchedulerViewModel;
})();
var ManagableActivityViewModel = (function () {
    function ManagableActivityViewModel(activity, commandService, applicationModel) {
        this.commandService = commandService;
        this.applicationModel = applicationModel;
        this.status = js.observableValue();
        this.canStart = js.observableValue();
        this.canPause = js.observableValue();
        this.canDelete = js.observableValue();
        this.name = activity.Name;
    }
    ManagableActivityViewModel.prototype.updateFrom = function (activity) {
        this.status.setValue(activity.Status);
        this.canStart.setValue(activity.CanStart);
        this.canPause.setValue(activity.CanPause);
        this.canDelete.setValue(activity.CanDelete);
    };
    ManagableActivityViewModel.prototype.resume = function () {
        var _this = this;
        this.commandService.executeCommand(this.createResumeCommand()).done(function (data) { return _this.applicationModel.setData(data); });
    };
    ManagableActivityViewModel.prototype.pause = function () {
        var _this = this;
        this.commandService.executeCommand(this.createPauseCommand()).done(function (data) { return _this.applicationModel.setData(data); });
    };
    ManagableActivityViewModel.prototype.delete = function () {
        var _this = this;
        if (confirm(this.getDeleteConfirmationsText())) {
            this.commandService.executeCommand(this.createDeleteCommand()).done(function (data) { return _this.applicationModel.setData(data); });
        }
    };
    ManagableActivityViewModel.prototype.getDeleteConfirmationsText = function () {
        return 'Are you sure?';
    };
    ManagableActivityViewModel.prototype.createResumeCommand = function () {
        throw new Error("Abstract method call");
    };
    ManagableActivityViewModel.prototype.createPauseCommand = function () {
        throw new Error("Abstract method call");
    };
    ManagableActivityViewModel.prototype.createDeleteCommand = function () {
        throw new Error("Abstract method call");
    };
    return ManagableActivityViewModel;
})();
var JobGroupViewModel = (function (_super) {
    __extends(JobGroupViewModel, _super);
    function JobGroupViewModel(group, commandService, applicationModel) {
        var _this = this;
        _super.call(this, group, commandService, applicationModel);
        this.jobs = js.observableList();
        this.jobsSynchronizer = new ActivitiesSynschronizer(function (job, jobViewModel) { return job.Name === jobViewModel.name; }, function (job) { return new JobViewModel(job, _this.name, _this.commandService, _this.applicationModel); }, this.jobs);
    }
    JobGroupViewModel.prototype.updateFrom = function (group) {
        _super.prototype.updateFrom.call(this, group);
        this.jobsSynchronizer.sync(group.Jobs);
    };
    JobGroupViewModel.prototype.getDeleteConfirmationsText = function () {
        return 'Are you sure you want to delete all jobs?';
    };
    JobGroupViewModel.prototype.createResumeCommand = function () {
        return new ResumeGroupCommand(this.name);
    };
    JobGroupViewModel.prototype.createPauseCommand = function () {
        return new PauseGroupCommand(this.name);
    };
    JobGroupViewModel.prototype.createDeleteCommand = function () {
        return new DeleteGroupCommand(this.name);
    };
    return JobGroupViewModel;
})(ManagableActivityViewModel);
var JobViewModel = (function (_super) {
    __extends(JobViewModel, _super);
    function JobViewModel(job, group, commandService, applicationModel) {
        var _this = this;
        _super.call(this, job, commandService, applicationModel);
        this.group = group;
        this.triggers = js.observableList();
        this.details = js.observableValue();
        this.triggersSynchronizer = new ActivitiesSynschronizer(function (trigger, triggerViewModel) { return trigger.Name === triggerViewModel.name; }, function (trigger) { return new TriggerViewModel(trigger, _this.commandService, _this.applicationModel); }, this.triggers);
    }
    JobViewModel.prototype.loadJobDetails = function () {
        var _this = this;
        this.commandService.executeCommand(new GetJobDetailsCommand(this.group, this.name)).done(function (details) { return _this.details.setValue(details); });
    };
    JobViewModel.prototype.updateFrom = function (job) {
        _super.prototype.updateFrom.call(this, job);
        this.triggersSynchronizer.sync(job.Triggers);
    };
    JobViewModel.prototype.executeNow = function () {
        var _this = this;
        this.commandService.executeCommand(new ExecuteNowCommand(this.group, this.name)).done(function (data) { return _this.applicationModel.setData(data); });
    };
    JobViewModel.prototype.getDeleteConfirmationsText = function () {
        return 'Are you sure you want to delete job?';
    };
    JobViewModel.prototype.createResumeCommand = function () {
        return new ResumeJobCommand(this.group, this.name);
    };
    JobViewModel.prototype.createPauseCommand = function () {
        return new PauseJobCommand(this.group, this.name);
    };
    JobViewModel.prototype.createDeleteCommand = function () {
        return new DeleteJobCommand(this.group, this.name);
    };
    JobViewModel.prototype.clearJobDetails = function () {
        this.details.setValue(null);
    };
    return JobViewModel;
})(ManagableActivityViewModel);
var TriggerViewModel = (function (_super) {
    __extends(TriggerViewModel, _super);
    function TriggerViewModel(trigger, commandService, applicationModel) {
        _super.call(this, trigger, commandService, applicationModel);
        this.startDate = js.observableValue();
        this.endDate = js.observableValue();
        this.previousFireDate = js.observableValue();
        this.nextFireDate = js.observableValue();
        this.triggerType = js.observableValue();
    }
    TriggerViewModel.prototype.updateFrom = function (trigger) {
        this._group = trigger.GroupName;
        _super.prototype.updateFrom.call(this, trigger);
        this.startDate.setValue(new NullableDate(trigger.StartDate));
        this.endDate.setValue(new NullableDate(trigger.EndDate));
        this.previousFireDate.setValue(new NullableDate(trigger.PreviousFireDate));
        this.nextFireDate.setValue(new NullableDate(trigger.NextFireDate));
        var triggerType = trigger.TriggerType;
        var triggerTypeMessage = 'unknown';
        if (triggerType.Code === 'simple') {
            var simpleTriggerType = triggerType;
            triggerTypeMessage = 'repeat ';
            if (simpleTriggerType.RepeatCount === -1) {
            }
            else {
                triggerTypeMessage += simpleTriggerType.RepeatCount + ' times ';
            }
            triggerTypeMessage += 'every ';
            var parts = [
                {
                    label: 'day',
                    pluralLabel: 'days',
                    multiplier: 1000 * 60 * 60 * 24
                },
                {
                    label: 'hour',
                    pluralLabel: 'hours',
                    multiplier: 1000 * 60 * 60
                },
                {
                    label: 'minute',
                    pluralLabel: 'min',
                    multiplier: 1000 * 60
                },
                {
                    label: 'second',
                    pluralLabel: 'sec',
                    multiplier: 1000
                }
            ];
            var diff = simpleTriggerType.RepeatInterval;
            var messagesParts = [];
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                var currentPartValue = Math.floor(diff / part.multiplier);
                diff -= currentPartValue * part.multiplier;
                if (currentPartValue == 1) {
                    messagesParts.push(part.label);
                }
                else if (currentPartValue > 1) {
                    messagesParts.push(currentPartValue + ' ' + part.pluralLabel);
                }
            }
            triggerTypeMessage += messagesParts.join(', ');
        }
        else if (triggerType.Code === 'cron') {
            var cronTriggerType = triggerType;
            triggerTypeMessage = cronTriggerType.CronExpression;
        }
        this.triggerType.setValue(triggerTypeMessage);
    };
    TriggerViewModel.prototype.getDeleteConfirmationsText = function () {
        return 'Are you sure you want to unchedule trigger?';
    };
    TriggerViewModel.prototype.createResumeCommand = function () {
        return new ResumeTriggerCommand(this._group, this.name);
    };
    TriggerViewModel.prototype.createPauseCommand = function () {
        return new PauseTriggerCommand(this._group, this.name);
    };
    TriggerViewModel.prototype.createDeleteCommand = function () {
        return new DeleteTriggerCommand(this._group, this.name);
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
        commandService.onCommandStart.listen(function (command) { return _this.addCommand(command); });
        commandService.onCommandComplete.listen(function (command) { return _this.removeCommand(command); });
    }
    CommandProgressViewModel.prototype.addCommand = function (command) {
        this._commands.push(command);
        this.updateState();
    };
    CommandProgressViewModel.prototype.removeCommand = function (command) {
        this._commands = _.filter(this._commands, function (c) { return c !== command; });
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
        var $$start = dom('#startSchedulerButton');
        var $$stop = dom('#stopSchedulerButton');
        var $$refresh = dom('#refreshData');
        viewModel.canStart.listen(function (value) {
            if (value) {
                $$start.$.removeClass('disabled');
            }
            else {
                $$start.$.addClass('disabled');
            }
        });
        viewModel.canShutdown.listen(function (value) {
            if (value) {
                $$stop.$.removeClass('disabled');
            }
            else {
                $$stop.$.addClass('disabled');
            }
        });
        $$start.on('click').react(viewModel.startScheduler);
        $$stop.on('click').react(function () {
            if (confirm('Are you sure you want to shutdown scheduler?')) {
                viewModel.stopScheduler();
            }
        });
        $$refresh.on('click').react(function () {
            viewModel.refreshData();
        });
    };
    SchedulerView.prototype.handleClick = function (link, callback, viewModel) {
        var $link = link.$;
        link.on('click').react(function () {
            if (!$link.is('.disabled')) {
                callback.call(viewModel);
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
        }
        else {
            dom.$.append(value.getDateString());
        }
    };
    return NullableDateView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="SchedulerView.ts"/> 
var ActivityStatusView2 = (function () {
    function ActivityStatusView2() {
        this.template = '<span class="cq-activity-status">' + '<span class="cq-activity-status-primary"></span>' + '<span class="cq-activity-status-secondary"></span>' + '</span>';
    }
    ActivityStatusView2.prototype.init = function (dom, statusAware) {
        statusAware.status.listen(function (newValue, oldValue) {
            if (oldValue) {
                dom.$.removeClass(oldValue.Code);
            }
            if (newValue) {
                dom.$.addClass(newValue.Code).attr('title', 'Status: ' + newValue.Name);
            }
        });
    };
    return ActivityStatusView2;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="_NullableDate.ts"/> 
/// <reference path="_ActivityStatus.ts"/> 
var ActivityView = (function () {
    function ActivityView() {
        this.template = ''; // abstract
    }
    ActivityView.prototype.init = function (dom, viewModel) {
        dom('.name').observes(viewModel.name);
        dom('.status').observes(viewModel, ActivityStatusView2);
        var $$pause = dom('.actions .pause');
        var $$resume = dom('.actions .resume');
        var $$delete = dom('.actions .delete');
        viewModel.canPause.listen(function (value) {
            if (value) {
                $$pause.$.parent().removeClass('disabled');
            }
            else {
                $$pause.$.parent().addClass('disabled');
            }
        });
        viewModel.canStart.listen(function (value) {
            if (value) {
                $$resume.$.parent().removeClass('disabled');
            }
            else {
                $$resume.$.parent().addClass('disabled');
            }
        });
        this.handleClick($$pause, viewModel.pause, viewModel);
        this.handleClick($$resume, viewModel.resume, viewModel);
        this.handleClick($$delete, viewModel.delete, viewModel);
    };
    ActivityView.prototype.handleClick = function (link, callback, viewModel) {
        var $link = link.$;
        link.on('click').react(function () {
            if (!$link.parent().is('.disabled')) {
                callback.call(viewModel);
            }
        });
    };
    return ActivityView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="AbstractActivityView.ts"/> 
/// <reference path="_NullableDate.ts"/> 
/// <reference path="_ActivityStatus.ts"/> 
var TriggerView = (function (_super) {
    __extends(TriggerView, _super);
    function TriggerView() {
        _super.apply(this, arguments);
        this.template = "#TriggerView";
    }
    TriggerView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        dom('.startDate').observes(viewModel.startDate, NullableDateView);
        dom('.endDate').observes(viewModel.endDate, NullableDateView);
        dom('.previousFireDate').observes(viewModel.previousFireDate, NullableDateView);
        dom('.nextFireDate').observes(viewModel.nextFireDate, NullableDateView);
        dom('.type').observes(viewModel.triggerType);
    };
    return TriggerView;
})(ActivityView);
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="../Scripts/Models.ts"/> 
/// <reference path="SchedulerView.ts"/> 
var PropertyValue = (function () {
    function PropertyValue() {
        this.template = '<span></span>';
    }
    PropertyValue.prototype.init = function (dom, value) {
        if (value == null || value.Value == null) {
            dom.$.addClass('none');
        }
        else {
            dom.$.append(value.Value);
            if (value.TypeName) {
                dom.$.addClass(value.TypeName.toLowerCase());
            }
        }
    };
    return PropertyValue;
})();
var PropertyView = (function () {
    function PropertyView() {
        this.template = '<tr>' + '<td class="name"></td>' + '<td class="value"></td>' + '</tr>';
    }
    PropertyView.prototype.init = function (dom, value) {
        dom('.name').observes(value.Name);
        dom('.value').observes(value, PropertyValue);
    };
    return PropertyView;
})();
var PropertyWithTypeView = (function () {
    function PropertyWithTypeView() {
        this.template = '<tr>' + '<td class="name"></td>' + '<td class="value"></td>' + '<td class="type"><span class="runtimetype"></span></td>' + '</tr>';
    }
    PropertyWithTypeView.prototype.init = function (dom, value) {
        dom('.name').observes(value.Name);
        dom('.value').observes(value, PropertyValue);
        dom('.type span').observes(value.TypeName);
    };
    return PropertyWithTypeView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="TriggerView.ts"/> 
/// <reference path="_Propertry.ts"/> 
var ErrorView = (function () {
    function ErrorView() {
        this.template = '#ErrorView';
    }
    ErrorView.prototype.init = function (dom, viewModel) {
        viewModel.isActive.listen(function (value) {
            if (value) {
                dom.$.fadeIn();
            }
            else {
                dom.$.fadeOut();
            }
        });
        viewModel.details.listen(function (value) {
            if (value && value.length > 0) {
                dom('#errorDetails').$.show();
            }
            else {
                dom('#errorDetails').$.hide();
            }
        });
        dom('#errorDetails tbody').observes(viewModel.details, PropertyView);
        dom('#errorMessage').observes(viewModel.message);
        dom('.close').on('click').react(viewModel.clear);
    };
    return ErrorView;
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
        dom('.properties tbody').observes(viewModel.JobProperties, PropertyView);
        dom('.dataMap tbody').observes(viewModel.JobDataMap, PropertyWithTypeView);
    };
    return JobDetailsView;
})();
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="AbstractActivityView.ts"/> 
/// <reference path="TriggerView.ts"/> 
/// <reference path="JobDetailsView.ts"/> 
var JobView = (function (_super) {
    __extends(JobView, _super);
    function JobView() {
        _super.apply(this, arguments);
        this.template = "#JobView";
    }
    JobView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        var $$hideDetails = dom('.hideDetails');
        viewModel.details.listen(function (value) {
            if (value) {
                $$hideDetails.$.fadeIn();
            }
            else {
                $$hideDetails.$.fadeOut();
            }
        });
        dom('.triggers tbody').observes(viewModel.triggers, TriggerView);
        dom('.detailsContainer').observes(viewModel.details, JobDetailsView);
        dom('.loadDetails').on('click').react(viewModel.loadJobDetails);
        dom('.actions .execute').on('click').react(viewModel.executeNow);
        $$hideDetails.on('click').react(viewModel.clearJobDetails);
    };
    return JobView;
})(ActivityView);
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="AbstractActivityView.ts"/> 
/// <reference path="JobView.ts"/> 
/// <reference path="_ActivityStatus.ts"/> 
var JobGroupView = (function (_super) {
    __extends(JobGroupView, _super);
    function JobGroupView() {
        _super.apply(this, arguments);
        this.template = "#JobGroupView";
    }
    JobGroupView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        dom('.content').observes(viewModel.jobs, JobView);
        dom.onUnrender().listen(function () {
            dom.$.fadeOut();
        });
    };
    return JobGroupView;
})(ActivityView);
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
        var timer = null;
        viewModel.active.listen((function (value) {
            if (value) {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                dom.$.stop().show();
            }
            else {
                timer = setTimeout(function () {
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
/// <reference path="ErrorView.ts"/> 
/// <reference path="../Views/JobGroupView.ts"/> 
/// <reference path="../Views/CommandProgressView.ts"/> 
var ApplicationView = (function () {
    function ApplicationView() {
        this.template = "#ApplicationView";
    }
    ApplicationView.prototype.init = function (dom, viewModel) {
        viewModel.environment.listen(function (value) {
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
        var applicationModel = new ApplicationModel();
        var schedulerService = new SchedulerService();
        var applicationViewModel = new ApplicationViewModel(applicationModel, schedulerService);
        js.dom('#application').render(ApplicationView, applicationViewModel);
        schedulerService.getData().done(function (data) {
            applicationModel.setData(data);
        }).then(function () { return schedulerService.executeCommand(new GetEnvironmentDataCommand()).done(function (data) { return applicationViewModel.setEnvoronmentData(data); }); });
    };
    return Application;
})();
new Application().run();
