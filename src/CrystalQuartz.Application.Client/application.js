/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 31);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AbstractCommand; });
var AbstractCommand = (function () {
    function AbstractCommand() {
        this.data = {};
    }
    return AbstractCommand;
}());



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
/* harmony default export */ __webpack_exports__["a"] = (ActivitiesSynschronizer);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ManagableActivityViewModel; });
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
    ManagableActivityViewModel.prototype.delete = function () {
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



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActivityView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__activity_status_view__ = __webpack_require__(20);

var ActivityView = (function () {
    function ActivityView() {
        this.template = ''; // abstract
    }
    ActivityView.prototype.init = function (dom, viewModel) {
        dom('.name').observes(viewModel.name);
        dom('.status').observes(viewModel, __WEBPACK_IMPORTED_MODULE_0__activity_status_view__["a" /* ActivityStatusView */]);
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
}());



/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Application; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__application_model__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_loader__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__main_aside_aside_view_model__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__main_aside_aside_view__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__main_content_activities_synschronizer__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__main_content_job_group_job_group_view_model__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__main_content_job_group_job_group_view__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__application_tmpl_html__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__application_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__application_tmpl_html__);









var Application = (function () {
    function Application() {
    }
    Application.prototype.run = function () {
        var commandService = new __WEBPACK_IMPORTED_MODULE_0__services__["a" /* CommandService */](), applicationModel = new __WEBPACK_IMPORTED_MODULE_1__application_model__["a" /* ApplicationModel */](), dataLoader = new __WEBPACK_IMPORTED_MODULE_2__data_loader__["a" /* DataLoader */](applicationModel, commandService);
        /*
        

        
        var applicationViewModel = new ApplicationViewModel(applicationModel, schedulerService);*/
        commandService.onCommandFailed.listen(console.log); // todo
        js.dom('#application').render(ApplicationView, new ApplicationViewModel(applicationModel, commandService));
        dataLoader.start();
        /*
        schedulerService.getData().done(data => {
            applicationModel.setData(data);
        }).then(() => schedulerService.executeCommand(new GetEnvironmentDataCommand()).done(data => applicationViewModel.setEnvoronmentData(data)));
        */
    };
    return Application;
}());

var ApplicationView = (function () {
    function ApplicationView() {
        this.template = __WEBPACK_IMPORTED_MODULE_8__application_tmpl_html___default.a;
    }
    ApplicationView.prototype.init = function (dom, viewModel) {
        dom('.mainAside').render(__WEBPACK_IMPORTED_MODULE_4__main_aside_aside_view__["a" /* MainAsideView */], viewModel.mainAside);
        dom('#jobsContainer').observes(viewModel.jobGroups, __WEBPACK_IMPORTED_MODULE_7__main_content_job_group_job_group_view__["a" /* JobGroupView */]);
    };
    return ApplicationView;
}());
var ApplicationViewModel = (function () {
    function ApplicationViewModel(application, commandService) {
        var _this = this;
        this.application = application;
        this.commandService = commandService;
        this.mainAside = new __WEBPACK_IMPORTED_MODULE_3__main_aside_aside_view_model__["a" /* MainAsideViewModel */](this.application);
        this.jobGroups = js.observableList();
        this.groupsSynchronizer = new __WEBPACK_IMPORTED_MODULE_5__main_content_activities_synschronizer__["a" /* default */](function (group, groupViewModel) { return group.Name === groupViewModel.name; }, function (group) { return new __WEBPACK_IMPORTED_MODULE_6__main_content_job_group_job_group_view_model__["a" /* JobGroupViewModel */](group, _this.commandService, _this.application); }, this.jobGroups);
        application.onDataChanged.listen(function (data) { return _this.setData(data); });
    }
    ApplicationViewModel.prototype.setData = function (data) {
        this.groupsSynchronizer.sync(data.JobGroups);
    };
    return ApplicationViewModel;
}());


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "<section class=\"mainAside\"></section><section class=\"main-container\">    <div class=\"scrollable-area\">        <section id=\"jobsContainer\"></section>            </div></section>"

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "<aside class=\"main-aside\">    <ul>        <li>            <span class=\"aside-value-title\">Uptime</span>            <span class=\"aside-value uptime\">                <span class=\"value-number\"></span>                <span class=\"value-measurement-unit\"></span>            </span>        </li>        <li>            <span class=\"aside-value-title\">Total Jobs</span>            <span class=\"aside-value totalJobs\">5</span>        </li>        <li>            <span class=\"aside-value-title\">Executed Jobs</span>            <span class=\"aside-value executedJobs\">18</span>        </li>    </ul></aside>"

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "<div class=\"data-row data-row-job-group\">    <section class=\"primary-data\">        <div class=\"status\"></div>        <section class=\"actions dropdown pull-right\" style=\"width: 20px; height: 100%; float: right\">            <a href=\"#\" class=\"cq-actions-toggle dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></a>            <ul class=\"dropdown-menu\">                <li class=\"cq-with-icon\"><a href=\"#\" class=\"pause\" title=\"\"><span class=\"flaticon-pause\"></span>Pause all jobs</a></li>                <li class=\"cq-with-icon\"><a href=\"#\" class=\"resume\" title=\"\"><span class=\"flaticon-play\"></span>Resume all jobs</a></li>                <li role=\"separator\" class=\"divider\"></li>                <li class=\"cq-with-icon\"><a href=\"#\" class=\"delete\" title=\"\"><span class=\"flaticon-remove\"></span>Delete all jobs</a></li>            </ul>        </section>        <div class=\"data-container\">            <section class=\"data-group name\"></section>        </div>    </section>    <section class=\"timeline-data timeline-data-filler\"></section></div><section class=\"children\"></section>"

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "<div class=\"data-row data-row-job\">    <section class=\"primary-data\">        <div class=\"status\"></div>        <div class=\"actions\">            <a href=\"#\"><span class=\"caret\"></span></a>        </div>        <div class=\"data-container\">            <section class=\"data-group name\"></section>        </div>    </section>    <section class=\"timeline-data timeline-data-filler\"></section></div><section class=\"triggers\"></section>"

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "<div class=\"data-row data-row-trigger\">    <section class=\"primary-data\">        <div class=\"status\"></div>        <div class=\"actions\">            <a href=\"#\"><span class=\"caret\"></span></a>        </div>        <div class=\"data-container\">            <section class=\"data-item name\">Trigger 1</section>            <section class=\"data-item type\"></section>            <section class=\"data-item startDate\"></section>            <section class=\"data-item endDate\"></section>            <section class=\"data-item previousFireDate\"></section>            <section class=\"data-item nextFireDate\"></section>        </div>    </section>    <section class=\"timeline-data\">        <div class=\"timeline-item\" style=\"left: 50%; width: 10%;\"></div>    </section></div>"

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export DateData */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NullableDate; });
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



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApplicationModel; });
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



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export GetEnvironmentDataCommand */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GetDataCommand; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abstract_command__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var GetEnvironmentDataCommand = (function (_super) {
    __extends(GetEnvironmentDataCommand, _super);
    function GetEnvironmentDataCommand() {
        var _this = _super.call(this) || this;
        _this.code = 'get_env';
        _this.message = 'Loading environment data';
        return _this;
    }
    return GetEnvironmentDataCommand;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

var GetDataCommand = (function (_super) {
    __extends(GetDataCommand, _super);
    function GetDataCommand() {
        var _this = _super.call(this) || this;
        _this.code = 'get_data';
        _this.message = 'Loading scheduler data';
        return _this;
    }
    return GetDataCommand;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return PauseJobCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ResumeJobCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return DeleteJobCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ExecuteNowCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GetJobDetailsCommand; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abstract_command__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

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
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

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
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

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
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

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
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

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
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PauseGroupCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ResumeGroupCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return DeleteGroupCommand; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abstract_command__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

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
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

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
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

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
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PauseTriggerCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ResumeTriggerCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return DeleteTriggerCommand; });
/* unused harmony export AddTriggerCommand */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abstract_command__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

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
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

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
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

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
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

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
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));



