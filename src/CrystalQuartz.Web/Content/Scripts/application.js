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

var Status = (function () {
    function Status(code, name) {
        this.code = code;
        this.name = name;
    }
    Status.byCode = function (code) {
        return _.find(Status._all, function (status) {
            return status.code === code;
        });
    };
    Status.Active = new Status('active', 'Active');
    Status.Paused = new Status('paused', 'Paused');
    Status.Mixed = new Status('mixed', 'Mixed');

    Status._all = [Status.Active, Status.Paused, Status.Mixed];
    return Status;
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
            } else {
                result.reject({
                    errorMessage: comandResult.ErrorMessage
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
        this.scheduler = new SchedulerViewModel(commandService, applicationModel);
        this.commandProgress = new CommandProgressViewModel(commandService);

        applicationModel.onDataChanged.listen(function (data) {
            return _this.setData(data);
        });
        commandService.onCommandFailed.listen(function (errorInfo) {
            return alert(errorInfo.errorMessage);
        });

        this.groupsSynchronizer = new ActivitiesSynschronizer(function (group, groupViewModel) {
            return group.Name === groupViewModel.name;
        }, function (group) {
            return new JobGroupViewModel(group, _this.commandService, _this.applicationModel);
        }, this.jobGroups);
    }
    ApplicationViewModel.prototype.setData = function (data) {
        //var groups = _.map(data.JobGroups, (group: JobGroup) => new JobGroupViewModel(group, this.commandService, this.applicationModel));
        this.scheduler.updateFrom(data);
        this.groupsSynchronizer.sync(data.JobGroups);
        //this.syncGroups(data.JobGroups);
        //this.jobGroups.setValue(groups);
    };

    ApplicationViewModel.prototype.syncGroups = function (groups) {
        var _this = this;
        var existingGroups = this.jobGroups.getValue();
        var identity = function (group, groupViewModel) {
            return group.Name === groupViewModel.name;
        };

        var deletedGroups = _.filter(existingGroups, function (groupViewModel) {
            return _.every(groups, function (group) {
                return !identity(group, groupViewModel);
            });
        });

        var addedGroups = _.filter(groups, function (group) {
            return _.every(existingGroups, function (groupViewModel) {
                return !identity(group, groupViewModel);
            });
        });

        var updatedGroups = _.filter(existingGroups, function (groupViewModel) {
            return _.some(groups, function (group) {
                return identity(group, groupViewModel);
            });
        });

        var addedGroupViewModels = _.map(addedGroups, function (group) {
            return new JobGroupViewModel(group, _this.commandService, _this.applicationModel);
        });

        console.log('deleted groups', deletedGroups);
        console.log('added groups', addedGroupViewModels);
        console.log('updated groups', updatedGroups);

        _.each(deletedGroups, function (groupViewModel) {
            return _this.jobGroups.remove(groupViewModel);
        });
        _.each(addedGroupViewModels, function (groupViewModel) {
            groupViewModel.updateFrom(_.find(groups, function (group) {
                return group.Name === groupViewModel.name;
            }));
            _this.jobGroups.add(groupViewModel);
        });
        _.each(updatedGroups, function (groupViewModel) {
            return groupViewModel.updateFrom(_.find(groups, function (group) {
                return group.Name === groupViewModel.name;
            }));
        });
    };

    ApplicationViewModel.prototype.getCommandProgress = function () {
        return new CommandProgressViewModel(this.commandService);
    };
    return ApplicationViewModel;
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
        var deletedActivities = _.filter(existingActivities, function (viewModel) {
            return _.every(activities, function (activity) {
                return _this.areNotEqual(activity, viewModel);
            });
        });

        var addedActivities = _.filter(activities, function (activity) {
            return _.every(existingActivities, function (viewModel) {
                return _this.areNotEqual(activity, viewModel);
            });
        });

        var updatedActivities = _.filter(existingActivities, function (viewModel) {
            return _.some(activities, function (activity) {
                return _this.areEqual(activity, viewModel);
            });
        });

        var addedViewModels = _.map(addedActivities, this.mapper);

        console.log('deleted activities', deletedActivities);
        console.log('added activities', addedViewModels);
        console.log('updated activities', updatedActivities);

        var finder = function (viewModel) {
            return _.find(activities, function (activity) {
                return _this.areEqual(activity, viewModel);
            });
        };

        _.each(deletedActivities, function (viewModel) {
            return _this.list.remove(viewModel);
        });
        _.each(addedViewModels, function (viewModel) {
            viewModel.updateFrom(finder(viewModel));
            _this.list.add(viewModel);
        });
        _.each(updatedActivities, function (viewModel) {
            return viewModel.updateFrom(finder(viewModel));
        });
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

    SchedulerViewModel.prototype.refreshData = function () {
        var _this = this;
        this.commandService.executeCommand(new GetDataCommand()).done(function (data) {
            return _this.applicationModel.setData(data);
        });
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
        this.name = activity.Name;
    }
    ManagableActivityViewModel.prototype.updateFrom = function (activity) {
        this.status.setValue(activity.Status);
        this.canStart.setValue(activity.CanStart);
        this.canPause.setValue(activity.CanPause);
    };

    ManagableActivityViewModel.prototype.resume = function () {
        var _this = this;
        this.commandService.executeCommand(this.createResumeCommand()).done(function (data) {
            return _this.applicationModel.setData(data);
        });
    };

    ManagableActivityViewModel.prototype.pause = function () {
        var _this = this;
        this.commandService.executeCommand(this.createPauseCommand()).done(function (data) {
            return _this.applicationModel.setData(data);
        });
    };

    ManagableActivityViewModel.prototype.createResumeCommand = function () {
        throw new Error("Abstract method call");
    };

    ManagableActivityViewModel.prototype.createPauseCommand = function () {
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
        this.jobsSynchronizer = new ActivitiesSynschronizer(function (job, jobViewModel) {
            return job.Name === jobViewModel.name;
        }, function (job) {
            return new JobViewModel(job, _this.name, _this.commandService, _this.applicationModel);
        }, this.jobs);
    }
    JobGroupViewModel.prototype.updateFrom = function (group) {
        _super.prototype.updateFrom.call(this, group);

        this.jobsSynchronizer.sync(group.Jobs);
    };

    JobGroupViewModel.prototype.createResumeCommand = function () {
        return new ResumeGroupCommand(this.name);
    };

    JobGroupViewModel.prototype.createPauseCommand = function () {
        return new PauseGroupCommand(this.name);
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
        this.triggersSynchronizer = new ActivitiesSynschronizer(function (trigger, triggerViewModel) {
            return trigger.Name === triggerViewModel.name;
        }, function (trigger) {
            return new TriggerViewModel(trigger, _this.group, _this.commandService, _this.applicationModel);
        }, this.triggers);
    }
    JobViewModel.prototype.loadJobDetails = function () {
        var _this = this;
        this.commandService.executeCommand(new GetJobDetailsCommand(this.group, this.name)).done(function (details) {
            return _this.details.setValue(details);
        });
    };

    JobViewModel.prototype.updateFrom = function (job) {
        _super.prototype.updateFrom.call(this, job);

        this.triggersSynchronizer.sync(job.Triggers);
    };

    JobViewModel.prototype.executeNow = function () {
        var _this = this;
        this.commandService.executeCommand(new ExecuteNowCommand(this.group, this.name)).done(function (data) {
            return _this.applicationModel.setData(data);
        });
    };

    JobViewModel.prototype.createResumeCommand = function () {
        return new ResumeJobCommand(this.group, this.name);
    };

    JobViewModel.prototype.createPauseCommand = function () {
        return new PauseJobCommand(this.group, this.name);
    };
    return JobViewModel;
})(ManagableActivityViewModel);

var TriggerViewModel = (function (_super) {
    __extends(TriggerViewModel, _super);
    function TriggerViewModel(trigger, group, commandService, applicationModel) {
        _super.call(this, trigger, commandService, applicationModel);
        this.group = group;
        this.startDate = js.observableValue();
        this.endDate = js.observableValue();
        this.previousFireDate = js.observableValue();
        this.nextFireDate = js.observableValue();
    }
    /*
    resume() {
    this.commandService
    .executeCommand(new ResumeTriggerCommand(this.job.GroupName, this.name))
    .done(data => this.applicationModel.setData(data));
    }
    
    pause() {
    this.commandService
    .executeCommand(new PauseTriggerCommand(this.job.GroupName, this.name))
    .done(data => this.applicationModel.setData(data));
    }*/
    TriggerViewModel.prototype.updateFrom = function (trigger) {
        _super.prototype.updateFrom.call(this, trigger);

        this.startDate.setValue(new NullableDate(trigger.StartDate));
        this.endDate.setValue(new NullableDate(trigger.EndDate));
        this.previousFireDate.setValue(new NullableDate(trigger.PreviousFireDate));
        this.nextFireDate.setValue(new NullableDate(trigger.NextFireDate));
    };

    TriggerViewModel.prototype.createResumeCommand = function () {
        return new ResumeTriggerCommand(this.group, this.name);
    };

    TriggerViewModel.prototype.createPauseCommand = function () {
        return new PauseTriggerCommand(this.group, this.name);
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
        dom('#refreshData').on('click').react(function () {
            viewModel.refreshData();
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
        this.template = '';
    }
    ActivityView.prototype.init = function (dom, viewModel) {
        dom('.name').observes(viewModel.name);

        dom('.status').observes(viewModel, ActivityStatusView2);

        viewModel.canPause.listen(function (value) {
            if (value) {
                dom('.actions .pause').$.removeClass('disabled');
            } else {
                dom('.actions .pause').$.addClass('disabled');
            }
        });

        viewModel.canStart.listen(function (value) {
            if (value) {
                dom('.actions .resume').$.removeClass('disabled');
            } else {
                dom('.actions .resume').$.addClass('disabled');
            }
        });

        dom('.actions .pause').on('click').react(viewModel.pause);
        dom('.actions .resume').on('click').react(viewModel.resume);
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

        //        dom('.name').observes(viewModel.name);
        //        dom('.status').observes(viewModel, ActivityStatusView2);
        dom('.startDate').observes(viewModel.startDate, NullableDateView);
        dom('.endDate').observes(viewModel.endDate, NullableDateView);
        dom('.previousFireDate').observes(viewModel.previousFireDate, NullableDateView);
        dom('.nextFireDate').observes(viewModel.nextFireDate, NullableDateView);
        //        viewModel.canPause.listen((value) => {
        //            if (value) {
        //                dom('.actions .pause').$.show();
        //            } else {
        //                dom('.actions .pause').$.hide();
        //            }
        //        });
        //
        //        dom('.actions .pause').on('click').react(viewModel.pause);
        //        dom('.actions .resume').on('click').react(viewModel.resume);
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
        } else {
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

        //        dom('.title').observes(viewModel.name);
        dom('.triggers tbody').observes(viewModel.triggers, TriggerView);
        dom('.detailsContainer').observes(viewModel.details, JobDetailsView);

        //        dom('.statusContainer').observes(viewModel, ActivityStatusView2);
        dom('.loadDetails').on('click').react(viewModel.loadJobDetails);

        //        dom('.actions .pause').on('click').react(viewModel.pause);
        //        dom('.actions .resume').on('click').react(viewModel.resume);
        dom('.actions .execute').on('click').react(viewModel.executeNow);
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

        //dom('header h2').observes(viewModel.name);
        //        dom('.status').observes(viewModel, ActivityStatusView2);
        dom('.content').observes(viewModel.jobs, JobView);

        //        dom('.actions .pause').on('click').react(viewModel.pause);
        //        dom('.actions .resume').on('click').react(viewModel.resume);
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

        viewModel.active.listen((function (value) {
            if (value) {
                dom.$.show();
                dom.$.show();
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
        var applicationModel = new ApplicationModel();

        var schedulerService = new SchedulerService();
        var applicationViewModel = new ApplicationViewModel(applicationModel, schedulerService);

        js.dom('#application').render(ApplicationView, applicationViewModel);

        schedulerService.getData().done(function (data) {
            applicationModel.setData(data);
        });
    };
    return Application;
})();

new Application().run();
