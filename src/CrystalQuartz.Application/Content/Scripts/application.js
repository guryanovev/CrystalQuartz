var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../Definitions/jquery.d.ts"/> 
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
var ApplicationModel = (function () {
    function ApplicationModel() {
        this.onDataChanged = new js.Event();
        this.onAddTrigger = new js.Event();
    }
    ApplicationModel.prototype.setData = function (data) {
        this.onDataChanged.trigger(data);
    };
    ApplicationModel.prototype.addTriggerFor = function (job) {
        this.onAddTrigger.trigger(job);
    };
    return ApplicationModel;
}());
var DateData = (function () {
    function DateData() {
    }
    return DateData;
}());
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
}());
var AbstractCommand = (function () {
    function AbstractCommand() {
        this.data = {};
    }
    return AbstractCommand;
}());
var GetEnvironmentDataCommand = (function (_super) {
    __extends(GetEnvironmentDataCommand, _super);
    function GetEnvironmentDataCommand() {
        var _this = _super.call(this) || this;
        _this.code = 'get_env';
        _this.message = 'Loading environment data';
        return _this;
    }
    return GetEnvironmentDataCommand;
}(AbstractCommand));
var GetDataCommand = (function (_super) {
    __extends(GetDataCommand, _super);
    function GetDataCommand() {
        var _this = _super.call(this) || this;
        _this.code = 'get_data';
        _this.message = 'Loading scheduler data';
        return _this;
    }
    return GetDataCommand;
}(AbstractCommand));
var StartSchedulerCommand = (function (_super) {
    __extends(StartSchedulerCommand, _super);
    function StartSchedulerCommand() {
        var _this = _super.call(this) || this;
        _this.code = 'start_scheduler';
        _this.message = 'Starting the scheduler';
        return _this;
    }
    return StartSchedulerCommand;
}(AbstractCommand));
var StopSchedulerCommand = (function (_super) {
    __extends(StopSchedulerCommand, _super);
    function StopSchedulerCommand() {
        var _this = _super.call(this) || this;
        _this.code = 'stop_scheduler';
        _this.message = 'Stopping the scheduler';
        return _this;
    }
    return StopSchedulerCommand;
}(AbstractCommand));
/*
 * Group Commands
 */
var PauseGroupCommand = (function (_super) {
    __extends(PauseGroupCommand, _super);
    function PauseGroupCommand(group) {
        var _this = _super.call(this) || this;
        _this.code = 'pause_group';
        _this.message = 'Pausing group';
        _this.data = {
            group: group
        };
        return _this;
    }
    return PauseGroupCommand;
}(AbstractCommand));
var ResumeGroupCommand = (function (_super) {
    __extends(ResumeGroupCommand, _super);
    function ResumeGroupCommand(group) {
        var _this = _super.call(this) || this;
        _this.code = 'resume_group';
        _this.message = 'Resuming group';
        _this.data = {
            group: group
        };
        return _this;
    }
    return ResumeGroupCommand;
}(AbstractCommand));
var DeleteGroupCommand = (function (_super) {
    __extends(DeleteGroupCommand, _super);
    function DeleteGroupCommand(group) {
        var _this = _super.call(this) || this;
        _this.code = 'delete_group';
        _this.message = 'Deleting group';
        _this.data = {
            group: group
        };
        return _this;
    }
    return DeleteGroupCommand;
}(AbstractCommand));
/*
 * Job Commands
 */
var PauseJobCommand = (function (_super) {
    __extends(PauseJobCommand, _super);
    function PauseJobCommand(group, job) {
        var _this = _super.call(this) || this;
        _this.code = 'pause_job';
        _this.message = 'Pausing job';
        _this.data = {
            group: group,
            job: job
        };
        return _this;
    }
    return PauseJobCommand;
}(AbstractCommand));
var ResumeJobCommand = (function (_super) {
    __extends(ResumeJobCommand, _super);
    function ResumeJobCommand(group, job) {
        var _this = _super.call(this) || this;
        _this.code = 'resume_job';
        _this.message = 'Resuming job';
        _this.data = {
            group: group,
            job: job
        };
        return _this;
    }
    return ResumeJobCommand;
}(AbstractCommand));
var DeleteJobCommand = (function (_super) {
    __extends(DeleteJobCommand, _super);
    function DeleteJobCommand(group, job) {
        var _this = _super.call(this) || this;
        _this.code = 'delete_job';
        _this.message = 'Deleting job';
        _this.data = {
            group: group,
            job: job
        };
        return _this;
    }
    return DeleteJobCommand;
}(AbstractCommand));
var ExecuteNowCommand = (function (_super) {
    __extends(ExecuteNowCommand, _super);
    function ExecuteNowCommand(group, job) {
        var _this = _super.call(this) || this;
        _this.code = 'execute_job';
        _this.message = 'Executing job';
        _this.data = {
            group: group,
            job: job
        };
        return _this;
    }
    return ExecuteNowCommand;
}(AbstractCommand));
/*
 * Trigger Commands
 */