/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataLoader; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commands_global_commands__ = __webpack_require__(13);

var DataLoader = (function () {
    function DataLoader(applicationModel, commandService) {
        var _this = this;
        this.applicationModel = applicationModel;
        this.commandService = commandService;
        applicationModel.onDataChanged.listen(function (data) { return _this.setData(data); });
    }
    DataLoader.prototype.start = function () {
        this.updateData();
    };
    DataLoader.prototype.setData = function (data) {
        this.scheduleAutoUpdate(data);
    };
    DataLoader.prototype.scheduleAutoUpdate = function (data) {
        var _this = this;
        var nextUpdateDate = this.getLastActivityFireDate(data) || this.getDefaultUpdateDate();
        clearTimeout(this._autoUpdateTimes);
        var now = new Date(), sleepInterval = this.calculateSleepInterval(nextUpdateDate), actualUpdateDate = new Date(now.getTime() + sleepInterval), message = 'next update at ' + actualUpdateDate.toTimeString();
        //this.autoUpdateMessage.setValue(message);
        this._autoUpdateTimes = setTimeout(function () {
            //this.autoUpdateMessage.setValue('updating...');
            _this.updateData();
        }, sleepInterval);
    };
    DataLoader.prototype.calculateSleepInterval = function (nextUpdateDate) {
        var now = new Date(), sleepInterval = nextUpdateDate.getTime() - now.getTime();
        if (sleepInterval < 0) {
            // updateDate is in the past, the scheduler is probably not started yet
            return DataLoader.DEFAULT_UPDATE_INTERVAL;
        }
        if (sleepInterval < DataLoader.MIN_UPDATE_INTERVAL) {
            // the delay interval is too small
            // we need to extend it to avoid huge amount of queries
            return DataLoader.MIN_UPDATE_INTERVAL;
        }
        if (sleepInterval > DataLoader.MAX_UPDATE_INTERVAL) {
            // the interval is too big
            return DataLoader.MAX_UPDATE_INTERVAL;
        }
        return sleepInterval;
    };
    DataLoader.prototype.updateData = function () {
        var _this = this;
        this.commandService
            .executeCommand(new __WEBPACK_IMPORTED_MODULE_0__commands_global_commands__["a" /* GetDataCommand */]())
            .done(function (data) { return _this.applicationModel.setData(data); });
    };
    DataLoader.prototype.getDefaultUpdateDate = function () {
        var now = new Date();
        now.setSeconds(now.getSeconds() + 30);
        return now;
    };
    DataLoader.prototype.getLastActivityFireDate = function (data) {
        if (data.Status !== 'started') {
            return null;
        }
        var allJobs = _.flatten(_.map(data.JobGroups, function (group) { return group.Jobs; })), allTriggers = _.flatten(_.map(allJobs, function (job) { return job.Triggers; })), activeTriggers = _.filter(allTriggers, function (trigger) { return trigger.Status.Code == 'active'; }), nextFireDates = _.compact(_.map(activeTriggers, function (trigger) { return trigger.NextFireDate == null ? null : trigger.NextFireDate.Ticks; }));
        return nextFireDates.length > 0 ? new Date(_.first(nextFireDates)) : null;
    };
    return DataLoader;
}());

