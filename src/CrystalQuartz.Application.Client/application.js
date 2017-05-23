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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Application; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__application_model__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_loader__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__main_aside_aside_view_model__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__main_aside_aside_view__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__application_tmpl_html__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__application_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__application_tmpl_html__);






var Application = (function () {
    function Application() {
    }
    Application.prototype.run = function () {
        var commandService = new __WEBPACK_IMPORTED_MODULE_0__services__["a" /* CommandService */](), applicationModel = new __WEBPACK_IMPORTED_MODULE_1__application_model__["a" /* ApplicationModel */](), dataLoader = new __WEBPACK_IMPORTED_MODULE_2__data_loader__["a" /* DataLoader */](applicationModel, commandService);
        /*
        

        
        var applicationViewModel = new ApplicationViewModel(applicationModel, schedulerService);*/
        commandService.onCommandFailed.listen(console.log); // todo
        js.dom('#application').render(ApplicationView, new ApplicationViewModel(applicationModel));
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
        this.template = __WEBPACK_IMPORTED_MODULE_5__application_tmpl_html___default.a;
    }
    ApplicationView.prototype.init = function (dom, viewModel) {
        dom('.mainAside').render(__WEBPACK_IMPORTED_MODULE_4__main_aside_aside_view__["a" /* MainAsideView */], viewModel.mainAside);
    };
    return ApplicationView;
}());
var ApplicationViewModel = (function () {
    function ApplicationViewModel(application) {
        this.application = application;
        this.mainAside = new __WEBPACK_IMPORTED_MODULE_3__main_aside_aside_view_model__["a" /* MainAsideViewModel */](this.application);
    }
    return ApplicationViewModel;
}());


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "<h1>Hello, Application!</h1><section class=\"mainAside\"></section>"

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = "<aside class=\"main-aside\">    <ul>        <li>            <span class=\"aside-value-title\">Uptime</span>            <span class=\"aside-value uptime\">                <span class=\"value-number\"></span>                <span class=\"value-measurement-unit\"></span>            </span>        </li>        <li>            <span class=\"aside-value-title\">Total Jobs</span>            <span class=\"aside-value totalJobs\">5</span>        </li>        <li>            <span class=\"aside-value-title\">Executed Jobs</span>            <span class=\"aside-value executedJobs\">18</span>        </li>    </ul></aside>"

/***/ }),
/* 4 */
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
/* 5 */
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export GetEnvironmentDataCommand */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GetDataCommand; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abstract_command__ = __webpack_require__(5);
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataLoader; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commands_global_commands__ = __webpack_require__(6);

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
/* 8 */
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
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MainAsideView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__aside_tmpl_html__ = __webpack_require__(3);
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
/* 10 */
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
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_index_less__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__app_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_application__ = __webpack_require__(1);


new __WEBPACK_IMPORTED_MODULE_1__app_application__["a" /* Application */]().run();


/***/ })
/******/ ]);