var PauseTriggerCommand = (function (_super) {
    __extends(PauseTriggerCommand, _super);
    function PauseTriggerCommand(group, trigger) {
        var _this = _super.call(this) || this;
        _this.code = 'pause_trigger';
        _this.message = 'Pausing trigger';
        _this.data = {
            group: group,
            trigger: trigger
        };
        return _this;
    }
    return PauseTriggerCommand;
}(AbstractCommand));
var ResumeTriggerCommand = (function (_super) {
    __extends(ResumeTriggerCommand, _super);
    function ResumeTriggerCommand(group, trigger) {
        var _this = _super.call(this) || this;
        _this.code = 'resume_trigger';
        _this.message = 'Resuming trigger';
        _this.data = {
            group: group,
            trigger: trigger
        };
        return _this;
    }
    return ResumeTriggerCommand;
}(AbstractCommand));
var DeleteTriggerCommand = (function (_super) {
    __extends(DeleteTriggerCommand, _super);
    function DeleteTriggerCommand(group, trigger) {
        var _this = _super.call(this) || this;
        _this.code = 'delete_trigger';
        _this.message = 'Deleting trigger';
        _this.data = {
            group: group,
            trigger: trigger
        };
        return _this;
    }
    return DeleteTriggerCommand;
}(AbstractCommand));
var GetJobDetailsCommand = (function (_super) {
    __extends(GetJobDetailsCommand, _super);
    function GetJobDetailsCommand(group, job) {
        var _this = _super.call(this) || this;
        _this.code = 'get_job_details';
        _this.message = 'Loading job details';
        _this.data = {
            group: group,
            job: job
        };
        return _this;
    }
    return GetJobDetailsCommand;
}(AbstractCommand));
var AddTriggerCommand = (function (_super) {
    __extends(AddTriggerCommand, _super);
    function AddTriggerCommand(form) {
        var _this = _super.call(this) || this;
        _this.code = 'add_trigger';
        _this.message = 'Adding new trigger';
        _this.data = form;
        return _this;
    }
    return AddTriggerCommand;
}(AbstractCommand));
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>
var TimelineActivity = (function () {
    function TimelineActivity(data) {
        this.data = data;
        this.position = new js.ObservableValue();
        this.key = data.key;
    }
    TimelineActivity.prototype.getStartDate = function () {
        return this.data.startedAt;
    };
    TimelineActivity.prototype.getCompleteDate = function () {
        return this.data.completedAt;
    };
    TimelineActivity.prototype.complete = function (date) {
        this.data.completedAt = date || new Date().getTime();
    };
    ;
    TimelineActivity.prototype.recalculate = function (rangeStart, rangeEnd) {
        var rangeWidth = rangeEnd - rangeStart, activityStart = this.getStartDate(), activityComplete = this.getCompleteDate() || rangeEnd, isOutOfViewport = activityStart <= rangeStart && activityComplete <= rangeStart;
        if (isOutOfViewport) {
            return false;
        }
        var viewPortActivityStart = activityStart < rangeStart ? rangeStart : activityStart;
        this.position.setValue({
            left: 100 * (viewPortActivityStart - rangeStart) / rangeWidth,
            width: 100 * (activityComplete - viewPortActivityStart) / rangeWidth
        });
        return true;
    };
    ;
    return TimelineActivity;
}());
var TimelineSlot = (function () {
    function TimelineSlot(options) {
        this.activities = new js.ObservableList();
        options = options || {};
        this.title = options.title;
        this.key = options.key;
    }
    TimelineSlot.prototype.add = function (activity /* todo: activity options typings */) {
        var result = new TimelineActivity(activity);
        this.activities.add(result);
        return result;
    };
    ;
    TimelineSlot.prototype.remove = function (activity) {
        this.activities.remove(activity);
    };
    ;
    TimelineSlot.prototype.isEmpty = function () {
        return this.activities.getValue().length === 0;
    };
    ;
    TimelineSlot.prototype.isBusy = function () {
        var activities = this.activities.getValue();
        for (var i = 0; i < activities.length; i++) {
            if (!activities[i].getCompleteDate()) {
                return true;
            }
        }
        return false;
    };
    TimelineSlot.prototype.recalculate = function (range) {
        var activities = this.activities.getValue(), rangeStart = range.start, rangeEnd = range.end;
        for (var i = 0; i < activities.length; i++) {
            var activity = activities[i];
            if (!activity.recalculate(rangeStart, rangeEnd)) {
                this.activities.remove(activity);
                if (this.isEmpty()) {
                    return false;
                }
            }
        }
        return true;
    };
    TimelineSlot.prototype.findActivityBy = function (key) {
        var activities = this.activities.getValue();
        for (var i = 0; i < activities.length; i++) {
            if (activities[i].key === key) {
                return activities[i];
            }
        }
        return null;
    };
    return TimelineSlot;
}());
;
var TimelineTicks = (function () {
    function TimelineTicks(ticksCount, timelineSizeMilliseconds) {
        this.ticksCount = ticksCount;
        this.timelineSizeMilliseconds = timelineSizeMilliseconds;
        this.items = new js.ObservableList();
        this.shift = new js.ObservableValue();
        this.millisecondsPerTick = timelineSizeMilliseconds / (ticksCount);
        this.tickWidthPercent = 100 / (ticksCount + 1);
    }
    TimelineTicks.prototype.init = function () {
        var now = Math.ceil(new Date().getTime() / this.millisecondsPerTick) * this.millisecondsPerTick, items = [];
        for (var i = 0; i < this.ticksCount + 1; i++) {
            var tickDate = now - this.millisecondsPerTick * (this.ticksCount - i + 1);
            items.push({
                tickDate: tickDate,
                width: this.tickWidthPercent
            });
        }
        this.items.setValue(items);
        this.calculateShift(now);
    };
    ;
    TimelineTicks.prototype.update = function (start, end) {
        var currentItems = this.items.getValue();
        if (!currentItems) {
            return;
        }
        this.removeOutdatedTicks(start, currentItems);
        if (this.items.getValue().length === 0) {
            this.init();
        }
        else {
            var edgeTick = this.items.getValue()[this.items.getValue().length - 1];
            while (edgeTick.tickDate + this.millisecondsPerTick / 2 < end) {
                var newTick = {
                    tickDate: edgeTick.tickDate + this.millisecondsPerTick,
                    width: this.tickWidthPercent
                };
                this.items.add(newTick);
                edgeTick = newTick;
            }
        }
        this.calculateShift(new Date().getTime());
    };
    ;
    TimelineTicks.prototype.getEdgeTick = function () {
        return this.items.getValue()[this.items.getValue().length - 1];
    };
    TimelineTicks.prototype.calculateShift = function (endDate) {
        var edgeTick = this.getEdgeTick(), shiftMilliseconds = endDate - edgeTick.tickDate + this.millisecondsPerTick / 2, shiftPercent = 100 * shiftMilliseconds / this.timelineSizeMilliseconds;
        this.shift.setValue(shiftPercent);
    };
    ;
    TimelineTicks.prototype.removeOutdatedTicks = function (startDate, items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.tickDate + this.millisecondsPerTick / 2 < startDate) {
                this.items.remove(item);
            }
            else {
                return;
            }
        }
    };
    return TimelineTicks;
}());
;
var Timeline = (function () {
    function Timeline() {
        this._timeRef = null;
        this.timelineSizeMilliseconds = 1000 * 60 * 60;
        this.range = new js.ObservableValue();
        this.slots = new js.ObservableList();
        this.ticks = new TimelineTicks(20, this.timelineSizeMilliseconds);
    }
    Timeline.prototype.init = function () {
        var _this = this;
        this.ticks.init();
        this.updateInterval();
        this._timeRef = setInterval(function () {
            _this.updateInterval();
        }, 1000);
    };
    Timeline.prototype.addSlot = function (slotKey /* todo: slot options typings */) {
        var result = new TimelineSlot(slotKey);
        this.slots.add(result);
        return result;
    };
    ;
    Timeline.prototype.addActivity = function (slot, activity /* todo: typings for activity options */) {
        var actualActivity = slot.add(activity);
        this.recalculateSlot(slot, this.range.getValue());
        return actualActivity;
    };
    Timeline.prototype.findSlotBy = function (key) {
        var slots = this.slots.getValue();
        for (var i = 0; i < slots.length; i++) {
            if (slots[i].key === key) {
                return slots[i];
            }
        }
        return null;
    };
    Timeline.prototype.updateInterval = function () {
        var now = new Date().getTime(), start = now - this.timelineSizeMilliseconds, range = {
            start: start,
            end: now
        };
        this.range.setValue(range);
        this.ticks.update(start, now);
        var slots = this.slots.getValue();
        for (var i = 0; i < slots.length; i++) {
            this.recalculateSlot(slots[i], range);
        }
    };
    Timeline.prototype.recalculateSlot = function (slot, range) {
        if (!range) {
            return;
        }
        if (!slot.recalculate(range)) {
            this.slots.remove(slot);
        }
    };
    ;
    return Timeline;
}());
;
/// <reference path="../Definitions/jquery.d.ts"/> 
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Definitions/lodash.d.ts"/> 
/// <reference path="Models.ts"/> 
var SchedulerService = (function () {
    function SchedulerService() {
        this.onCommandStart = new js.Event();
        this.onCommandComplete = new js.Event();
        this.onCommandFailed = new js.Event();
        this.onEvent = new js.Event(); // todo: typings
        this._minEventId = 0;
    }
    SchedulerService.prototype.getData = function () {
        return this.executeCommand(new GetDataCommand());
    };
    SchedulerService.prototype.executeCommand = function (command) {
        var _this = this;
        var result = $.Deferred(), data = _.assign(command.data, { command: command.code, minEventId: this._minEventId }), that = this;
        this.onCommandStart.trigger(command);
        $.post('', data)
            .done(function (response) {
            var comandResult = response;
            if (comandResult.Success) {
                result.resolve(response);
                /* Events handling */
                var eventsResult = comandResult, events = eventsResult.Events;
                if (events && events.length > 0) {
                    for (var i = 0; i < events.length; i++) {
                        _this.onEvent.trigger(events[i]);
                    }
                    _this._minEventId = _.max(_.map(events, function (e) { return e.Id; }));
                }
            }
            else {
                result.reject({
                    errorMessage: comandResult.ErrorMessage,
                    details: comandResult.ErrorDetails
                });
            }
            return response;
        })
            .fail(function () {
            result.reject({
                errorMessage: 'Unknown error while executing the command'
            });
        });
        return result
            .promise()
            .always(function () {
            that.onCommandComplete.trigger(command);
        })
            .fail(function (response) {
            var comandResult = response;
            that.onCommandFailed.trigger(comandResult);
        });
    };
    return SchedulerService;
}());
/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>
/// <reference path="Timeline.ts"/>
/// <reference path="Models.ts"/>
/// <reference path="Services.ts"/>
var ApplicationViewModel = (function () {
    function ApplicationViewModel(applicationModel, commandService) {
        var _this = this;
        this.applicationModel = applicationModel;
        this.commandService = commandService;
        this.environment = js.observableValue();
        this.autoUpdateMessage = js.observableValue();
        this.triggerEditorJob = js.observableValue();
        this.jobGroups = js.observableList();
        this.scheduler = new SchedulerViewModel(commandService, applicationModel);
        this.commandProgress = new CommandProgressViewModel(commandService);
        applicationModel.onDataChanged.listen(function (data) { return _this.setData(data); });
        applicationModel.onAddTrigger.listen(function (job) { return _this.triggerEditorJob.setValue(new TriggerDialogViewModel(job, function (result) { return _this.onTriggerDialogClosed(result); }, commandService)); });
        this.groupsSynchronizer = new ActivitiesSynschronizer(function (group, groupViewModel) { return group.Name === groupViewModel.name; }, function (group) { return new JobGroupViewModel(group, _this.commandService, _this.applicationModel); }, this.jobGroups);
        this.timeline = new Timeline();
    }
    ApplicationViewModel.prototype.initTimeline = function () {
        var _this = this;
        this.timeline.init();
        this.commandService.onEvent.listen(function (event) {
            var slotKey = event.Event.Group + '/' + event.Event.Job + '/' + event.Event.Trigger;
            if (event.Event.TypeCode === 'TRIGGER_FIRED') {
                var slot = _this.timeline.findSlotBy(slotKey) || _this.timeline.addSlot({ key: slotKey, title: slotKey });
                _this.timeline.addActivity(slot, {
                    key: event.Event.FireInstanceId,
                    startedAt: event.Date.Ticks
                });
            }
            else if (event.Event.TypeCode === 'TRIGGER_COMPLETE') {
                var completeSlot = _this.timeline.findSlotBy(slotKey);
                if (completeSlot) {
                    var activity = completeSlot.findActivityBy(event.Event.FireInstanceId);
                    activity.complete(event.Date.Ticks);
                }
            }
        });
    };
    ApplicationViewModel.prototype.onTriggerDialogClosed = function (isSaved) {
        this.triggerEditorJob.setValue(null);
        this.updateData();
    };
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
        var now = new Date(), sleepInterval = this.calculateSleepInterval(nextUpdateDate), actualUpdateDate = new Date(now.getTime() + sleepInterval), message = 'next update at ' + actualUpdateDate.toTimeString();
        this.autoUpdateMessage.setValue(message);
        this._autoUpdateTimes = setTimeout(function () {
            _this.autoUpdateMessage.setValue('updating...');
            _this.updateData();
        }, sleepInterval);
    };
    ApplicationViewModel.prototype.calculateSleepInterval = function (nextUpdateDate) {
        var now = new Date(), sleepInterval = nextUpdateDate.getTime() - now.getTime();
        if (sleepInterval < 0) {
            // updateDate is in the past, the scheduler is probably not started yet
            return ApplicationViewModel.DEFAULT_UPDATE_INTERVAL;
        }
        if (sleepInterval < ApplicationViewModel.MIN_UPDATE_INTERVAL) {
            // the delay interval is too small
            // we need to extend it to avoid huge amount of queries
            return ApplicationViewModel.MIN_UPDATE_INTERVAL;
        }
        if (sleepInterval > ApplicationViewModel.MAX_UPDATE_INTERVAL) {
            // the interval is too big
            return ApplicationViewModel.MAX_UPDATE_INTERVAL;
        }
        return sleepInterval;
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
    return ApplicationViewModel;
}());
ApplicationViewModel.DEFAULT_UPDATE_INTERVAL = 30000; // 30sec
ApplicationViewModel.MAX_UPDATE_INTERVAL = 300000; // 5min
ApplicationViewModel.MIN_UPDATE_INTERVAL = 10000; // 10sec
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
}());
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
}());
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
        this.commandService
            .executeCommand(new StartSchedulerCommand())
            .done(function (data) { return _this.applicationModel.setData(data); });
    };
    SchedulerViewModel.prototype.stopScheduler = function () {
        var _this = this;
        this.commandService
            .executeCommand(new StopSchedulerCommand())
            .done(function (data) { return _this.applicationModel.setData(data); });
    };
    SchedulerViewModel.prototype.refreshData = function () {
        var _this = this;
        this.commandService
            .executeCommand(new GetDataCommand())
            .done(function (data) { return _this.applicationModel.setData(data); });
    };
    return SchedulerViewModel;
}());
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
        this.commandService
            .executeCommand(this.createResumeCommand())
            .done(function (data) { return _this.applicationModel.setData(data); });
    };
    ManagableActivityViewModel.prototype.pause = function () {
        var _this = this;
        this.commandService
            .executeCommand(this.createPauseCommand())
            .done(function (data) { return _this.applicationModel.setData(data); });
    };
    ManagableActivityViewModel.prototype["delete"] = function () {
        var _this = this;
        if (confirm(this.getDeleteConfirmationsText())) {
            this.commandService
                .executeCommand(this.createDeleteCommand())
                .done(function (data) { return _this.applicationModel.setData(data); });
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
}());
var JobGroupViewModel = (function (_super) {
    __extends(JobGroupViewModel, _super);
    function JobGroupViewModel(group, commandService, applicationModel) {
        var _this = _super.call(this, group, commandService, applicationModel) || this;
        _this.jobs = js.observableList();
        _this.jobsSynchronizer = new ActivitiesSynschronizer(function (job, jobViewModel) { return job.Name === jobViewModel.name; }, function (job) { return new JobViewModel(job, _this.name, _this.commandService, _this.applicationModel); }, _this.jobs);
        return _this;
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
}(ManagableActivityViewModel));
var JobViewModel = (function (_super) {
    __extends(JobViewModel, _super);
    function JobViewModel(job, group, commandService, applicationModel) {
        var _this = _super.call(this, job, commandService, applicationModel) || this;
        _this.job = job;
        _this.group = group;
        _this.triggers = js.observableList();
        _this.details = js.observableValue();
        _this.triggersSynchronizer = new ActivitiesSynschronizer(function (trigger, triggerViewModel) { return trigger.Name === triggerViewModel.name; }, function (trigger) { return new TriggerViewModel(trigger, _this.commandService, _this.applicationModel); }, _this.triggers);
        return _this;
    }
    JobViewModel.prototype.loadJobDetails = function () {
        var _this = this;
        this.commandService
            .executeCommand(new GetJobDetailsCommand(this.group, this.name))
            .done(function (details) { return _this.details.setValue(details); });
    };
    JobViewModel.prototype.updateFrom = function (job) {
        _super.prototype.updateFrom.call(this, job);
        this.triggersSynchronizer.sync(job.Triggers);
    };
    JobViewModel.prototype.executeNow = function () {
        var _this = this;
        this.commandService
            .executeCommand(new ExecuteNowCommand(this.group, this.name))
            .done(function (data) { return _this.applicationModel.setData(data); });
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
    JobViewModel.prototype.addTrigger = function () {
        this.applicationModel.addTriggerFor(this.job);
    };
    return JobViewModel;
}(ManagableActivityViewModel));
var TriggerViewModel = (function (_super) {
    __extends(TriggerViewModel, _super);
    function TriggerViewModel(trigger, commandService, applicationModel) {
        var _this = _super.call(this, trigger, commandService, applicationModel) || this;
        _this.startDate = js.observableValue();
        _this.endDate = js.observableValue();
        _this.previousFireDate = js.observableValue();
        _this.nextFireDate = js.observableValue();
        _this.triggerType = js.observableValue();
        return _this;
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
}(ManagableActivityViewModel));
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
}());
var ValidatorViewModel = (function () {
    function ValidatorViewModel(forced, key, source, validators, condition) {
        var _this = this;
        this.key = key;
        this.source = source;
        this.validators = validators;
        this.condition = condition;
        this._errors = new js.ObservableValue();
        this.dirty = new js.ObservableValue();
        var conditionErrors = condition ?
            js.dependentValue(function (validationAllowed, errors) { return validationAllowed ? errors : []; }, condition, this._errors) :
            this._errors;
        this.errors = js.dependentValue(function (isDirty, isForced, errors) {
            if (isForced || isDirty) {
                return errors;
            }
            return [];
        }, this.dirty, forced, conditionErrors);
        source.listen(function (value) {
            var actualErrors = [];
            for (var i = 0; i < validators.length; i++) {
                var errors = validators[i](value);
                if (errors) {
                    for (var j = 0; j < errors.length; j++) {
                        actualErrors.push(errors[j]);
                    }
                }
            }
            _this._errors.setValue(actualErrors);
        }, false);
    }
    ValidatorViewModel.prototype.reset = function () {
        this._errors.setValue([]);
    };
    ValidatorViewModel.prototype.makeDirty = function () {
        this.dirty.setValue(true);
    };
    ValidatorViewModel.prototype.hasErrors = function () {
        return this.errors.getValue().length > 0;
    };
    return ValidatorViewModel;
}());
var Validators = (function () {
    function Validators() {
        this._forced = new js.ObservableValue();
        this.validators = [];
    }
    Validators.prototype.register = function (options) {
        var validators = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            validators[_i - 1] = arguments[_i];
        }
        this.validators.push(new ValidatorViewModel(this._forced, options.key || options.source, options.source, validators, options.condition));
    };
    Validators.prototype.findFor = function (key) {
        for (var i = 0; i < this.validators.length; i++) {
            if (this.validators[i].key === key) {
                return this.validators[i];
            }
        }
        return null;
    };
    Validators.prototype.validate = function () {
        this._forced.setValue(true);
        return !_.any(this.validators, function (v) { return v.hasErrors(); });
    };
    return Validators;
}());
function map(source, func) {
    return js.dependentValue(func, source);
}
var ValidatorsFactory = (function () {
    function ValidatorsFactory() {
    }
    ValidatorsFactory.required = function (message) {
        return function (value) {
            if (!value) {
                return [message];
            }
            return [];
        };
    };
    ValidatorsFactory.isInteger = function (message) {
        return function (value) {
            if (value === null || value === undefined) {
                return [];
            }
            var rawValue = value.toString();
            for (var i = 0; i < rawValue.length; i++) {
                var char = rawValue.charAt(i);
                if (char < '0' || char > '9') {
                    return [message];
                }
            }
            return [];
        };
    };
    return ValidatorsFactory;
}());
var TriggerDialogViewModel = (function () {
    function TriggerDialogViewModel(job, callback, commandService) {
        this.job = job;
        this.callback = callback;
        this.commandService = commandService;
        this.triggerName = js.observableValue();
        this.triggerType = js.observableValue();
        this.cronExpression = js.observableValue();
        this.repeatForever = js.observableValue();
        this.repeatCount = js.observableValue();
        this.repeatInterval = js.observableValue();
        this.repeatIntervalType = js.observableValue();
        this.isSaving = js.observableValue();
        this.validators = new Validators();
        var isSimpleTrigger = map(this.triggerType, function (x) { return x === 'Simple'; });
        this.validators.register({
            source: this.cronExpression,
            condition: map(this.triggerType, function (x) { return x === 'Cron'; })
        }, ValidatorsFactory.required('Please enter cron expression'));
        this.validators.register({
            source: this.repeatCount,
            condition: js.dependentValue(function (isSimple, repeatForever) { return isSimple && !repeatForever; }, isSimpleTrigger, this.repeatForever)
        }, ValidatorsFactory.required('Please enter repeat count'), ValidatorsFactory.isInteger('Please enter an integer number'));
        this.validators.register({
            source: this.repeatInterval,
            condition: isSimpleTrigger
        }, ValidatorsFactory.required('Please enter repeat interval'), ValidatorsFactory.isInteger('Please enter an integer number'));
    }
    TriggerDialogViewModel.prototype.cancel = function () {
        this.callback(false);
    };
    TriggerDialogViewModel.prototype.save = function () {
        var _this = this;
        if (!this.validators.validate()) {
            return false;
        }
        var form = {
            name: this.triggerName.getValue(),
            job: this.job.Name,
            group: this.job.GroupName,
            triggerType: this.triggerType.getValue()
        };
        if (this.triggerType.getValue() === 'Simple') {
            var repeatForever = this.repeatForever.getValue();
            form.repeatForever = repeatForever;
            if (!repeatForever) {
                form.repeatCount = +this.repeatCount.getValue();
            }
            var repeatInterval = +this.repeatInterval.getValue();
            form.repeatInterval = repeatInterval * this.getIntervalMultiplier();
        }
        else if (this.triggerType.getValue() === 'Cron') {
            form.cronExpression = this.cronExpression.getValue();
        }
        this.isSaving.setValue(true);
        this.commandService
            .executeCommand(new AddTriggerCommand(form))
            .then(function (result) {
            if (result.Success) {
                _this.callback(true);
            }
        })
            .always(function () {
            _this.isSaving.setValue(false);
        })
            .fail(function (reason) {
            console.log(reason);
        });
        return true;
    };
    TriggerDialogViewModel.prototype.getIntervalMultiplier = function () {
        var intervalCode = this.repeatIntervalType.getValue();
        if (intervalCode === 'Seconds') {
            return 1000;
        }
        if (intervalCode === 'Minutes') {
            return 1000 * 60;
        }
        if (intervalCode === 'Hours') {
            return 1000 * 60 * 60;
        }
        if (intervalCode === 'Days') {
            return 1000 * 60 * 60 * 24;
        }
        return 1;
    };
    return TriggerDialogViewModel;
}());
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
}());
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
}());
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="SchedulerView.ts"/> 
var ActivityStatusView2 = (function () {
    function ActivityStatusView2() {
        this.template = '<span class="cq-activity-status">' +
            '<span class="cq-activity-status-primary"></span>' +
            '<span class="cq-activity-status-secondary"></span>' +
            '</span>';
    }
    ActivityStatusView2.prototype.init = function (dom, statusAware) {
        statusAware.status.listen(function (newValue, oldValue) {
            if (oldValue) {
                dom.$.removeClass(oldValue.Code);
            }
            if (newValue) {
                dom.$
                    .addClass(newValue.Code)
                    .attr('title', 'Status: ' + newValue.Name);
            }
        });
    };
    return ActivityStatusView2;
}());
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
        this.handleClick($$delete, viewModel["delete"], viewModel);
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
}());
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="AbstractActivityView.ts"/> 
/// <reference path="_NullableDate.ts"/> 
/// <reference path="_ActivityStatus.ts"/> 
var TriggerView = (function (_super) {
    __extends(TriggerView, _super);
    function TriggerView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.template = "#TriggerView";
        return _this;
    }
    TriggerView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        dom('.startDate').observes(viewModel.startDate, NullableDateView);
        dom('.endDate').observes(viewModel.endDate, NullableDateView);
        dom('.previousFireDate').observes(viewModel.previousFireDate, NullableDateView);
        dom('.nextFireDate').observes(viewModel.nextFireDate, NullableDateView);
        dom('.type').observes(viewModel.triggerType);
        dom.onUnrender().listen(function () {
            dom('.name').$.text(viewModel.name);
            dom('.type').$.text('Trigger complete');
            var $root = dom.root.$;
            $root.css('background', '#CCCCCC');
            $root.fadeOut('slow', function () {
                dom.root.remove();
            });
        });
    };
    return TriggerView;
}(ActivityView));
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
}());
var PropertyView = (function () {
    function PropertyView() {
        this.template = '<tr>' +
            '<td class="name"></td>' +
            '<td class="value"></td>' +
            '</tr>';
    }
    PropertyView.prototype.init = function (dom, value) {
        dom('.name').observes(value.Name);
        dom('.value').observes(value, PropertyValue);
    };
    return PropertyView;
}());
var PropertyWithTypeView = (function () {
    function PropertyWithTypeView() {
        this.template = '<tr>' +
            '<td class="name"></td>' +
            '<td class="value"></td>' +
            '<td class="type"><span class="runtimetype"></span></td>' +
            '</tr>';
    }
    PropertyWithTypeView.prototype.init = function (dom, value) {
        dom('.name').observes(value.Name);
        dom('.value').observes(value, PropertyValue);
        dom('.type span').observes(value.TypeName);
    };
    return PropertyWithTypeView;
}());
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
}());
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
}());
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="AbstractActivityView.ts"/> 
/// <reference path="TriggerView.ts"/> 
/// <reference path="JobDetailsView.ts"/> 
var JobView = (function (_super) {
    __extends(JobView, _super);
    function JobView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.template = "#JobView";
        return _this;
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
        dom('.triggers').observes(viewModel.triggers, TriggerView);
        dom('.detailsContainer').observes(viewModel.details, JobDetailsView);
        dom('.loadDetails').on('click').react(viewModel.loadJobDetails);
        dom('.actions .execute').on('click').react(viewModel.executeNow);
        dom('.addTrigger').on('click').react(viewModel.addTrigger);
        $$hideDetails.on('click').react(viewModel.clearJobDetails);
    };
    return JobView;
}(ActivityView));
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="AbstractActivityView.ts"/> 
/// <reference path="JobView.ts"/> 
/// <reference path="_ActivityStatus.ts"/> 
var JobGroupView = (function (_super) {
    __extends(JobGroupView, _super);
    function JobGroupView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.template = "#JobGroupView";
        return _this;
    }
    JobGroupView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        dom('.children').observes(viewModel.jobs, JobView);
        dom.onUnrender().listen(function () {
            dom.$.fadeOut();
        });
    };
    return JobGroupView;
}(ActivityView));
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="SchedulerView.ts"/> 
/// <reference path="../Views/JobGroupView.ts"/> 
var CommandProgressView = (function () {
    function CommandProgressView() {
        this.template = '<section class="cq-busy">' +
            '<div class="cq-busy-image">' +
            '<img src="?path=Images.loading.gif"/>' +
            '</div>' +
            '<div id="currentCommand" class="cq-current-command"></div>' +
            '</section>';
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
}());
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/>
var ValidationError = (function () {
    function ValidationError() {
        this.template = '<li></li>';
    }
    ValidationError.prototype.init = function (dom, viewModel) {
        dom('li').observes(viewModel);
    };
    return ValidationError;
}());
var ValidatorView = (function () {
    function ValidatorView() {
        this.template = '<ul class="cq-validator"></ul>';
    }
    ValidatorView.prototype.init = function (dom, viewModel) {
        dom('ul').observes(viewModel.errors, ValidationError);
    };
    return ValidatorView;
}());
var TriggerDialogView = (function () {
    function TriggerDialogView() {
        this.template = '#TriggerDialogView';
    }
    TriggerDialogView.prototype.init = function (dom, viewModel) {
        dom('.triggerName').observes(viewModel.triggerName);
        dom('.triggerType').observes(viewModel.triggerType);
        dom('.repeatForever').observes(viewModel.repeatForever);
        var $repeatCount = dom('.repeatCount');
        dom('.repeatIntervalType').observes(viewModel.repeatIntervalType);
        this.valueAndValidator(dom('.cronExpression'), dom('.cronExpressionContainer'), viewModel.cronExpression, viewModel.validators);
        this.valueAndValidator(dom('.repeatInterval'), dom('.repeatIntervalContainer'), viewModel.repeatInterval, viewModel.validators);
        this.valueAndValidator(dom('.repeatCount'), dom('.repeatCountContainer'), viewModel.repeatCount, viewModel.validators);
        var $simpleTriggerDetails = dom('.simpleTriggerDetails');
        var $cronTriggerDetails = dom('.cronTriggerDetails');
        var triggersUi = [
            { code: 'Simple', element: $simpleTriggerDetails.$ },
            { code: 'Cron', element: $cronTriggerDetails.$ }
        ];
        viewModel.triggerType.listen(function (value) {
            for (var i = 0; i < triggersUi.length; i++) {
                var triggerData = triggersUi[i];
                if (triggerData.code === value) {
                    triggerData.element.show();
                }
                else {
                    triggerData.element.hide();
                }
            }
        });
        var $saveButton = dom('.save');
        dom('.cancel').on('click').react(viewModel.cancel);
        $saveButton.on('click').react(function () {
            if (viewModel.isSaving.getValue()) {
                return;
            }
            var isValid = viewModel.save();
            if (!isValid) {
                $saveButton.$.addClass("effects-shake");
                setTimeout(function () {
                    $saveButton.$.removeClass("effects-shake");
                }, 2000);
            }
        });
        viewModel.repeatForever.listen(function (value) {
            $repeatCount.$.prop('disabled', value);
        });
        var saveText;
        viewModel.isSaving.listen(function (value) {
            if (value) {
                saveText = $saveButton.$.text();
                $saveButton.$.text('...');
            }
            else if (saveText) {
                $saveButton.$.text(saveText);
            }
        });
        viewModel.repeatIntervalType.setValue('Milliseconds');
        viewModel.triggerType.setValue('Simple');
    };
    TriggerDialogView.prototype.valueAndValidator = function (dom, validatorDom, source, validators) {
        dom.observes(source);
        var sourceValidator = validators.findFor(source);
        if (sourceValidator) {
            validatorDom.render(ValidatorView, { errors: sourceValidator.errors });
            sourceValidator.errors.listen(function (errors) {
                if (errors && errors.length > 0) {
                    dom.$.addClass('cq-error-control');
                }
                else {
                    dom.$.removeClass('cq-error-control');
                }
            });
            dom.on('blur').react(sourceValidator.makeDirty, sourceValidator);
        }
    };
    return TriggerDialogView;
}());
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/Timeline.ts"/> 
var TimelineActivityView = (function () {
    function TimelineActivityView() {
        this.template = '<div class="timeline-item"></div>';
    }
    TimelineActivityView.prototype.init = function (dom, activity) {
        var $root = dom.root.$;
        var wire = activity.position.listen(function (position) {
            if (!position) {
                return;
            }
            $root
                .css('left', position.left + '%')
                .css('width', position.width + '%');
        });
        dom.onUnrender().listen(function () {
            wire.dispose();
        });
    };
    ;
    return TimelineActivityView;
}());
;
var TimelineSlotView = (function () {
    function TimelineSlotView() {
        this.template = '<div class="timeline-slot"><div class="timeline-slot-title"><span></span></div><section class="timeline-slot-activities"></section></div>';
    }
    TimelineSlotView.prototype.init = function (dom, slot) {
        dom('span').observes(slot.title);
        dom('.timeline-slot-activities').observes(slot.activities, TimelineActivityView);
    };
    ;
    return TimelineSlotView;
}());
;
var TimelineTickView = (function () {
    function TimelineTickView() {
        this.template = '<div class="timeline-tick"><div class="timeline-tick-border"></div><span><p></p></span></div>';
    }
    TimelineTickView.prototype.init = function (dom, viewModel) {
        dom('p').observes(this.formatDate(new Date(viewModel.tickDate)));
        dom.root.$.css('width', viewModel.width + '%');
    };
    ;
    TimelineTickView.prototype.formatDate = function (date) {
        /* todo: cross-culture implementation */
        var minutes = date.getMinutes(), seconds = date.getSeconds();
        return date.getHours() + ':' +
            (minutes <= 9 ? '0' : '') + minutes +
            ':' +
            (seconds <= 9 ? '0' : '') + seconds;
    };
    return TimelineTickView;
}());
;
var TimelineView = (function () {
    function TimelineView() {
        this.template = '#TimelineView';
    }
    TimelineView.prototype.init = function (dom, timeline) {
        var $ticks = dom('.timeline-captions');
        $ticks.observes(timeline.ticks.items, TimelineTickView);
        dom('.timeline-body').observes(timeline.slots, TimelineSlotView);
        $ticks.$.css('width', (100 + 100 * timeline.ticks.millisecondsPerTick / timeline.timelineSizeMilliseconds) + '%');
        var wire = timeline.ticks.shift.listen(function (shiftPercent) {
            $ticks.$.css('left', (-shiftPercent) + '%');
        });
        dom.onUnrender().listen(function () {
            wire.dispose();
        });
    };
    return TimelineView;
}());
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="../Scripts/Timeline.ts"/> 
/// <reference path="SchedulerView.ts"/> 
/// <reference path="ErrorView.ts"/> 
/// <reference path="../Views/JobGroupView.ts"/> 
/// <reference path="../Views/CommandProgressView.ts"/> 
/// <reference path="../Views/TriggerDialogView.ts"/> 
/// <reference path="../Views/TimelineView.ts"/> 
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
        var $overlay = dom('#dialogsOverlay');
        var $triggerDialog = dom('#triggerDialog');
        $triggerDialog.observes(viewModel.triggerEditorJob, TriggerDialogView);
        viewModel.triggerEditorJob.listen(function (job) {
            if (job) {
                $overlay.$.show();
                $triggerDialog.$.show();
            }
            else {
                $overlay.$.hide();
                $triggerDialog.$.hide();
            }
        });
        var timeline = viewModel.timeline;
        dom('.timelineContainer').render(TimelineView, timeline);
        viewModel.initTimeline();
        //timeline.init();
    };
    return ApplicationView;
}());
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
}());
new Application().run();