DataLoader.DEFAULT_UPDATE_INTERVAL = 30000; // 30sec
DataLoader.MAX_UPDATE_INTERVAL = 300000; // 5min
DataLoader.MIN_UPDATE_INTERVAL = 10000; // 10sec


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MainAsideViewModel; });
var MainAsideViewModel = (function () {
    function MainAsideViewModel(application) {
        var _this = this;
        this.application = application;
        this.uptimeValue = new js.ObservableValue();
        this.uptimeMeasurementUnit = new js.ObservableValue();
        this._uptimeTimerRef = null;
        this._uptimeRanges = [
            { title: 'sec', edge: 1000 },
            { title: 'min', edge: 60 },
            { title: 'hours', edge: 60 },
            { title: 'days', edge: 24 }
        ];
        application.onDataChanged.listen(function (data) { return _this.updateAsideData(data); });
    }
    MainAsideViewModel.prototype.updateAsideData = function (data) {
        this.calculateUptime(data.RunningSince);
    };
    MainAsideViewModel.prototype.calculateUptime = function (runningSince) {
        var _this = this;
        if (this._uptimeTimerRef) {
            clearTimeout(this._uptimeTimerRef);
        }
        var uptimeMilliseconds = new Date().getTime() - runningSince;
        var ratio = 1;
        for (var i = 0; i < this._uptimeRanges.length; i++) {
            var rangeItem = this._uptimeRanges[i];
            ratio *= rangeItem.edge;
            var ratioUnits = uptimeMilliseconds / ratio, isLastItem = i === this._uptimeRanges.length - 1;
            if (isLastItem || this.isCurrentRange(uptimeMilliseconds, i, ratio)) {
                this.uptimeValue.setValue(Math.floor(ratioUnits).toString());
                this.uptimeMeasurementUnit.setValue(rangeItem.title);
                this._uptimeTimerRef = setTimeout(function () { return _this.calculateUptime(runningSince); }, ratio / 2);
                return;
            }
        }
    };
    MainAsideViewModel.prototype.isCurrentRange = function (uptimeMilliseconds, index, ratioMultiplier) {
        return (uptimeMilliseconds / (this._uptimeRanges[index + 1].edge * ratioMultiplier)) < 1;
    };
    return MainAsideViewModel;
}());



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MainAsideView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__aside_tmpl_html__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__aside_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__aside_tmpl_html__);

var MainAsideView = (function () {
    function MainAsideView() {
        this.template = __WEBPACK_IMPORTED_MODULE_0__aside_tmpl_html___default.a;
    }
    MainAsideView.prototype.init = function (dom, viewModel) {
        dom('.value-number').observes(viewModel.uptimeValue);
        dom('.value-measurement-unit').observes(viewModel.uptimeMeasurementUnit);
    };
    return MainAsideView;
}());



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActivityStatusView; });
var ActivityStatusView = (function () {
    function ActivityStatusView() {
        this.template = "<span class=\"cq-activity-status\">\n    <span class=\"cq-activity-status-primary\"></span>\n    <span class=\"cq-activity-status-secondary\"></span>\n</span>";
    }
    ActivityStatusView.prototype.init = function (dom, statusAware) {
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
    return ActivityStatusView;
}());



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobDetailsView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__property_view__ = __webpack_require__(27);

var JobDetailsView = (function () {
    function JobDetailsView() {
        this.template = "#JobDetailsView";
    }
    JobDetailsView.prototype.init = function (dom, viewModel) {
        dom('.properties tbody').observes(viewModel.JobProperties, __WEBPACK_IMPORTED_MODULE_0__property_view__["a" /* PropertyView */]);
        dom('.dataMap tbody').observes(viewModel.JobDataMap, __WEBPACK_IMPORTED_MODULE_0__property_view__["b" /* PropertyWithTypeView */]);
    };
    return JobDetailsView;
}());



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobGroupViewModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commands_job_group_commands__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__activity_view_model__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__activities_synschronizer__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__job_job_view_model__ = __webpack_require__(24);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var JobGroupViewModel = (function (_super) {
    __extends(JobGroupViewModel, _super);
    function JobGroupViewModel(group, commandService, applicationModel) {
        var _this = _super.call(this, group, commandService, applicationModel) || this;
        _this.jobs = js.observableList();
        _this.jobsSynchronizer = new __WEBPACK_IMPORTED_MODULE_2__activities_synschronizer__["a" /* default */](function (job, jobViewModel) { return job.Name === jobViewModel.name; }, function (job) { return new __WEBPACK_IMPORTED_MODULE_3__job_job_view_model__["a" /* JobViewModel */](job, _this.name, _this.commandService, _this.applicationModel); }, _this.jobs);
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
        return new __WEBPACK_IMPORTED_MODULE_0__commands_job_group_commands__["a" /* ResumeGroupCommand */](this.name);
    };
    JobGroupViewModel.prototype.createPauseCommand = function () {
        return new __WEBPACK_IMPORTED_MODULE_0__commands_job_group_commands__["b" /* PauseGroupCommand */](this.name);
    };
    JobGroupViewModel.prototype.createDeleteCommand = function () {
        return new __WEBPACK_IMPORTED_MODULE_0__commands_job_group_commands__["c" /* DeleteGroupCommand */](this.name);
    };
    return JobGroupViewModel;
}(__WEBPACK_IMPORTED_MODULE_1__activity_view_model__["a" /* ManagableActivityViewModel */]));



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobGroupView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__activity_view__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__job_job_view__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__job_group_tmpl_html__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__job_group_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__job_group_tmpl_html__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var JobGroupView = (function (_super) {
    __extends(JobGroupView, _super);
    function JobGroupView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.template = __WEBPACK_IMPORTED_MODULE_2__job_group_tmpl_html___default.a;
        return _this;
    }
    JobGroupView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        dom('.children').observes(viewModel.jobs, __WEBPACK_IMPORTED_MODULE_1__job_job_view__["a" /* JobView */]);
        dom.onUnrender().listen(function () {
            dom.$.fadeOut();
        });
    };
    return JobGroupView;
}(__WEBPACK_IMPORTED_MODULE_0__activity_view__["a" /* ActivityView */]));



/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobViewModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commands_job_commands__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__activity_view_model__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__activities_synschronizer__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__trigger_trigger_view_model__ = __webpack_require__(28);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var JobViewModel = (function (_super) {
    __extends(JobViewModel, _super);
    function JobViewModel(job, group, commandService, applicationModel) {
        var _this = _super.call(this, job, commandService, applicationModel) || this;
        _this.job = job;
        _this.group = group;
        _this.triggers = js.observableList();
        _this.details = js.observableValue();
        _this.triggersSynchronizer = new __WEBPACK_IMPORTED_MODULE_2__activities_synschronizer__["a" /* default */](function (trigger, triggerViewModel) { return trigger.Name === triggerViewModel.name; }, function (trigger) { return new __WEBPACK_IMPORTED_MODULE_3__trigger_trigger_view_model__["a" /* TriggerViewModel */](trigger, _this.commandService, _this.applicationModel); }, _this.triggers);
        return _this;
    }
    JobViewModel.prototype.loadJobDetails = function () {
        var _this = this;
        this.commandService
            .executeCommand(new __WEBPACK_IMPORTED_MODULE_0__commands_job_commands__["a" /* GetJobDetailsCommand */](this.group, this.name))
            .done(function (details) { return _this.details.setValue(details); });
    };
    JobViewModel.prototype.updateFrom = function (job) {
        _super.prototype.updateFrom.call(this, job);
        this.triggersSynchronizer.sync(job.Triggers);
    };
    JobViewModel.prototype.executeNow = function () {
        var _this = this;
        this.commandService
            .executeCommand(new __WEBPACK_IMPORTED_MODULE_0__commands_job_commands__["b" /* ExecuteNowCommand */](this.group, this.name))
            .done(function (data) { return _this.applicationModel.setData(data); });
    };
    JobViewModel.prototype.getDeleteConfirmationsText = function () {
        return 'Are you sure you want to delete job?';
    };
    JobViewModel.prototype.createResumeCommand = function () {
        return new __WEBPACK_IMPORTED_MODULE_0__commands_job_commands__["c" /* ResumeJobCommand */](this.group, this.name);
    };
    JobViewModel.prototype.createPauseCommand = function () {
        return new __WEBPACK_IMPORTED_MODULE_0__commands_job_commands__["d" /* PauseJobCommand */](this.group, this.name);
    };
    JobViewModel.prototype.createDeleteCommand = function () {
        return new __WEBPACK_IMPORTED_MODULE_0__commands_job_commands__["e" /* DeleteJobCommand */](this.group, this.name);
    };
    JobViewModel.prototype.clearJobDetails = function () {
        this.details.setValue(null);
    };
    JobViewModel.prototype.addTrigger = function () {
        this.applicationModel.addTriggerFor(this.job);
    };
    return JobViewModel;
}(__WEBPACK_IMPORTED_MODULE_1__activity_view_model__["a" /* ManagableActivityViewModel */]));



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__activity_view__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__trigger_trigger_view__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__job_details_job_details_view__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__job_tmpl_html__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__job_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__job_tmpl_html__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var JobView = (function (_super) {
    __extends(JobView, _super);
    function JobView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.template = __WEBPACK_IMPORTED_MODULE_3__job_tmpl_html___default.a;
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
        dom('.triggers').observes(viewModel.triggers, __WEBPACK_IMPORTED_MODULE_1__trigger_trigger_view__["a" /* TriggerView */]);
        dom('.detailsContainer').observes(viewModel.details, __WEBPACK_IMPORTED_MODULE_2__job_details_job_details_view__["a" /* JobDetailsView */]);
        dom('.loadDetails').on('click').react(viewModel.loadJobDetails);
        dom('.actions .execute').on('click').react(viewModel.executeNow);
        dom('.addTrigger').on('click').react(viewModel.addTrigger);
        $$hideDetails.on('click').react(viewModel.clearJobDetails);
    };
    return JobView;
}(__WEBPACK_IMPORTED_MODULE_0__activity_view__["a" /* ActivityView */]));



/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NullableDateView; });
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



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export PropertyValue */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PropertyView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PropertyWithTypeView; });
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



/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TriggerViewModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__commands_trigger_commands__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__activity_view_model__ = __webpack_require__(2);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



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
        this.startDate.setValue(new __WEBPACK_IMPORTED_MODULE_0__api__["a" /* NullableDate */](trigger.StartDate));
        this.endDate.setValue(new __WEBPACK_IMPORTED_MODULE_0__api__["a" /* NullableDate */](trigger.EndDate));
        this.previousFireDate.setValue(new __WEBPACK_IMPORTED_MODULE_0__api__["a" /* NullableDate */](trigger.PreviousFireDate));
        this.nextFireDate.setValue(new __WEBPACK_IMPORTED_MODULE_0__api__["a" /* NullableDate */](trigger.NextFireDate));
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
                if (currentPartValue === 1) {
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
        return new __WEBPACK_IMPORTED_MODULE_1__commands_trigger_commands__["a" /* ResumeTriggerCommand */](this._group, this.name);
    };
    TriggerViewModel.prototype.createPauseCommand = function () {
        return new __WEBPACK_IMPORTED_MODULE_1__commands_trigger_commands__["b" /* PauseTriggerCommand */](this._group, this.name);
    };
    TriggerViewModel.prototype.createDeleteCommand = function () {
        return new __WEBPACK_IMPORTED_MODULE_1__commands_trigger_commands__["c" /* DeleteTriggerCommand */](this._group, this.name);
    };
    return TriggerViewModel;
}(__WEBPACK_IMPORTED_MODULE_2__activity_view_model__["a" /* ManagableActivityViewModel */]));



/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TriggerView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__activity_view__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__nullable_date_view__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__trigger_tmpl_html__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__trigger_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__trigger_tmpl_html__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var TriggerView = (function (_super) {
    __extends(TriggerView, _super);
    function TriggerView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.template = __WEBPACK_IMPORTED_MODULE_2__trigger_tmpl_html___default.a;
        return _this;
    }
    TriggerView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        dom('.startDate').observes(viewModel.startDate, __WEBPACK_IMPORTED_MODULE_1__nullable_date_view__["a" /* NullableDateView */]);
        dom('.endDate').observes(viewModel.endDate, __WEBPACK_IMPORTED_MODULE_1__nullable_date_view__["a" /* NullableDateView */]);
        dom('.previousFireDate').observes(viewModel.previousFireDate, __WEBPACK_IMPORTED_MODULE_1__nullable_date_view__["a" /* NullableDateView */]);
        dom('.nextFireDate').observes(viewModel.nextFireDate, __WEBPACK_IMPORTED_MODULE_1__nullable_date_view__["a" /* NullableDateView */]);
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
}(__WEBPACK_IMPORTED_MODULE_0__activity_view__["a" /* ActivityView */]));



/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommandService; });
var CommandService = (function () {
    function CommandService() {
        this.onCommandStart = new js.Event();
        this.onCommandComplete = new js.Event();
        this.onCommandFailed = new js.Event();
        this.onEvent = new js.Event(); // todo: typings
        this._minEventId = 0;
    }
    CommandService.prototype.executeCommand = function (command) {
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
    return CommandService;
}());



/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_index_less__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__app_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_application__ = __webpack_require__(5);


new __WEBPACK_IMPORTED_MODULE_1__app_application__["a" /* Application */]().run();


/***/ })
/******/ ]);