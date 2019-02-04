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
/******/ 	return __webpack_require__(__webpack_require__.s = 284);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, jQuery) {/// <reference path="../libs/jquery.d.ts"/>
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
var js;
(function (js) {
    var ExplicitManager = (function () {
        function ExplicitManager() {
            this._slaves = [];
        }
        ExplicitManager.prototype.manage = function (manageable) {
            this._slaves.push(manageable);
            manageable.init();
        };
        ExplicitManager.prototype.dispose = function () {
            for (var i = 0; i < this._slaves.length; i++) {
                this._slaves[i].dispose();
            }
        };
        ExplicitManager.prototype.getViewModel = function () {
            return null;
        };
        ExplicitManager.prototype.getParent = function () {
            return null;
        };
        ExplicitManager.prototype.onUnrender = function () {
            return new Event();
        };
        return ExplicitManager;
    }());
    js.ExplicitManager = ExplicitManager;
    js.observableValue = function () { return new ObservableValue(); };
    js.observableList = function () { return new ObservableList(); };
    js.dependentValue = function (evaluate) {
        var dependencies = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            dependencies[_i - 1] = arguments[_i];
        }
        return new DependentValue(evaluate, dependencies);
    };
    js.init = function () {
        var markupResolver = new JQueryMarkupResolver();
        var defaultFormatter = function (value) { return value.toString(); };
        var fetcherFactory = new FetcherFactory()
            .registerFetcher(FetcherType.Value, new ValueFetcher())
            .registerFetcher(FetcherType.CheckedAttribute, new CheckedAttributeFetcher());
        var viewFactory = new DefaultViewFactory(markupResolver);
        var renderListenerFactory = new RenderListenerFactory(defaultFormatter, markupResolver, viewFactory, fetcherFactory);
        var domFactory = new DomFactory(renderListenerFactory, viewFactory, fetcherFactory);
        viewFactory.setDomFactory(domFactory); // todo: avoid this bidirectional link
        js.dom = domFactory.create(new JQueryElement($(document)), new ExplicitManager());
    };
    var CommandConfig = (function () {
        function CommandConfig(_manager, _event, _target, _options, _fetcherFactory) {
            this._manager = _manager;
            this._event = _event;
            this._target = _target;
            this._options = _options;
            this._fetcherFactory = _fetcherFactory;
        }
        CommandConfig.prototype.react = function (callback, context) {
            var fetcher = null;
            if (this._options && this._options.fetch) {
                fetcher = this._fetcherFactory.getByKey(this._options.fetch);
            }
            else {
                fetcher = this._fetcherFactory.getForElement(this._target);
            }
            var argumentFetcher = null;
            if (fetcher) {
                argumentFetcher = function (target) { return fetcher.valueFromElement(target); };
            }
            var actualContext = context || this._manager.getViewModel();
            var wire = new CommandWire(argumentFetcher, this._event, callback, this._target, actualContext);
            this._manager.manage(wire);
        };
        return CommandConfig;
    }());
    js.CommandConfig = CommandConfig;
    var CommandWire = (function () {
        function CommandWire(_argumentFetcher, _eventType, _callback, _target, _context) {
            this._argumentFetcher = _argumentFetcher;
            this._eventType = _eventType;
            this._callback = _callback;
            this._target = _target;
            this._context = _context;
        }
        CommandWire.prototype.dispose = function () {
            this._target.detachEventHandler(this._eventType, this._handlerRef);
        };
        CommandWire.prototype.init = function () {
            var _this = this;
            this._handlerRef = this._target.attachEventHandler(this._eventType, function () {
                var commandArgument = _this._argumentFetcher == null ? null : _this._argumentFetcher(_this._target);
                if (commandArgument == null) {
                    _this._callback.call(_this._context);
                }
                else {
                    _this._callback.call(_this._context, commandArgument);
                }
            });
        };
        return CommandWire;
    }());
    js.CommandWire = CommandWire;
    /**
     * Describes the type of string value
     */
    var ValueType;
    (function (ValueType) {
        /** The value contains plain text */
        ValueType.text = "text";
        /** The value contains prepared html */
        ValueType.html = "html";
        /** The value contains an object that could be transformed to html */
        ValueType.unknown = "unknown";
    })(ValueType = js.ValueType || (js.ValueType = {}));
    var DomWrapper = (function () {
        function DomWrapper(_rootElement, _manager, _renderListenerFactory, _viewFactory, _fetcherFactory) {
            this._rootElement = _rootElement;
            this._manager = _manager;
            this._renderListenerFactory = _renderListenerFactory;
            this._viewFactory = _viewFactory;
            this._fetcherFactory = _fetcherFactory;
            this.root = _rootElement;
            this.$ = _rootElement.$;
            this.manager = _manager;
        }
        DomWrapper.prototype.find = function (selector) {
            var dom = new ListenerDom(this._rootElement.findRelative(selector), this._manager, this._renderListenerFactory, this._viewFactory, this._fetcherFactory);
            return Utils.wrapObjectWithSelfFunction(dom, function (d, value, options) {
                d.observes(value, options);
            });
        };
        DomWrapper.prototype.dispose = function () {
            this._manager.dispose();
        };
        DomWrapper.prototype.onUnrender = function () {
            return this._manager.onUnrender();
        };
        return DomWrapper;
    }());
    var ListenerDom = (function () {
        function ListenerDom(_rootElement, _manager, _renderListenerFactory, _viewFactory, _fetcherFactory) {
            var _this = this;
            this._rootElement = _rootElement;
            this._manager = _manager;
            this._renderListenerFactory = _renderListenerFactory;
            this._viewFactory = _viewFactory;
            this._fetcherFactory = _fetcherFactory;
            this.root = _rootElement;
            var textConfig = new ObservationConfig(this._manager, function (observable) { return _this.createRenderListener(observable, { valueType: ValueType.text }); });
            var htmlConfig = new ObservationConfig(this._manager, function (observable) { return _this.createRenderListener(observable, { valueType: ValueType.html }); });
            this.$ = this._rootElement.$;
            this.text = Utils.wrapObjectWithSelfFunction(textConfig, function (config, value) { return config.observes(value); });
            this.html = Utils.wrapObjectWithSelfFunction(htmlConfig, function (config, value) { return config.observes(value); });
            this.manager = this._manager;
        }
        ListenerDom.prototype.listener = function (listener) {
            var _this = this;
            return new ObservationConfig(this._manager, function (observable) { return _this.createRenderListener(observable, { renderer: new CustomListenerRenderer(listener) }); });
        };
        ListenerDom.prototype.className = function (className) {
            return this.listener(function (element, value) {
                var hasClass = !!value;
                if (hasClass) {
                    element.addClass(className);
                }
                else {
                    element.removeClass(className);
                }
            });
        };
        ListenerDom.prototype.observes = function (value, options) {
            var observable = ListenerUtils.getObservable(value);
            if (options && Utils.isFunction(options)) {
                var view = options;
                options = {
                    view: view
                };
            }
            var wire = this.createRenderListener(observable, options);
            this._manager.manage(wire);
        };
        ListenerDom.prototype.render = function (view, viewModel) {
            var composedView = this._viewFactory.resolve(this._rootElement, view, viewModel, this._manager);
            this._manager.manage(composedView);
            return composedView;
        };
        ListenerDom.prototype.on = function (event, options) {
            return new CommandConfig(this._manager, event, this._rootElement, options, this._fetcherFactory);
        };
        ListenerDom.prototype.createRenderListener = function (observable, options) {
            var listener = this;
            return this._renderListenerFactory.createListener(observable, listener, options);
        };
        return ListenerDom;
    }());
    var ObservationConfig = (function () {
        function ObservationConfig(_manager, factory) {
            this._manager = _manager;
            this.factory = factory;
        }
        ObservationConfig.prototype.observes = function (value) {
            var observable = ListenerUtils.getObservable(value);
            var wire = this.factory(observable);
            this._manager.manage(wire);
        };
        return ObservationConfig;
    }());
    js.ObservationConfig = ObservationConfig;
    var ListenerUtils;
    (function (ListenerUtils) {
        ListenerUtils.getObservable = function (candidate) {
            if (candidate && candidate.getValue && candidate.listen) {
                return candidate;
            }
            return new StaticObservableValue(candidate);
        };
    })(ListenerUtils || (ListenerUtils = {}));
    var DomFactory = (function () {
        function DomFactory(_renderListenerFactory, _viewFactory, _fetcherFactory) {
            this._renderListenerFactory = _renderListenerFactory;
            this._viewFactory = _viewFactory;
            this._fetcherFactory = _fetcherFactory;
        }
        DomFactory.prototype.create = function (root, manager) {
            var actualDom = new DomWrapper(root, manager, this._renderListenerFactory, this._viewFactory, this._fetcherFactory);
            return Utils.wrapObjectWithSelfFunction(actualDom, function (dom, selector) { return dom.find(selector); });
        };
        return DomFactory;
    }());
    js.DomFactory = DomFactory;
    var Event = (function () {
        function Event() {
            this._listeners = [];
        }
        Event.prototype.listen = function (listener) {
            var that = this;
            this._listeners.push(listener);
            return {
                dispose: function () {
                    that.removeListener(listener);
                }
            };
        };
        Event.prototype.trigger = function (arg) {
            for (var i = 0; i < this._listeners.length; i++) {
                this._listeners[i](arg);
            }
        };
        Event.prototype.dispose = function () {
            this._listeners = null;
        };
        Event.prototype.getListenersCount = function () {
            if (this._listeners === null) {
                return 0;
            }
            return this._listeners.length;
        };
        Event.prototype.hasListeners = function () {
            return this.getListenersCount() > 0;
        };
        Event.prototype.removeListener = function (listener) {
            ArrayUtils.removeItem(this._listeners, listener);
        };
        return Event;
    }());
    js.Event = Event;
    var FetcherType = (function () {
        function FetcherType() {
        }
        return FetcherType;
    }());
    FetcherType.Value = "value";
    FetcherType.CheckedAttribute = "checkedAttribute";
    js.FetcherType = FetcherType;
    var ValueFetcher = (function () {
        function ValueFetcher() {
        }
        ValueFetcher.prototype.isSuitableFor = function (element) {
            var nodeName = element.getNodeName();
            if (nodeName) {
                nodeName = nodeName.toUpperCase();
                if (nodeName === "TEXTAREA" || nodeName === "SELECT") {
                    return true;
                }
                if (nodeName === "INPUT") {
                    var inputType = element.getAttribute("type");
                    if ((!inputType) || inputType.toUpperCase() === "TEXT") {
                        return true;
                    }
                }
            }
            return false;
        };
        ValueFetcher.prototype.valueToElement = function (value, element) {
            element.setValue(value);
        };
        ValueFetcher.prototype.valueFromElement = function (element) {
            return element.getValue();
        };
        return ValueFetcher;
    }());
    js.ValueFetcher = ValueFetcher;
    var CheckedAttributeFetcher = (function () {
        function CheckedAttributeFetcher() {
        }
        CheckedAttributeFetcher.prototype.isSuitableFor = function (element) {
            var nodeName = element.getNodeName();
            if (nodeName) {
                nodeName = nodeName.toUpperCase();
                var type = element.getAttribute("type");
                return nodeName === "INPUT" && type && type.toUpperCase() === "CHECKBOX";
            }
            return false;
        };
        CheckedAttributeFetcher.prototype.valueToElement = function (value, element) {
            element.setProperty("checked", value);
        };
        CheckedAttributeFetcher.prototype.valueFromElement = function (element) {
            var isChecked = false;
            if (element.getProperty("checked")) {
                isChecked = true;
            }
            return isChecked;
        };
        return CheckedAttributeFetcher;
    }());
    js.CheckedAttributeFetcher = CheckedAttributeFetcher;
    var FetcherFactory = (function () {
        function FetcherFactory() {
            this._items = {};
        }
        FetcherFactory.prototype.getForElement = function (element) {
            for (var key in this._items) {
                var fetcher = this._items[key];
                if (fetcher.isSuitableFor(element)) {
                    return fetcher;
                }
            }
            return null;
        };
        FetcherFactory.prototype.getByKey = function (key) {
            return this._items[key];
        };
        FetcherFactory.prototype.registerFetcher = function (key, fetcher) {
            this._items[key] = fetcher;
            return this;
        };
        return FetcherFactory;
    }());
    js.FetcherFactory = FetcherFactory;
    /// <reference path="../libs/jquery.d.ts"/>
    /// <reference path="Common.ts"/>
    var JQueryElement = (function () {
        function JQueryElement(target) {
            this.$ = target;
            this._target = target;
        }
        JQueryElement.prototype.empty = function () {
            this._target.empty();
        };
        JQueryElement.prototype.appendHtml = function (html) {
            if (html === null || html === undefined) {
                throw new Error("Could not append empty string!");
            }
            if (typeof html !== "string") {
                throw new Error("Expected string markup but was" + html);
            }
            var parsedHtml = $($.parseHTML(html));
            this._target.append(parsedHtml);
            return new JQueryElement(parsedHtml);
        };
        JQueryElement.prototype.getNodeName = function () {
            if (this._target.length == 1) {
                return this._target[0].nodeName;
            }
            return null;
        };
        JQueryElement.prototype.findRelative = function (query) {
            var result = this._target.filter(query);
            if (result.length == 0) {
                result = this._target.find(query);
            }
            return new JQueryElement(result);
        };
        JQueryElement.prototype.remove = function () {
            this._target.remove();
        };
        JQueryElement.prototype.getTarget = function () {
            return this._target;
        };
        JQueryElement.prototype.setText = function (text) {
            this._target.text(text);
        };
        JQueryElement.prototype.setHtml = function (html) {
            this._target.html(html);
        };
        JQueryElement.prototype.addClass = function (className) {
            this._target.addClass(className);
        };
        JQueryElement.prototype.removeClass = function (className) {
            this._target.removeClass(className);
        };
        JQueryElement.prototype.attachEventHandler = function (event, callback) {
            var actualCallback = function () {
                callback(new JQueryElement($(this)));
                return false;
            };
            this._target.on(event, actualCallback);
            return actualCallback;
        };
        JQueryElement.prototype.detachEventHandler = function (event, handler) {
            this._target.off(event, handler);
        };
        JQueryElement.prototype.getValue = function () {
            return this._target.val();
        };
        JQueryElement.prototype.setValue = function (value) {
            return this._target.val(value);
        };
        JQueryElement.prototype.getAttribute = function (attribute) {
            return this._target.attr(attribute);
        };
        JQueryElement.prototype.setAttribute = function (attribute, value) {
            this._target.attr(attribute, value);
        };
        JQueryElement.prototype.getProperty = function (property) {
            return this._target.prop(property);
        };
        JQueryElement.prototype.setProperty = function (property, value) {
            this._target.prop(property, value);
        };
        return JQueryElement;
    }());
    js.JQueryElement = JQueryElement;
    var JQueryMarkupResolver = (function () {
        function JQueryMarkupResolver() {
        }
        JQueryMarkupResolver.prototype.resolve = function (markup) {
            var $markup;
            if (markup instanceof jQuery) {
                $markup = markup;
            }
            else {
                try {
                    $markup = $(markup);
                }
                catch (error) {
                    return markup;
                }
            }
            if ($markup.parent().length > 0) {
                return $markup.html();
            }
            if (typeof markup === "string") {
                return markup;
            }
            if (markup instanceof jQuery) {
                return $("<p>").append(markup).html();
            }
            throw new Error("Could not resolve markup by object " + markup);
        };
        return JQueryMarkupResolver;
    }());
    js.JQueryMarkupResolver = JQueryMarkupResolver;
    var CustomListenerRenderer = (function () {
        function CustomListenerRenderer(payload) {
            this.payload = payload;
        }
        CustomListenerRenderer.prototype.render = function (value, destination) {
            this.payload(destination, value);
            return {
                element: destination,
                dispose: function () { }
            };
        };
        return CustomListenerRenderer;
    }());
    js.CustomListenerRenderer = CustomListenerRenderer;
    var RenderValueListener = (function () {
        function RenderValueListener(_observable, _contentDestination, _renderer) {
            this._observable = _observable;
            this._contentDestination = _contentDestination;
            this._renderer = _renderer;
        }
        RenderValueListener.prototype.init = function () {
            var _this = this;
            this._link = this._observable.listen(function (value) { return _this.doRender(value); });
        };
        RenderValueListener.prototype.dispose = function () {
            if (this._link) {
                this._link.dispose();
            }
            this.disposeCurrentValue();
        };
        RenderValueListener.prototype.doRender = function (value) {
            this.disposeCurrentValue();
            //if (value !== null && value !== undefined) {
            this._currentValue = this._renderer.render(value, this._contentDestination);
            //}
        };
        RenderValueListener.prototype.disposeCurrentValue = function () {
            if (this._currentValue) {
                this._currentValue.dispose();
            }
        };
        return RenderValueListener;
    }());
    js.RenderValueListener = RenderValueListener;
    var RenderListHandler = (function () {
        function RenderListHandler(_observable, _contentDestination, _renderer) {
            this._observable = _observable;
            this._contentDestination = _contentDestination;
            this._renderer = _renderer;
            this._renderedValues = [];
        }
        RenderListHandler.prototype.dispose = function () {
            if (this._link) {
                this._link.dispose();
            }
            for (var i = 0; i < this._renderedValues.length; i++) {
                if (this._renderedValues[i].renderedValue.dispose) {
                    this._renderedValues[i].renderedValue.dispose();
                }
            }
        };
        RenderListHandler.prototype.init = function () {
            var _this = this;
            this._link = this._observable.listen(function (value, oldValue, details) { return _this.doRender(details.portion, details.reason); });
        };
        RenderListHandler.prototype.findRenderedValue = function (value) {
            for (var i = 0; i < this._renderedValues.length; i++) {
                if (this._renderedValues[i].value === value) {
                    return this._renderedValues[i].renderedValue;
                }
            }
            return null;
        };
        RenderListHandler.prototype.removeRenderedValue = function (renderedValue) {
            var indexToRemove = -1;
            for (var i = 0; i < this._renderedValues.length; i++) {
                if (this._renderedValues[i].renderedValue === renderedValue) {
                    indexToRemove = i;
                }
            }
            if (indexToRemove >= 0) {
                this._renderedValues.splice(indexToRemove, 1);
            }
        };
        RenderListHandler.prototype.doRender = function (value, reason) {
            var items = value;
            if (reason == DataChangeReason.remove) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var itemRenderedValue = this.findRenderedValue(item);
                    if (itemRenderedValue) {
                        itemRenderedValue.dispose();
                        this.removeRenderedValue(itemRenderedValue);
                    }
                }
            }
            else if (reason == DataChangeReason.add) {
                this.appendItems(value);
            }
            else {
                this._renderedValues = [];
                this._contentDestination.empty();
                this.appendItems(value);
            }
        };
        RenderListHandler.prototype.appendItems = function (items) {
            if (!items) {
                return;
            }
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var itemRenderedValue = this._renderer.render(item, this._contentDestination);
                this._renderedValues.push({
                    value: item,
                    renderedValue: itemRenderedValue
                });
            }
        };
        return RenderListHandler;
    }());
    js.RenderListHandler = RenderListHandler;
    var RenderListenerFactory = (function () {
        function RenderListenerFactory(_defaultFormatter, _markupResolver, _viewFactory, _fetcherFactory) {
            this._defaultFormatter = _defaultFormatter;
            this._markupResolver = _markupResolver;
            this._viewFactory = _viewFactory;
            this._fetcherFactory = _fetcherFactory;
        }
        RenderListenerFactory.prototype.createListener = function (observable, dom, options) {
            var root = dom.root;
            if (!options) {
                options = {};
            }
            if (!options.renderer) {
                /** try to resolve view first */
                if (options.view) {
                    options.renderer = new ViewValueRenderer(this._viewFactory, options.view, dom.manager);
                }
                else {
                    /** use default renderer if no view in options */
                    if (!options.valueType) {
                        if (options.formatter) {
                            /** if custom formatter used we assume that formatted value might be of unknown type */
                            options.valueType = ValueType.unknown;
                        }
                        else {
                            var encode = true;
                            if (options.encode !== undefined) {
                                encode = options.encode;
                            }
                            options.valueType = encode ? ValueType.text : ValueType.html;
                        }
                    }
                    if (!options.formatter) {
                        options.formatter = this._defaultFormatter;
                    }
                    options.renderer = this.getRenderer(options, dom, observable);
                }
            }
            if (this.isList(observable)) {
                return new RenderListHandler(observable, root, options.renderer);
            }
            return new RenderValueListener(observable, root, options.renderer);
        };
        RenderListenerFactory.prototype.getRenderer = function (options, dom, observable) {
            var fetcher = null;
            if (options.fetch) {
                fetcher = this._fetcherFactory.getByKey(options.fetch);
                if (!fetcher) {
                    throw new Error("Fetcher " + options.fetch + " not found");
                }
            }
            else {
                fetcher = this._fetcherFactory.getForElement(dom.root);
                if (options.bidirectional !== false) {
                    var command = options.command;
                    var context = options.commandContext;
                    var event = options.event || "change";
                    var bindableObject = observable;
                    if ((!command) && bindableObject.setValue) {
                        command = bindableObject.setValue;
                        context = bindableObject;
                    }
                    if (command) {
                        dom.on(event).react(command, context);
                    }
                }
            }
            if (fetcher) {
                return new FetcherToRendererAdapter(fetcher);
            }
            switch (options.valueType) {
                case ValueType.text:
                    return new TextRenderer(options.formatter);
                case ValueType.html:
                    return new HtmlRenderer(options.formatter);
                case ValueType.unknown:
                    return new ResolvableMarkupRenderer(options.formatter, this._markupResolver);
                default:
                    throw new Error("Unknown value type: " + options.valueType);
            }
        };
        RenderListenerFactory.prototype.isList = function (bindable) {
            if (bindable instanceof ObservableList) {
                return true;
            }
            else if (bindable) {
                var value = bindable.getValue();
                if (value instanceof Array) {
                    return true;
                }
            }
            return false;
        };
        return RenderListenerFactory;
    }());
    js.RenderListenerFactory = RenderListenerFactory;
    /// <reference path="Common.ts"/>
    /// <reference path="Utils.ts"/>
    var DataChangeReason;
    (function (DataChangeReason) {
        DataChangeReason[DataChangeReason["replace"] = 0] = "replace";
        DataChangeReason[DataChangeReason["add"] = 1] = "add";
        DataChangeReason[DataChangeReason["remove"] = 2] = "remove";
        DataChangeReason[DataChangeReason["initial"] = 3] = "initial";
    })(DataChangeReason = js.DataChangeReason || (js.DataChangeReason = {}));
    var ListenerLink = (function () {
        function ListenerLink(allListeners, currentListener) {
            this.allListeners = allListeners;
            this.currentListener = currentListener;
        }
        ListenerLink.prototype.dispose = function () {
            ArrayUtils.removeItem(this.allListeners, this.currentListener);
        };
        return ListenerLink;
    }());
    js.ListenerLink = ListenerLink;
    var ObservableValue = (function () {
        function ObservableValue() {
            this._listeners = [];
        }
        ObservableValue.prototype.getValue = function () {
            return this._value;
        };
        ObservableValue.prototype.setValue = function (value) {
            var oldValue = this._value;
            this._value = value;
            this.notifyListeners(value, oldValue, { reason: DataChangeReason.replace, portion: value });
        };
        ObservableValue.prototype.listen = function (listener, raiseInitial) {
            this._listeners.push(listener);
            if (raiseInitial === undefined || raiseInitial === true) {
                listener(this.getValue(), null, { reason: DataChangeReason.initial, portion: this.getValue() });
                //this.notifyListeners(this.getValue(), this.getValue(), { reason: DataChangeReason.initial, portion: this.getValue() });
            }
            return new ListenerLink(this._listeners, listener);
        };
        ObservableValue.prototype.getListenersCount = function () {
            return this._listeners.length;
        };
        ObservableValue.prototype.getListener = function (index) {
            return this._listeners[index];
        };
        ObservableValue.prototype.notifyListeners = function (newValue, oldValue, details) {
            for (var i = 0; i < this._listeners.length; i++) {
                this._listeners[i](newValue, oldValue, details);
            }
        };
        ObservableValue.prototype.hasValue = function () {
            if (this._value == null || this._value == undefined) {
                return false;
            }
            return true;
        };
        return ObservableValue;
    }());
    js.ObservableValue = ObservableValue;
    var ObservableList = (function (_super) {
        __extends(ObservableList, _super);
        function ObservableList() {
            var _this = _super.call(this) || this;
            _super.prototype.setValue.call(_this, []);
            return _this;
        }
        ObservableList.prototype.setValue = function (value) {
            if (value) {
                if (!(value instanceof Array)) {
                    throw new Error("Observable list supports only array values");
                }
            }
            _super.prototype.setValue.call(this, value);
            this.notifyCountListeners();
        };
        ObservableList.prototype.add = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var oldValue = this.getValue().slice(0);
            var array = this.getValue();
            for (var i = 0; i < args.length; i++) {
                array.push(args[i]);
            }
            this.reactOnChange(this.getValue(), oldValue, { reason: DataChangeReason.add, portion: args });
        };
        ObservableList.prototype.remove = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var oldValue = this.getValue().slice(0);
            var array = this.getValue();
            for (var i = 0; i < args.length; i++) {
                ArrayUtils.removeItem(array, args[i]);
            }
            this.reactOnChange(this.getValue(), oldValue, { reason: DataChangeReason.remove, portion: args });
        };
        /** Removes all items from the list */
        ObservableList.prototype.clear = function () {
            var removed = this.getValue().splice(0, this.getValue().length);
            this.reactOnChange(this.getValue(), removed, { reason: DataChangeReason.remove, portion: removed });
        };
        /** Returns a bindable value that stores size of the list */
        ObservableList.prototype.count = function () {
            if (!this._count) {
                this._count = new ObservableValue();
                this.notifyCountListeners();
            }
            return this._count;
        };
        ObservableList.prototype.forEach = function (callback, thisArg) {
            var array = this.getValue();
            array.forEach(callback, thisArg);
        };
        ObservableList.prototype.reactOnChange = function (newItems, oldItems, details) {
            _super.prototype.notifyListeners.call(this, newItems, oldItems, details);
            this.notifyCountListeners();
        };
        ObservableList.prototype.notifyCountListeners = function () {
            if (this._count) {
                if (this.getValue()) {
                    this._count.setValue(this.getValue().length);
                }
                else {
                    this._count.setValue(0);
                }
            }
        };
        return ObservableList;
    }(ObservableValue));
    js.ObservableList = ObservableList;
    var DependentValue = (function (_super) {
        __extends(DependentValue, _super);
        function DependentValue(evaluate, dependencies) {
            var _this = _super.call(this) || this;
            _this._wires = [];
            _this._dependencies = dependencies;
            _this._evaluateValue = evaluate;
            _this._dependencyValues = [];
            for (var i = 0; i < dependencies.length; i++) {
                var dependency = dependencies[i];
                _this.setupListener(dependency);
                _this._dependencyValues[i] = dependency.getValue();
            }
            return _this;
        }
        DependentValue.prototype.dispose = function () {
            for (var i = 0; i < this._wires.length; i++) {
                this._wires[i].dispose();
            }
        };
        DependentValue.prototype.getValue = function () {
            return this._evaluateValue.apply(this, this._dependencyValues);
        };
        DependentValue.prototype.setValue = function (value) {
            throw Error("Could not set dependent value");
        };
        DependentValue.prototype.notifyDependentListeners = function (causedByDependency, newDependencyValue) {
            var oldValue = this.getValue();
            for (var i = 0; i < this._dependencies.length; i++) {
                var dependency = this._dependencies[i];
                if (dependency === causedByDependency) {
                    this._dependencyValues[i] = newDependencyValue;
                }
            }
            var newValue = this.getValue();
            for (var i = 0; i < this.getListenersCount(); i++) {
                var listener = this.getListener(i);
                listener(newValue, oldValue, { portion: newValue, reason: DataChangeReason.replace });
            }
        };
        DependentValue.prototype.setupListener = function (dependency) {
            var _this = this;
            var wire = dependency.listen(function (newValue, oldValue, details) {
                var actualValue = newValue;
                if (details.reason !== DataChangeReason.replace) {
                    actualValue = dependency.getValue();
                }
                _this.notifyDependentListeners(dependency, actualValue);
            }, false);
            this._wires.push(wire);
        };
        return DependentValue;
    }(ObservableValue));
    js.DependentValue = DependentValue;
    var StaticObservableValue = (function () {
        function StaticObservableValue(_value) {
            this._value = _value;
        }
        StaticObservableValue.prototype.getValue = function () {
            return this._value;
        };
        StaticObservableValue.prototype.listen = function (listener) {
            listener(this.getValue(), null, { reason: DataChangeReason.initial, portion: this.getValue() });
            return { dispose: function () { } };
        };
        return StaticObservableValue;
    }());
    js.StaticObservableValue = StaticObservableValue;
    /**
     * A base class for formatting-based renderers.
     * @abstract
     */
    var FormatterBasedRenderer = (function () {
        function FormatterBasedRenderer(formatter) {
            this._formatter = formatter;
        }
        FormatterBasedRenderer.prototype.render = function (value, destination) {
            var _this = this;
            var formattedValue = this._formatter(Utils.isNullOrUndefined(value) ? '' : value);
            this.doRender(formattedValue, destination);
            return {
                dispose: function () { _this.doRender('', destination); }
            };
        };
        /**
         * @abstract
         * @param formattedValue
         */
        FormatterBasedRenderer.prototype.doRender = function (formattedValue, destination) { };
        return FormatterBasedRenderer;
    }());
    js.FormatterBasedRenderer = FormatterBasedRenderer;
    /**
     * Appends encoded text to destination element.
     */
    var TextRenderer = (function (_super) {
        __extends(TextRenderer, _super);
        function TextRenderer(formatter) {
            return _super.call(this, formatter) || this;
        }
        TextRenderer.prototype.doRender = function (formattedValue, destination) {
            destination.setText(formattedValue);
        };
        return TextRenderer;
    }(FormatterBasedRenderer));
    js.TextRenderer = TextRenderer;
    /**
     * Appends html markup to destination element.
     */
    var HtmlRenderer = (function (_super) {
        __extends(HtmlRenderer, _super);
        function HtmlRenderer(formatter) {
            return _super.call(this, formatter) || this;
        }
        HtmlRenderer.prototype.doRender = function (formattedValue, destination) {
            destination.setHtml(formattedValue);
        };
        return HtmlRenderer;
    }(FormatterBasedRenderer));
    js.HtmlRenderer = HtmlRenderer;
    /**
     * Appends html markup to destination element.
     */
    var ResolvableMarkupRenderer = (function (_super) {
        __extends(ResolvableMarkupRenderer, _super);
        function ResolvableMarkupRenderer(formatter, markupResolver) {
            var _this = _super.call(this, formatter) || this;
            _this._markupResolver = markupResolver;
            return _this;
        }
        ResolvableMarkupRenderer.prototype.doRender = function (formattedValue, destination) {
            var markup = this._markupResolver.resolve(formattedValue);
            destination.setHtml(markup);
        };
        return ResolvableMarkupRenderer;
    }(FormatterBasedRenderer));
    js.ResolvableMarkupRenderer = ResolvableMarkupRenderer;
    var ViewValueRenderer = (function () {
        function ViewValueRenderer(viewFactory, viewDescriptor, _parent) {
            this._parent = _parent;
            this._viewFactory = viewFactory;
            this._viewDescriptor = viewDescriptor;
        }
        ViewValueRenderer.prototype.render = function (value, destination) {
            if (Utils.isNullOrUndefined(value)) {
                return DisposingUtils.noopDisposable;
            }
            var currentView = this._viewFactory.resolve(destination, this._viewDescriptor, value, this._parent);
            currentView.init();
            return {
                dispose: function () {
                    currentView.dispose();
                }
            };
        };
        return ViewValueRenderer;
    }());
    js.ViewValueRenderer = ViewValueRenderer;
    var FetcherToRendererAdapter = (function () {
        function FetcherToRendererAdapter(fetcher) {
            this._fetcher = fetcher;
        }
        FetcherToRendererAdapter.prototype.render = function (formattedValue, destination) {
            this._fetcher.valueToElement(formattedValue, destination);
            return DisposingUtils.noopDisposable;
        };
        return FetcherToRendererAdapter;
    }());
    js.FetcherToRendererAdapter = FetcherToRendererAdapter;
    var Utils;
    (function (Utils) {
        Utils.isNullOrUndefined = function (value) {
            return value === null || value === undefined;
        };
        /**
         * Checks if provided object is a function.
         * @param target An object to check.
         * @returns {boolean}
         */
        Utils.isFunction = function (target) {
            var getType = {};
            return (target && getType.toString.call(target) === '[object Function]');
        };
        /**
         *
         */
        Utils.wrapObjectWithSelfFunction = function (target, payload) {
            var result = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                args.splice(0, 0, result);
                return payload.apply(this, args);
            };
            for (var key in target) {
                result[key] = target[key];
            }
            return result;
        };
    })(Utils = js.Utils || (js.Utils = {}));
    var ArrayUtils;
    (function (ArrayUtils) {
        ArrayUtils.removeItem = function (array, itemToRemove) {
            var indexToRemove = -1;
            for (var i = 0; i < array.length; i++) {
                if (array[i] === itemToRemove) {
                    indexToRemove = i;
                }
            }
            if (indexToRemove >= 0) {
                array.splice(indexToRemove, 1);
            }
        };
    })(ArrayUtils = js.ArrayUtils || (js.ArrayUtils = {}));
    var DisposingUtils;
    (function (DisposingUtils) {
        DisposingUtils.noop = function () { };
        DisposingUtils.noopDisposable = {
            dispose: DisposingUtils.noop
        };
    })(DisposingUtils = js.DisposingUtils || (js.DisposingUtils = {}));
    var ManagableDisposableAdapter = (function () {
        function ManagableDisposableAdapter(disposable) {
            this.disposable = disposable;
        }
        ManagableDisposableAdapter.prototype.init = function () { };
        ManagableDisposableAdapter.prototype.dispose = function () {
            this.disposable.dispose();
        };
        return ManagableDisposableAdapter;
    }());
    var ComposedView = (function () {
        function ComposedView(_viewData, _viewModel, _markupResolver, _destination, _domFactory, _parent) {
            this._viewData = _viewData;
            this._viewModel = _viewModel;
            this._markupResolver = _markupResolver;
            this._destination = _destination;
            this._domFactory = _domFactory;
            this._parent = _parent;
            this._slaves = [];
            this._unrender = new Event();
        }
        ComposedView.prototype.onUnrender = function () {
            return this._unrender;
        };
        ComposedView.prototype.manage = function (manageable) {
            this._slaves.push(manageable.init ? manageable : new ManagableDisposableAdapter(manageable));
        };
        ComposedView.prototype.init = function () {
            var templateHtml = this._markupResolver.resolve(this._viewData.template);
            var root = this._destination.appendHtml(templateHtml);
            this.attachViewToRoot(root);
        };
        ComposedView.prototype.getViewModel = function () {
            return this._viewModel;
        };
        ComposedView.prototype.getParent = function () {
            return this._parent;
        };
        ComposedView.prototype.attachViewToRoot = function (root) {
            this._root = root;
            if (this._viewData.init) {
                var dom = this._domFactory.create(this._root, this);
                if (this._viewData.deep > 0) {
                    var viewModelsOfLevelDeep = this.fetchViewModels(this._viewData.deep);
                    viewModelsOfLevelDeep.splice(0, 0, this._viewModel);
                    viewModelsOfLevelDeep.splice(0, 0, dom);
                    this._viewData.init.apply(this._viewData, viewModelsOfLevelDeep);
                }
                else {
                    this._viewData.init(dom, this._viewModel);
                }
            }
            for (var i = 0; i < this._slaves.length; i++) {
                this._slaves[i].init();
            }
            if (this._viewModel && this._viewModel.initState) {
                this._viewModel.initState();
            }
        };
        ComposedView.prototype.getRootElement = function () {
            return this._root;
        };
        ComposedView.prototype.unrenderView = function () {
            if (this._unrender.hasListeners()) {
                this._unrender.trigger();
            }
            else {
                this.getRootElement().remove();
            }
        };
        ComposedView.prototype.dispose = function () {
            this.unrenderView();
            /* release viewModel state before disposing
             *  to make sure the model will not attempt to use observables */
            if (this._viewModel && this._viewModel.releaseState) {
                this._viewModel.releaseState();
            }
            for (var i = 0; i < this._slaves.length; i++) {
                this._slaves[i].dispose();
            }
        };
        ComposedView.prototype.fetchViewModels = function (deep) {
            var result = [];
            var currentManager = this.getParent();
            var currentLevel = 1;
            while (currentLevel <= deep && currentManager !== null) {
                result.push(currentManager.getViewModel());
                currentManager = currentManager.getParent();
                currentLevel++;
            }
            return result;
        };
        return ComposedView;
    }());
    js.ComposedView = ComposedView;
    /**
     * Default implementation of IViewFactory
     */
    var DefaultViewFactory = (function () {
        function DefaultViewFactory(_markupResolver) {
            this._markupResolver = _markupResolver;
        }
        DefaultViewFactory.prototype.setDomFactory = function (domFactory) {
            this._domFactory = domFactory;
        };
        DefaultViewFactory.prototype.resolve = function (destination, dataDescriptor, viewModel, parent) {
            if (!dataDescriptor) {
                throw new Error("Expected view data object was not defined");
            }
            if (Utils.isFunction(dataDescriptor)) {
                var newInstance = new dataDescriptor(viewModel);
                return this.resolve(destination, newInstance, viewModel, parent);
            }
            if (dataDescriptor.template) {
                return new ComposedView(dataDescriptor, viewModel, this._markupResolver, destination, this._domFactory, parent);
            }
            if (dataDescriptor.renderTo && dataDescriptor.getRootElement) {
                return dataDescriptor;
            }
            throw new Error("Could not resolve view data by provided descriptor");
        };
        return DefaultViewFactory;
    }());
    js.DefaultViewFactory = DefaultViewFactory;
})(js || (js = {}));
js.init();


/*** EXPORTS FROM exports-loader ***/
module.exports = js;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(2)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with computed style
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// Fall back to offsetWidth/Height when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	if ( val === "auto" ) {
		val = elem[ "offset" + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
		return jQuery;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(54),
    baseIteratee = __webpack_require__(8),
    baseMap = __webpack_require__(143),
    isArray = __webpack_require__(1);

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SchedulerStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ActivityStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return PropertyValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return Property; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return NullableDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return SchedulerEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return SchedulerEventScope; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SchedulerEventType; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_reduce__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_reduce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_reduce__);

var SchedulerStatus = (function () {
    function SchedulerStatus(value, code) {
        this.value = value;
        this.code = code;
    }
    SchedulerStatus.findByCode = function (code) {
        return this._dictionaryByCode[code];
    };
    return SchedulerStatus;
}());

SchedulerStatus.Offline = new SchedulerStatus(-1, 'Offline');
SchedulerStatus.Empty = new SchedulerStatus(0, 'empty');
SchedulerStatus.Ready = new SchedulerStatus(1, 'ready');
SchedulerStatus.Started = new SchedulerStatus(2, 'started');
SchedulerStatus.Shutdown = new SchedulerStatus(3, 'shutdown');
SchedulerStatus._all = [
    SchedulerStatus.Offline,
    SchedulerStatus.Empty,
    SchedulerStatus.Ready,
    SchedulerStatus.Started,
    SchedulerStatus.Shutdown
];
SchedulerStatus._dictionaryByCode = __WEBPACK_IMPORTED_MODULE_0_lodash_reduce___default()(SchedulerStatus._all, function (result, item) {
    result[item.code] = item;
    return result;
}, {});
var ActivityStatus = (function () {
    function ActivityStatus(value, title, code) {
        this.value = value;
        this.title = title;
        this.code = code;
    }
    ActivityStatus.findBy = function (value) {
        return ActivityStatus._dictionary[value];
    };
    return ActivityStatus;
}());

ActivityStatus.Active = new ActivityStatus(0, 'Active', 'active');
ActivityStatus.Paused = new ActivityStatus(1, 'Paused', 'paused');
ActivityStatus.Mixed = new ActivityStatus(2, 'Mixed', 'mixed');
ActivityStatus.Complete = new ActivityStatus(3, 'Complete', 'complete');
ActivityStatus._dictionary = {
    0: ActivityStatus.Active,
    1: ActivityStatus.Paused,
    2: ActivityStatus.Mixed,
    3: ActivityStatus.Complete
};
var PropertyValue = (function () {
    function PropertyValue(typeCode, rawValue, errorMessage, nestedProperties, isOverflow, kind) {
        this.typeCode = typeCode;
        this.rawValue = rawValue;
        this.errorMessage = errorMessage;
        this.nestedProperties = nestedProperties;
        this.isOverflow = isOverflow;
        this.kind = kind;
    }
    PropertyValue.prototype.isSingle = function () {
        return this.typeCode === 'single' || this.typeCode === 'error' || this.typeCode === '...';
    };
    return PropertyValue;
}());

var Property = (function () {
    function Property(title, value) {
        this.title = title;
        this.value = value;
    }
    return Property;
}());

var NullableDate = (function () {
    function NullableDate(date) {
        this.date = date;
        this._isEmpty = date == null;
    }
    NullableDate.prototype.isEmpty = function () {
        return this._isEmpty;
    };
    NullableDate.prototype.getDate = function () {
        return this.date;
    };
    return NullableDate;
}());

var ErrorMessage = (function () {
    function ErrorMessage(level, text) {
        this.level = level;
        this.text = text;
    }
    return ErrorMessage;
}());

var SchedulerEvent = (function () {
    function SchedulerEvent(id, date, scope, eventType, itemKey, fireInstanceId, faulted, errors) {
        this.id = id;
        this.date = date;
        this.scope = scope;
        this.eventType = eventType;
        this.itemKey = itemKey;
        this.fireInstanceId = fireInstanceId;
        this.faulted = faulted;
        this.errors = errors;
    }
    return SchedulerEvent;
}());

var SchedulerEventScope;
(function (SchedulerEventScope) {
    SchedulerEventScope[SchedulerEventScope["Scheduler"] = 0] = "Scheduler";
    SchedulerEventScope[SchedulerEventScope["Group"] = 1] = "Group";
    SchedulerEventScope[SchedulerEventScope["Job"] = 2] = "Job";
    SchedulerEventScope[SchedulerEventScope["Trigger"] = 3] = "Trigger";
})(SchedulerEventScope || (SchedulerEventScope = {}));
var SchedulerEventType;
(function (SchedulerEventType) {
    SchedulerEventType[SchedulerEventType["Fired"] = 0] = "Fired";
    SchedulerEventType[SchedulerEventType["Complete"] = 1] = "Complete";
    SchedulerEventType[SchedulerEventType["Paused"] = 2] = "Paused";
    SchedulerEventType[SchedulerEventType["Resumed"] = 3] = "Resumed";
    SchedulerEventType[SchedulerEventType["Standby"] = 4] = "Standby";
    SchedulerEventType[SchedulerEventType["Shutdown"] = 5] = "Shutdown";
})(SchedulerEventType || (SchedulerEventType = {}));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(68);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(213);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(127),
    baseKeys = __webpack_require__(141),
    isArrayLike = __webpack_require__(13);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var baseMatches = __webpack_require__(144),
    baseMatchesProperty = __webpack_require__(145),
    identity = __webpack_require__(12),
    isArray = __webpack_require__(1),
    property = __webpack_require__(220);

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(139),
    getValue = __webpack_require__(169);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var getDate = function (date) {
    if (date instanceof Date) {
        return date;
    }
    return new Date(date);
};
var DateLocaleEnvironment = (function () {
    function DateLocaleEnvironment(dateFormatter, timeFormatter) {
        this.dateFormatter = dateFormatter;
        this.timeFormatter = timeFormatter;
    }
    return DateLocaleEnvironment;
}());
var LocaleEnvironmentFactory = (function () {
    function LocaleEnvironmentFactory() {
        var _this = this;
        this._hours12Formatter = function (date) {
            var dateObject = getDate(date), hours = dateObject.getHours(), minutes = dateObject.getMinutes(), seconds = dateObject.getSeconds(), isPm = hours > 12;
            return _this.padZeros(isPm ? hours - 12 : hours) + ':' + _this.padZeros(minutes) +
                (seconds > 0 ? (':' + _this.padZeros(seconds)) : '') + ' ' +
                (isPm ? 'PM' : 'AM');
        };
        this._hours24Formatter = function (date) {
            var dateObject = getDate(date), hours = dateObject.getHours(), minutes = dateObject.getMinutes(), seconds = dateObject.getSeconds();
            return _this.padZeros(hours) + ':' + _this.padZeros(minutes) + (seconds > 0 ? (':' + seconds) : '');
        };
    }
    LocaleEnvironmentFactory.prototype.padZeros = function (value) {
        if (value < 10) {
            return '0' + value;
        }
        return value.toString();
    };
    LocaleEnvironmentFactory.prototype.is24HoursFormat = function () {
        var markerDate = new Date(2017, 4, 28, 17, 26);
        return markerDate.toLocaleTimeString().indexOf('17') >= 0;
    };
    LocaleEnvironmentFactory.prototype.createEnvironment = function () {
        var dateFormatter = function (date) { return getDate(date).toLocaleDateString(); };
        return new DateLocaleEnvironment(dateFormatter, this.is24HoursFormat() ? this._hours24Formatter : this._hours12Formatter);
    };
    return LocaleEnvironmentFactory;
}());
var localeEnvironment = new LocaleEnvironmentFactory().createEnvironment();
var DateUtils = (function () {
    function DateUtils() {
    }
    DateUtils.smartDateFormat = function (date) {
        var now = new Date(), today = now.setHours(0, 0, 0, 0), // start time of local date
        tomorrow = today + 86400000, dateObject = getDate(date), dateTicks = dateObject.getTime(), shouldOmitDate = dateTicks >= today && dateTicks <= tomorrow;
        return (shouldOmitDate ? '' : localeEnvironment.dateFormatter(dateObject) + ' ') +
            localeEnvironment.timeFormatter(dateObject);
    };
    DateUtils.timeFormat = function (date) {
        return localeEnvironment.timeFormatter(date);
    };
    return DateUtils;
}());
/* harmony default export */ __webpack_exports__["a"] = (DateUtils);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(61),
    createBaseEach = __webpack_require__(159);

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(74),
    isLength = __webpack_require__(41);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),
/* 14 */
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
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Timer; });
var Timer = (function () {
    function Timer() {
    }
    Timer.prototype.schedule = function (action, delay) {
        this.reset();
        this._ref = setTimeout(action, delay);
    };
    Timer.prototype.reset = function () {
        if (this._ref) {
            clearTimeout(this._ref);
            this._ref = null;
        }
    };
    Timer.prototype.dispose = function () {
        this.reset();
    };
    return Timer;
}());



/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(5);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(16),
    getRawTag = __webpack_require__(166),
    objectToString = __webpack_require__(193);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(53),
    baseFilter = __webpack_require__(130),
    baseIteratee = __webpack_require__(8),
    isArray = __webpack_require__(1);

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = filter;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(17),
    isObjectLike = __webpack_require__(20);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SCHEDULER_DATA_MAPPER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return TYPE_MAPPER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return PARSE_OPTIONAL_INT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PROPERTY_VALUE_MAPPER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return TRIGGER_MAPPER; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_map__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_keys__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_keys__);



var SCHEDULER_DATA_MAPPER = mapSchedulerData;
var TYPE_MAPPER = mapTypeInfo;
var PARSE_OPTIONAL_INT = parseOptionalInt;
var PROPERTY_VALUE_MAPPER = mapPropertyValue;
var TRIGGER_MAPPER = mapSingleTrigger;
function mapSchedulerData(data) {
    return {
        Name: data.n,
        ServerInstanceMarker: data.sim,
        Status: data.st,
        InstanceId: data['_'],
        RunningSince: data.rs ? parseInt(data.rs, 10) : null,
        JobsTotal: data.jt ? parseInt(data.jt, 10) : 0,
        JobsExecuted: data.je ? parseInt(data.je, 10) : 0,
        JobGroups: mapJobGroups(data.jg),
        InProgress: mapInProgress(data.ip),
        Events: mapEvents(data.ev)
    };
}
function mapEvents(events) {
    if (!events) {
        return [];
    }
    return __WEBPACK_IMPORTED_MODULE_1_lodash_map___default()(events, function (dto) {
        var primary = dto['_'], parts = parseJoined(primary, 4), errors = dto['_err'];
        return new __WEBPACK_IMPORTED_MODULE_0__api__["g" /* SchedulerEvent */](parseInt(parts[0], 10), parseInt(parts[1], 10), parseInt(parts[3], 10), parseInt(parts[2], 10), dto['k'], dto['fid'], !!errors, (errors && errors !== 1) ? __WEBPACK_IMPORTED_MODULE_1_lodash_map___default()(errors, function (err) { return new __WEBPACK_IMPORTED_MODULE_0__api__["e" /* ErrorMessage */](err['l'] || 0, err['_']); }) : null);
    });
}
function mapJobGroups(groups) {
    if (!groups) {
        return [];
    }
    return __WEBPACK_IMPORTED_MODULE_1_lodash_map___default()(groups, function (dto) { return ({
        Name: dto.n,
        Status: __WEBPACK_IMPORTED_MODULE_0__api__["b" /* ActivityStatus */].findBy(parseInt(dto.s, 10)),
        Jobs: mapJobs(dto.jb)
    }); });
}
function mapJobs(jobs) {
    if (!jobs) {
        return [];
    }
    return __WEBPACK_IMPORTED_MODULE_1_lodash_map___default()(jobs, function (dto) { return ({
        Name: dto.n,
        Status: __WEBPACK_IMPORTED_MODULE_0__api__["b" /* ActivityStatus */].findBy(parseInt(dto.s, 10)),
        GroupName: dto.gn,
        UniqueName: dto['_'],
        Triggers: mapTriggers(dto.tr)
    }); });
}
function mapTriggers(triggers) {
    if (!triggers) {
        return [];
    }
    return __WEBPACK_IMPORTED_MODULE_1_lodash_map___default()(triggers, mapSingleTrigger);
}
function mapSingleTrigger(dto) {
    if (!dto) {
        return null;
    }
    return {
        Name: dto.n,
        Status: __WEBPACK_IMPORTED_MODULE_0__api__["b" /* ActivityStatus */].findBy(parseInt(dto.s, 10)),
        GroupName: dto.gn,
        EndDate: parseOptionalInt(dto.ed),
        NextFireDate: parseOptionalInt(dto.nfd),
        PreviousFireDate: parseOptionalInt(dto.pfd),
        StartDate: parseInt(dto.sd),
        TriggerType: mapTriggerType(dto),
        UniqueTriggerKey: dto['_']
    };
}
function mapTriggerType(dto) {
    var triggerTypeCode = dto.tc, triggerData = dto.tb;
    switch (triggerTypeCode) {
        case 'simple':
            return parseSimpleTriggerType(triggerTypeCode, triggerData);
        case 'cron':
            return parseCronTriggerType(triggerTypeCode, triggerData);
        default:
            return {
                Code: triggerTypeCode,
                supportedMisfireInstructions: {}
            };
    }
}
function parseSimpleTriggerType(code, data) {
    var parts = parseJoined(data, 3);
    return {
        Code: code,
        RepeatCount: parseInt(parts[0], 10),
        RepeatInterval: parseInt(parts[1], 10),
        TimesTriggered: parseInt(parts[2], 10),
        supportedMisfireInstructions: {
            1: 'Fire Now',
            2: 'Reschedule Now With Existing RepeatCount',
            3: 'Reschedule Now With RemainingRepeatCount',
            4: 'Reschedule Next With Remaining Count',
            5: 'Reschedule Next With Existing Count'
        }
    };
}
function parseCronTriggerType(code, data) {
    return {
        Code: code,
        CronExpression: data,
        supportedMisfireInstructions: {
            1: 'Fire Once Now',
            2: 'Do Nothing'
        }
    };
}
function mapInProgress(inProgress) {
    if (!inProgress) {
        return [];
    }
    return __WEBPACK_IMPORTED_MODULE_1_lodash_map___default()(inProgress, function (dto) {
        var parts = parseJoined(dto, 2);
        return {
            FireInstanceId: parts[0],
            UniqueTriggerKey: parts[1]
        };
    });
}
function mapTypeInfo(data) {
    if (!data) {
        return null;
    }
    var parts = parseJoined(data, 3);
    return {
        Assembly: parts[0],
        Namespace: parts[1],
        Name: parts[2]
    };
}
function parseOptionalInt(dto) {
    if (dto === null || dto === undefined) {
        return null;
    }
    return parseInt(dto, 10);
}
function parseJoined(dto, expectedCount) {
    var parts = dto.split('|');
    if (parts.length === expectedCount) {
        return parts;
    }
    if (parts.length < expectedCount) {
        throw new Error('Unexpected joinde string: ' +
            dto +
            '. Expected ' +
            expectedCount +
            ' parts but got ' +
            parts.length);
    }
    var result = [];
    var tail = [];
    for (var i = 0; i < parts.length; i++) {
        if (i < expectedCount - 1) {
            result.push(parts[i]);
        }
        else {
            tail.push(parts[i]);
        }
    }
    result.push(tail.join('|'));
    return result;
}
function mapPropertyValue(data) {
    if (!data) {
        return null;
    }
    var typeCode = data["_"], isSingle = typeCode === 'single';
    return new __WEBPACK_IMPORTED_MODULE_0__api__["h" /* PropertyValue */](data["_"], isSingle ? data["v"] : null, data["_err"], isSingle ? null : mapProperties(typeCode, data['v']), isSingle ? false : !!data['...'], data["k"]);
}
function mapProperties(typeCode, data) {
    if (!data) {
        return null;
    }
    if (typeCode === 'enumerable') {
        return __WEBPACK_IMPORTED_MODULE_1_lodash_map___default()(data, function (item, index) { return new __WEBPACK_IMPORTED_MODULE_0__api__["i" /* Property */]('[' + index + ']', mapPropertyValue(item)); });
    }
    else if (typeCode === "object") {
        return __WEBPACK_IMPORTED_MODULE_1_lodash_map___default()(__WEBPACK_IMPORTED_MODULE_2_lodash_keys___default()(data), function (key) { return new __WEBPACK_IMPORTED_MODULE_0__api__["i" /* Property */](key, mapPropertyValue(data[key])); });
    }
    else {
        throw new Error('Unknown type code ' + typeCode);
    }
}


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var DialogViewBase = (function () {
    function DialogViewBase() {
    }
    DialogViewBase.prototype.init = function (dom, viewModel) {
        dom('.js_close').on('click').react(viewModel.cancel); /* todo: base class */
        dom.$.addClass('showing');
        setTimeout(function () {
            dom.$.removeClass('showing');
        }, 10);
        dom.onUnrender().listen(function () {
            dom.$.addClass('showing');
            setTimeout(function () {
                dom.$.remove();
            }, 1000);
        });
    };
    return DialogViewBase;
}());
/* harmony default export */ __webpack_exports__["a"] = (DialogViewBase);


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var Separator = (function () {
    function Separator() {
    }
    return Separator;
}());
/* harmony default export */ __webpack_exports__["a"] = (Separator);


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(179),
    listCacheDelete = __webpack_require__(180),
    listCacheGet = __webpack_require__(181),
    listCacheHas = __webpack_require__(182),
    listCacheSet = __webpack_require__(183);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(30);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(177);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(9);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(21);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PropertyType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Property; });
var PropertyType;
(function (PropertyType) {
    PropertyType[PropertyType["String"] = 0] = "String";
    PropertyType[PropertyType["Boolean"] = 1] = "Boolean";
    PropertyType[PropertyType["Type"] = 2] = "Type";
    PropertyType[PropertyType["Numeric"] = 3] = "Numeric";
    PropertyType[PropertyType["Array"] = 4] = "Array";
    PropertyType[PropertyType["Object"] = 5] = "Object";
    PropertyType[PropertyType["Date"] = 6] = "Date";
})(PropertyType || (PropertyType = {}));
var Property = (function () {
    function Property(title, value, valueType) {
        this.title = title;
        this.value = value;
        this.valueType = valueType;
    }
    return Property;
}());



/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DialogViewModel; });
var DialogViewModel = (function () {
    function DialogViewModel() {
        this.accepted = new js.Event();
        this.canceled = new js.Event();
    }
    DialogViewModel.prototype.cancel = function () {
        this.canceled.trigger({});
    };
    return DialogViewModel;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(9),
    root = __webpack_require__(5);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(184),
    mapCacheDelete = __webpack_require__(185),
    mapCacheGet = __webpack_require__(186),
    mapCacheHas = __webpack_require__(187),
    mapCacheSet = __webpack_require__(188);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(30),
    isArrayLike = __webpack_require__(13),
    isIndex = __webpack_require__(35),
    isObject = __webpack_require__(19);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(1),
    isSymbol = __webpack_require__(21);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var createFind = __webpack_require__(161),
    findIndex = __webpack_require__(211);

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(60),
    map = __webpack_require__(3);

/**
 * Creates a flattened array of values by running each element in `collection`
 * thru `iteratee` and flattening the mapped results. The iteratee is invoked
 * with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * function duplicate(n) {
 *   return [n, n];
 * }
 *
 * _.flatMap([1, 2], duplicate);
 * // => [1, 1, 2, 2]
 */
function flatMap(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), 1);
}

module.exports = flatMap;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(136),
    isObjectLike = __webpack_require__(20);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),
/* 41 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var arraySome = __webpack_require__(56),
    baseIteratee = __webpack_require__(8),
    baseSome = __webpack_require__(151),
    isArray = __webpack_require__(1),
    isIterateeCall = __webpack_require__(36);

/**
 * Checks if `predicate` returns truthy for **any** element of `collection`.
 * Iteration is stopped once `predicate` returns truthy. The predicate is
 * invoked with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 * @example
 *
 * _.some([null, 0, 'yes', false], Boolean);
 * // => true
 *
 * var users = [
 *   { 'user': 'barney', 'active': true },
 *   { 'user': 'fred',   'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.some(users, { 'user': 'barney', 'active': false });
 * // => false
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.some(users, ['active', false]);
 * // => true
 *
 * // The `_.property` iteratee shorthand.
 * _.some(users, 'active');
 * // => true
 */
function some(collection, predicate, guard) {
  var func = isArray(collection) ? arraySome : baseSome;
  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = some;


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_actions_action__ = __webpack_require__(88);
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

var CommandAction = (function (_super) {
    __extends(CommandAction, _super);
    function CommandAction(application, commandService, title, commandFactory, confirmText) {
        return _super.call(this, title, function () { return commandService.executeCommand(commandFactory()).done(function (data) { return application.setData(data); }); }, confirmText) || this;
    }
    return CommandAction;
}(__WEBPACK_IMPORTED_MODULE_0__global_actions_action__["a" /* default */]));
/* harmony default export */ __webpack_exports__["a"] = (CommandAction);


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GetEnvironmentDataCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return GetDataCommand; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abstract_command__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_mappers__ = __webpack_require__(22);
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
        _this.mapper = function (data) { return ({
            SelfVersion: data.sv,
            QuartzVersion: data.qv,
            DotNetVersion: data.dnv,
            CustomCssUrl: data.ccss,
            TimelineSpan: parseInt(data.ts, 10)
        }); };
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
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
        _this.code = 'get_data';
        _this.message = 'Loading scheduler data';
        return _this;
    }
    return GetDataCommand;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));



/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PauseTriggerCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ResumeTriggerCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return DeleteTriggerCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddTriggerCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return GetTriggerDetailsCommand; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abstract_command__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_mappers__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_each__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_each___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_each__);
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
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
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
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
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
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
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
        _this.mapper = function (dto) { return ({ validationErrors: dto['ve'] }); };
        _this.code = 'add_trigger';
        _this.message = 'Adding new trigger';
        _this.data = {
            name: form.name,
            job: form.job,
            group: form.group,
            triggerType: form.triggerType,
            cronExpression: form.cronExpression,
            repeatForever: form.repeatForever,
            repeatCount: form.repeatCount,
            repeatInterval: form.repeatInterval
        };
        if (form.jobDataMap) {
            var index = 0;
            __WEBPACK_IMPORTED_MODULE_2_lodash_each___default()(form.jobDataMap, function (x) {
                _this.data['jobDataMap[' + index + '].Key'] = x.key;
                _this.data['jobDataMap[' + index + '].Value'] = x.value;
                _this.data['jobDataMap[' + index + '].InputTypeCode'] = x.inputTypeCode;
                index++;
            });
        }
        return _this;
    }
    return AddTriggerCommand;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

var GetTriggerDetailsCommand = (function (_super) {
    __extends(GetTriggerDetailsCommand, _super);
    function GetTriggerDetailsCommand(group, trigger) {
        var _this = _super.call(this) || this;
        _this.mapper = mapJobDetailsData;
        _this.code = 'get_trigger_details';
        _this.message = 'Loading trigger details';
        _this.data = {
            group: group,
            trigger: trigger
        };
        return _this;
    }
    return GetTriggerDetailsCommand;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

function mapJobDetailsData(data) {
    return {
        jobDataMap: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_mappers__["b" /* PROPERTY_VALUE_MAPPER */])(data.jdm),
        trigger: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_mappers__["c" /* TRIGGER_MAPPER */])(data.t),
        secondaryData: data.ts ? {
            priority: parseInt(data.ts.p, 10),
            misfireInstruction: parseInt(data.ts.mfi),
            description: data.ts.d
        } : null
    };
}


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__value_formatting__ = __webpack_require__(242);

var PropertyView = (function () {
    function PropertyView() {
        this.template = "<tr>\n    <td class=\"js_title\"></td>\n    <td class=\"js_value\"></td>\n</tr>";
    }
    PropertyView.prototype.init = function (dom, viewModel) {
        dom('.js_title').observes(viewModel.title);
        dom('.js_value').observes(__WEBPACK_IMPORTED_MODULE_0__value_formatting__["a" /* default */].format(viewModel.value, viewModel.valueType), { encode: false });
    };
    return PropertyView;
}());
/* harmony default export */ __webpack_exports__["a"] = (PropertyView);


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DurationFormatter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Duration; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__timers_timer__ = __webpack_require__(15);

var DurationFormatter = (function () {
    function DurationFormatter() {
    }
    DurationFormatter.format = function (durationMilliseconds) {
        var ratio = 1;
        for (var i = 0; i < this._ranges.length; i++) {
            var rangeItem = this._ranges[i];
            ratio *= rangeItem.edge;
            var ratioUnits = durationMilliseconds / ratio, isLastItem = i === this._ranges.length - 1;
            if (isLastItem || this.isCurrentRange(durationMilliseconds, i, ratio)) {
                return {
                    value: Math.floor(ratioUnits).toString(),
                    unit: rangeItem.title,
                    ratio: ratio
                };
            }
        }
        return null; // should not ever get here
    };
    DurationFormatter.isCurrentRange = function (uptimeMilliseconds, index, ratioMultiplier) {
        return (uptimeMilliseconds / (this._ranges[index + 1].edge * ratioMultiplier)) < 1;
    };
    return DurationFormatter;
}());

DurationFormatter._ranges = [
    { title: 'sec', edge: 1000 },
    { title: 'min', edge: 60 },
    { title: 'hours', edge: 60 },
    { title: 'days', edge: 24 }
];
var Duration = (function () {
    function Duration(startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.value = new js.ObservableValue();
        this.measurementUnit = new js.ObservableValue();
        this._timer = new __WEBPACK_IMPORTED_MODULE_0__timers_timer__["a" /* Timer */]();
        var waitingText = '...';
        this.value.setValue(waitingText);
    }
    Duration.prototype.init = function () {
        this.calculate();
    };
    Duration.prototype.setStartDate = function (date) {
        this.startDate = date;
        this.calculate();
    };
    Duration.prototype.setEndDate = function (date) {
        this.endDate = date;
        this.calculate();
    };
    Duration.prototype.dispose = function () {
        this.releaseTimer();
    };
    Duration.prototype.releaseTimer = function () {
        this._timer.reset();
    };
    Duration.prototype.calculate = function () {
        var _this = this;
        this.releaseTimer();
        if (!this.startDate) {
            this.value.setValue(null);
            this.measurementUnit.setValue('');
            return;
        }
        var durationMilliseconds = (this.endDate || new Date().getTime()) - this.startDate, formattedDuration = DurationFormatter.format(durationMilliseconds);
        if (formattedDuration) {
            this.value.setValue(formattedDuration.value);
            this.measurementUnit.setValue(' ' + formattedDuration.unit);
            if (!this.endDate) {
                this._timer.schedule(function () { return _this.calculate(); }, formattedDuration.ratio / 2);
            }
        }
    };
    return Duration;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_every__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_every___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_every__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_filter__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_some__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_some___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_some__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_map__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_each__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_each___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_lodash_each__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_find__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_find___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash_find__);






var ActivitiesSynschronizer = (function () {
    function ActivitiesSynschronizer(identityChecker, mapper, list) {
        this.identityChecker = identityChecker;
        this.mapper = mapper;
        this.list = list;
    }
    ActivitiesSynschronizer.prototype.sync = function (activities) {
        var _this = this;
        var existingActivities = this.list.getValue(), deletedActivities = __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default()(existingActivities, function (viewModel) { return __WEBPACK_IMPORTED_MODULE_0_lodash_every___default()(activities, function (activity) { return _this.areNotEqual(activity, viewModel); }); }), addedActivities = __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default()(activities, function (activity) { return __WEBPACK_IMPORTED_MODULE_0_lodash_every___default()(existingActivities, function (viewModel) { return _this.areNotEqual(activity, viewModel); }); }), updatedActivities = __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default()(existingActivities, function (viewModel) { return __WEBPACK_IMPORTED_MODULE_2_lodash_some___default()(activities, function (activity) { return _this.areEqual(activity, viewModel); }); }), addedViewModels = __WEBPACK_IMPORTED_MODULE_3_lodash_map___default()(addedActivities, this.mapper), finder = function (viewModel) { return __WEBPACK_IMPORTED_MODULE_5_lodash_find___default()(activities, function (activity) { return _this.areEqual(activity, viewModel); }); };
        __WEBPACK_IMPORTED_MODULE_4_lodash_each___default()(deletedActivities, function (viewModel) { return _this.list.remove(viewModel); });
        __WEBPACK_IMPORTED_MODULE_4_lodash_each___default()(addedViewModels, function (viewModel) {
            viewModel.updateFrom(finder(viewModel));
            _this.list.add(viewModel);
        });
        __WEBPACK_IMPORTED_MODULE_4_lodash_each___default()(updatedActivities, function (viewModel) { return viewModel.updateFrom(finder(viewModel)); });
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
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ManagableActivityViewModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__command_action__ = __webpack_require__(43);


var ManagableActivityViewModel = (function () {
    function ManagableActivityViewModel(activity, commandService, applicationModel) {
        this.commandService = commandService;
        this.applicationModel = applicationModel;
        this.status = js.observableValue();
        this.name = activity.Name;
        var resumeActionInfo = this.getResumeAction(), pauseActionInfo = this.getPauseAction(), deleteActionInfo = this.getDeleteAction();
        this.resumeAction = new __WEBPACK_IMPORTED_MODULE_1__command_action__["a" /* default */](this.applicationModel, this.commandService, resumeActionInfo.title, resumeActionInfo.command);
        this.pauseAction = new __WEBPACK_IMPORTED_MODULE_1__command_action__["a" /* default */](this.applicationModel, this.commandService, pauseActionInfo.title, pauseActionInfo.command);
        this.deleteAction = new __WEBPACK_IMPORTED_MODULE_1__command_action__["a" /* default */](this.applicationModel, this.commandService, deleteActionInfo.title, deleteActionInfo.command, this.getDeleteConfirmationsText());
    }
    ManagableActivityViewModel.prototype.updateFrom = function (activity) {
        this.status.setValue(activity.Status);
        this.resumeAction.enabled = activity.Status === __WEBPACK_IMPORTED_MODULE_0__api__["b" /* ActivityStatus */].Paused || activity.Status === __WEBPACK_IMPORTED_MODULE_0__api__["b" /* ActivityStatus */].Mixed;
        this.pauseAction.enabled = activity.Status === __WEBPACK_IMPORTED_MODULE_0__api__["b" /* ActivityStatus */].Active || activity.Status === __WEBPACK_IMPORTED_MODULE_0__api__["b" /* ActivityStatus */].Mixed;
        this.deleteAction.enabled = true;
    };
    return ManagableActivityViewModel;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActivityView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__activity_status_view__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_actions_actions_utils__ = __webpack_require__(89);


var ActivityView = (function () {
    function ActivityView() {
        this.template = ''; // abstract
    }
    ActivityView.prototype.init = function (dom, viewModel) {
        dom('.name').observes(viewModel.name);
        dom('.status').observes(viewModel, __WEBPACK_IMPORTED_MODULE_0__activity_status_view__["a" /* ActivityStatusView */]);
        __WEBPACK_IMPORTED_MODULE_1__global_actions_actions_utils__["a" /* default */].render(dom('.js_actions'), this.composeActions(viewModel));
    };
    return ActivityView;
}());



/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NullableDateView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_date__ = __webpack_require__(10);

var NullableDateView = (function () {
    function NullableDateView() {
        this.template = '<span class="cq-date"></span>';
    }
    NullableDateView.prototype.init = function (dom, value) {
        if (value.isEmpty()) {
            dom.$.append('<span class="cq-none">[none]</span>');
        }
        else {
            dom.$.append(__WEBPACK_IMPORTED_MODULE_0__utils_date__["a" /* default */].smartDateFormat(value.getDate()) || '&nbsp;');
        }
    };
    return NullableDateView;
}());



/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(25),
    stackClear = __webpack_require__(201),
    stackDelete = __webpack_require__(202),
    stackGet = __webpack_require__(203),
    stackHas = __webpack_require__(204),
    stackSet = __webpack_require__(205);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),
/* 53 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),
/* 54 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),
/* 55 */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(58),
    eq = __webpack_require__(30);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(66);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(21);

/**
 * The base implementation of methods like `_.max` and `_.min` which accepts a
 * `comparator` to determine the extremum value.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per iteration.
 * @param {Function} comparator The comparator used to compare values.
 * @returns {*} Returns the extremum value.
 */
function baseExtremum(array, iteratee, comparator) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index],
        current = iteratee(value);

    if (current != null && (computed === undefined
          ? (current === current && !isSymbol(current))
          : comparator(current, computed)
        )) {
      var computed = current,
          result = value;
    }
  }
  return result;
}

module.exports = baseExtremum;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(55),
    isFlattenable = __webpack_require__(176);

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var baseFor = __webpack_require__(132),
    keys = __webpack_require__(7);

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(65),
    toKey = __webpack_require__(29);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqualDeep = __webpack_require__(137),
    isObjectLike = __webpack_require__(20);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(12);

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(1),
    isKey = __webpack_require__(37),
    stringToPath = __webpack_require__(206),
    toString = __webpack_require__(227);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(9);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(121),
    arraySome = __webpack_require__(56),
    cacheHas = __webpack_require__(155);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(283)))

/***/ }),
/* 69 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(19);

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;


/***/ }),
/* 71 */
/***/ (function(module, exports) {

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;


/***/ }),
/* 72 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(5),
    stubFalse = __webpack_require__(223);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(97)(module)))

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(17),
    isObject = __webpack_require__(19);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(140),
    baseUnary = __webpack_require__(154),
    nodeUtil = __webpack_require__(192);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var baseExtremum = __webpack_require__(59),
    baseLt = __webpack_require__(142),
    identity = __webpack_require__(12);

/**
 * Computes the minimum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * _.min([4, 2, 8, 6]);
 * // => 2
 *
 * _.min([]);
 * // => undefined
 */
function min(array) {
  return (array && array.length)
    ? baseExtremum(array, identity, baseLt)
    : undefined;
}

module.exports = min;


/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return FaviconStatus; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services__ = __webpack_require__(269);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__commands_global_commands__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__application_model__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__data_loader__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__application_view_model__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__notification_notification_service__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__global_timers_retry_timer__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_lodash_each__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_lodash_each___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_lodash_each__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__timeline_timeline_initializer__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__utils_date__ = __webpack_require__(10);











var FaviconStatus;
(function (FaviconStatus) {
    FaviconStatus[FaviconStatus["Loading"] = 0] = "Loading";
    FaviconStatus[FaviconStatus["Ready"] = 1] = "Ready";
    FaviconStatus[FaviconStatus["Active"] = 2] = "Active";
    FaviconStatus[FaviconStatus["Broken"] = 3] = "Broken";
})(FaviconStatus || (FaviconStatus = {}));
var BootstrapperViewModel = (function () {
    function BootstrapperViewModel() {
        this.statusMessage = new js.ObservableValue();
        this.status = new js.ObservableValue();
        this.favicon = new js.ObservableValue();
        this.title = new js.ObservableValue();
        this.failed = new js.ObservableValue();
        this.errorMessage = new js.ObservableValue();
        this.retryIn = new js.ObservableValue();
        this.customStylesUrl = new js.ObservableValue();
    }
    BootstrapperViewModel.prototype.start = function () {
        this._commandService = new __WEBPACK_IMPORTED_MODULE_0__services__["a" /* CommandService */](),
            this._applicationModel = new __WEBPACK_IMPORTED_MODULE_3__application_model__["a" /* ApplicationModel */](),
            this._notificationService = new __WEBPACK_IMPORTED_MODULE_6__notification_notification_service__["a" /* DefaultNotificationService */](),
            this._dataLoader = new __WEBPACK_IMPORTED_MODULE_4__data_loader__["a" /* DataLoader */](this._applicationModel, this._commandService);
        this.initialSetup();
        this.performLoading();
    };
    BootstrapperViewModel.prototype.onAppRendered = function () {
        var _this = this;
        this.setupFaviconListeners();
        js.dependentValue(function (isOffline, schedulerName, inProgressCount) {
            /**
             * Compose title here
             */
            if (isOffline) {
                return (schedulerName ? schedulerName + ' - ' : '') + 'Disconnected since ' + __WEBPACK_IMPORTED_MODULE_10__utils_date__["a" /* default */].smartDateFormat(_this._applicationModel.offlineSince);
            }
            var suffix = inProgressCount == 0 ? '' : " - " + inProgressCount + " " + (inProgressCount === 1 ? 'job' : 'jobs') + " in progress";
            return schedulerName + suffix;
        }, this._applicationModel.isOffline, this._applicationModel.schedulerName, this._applicationModel.inProgressCount).listen(function (composedTitle) { return _this.title.setValue(composedTitle); });
        this._initialData = null;
    };
    BootstrapperViewModel.prototype.initialSetup = function () {
        this.favicon.setValue(FaviconStatus.Loading);
        this.title.setValue('Loading...');
    };
    BootstrapperViewModel.prototype.setupFaviconListeners = function () {
        var _this = this;
        this._applicationModel.isOffline.listen(function (isOffline) {
            if (isOffline) {
                _this.favicon.setValue(FaviconStatus.Broken);
            }
        });
        var syncFaviconWithSchedulerData = function (data) {
            if (data) {
                var schedulerStatus = __WEBPACK_IMPORTED_MODULE_2__api__["a" /* SchedulerStatus */].findByCode(data.Status);
                if (schedulerStatus === __WEBPACK_IMPORTED_MODULE_2__api__["a" /* SchedulerStatus */].Started) {
                    _this.favicon.setValue(FaviconStatus.Active);
                }
                else {
                    _this.favicon.setValue(FaviconStatus.Ready);
                }
            }
        };
        this._applicationModel.onDataChanged.listen(syncFaviconWithSchedulerData);
        syncFaviconWithSchedulerData(this._initialData);
    };
    BootstrapperViewModel.prototype.performLoading = function () {
        var _this = this;
        var stepEnvironment = this.wrapWithRetry(function () {
            _this.statusMessage.setValue('Loading environment settings');
            return _this._commandService.executeCommand(new __WEBPACK_IMPORTED_MODULE_1__commands_global_commands__["a" /* GetEnvironmentDataCommand */]());
        }), stepData = stepEnvironment.then(function (envData) { return _this.wrapWithRetry(function () {
            /**
             * We need to initialize the timeline before first call
             * to getData method to handle event from this call.
             */
            _this._timelineInitializer = new __WEBPACK_IMPORTED_MODULE_9__timeline_timeline_initializer__["a" /* TimelineInitializer */](envData.TimelineSpan);
            _this._timelineInitializer.start(_this._commandService.onEvent);
            if (envData.CustomCssUrl) {
                _this.statusMessage.setValue('Loading custom styles');
                _this.customStylesUrl.setValue((envData.CustomCssUrl));
            }
            _this.statusMessage.setValue('Loading initial scheduler data');
            return _this._commandService.executeCommand(new __WEBPACK_IMPORTED_MODULE_1__commands_global_commands__["b" /* GetDataCommand */]()).then(function (schedulerData) {
                _this.statusMessage.setValue('Done');
                return {
                    envData: envData,
                    schedulerData: schedulerData
                };
            });
        }); });
        stepData.done(function (data) {
            _this.applicationViewModel = new __WEBPACK_IMPORTED_MODULE_5__application_view_model__["a" /* default */](_this._applicationModel, _this._commandService, data.envData, _this._notificationService, _this._timelineInitializer);
            _this._initialData = data.schedulerData;
            /**
             * That would trigger application services.
             */
            _this._applicationModel.setData(data.schedulerData);
            _this.status.setValue(true);
        });
    };
    BootstrapperViewModel.prototype.wrapWithRetry = function (payload) {
        var _this = this;
        var errorHandler = function (error) {
            _this.failed.setValue(true);
            _this.errorMessage.setValue(error.errorMessage);
        }, actualPayload = function (isRetry) {
            _this.failed.setValue(false);
            if (isRetry) {
                _this.statusMessage.setValue('Retry...');
            }
            return payload();
        }, timer = new __WEBPACK_IMPORTED_MODULE_7__global_timers_retry_timer__["a" /* RetryTimer */](actualPayload, 5, 60, errorHandler), disposables = [
            timer.message.listen(function (message) { return _this.retryIn.setValue(message); }),
            timer
        ];
        this._currentTimer = timer;
        return timer
            .start(false)
            .always(function () {
            __WEBPACK_IMPORTED_MODULE_8_lodash_each___default()(disposables, function (x) { return x.dispose(); });
        });
    };
    BootstrapperViewModel.prototype.cancelAutoRetry = function () {
        if (this._currentTimer) {
            this._currentTimer.reset();
        }
        this.retryIn.setValue('canceled');
    };
    BootstrapperViewModel.prototype.retryNow = function () {
        if (this._currentTimer) {
            this._currentTimer.force();
        }
    };
    return BootstrapperViewModel;
}());
/* harmony default export */ __webpack_exports__["a"] = (BootstrapperViewModel);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PauseJobCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ResumeJobCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return DeleteJobCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExecuteNowCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return GetJobDetailsCommand; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abstract_command__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_mappers__ = __webpack_require__(22);
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
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
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
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
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
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
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
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
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
        _this.mapper = mapJobDetailsData;
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

function mapJobDetailsData(data) {
    return {
        JobDetails: mapJobDetails(data.jd),
        JobDataMap: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_mappers__["b" /* PROPERTY_VALUE_MAPPER */])(data.jdm)
    };
}
function mapJobDetails(data) {
    if (!data) {
        return null;
    }
    return {
        ConcurrentExecutionDisallowed: !!data.ced,
        Description: data.ds,
        PersistJobDataAfterExecution: !!data.pjd,
        Durable: !!data.d,
        JobType: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_mappers__["d" /* TYPE_MAPPER */])(data.t),
        RequestsRecovery: !!data.rr
    };
}


/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GetInputTypesCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return GetInputTypeVariantsCommand; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abstract_command__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_map__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_map__);
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


var GetInputTypesCommand = (function (_super) {
    __extends(GetInputTypesCommand, _super);
    function GetInputTypesCommand() {
        var _this = _super.call(this) || this;
        _this.mapper = function (dto) {
            if (!dto.i) {
                return [];
            }
            return __WEBPACK_IMPORTED_MODULE_1_lodash_map___default()(dto.i, function (x) { return ({
                code: x['_'],
                label: x['l'],
                hasVariants: !!x['v']
            }); });
        };
        _this.code = 'get_input_types';
        _this.message = 'Loading job data map types';
        return _this;
    }
    return GetInputTypesCommand;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

var GetInputTypeVariantsCommand = (function (_super) {
    __extends(GetInputTypeVariantsCommand, _super);
    function GetInputTypeVariantsCommand(inputType) {
        var _this = _super.call(this) || this;
        _this.mapper = function (dto) {
            if (!dto.i) {
                return [];
            }
            return __WEBPACK_IMPORTED_MODULE_1_lodash_map___default()(dto.i, function (x) { return ({
                value: x['_'],
                label: x['l']
            }); });
        };
        _this.code = 'get_input_type_variants';
        _this.message = 'Loading options for type ' + inputType.label;
        _this.data = {
            inputTypeCode: inputType.code
        };
        return _this;
    }
    return GetInputTypeVariantsCommand;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));



/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StartSchedulerCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return StopSchedulerCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return GetSchedulerDetailsCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PauseSchedulerCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ResumeSchedulerCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return StandbySchedulerCommand; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abstract_command__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_mappers__ = __webpack_require__(22);
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


var StartSchedulerCommand = (function (_super) {
    __extends(StartSchedulerCommand, _super);
    function StartSchedulerCommand() {
        var _this = _super.call(this) || this;
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
        _this.code = 'start_scheduler';
        _this.message = 'Starting the scheduler';
        return _this;
    }
    return StartSchedulerCommand;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

var StopSchedulerCommand = (function (_super) {
    __extends(StopSchedulerCommand, _super);
    function StopSchedulerCommand() {
        var _this = _super.call(this) || this;
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
        _this.code = 'stop_scheduler';
        _this.message = 'Stopping the scheduler';
        return _this;
    }
    return StopSchedulerCommand;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

var GetSchedulerDetailsCommand = (function (_super) {
    __extends(GetSchedulerDetailsCommand, _super);
    function GetSchedulerDetailsCommand() {
        var _this = _super.call(this) || this;
        _this.mapper = mapSchedulerDetails;
        _this.code = 'get_scheduler_details';
        _this.message = 'Loading scheduler details';
        return _this;
    }
    return GetSchedulerDetailsCommand;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

function mapSchedulerDetails(data) {
    return {
        InStandbyMode: !!data.ism,
        JobStoreClustered: !!data.jsc,
        JobStoreSupportsPersistence: !!data.jsp,
        JobStoreType: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_mappers__["d" /* TYPE_MAPPER */])(data.jst),
        NumberOfJobsExecuted: parseInt(data.je, 10),
        RunningSince: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_mappers__["e" /* PARSE_OPTIONAL_INT */])(data.rs),
        SchedulerInstanceId: data.siid,
        SchedulerName: data.sn,
        SchedulerRemote: !!data.isr,
        SchedulerType: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_mappers__["d" /* TYPE_MAPPER */])(data.t),
        Shutdown: !!data.isd,
        Started: !!data.ist,
        ThreadPoolSize: parseInt(data.tps, 10),
        ThreadPoolType: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_mappers__["d" /* TYPE_MAPPER */])(data.tpt),
        Version: data.v
    };
}
var PauseSchedulerCommand = (function (_super) {
    __extends(PauseSchedulerCommand, _super);
    function PauseSchedulerCommand() {
        var _this = _super.call(this) || this;
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
        _this.code = 'pause_scheduler';
        _this.message = 'Pausing all jobs';
        return _this;
    }
    return PauseSchedulerCommand;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

var ResumeSchedulerCommand = (function (_super) {
    __extends(ResumeSchedulerCommand, _super);
    function ResumeSchedulerCommand() {
        var _this = _super.call(this) || this;
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
        _this.code = 'resume_scheduler';
        _this.message = 'Resuming all jobs';
        return _this;
    }
    return ResumeSchedulerCommand;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));

var StandbySchedulerCommand = (function (_super) {
    __extends(StandbySchedulerCommand, _super);
    function StandbySchedulerCommand() {
        var _this = _super.call(this) || this;
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
        _this.code = 'standby_scheduler';
        _this.message = 'Switching to standby mode';
        return _this;
    }
    return StandbySchedulerCommand;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_command__["a" /* AbstractCommand */]));



/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dialog_view_model__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__timeline_timeline_activity_view_model__ = __webpack_require__(95);
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


var ActivityDetailsViewModel = (function (_super) {
    __extends(ActivityDetailsViewModel, _super);
    function ActivityDetailsViewModel(activity) {
        var _this = _super.call(this) || this;
        _this.activity = activity;
        _this.activityModel = new __WEBPACK_IMPORTED_MODULE_1__timeline_timeline_activity_view_model__["a" /* TimelineActivityViewModel */](activity);
        _this.fireInstanceId = activity.key;
        return _this;
    }
    ActivityDetailsViewModel.prototype.loadDetails = function () {
        this.activityModel.init();
    };
    ActivityDetailsViewModel.prototype.releaseState = function () {
        this.activityModel.dispose();
    };
    return ActivityDetailsViewModel;
}(__WEBPACK_IMPORTED_MODULE_0__dialog_view_model__["a" /* DialogViewModel */]));
/* harmony default export */ __webpack_exports__["a"] = (ActivityDetailsViewModel);


/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RENDER_PROPERTIES; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_flatMap__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_flatMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_flatMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_date__ = __webpack_require__(10);


var IS_SINGLE = function (value) {
    return value === null || value.isSingle();
};
var RENDER_PROPERTIES = function (dom, properties) {
    dom.observes(properties, function (p) { return IS_SINGLE(p) ? null : FlatObjectRootView; });
};
var FlatObjectItem = (function () {
    function FlatObjectItem(title, value, code, level) {
        this.title = title;
        this.value = value;
        this.code = code;
        this.level = level;
    }
    return FlatObjectItem;
}());
var FlatObjectRootView = (function () {
    function FlatObjectRootView() {
        this.template = "<tbody></tbody>";
    }
    FlatObjectRootView.prototype.init = function (dom, viewModel) {
        var flattenViewModel = this.flatNestedProperties(viewModel, 1);
        dom('tbody').observes(flattenViewModel, FlatObjectItemView);
    };
    FlatObjectRootView.prototype.flatNestedProperties = function (value, level) {
        var _this = this;
        if (value.nestedProperties.length === 0) {
            return [
                new FlatObjectItem(value.typeCode === 'object' ? 'No properties exposed' : 'No items', '', 'empty', level)
            ];
        }
        var result = __WEBPACK_IMPORTED_MODULE_0_lodash_flatMap___default()(value.nestedProperties, function (p) {
            if (IS_SINGLE(p.value)) {
                var singleData = _this.mapSinglePropertyValue(p.value);
                return [new FlatObjectItem(p.title, singleData.value, singleData.code, level)];
            }
            var head = new FlatObjectItem(p.title, '', '', level);
            return [
                head
            ].concat(_this.flatNestedProperties(p.value, level + 1));
        });
        if (value.isOverflow) {
            return result.concat([new FlatObjectItem('...', 'Rest items hidden', 'overflow', level)]);
        }
        return result;
    };
    FlatObjectRootView.prototype.mapSinglePropertyValue = function (value) {
        if (value === null) {
            return { value: 'Null', code: 'null' };
        }
        else if (value.typeCode === 'single') {
            return { value: this.formatSingleValue(value), code: 'single' };
        }
        else if (value.typeCode === 'error') {
            return { value: value.errorMessage, code: 'error' };
        }
        else if (value.typeCode === '...') {
            return { value: '...', code: 'overflow' };
        }
        throw new Error('Unknown type code: ' + value.typeCode);
    };
    FlatObjectRootView.prototype.formatSingleValue = function (value) {
        if (value.kind === 3) {
            try {
                return __WEBPACK_IMPORTED_MODULE_1__utils_date__["a" /* default */].smartDateFormat(parseInt(value.rawValue, 10));
            }
            catch (e) {
            }
        }
        return value.rawValue;
    };
    return FlatObjectRootView;
}());
var FlatObjectItemView = (function () {
    function FlatObjectItemView() {
        this.template = "<tr>\n    <td class=\"js_title property-title\"></td>\n    <td class=\"js_value property-value\"></td>\n</tr>";
    }
    FlatObjectItemView.prototype.init = function (dom, viewModel) {
        dom('.js_title').$.css('padding-left', (viewModel.level * 15) + 'px');
        dom('.js_title').observes(viewModel.title);
        dom('.js_value').root.addClass(viewModel.code);
        dom('.js_value').observes(viewModel.value);
    };
    return FlatObjectItemView;
}());


/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dialog_view_model__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__commands_job_commands__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_property__ = __webpack_require__(31);
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



var JobDetailsViewModel = (function (_super) {
    __extends(JobDetailsViewModel, _super);
    function JobDetailsViewModel(job, commandService) {
        var _this = _super.call(this) || this;
        _this.job = job;
        _this.commandService = commandService;
        _this.summary = new js.ObservableList();
        _this.identity = new js.ObservableList();
        _this.jobDataMap = new js.ObservableValue();
        return _this;
    }
    JobDetailsViewModel.prototype.loadDetails = function () {
        var _this = this;
        this.commandService
            .executeCommand(new __WEBPACK_IMPORTED_MODULE_1__commands_job_commands__["e" /* GetJobDetailsCommand */](this.job.GroupName, this.job.Name))
            .done(function (details) {
            _this.identity.setValue([
                new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Name', _this.job.Name, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String),
                new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Group', _this.job.GroupName, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String)
            ]);
            _this.summary.add(new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Job type', details.JobDetails.JobType, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Type), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Description', details.JobDetails.Description, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Concurrent execution disallowed', details.JobDetails.ConcurrentExecutionDisallowed, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Boolean), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Persist after execution', details.JobDetails.PersistJobDataAfterExecution, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Boolean), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Requests recovery', details.JobDetails.RequestsRecovery, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Boolean), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Durable', details.JobDetails.Durable, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Boolean));
            _this.jobDataMap.setValue(details.JobDataMap);
        });
    };
    return JobDetailsViewModel;
}(__WEBPACK_IMPORTED_MODULE_0__dialog_view_model__["a" /* DialogViewModel */]));
/* harmony default export */ __webpack_exports__["a"] = (JobDetailsViewModel);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dialog_view_model__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__commands_scheduler_commands__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_property__ = __webpack_require__(31);
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



var SchedulerDetailsViewModel = (function (_super) {
    __extends(SchedulerDetailsViewModel, _super);
    function SchedulerDetailsViewModel(commandService) {
        var _this = _super.call(this) || this;
        _this.commandService = commandService;
        _this.summary = new js.ObservableList();
        _this.status = new js.ObservableList();
        _this.jobStore = new js.ObservableList();
        _this.threadPool = new js.ObservableList();
        return _this;
    }
    SchedulerDetailsViewModel.prototype.loadDetails = function () {
        var _this = this;
        this.commandService
            .executeCommand(new __WEBPACK_IMPORTED_MODULE_1__commands_scheduler_commands__["f" /* GetSchedulerDetailsCommand */]())
            .then(function (response) {
            var data = response;
            _this.summary.add(new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Scheduler name', data.SchedulerName, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Scheduler instance id', data.SchedulerInstanceId, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Scheduler remote', data.SchedulerRemote, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Boolean), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Scheduler type', data.SchedulerType, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Type), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Version', data.Version, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String));
            _this.status.add(new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('In standby mode', data.InStandbyMode, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Boolean), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Shutdown', data.Shutdown, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Boolean), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Started', data.Started, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Boolean), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Jobs executed', data.NumberOfJobsExecuted, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Numeric), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Running since', data.RunningSince, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Date)); // todo
            _this.jobStore.add(new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Job store clustered', data.JobStoreClustered, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Boolean), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Job store supports persistence', data.JobStoreSupportsPersistence, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Boolean), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Job store type', data.JobStoreType, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Type)); // todo
            _this.threadPool.add(new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Thread pool size', data.ThreadPoolSize, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Numeric), new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Thread pool type', data.ThreadPoolType, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Type)); // todo
        });
    };
    return SchedulerDetailsViewModel;
}(__WEBPACK_IMPORTED_MODULE_0__dialog_view_model__["a" /* DialogViewModel */]));
/* harmony default export */ __webpack_exports__["a"] = (SchedulerDetailsViewModel);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TriggerDetailsViewModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dialog_view_model__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__commands_trigger_commands__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_property__ = __webpack_require__(31);
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



var TriggerDetailsViewModel = (function (_super) {
    __extends(TriggerDetailsViewModel, _super);
    function TriggerDetailsViewModel(trigger, commandService) {
        var _this = _super.call(this) || this;
        _this.trigger = trigger;
        _this.commandService = commandService;
        _this.summary = new js.ObservableList();
        _this.identity = new js.ObservableList();
        _this.schedule = new js.ObservableList();
        _this.jobDataMap = new js.ObservableValue();
        return _this;
    }
    TriggerDetailsViewModel.prototype.loadDetails = function () {
        var _this = this;
        this.commandService
            .executeCommand(new __WEBPACK_IMPORTED_MODULE_1__commands_trigger_commands__["e" /* GetTriggerDetailsCommand */](this.trigger.GroupName, this.trigger.Name))
            .done(function (details) {
            var trigger = details.trigger;
            if (trigger) {
                var identityProperties = [
                    new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Name', trigger.Name, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String),
                    new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Group', trigger.GroupName, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String),
                ];
                if (details.secondaryData) {
                    identityProperties.push(new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Description', details.secondaryData.description, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String));
                }
                _this.identity.setValue(identityProperties);
                var scheduleProperties = [
                    new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Trigger Type', trigger.TriggerType.Code, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String)
                ];
                switch (trigger.TriggerType.Code) {
                    case 'simple':
                        var simpleTrigger = trigger.TriggerType;
                        scheduleProperties.push(new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Repeat Count', simpleTrigger.RepeatCount === -1 ? 'forever' : simpleTrigger.RepeatCount, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String));
                        scheduleProperties.push(new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Repeat Interval', simpleTrigger.RepeatInterval, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String));
                        scheduleProperties.push(new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Times Triggered', simpleTrigger.TimesTriggered, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Numeric));
                        break;
                    case 'cron':
                        var cronTrigger = trigger.TriggerType;
                        scheduleProperties.push(new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Cron Expression', cronTrigger.CronExpression, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String));
                        break;
                }
                _this.schedule.setValue(scheduleProperties);
            }
            if (details.secondaryData) {
                _this.summary.setValue([
                    new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Priority', details.secondaryData.priority, __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].Numeric),
                    new __WEBPACK_IMPORTED_MODULE_2__common_property__["a" /* Property */]('Misfire Instruction', _this.getFriendlyMisfireInstruction(details.secondaryData.misfireInstruction, trigger), __WEBPACK_IMPORTED_MODULE_2__common_property__["b" /* PropertyType */].String),
                ]);
            }
            _this.jobDataMap.setValue(details.jobDataMap);
        });
    };
    TriggerDetailsViewModel.prototype.getFriendlyMisfireInstruction = function (misfireInstruction, trigger) {
        if (!trigger) {
            return misfireInstruction.toString();
        }
        if (misfireInstruction === 0) {
            return 'Not Set';
        }
        return (trigger.TriggerType.supportedMisfireInstructions[misfireInstruction] || 'Unknown') + ' (' + misfireInstruction + ')';
    };
    return TriggerDetailsViewModel;
}(__WEBPACK_IMPORTED_MODULE_0__dialog_view_model__["a" /* DialogViewModel */]));


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* unused harmony export ValidatorViewModel */
/* unused harmony export Validators */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commands_trigger_commands__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_job_data_map__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_some__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_some___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_some__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_map__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_each__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_each___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_lodash_each__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_forOwn__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_forOwn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash_forOwn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__global_owner__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__commands_job_data_map_commands__ = __webpack_require__(79);
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








var ValidatorViewModel = (function (_super) {
    __extends(ValidatorViewModel, _super);
    function ValidatorViewModel(forced, key, source, validators, condition) {
        var _this = _super.call(this) || this;
        _this.key = key;
        _this.source = source;
        _this.validators = validators;
        _this.condition = condition;
        _this._errors = new js.ObservableValue();
        _this.dirty = new js.ObservableValue();
        _this.validated = new js.ObservableValue();
        var conditionErrors = condition ?
            _this.own(js.dependentValue(function (validationAllowed, errors) { return validationAllowed ? errors : []; }, condition, _this._errors)) :
            _this._errors;
        _this.errors = _this.own(js.dependentValue(function (isDirty, isForced, errors) {
            if (isForced || isDirty) {
                return errors;
            }
            return [];
        }, _this.dirty, forced, conditionErrors));
        _this.own(source.listen(function (value, oldValue, data) {
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
            _this.validated.setValue({ data: value, errors: _this._errors.getValue() || [] });
        }));
        return _this;
    }
    ValidatorViewModel.prototype.reset = function () {
        this._errors.setValue([]);
    };
    ValidatorViewModel.prototype.makeDirty = function () {
        this.dirty.setValue(true);
    };
    ValidatorViewModel.prototype.hasErrors = function () {
        var errors = this.errors.getValue();
        return errors && errors.length > 0;
    };
    return ValidatorViewModel;
}(__WEBPACK_IMPORTED_MODULE_6__global_owner__["a" /* Owner */]));

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
        var result = new ValidatorViewModel(this._forced, options.key || options.source, options.source, validators, options.condition);
        this.validators.push(result);
        return result;
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
        return !__WEBPACK_IMPORTED_MODULE_2_lodash_some___default()(this.validators, function (v) { return v.hasErrors(); });
    };
    Validators.prototype.dispose = function () {
        __WEBPACK_IMPORTED_MODULE_4_lodash_each___default()(this.validators, function (x) { return x.dispose(); });
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
var TriggerDialogViewModel = (function (_super) {
    __extends(TriggerDialogViewModel, _super);
    function TriggerDialogViewModel(job, commandService) {
        var _this = _super.call(this) || this;
        _this.job = job;
        _this.commandService = commandService;
        _this.accepted = new js.Event(); /* todo: base class */
        _this.canceled = new js.Event();
        _this.triggerName = js.observableValue();
        _this.triggerType = js.observableValue();
        _this.cronExpression = js.observableValue();
        _this.repeatForever = js.observableValue();
        _this.repeatCount = js.observableValue();
        _this.repeatInterval = js.observableValue();
        _this.repeatIntervalType = js.observableValue();
        _this.jobDataMap = new js.ObservableList();
        _this.isSaving = js.observableValue();
        _this.newJobDataKey = new js.ObservableValue();
        _this.validators = new Validators();
        _this._inputTypesVariants = {};
        var isSimpleTrigger = _this.own(map(_this.triggerType, function (x) { return x === 'Simple'; }));
        _this.validators.register({
            source: _this.cronExpression,
            condition: _this.own(map(_this.triggerType, function (x) { return x === 'Cron'; }))
        }, ValidatorsFactory.required('Please enter cron expression'));
        _this.validators.register({
            source: _this.repeatCount,
            condition: _this.own(js.dependentValue(function (isSimple, repeatForever) { return isSimple && !repeatForever; }, isSimpleTrigger, _this.repeatForever))
        }, ValidatorsFactory.required('Please enter repeat count'), ValidatorsFactory.isInteger('Please enter an integer number'));
        _this.validators.register({
            source: _this.repeatInterval,
            condition: isSimpleTrigger
        }, ValidatorsFactory.required('Please enter repeat interval'), ValidatorsFactory.isInteger('Please enter an integer number'));
        var newJobDataKeyValidationModel = _this.validators.register({
            source: _this.newJobDataKey
        }, function (value) {
            if (value && __WEBPACK_IMPORTED_MODULE_2_lodash_some___default()(_this.jobDataMap.getValue(), function (x) { return x.key === value; })) {
                return ['Key ' + value + ' has already been added'];
            }
            return null;
        });
        _this.canAddJobDataKey = _this.own(map(newJobDataKeyValidationModel.validated, function (x) { return x.data && x.data.length > 0 && x.errors.length === 0; }));
        return _this;
    }
    TriggerDialogViewModel.prototype.addJobDataMapItem = function () {
        var _this = this;
        var payload = function (inputTypes) {
            var jobDataMapItem = new __WEBPACK_IMPORTED_MODULE_1__common_job_data_map__["a" /* JobDataMapItem */](_this.newJobDataKey.getValue(), inputTypes, _this._inputTypesVariants, _this.commandService), removeWire = jobDataMapItem.onRemoved.listen(function () {
                _this.jobDataMap.remove(jobDataMapItem);
                _this.newJobDataKey.setValue(_this.newJobDataKey.getValue());
                removeWire.dispose();
            });
            _this.jobDataMap.add(jobDataMapItem);
            _this.newJobDataKey.setValue('');
        };
        if (this._inputTypes) {
            payload(this._inputTypes);
        }
        else {
            this.commandService
                .executeCommand(new __WEBPACK_IMPORTED_MODULE_7__commands_job_data_map_commands__["a" /* GetInputTypesCommand */]())
                .then(function (inputTypes) {
                _this._inputTypes = inputTypes;
                payload(_this._inputTypes);
            });
        }
    };
    TriggerDialogViewModel.prototype.cancel = function () {
        var hasDataEntered = this.repeatCount.getValue() ||
            this.repeatInterval.getValue() ||
            this.cronExpression.getValue();
        if (!hasDataEntered || confirm('Close trigger dialog?')) {
            this.canceled.trigger();
        }
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
            triggerType: this.triggerType.getValue(),
            jobDataMap: __WEBPACK_IMPORTED_MODULE_3_lodash_map___default()(this.jobDataMap.getValue(), function (x) { return ({
                key: x.key,
                value: x.getActualValue(),
                inputTypeCode: x.inputTypeCode.getValue()
            }); })
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
            .executeCommand(new __WEBPACK_IMPORTED_MODULE_0__commands_trigger_commands__["a" /* AddTriggerCommand */](form))
            .then(function (result) {
            console.log(result);
            if (result.validationErrors) {
                __WEBPACK_IMPORTED_MODULE_5_lodash_forOwn___default()(result.validationErrors, function (value, key) {
                    __WEBPACK_IMPORTED_MODULE_4_lodash_each___default()(_this.jobDataMap.getValue(), function (jobDataMapItem) {
                        if (jobDataMapItem.key === key) {
                            jobDataMapItem.error.setValue(value);
                        }
                    });
                });
            }
            else {
                _this.accepted.trigger(true);
            }
        })
            .always(function () {
            _this.isSaving.setValue(false);
        })
            .fail(function (reason) {
            /* todo */
        });
        return true;
    };
    TriggerDialogViewModel.prototype.releaseState = function () {
        this.validators.dispose();
        this.dispose();
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
}(__WEBPACK_IMPORTED_MODULE_6__global_owner__["a" /* Owner */]));
/* harmony default export */ __webpack_exports__["a"] = (TriggerDialogViewModel);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var ActionView = (function () {
    function ActionView() {
        this.template = '<li><a href="#"><span></span></a></li>';
    }
    ActionView.prototype.init = function (dom, action) {
        var container = dom('li');
        var link = dom('a');
        dom('li').className('disabled').observes(action.disabled);
        dom('span').observes(action.title);
        if (action.isDanger) {
            //link.$.prepend('<span class="danger">!</span>');
            container.$.addClass('danger');
        }
        link.on('click').react(function () {
            if (!container.$.is('.disabled')) {
                action.execute();
            }
        });
    };
    return ActionView;
}());
/* harmony default export */ __webpack_exports__["a"] = (ActionView);


/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {var Action = (function () {
    function Action(title, callback, confirmMessage) {
        this.title = title;
        this.callback = callback;
        this.confirmMessage = confirmMessage;
        this.disabled = new js.ObservableValue();
    }
    Object.defineProperty(Action.prototype, "enabled", {
        set: function (value) {
            this.disabled.setValue(!value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "isDanger", {
        get: function () {
            return !!this.confirmMessage;
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype.execute = function () {
        if (!this.confirmMessage || confirm(this.confirmMessage)) {
            this.callback();
        }
    };
    return Action;
}());
/* harmony default export */ __webpack_exports__["a"] = (Action);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__separator__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__separator_view__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__action_view__ = __webpack_require__(87);



var ActionsUtils = (function () {
    function ActionsUtils() {
    }
    ActionsUtils.render = function (dom, actions) {
        dom.observes(actions, function (item) { return item instanceof __WEBPACK_IMPORTED_MODULE_0__separator__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_1__separator_view__["a" /* default */] : __WEBPACK_IMPORTED_MODULE_2__action_view__["a" /* default */]; });
    };
    return ActionsUtils;
}());
/* harmony default export */ __webpack_exports__["a"] = (ActionsUtils);


/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActivityStateView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__activity_state__ = __webpack_require__(91);

var statusData = {};
statusData[__WEBPACK_IMPORTED_MODULE_0__activity_state__["a" /* ActivityState */].InProgress] = { title: 'In progress', className: 'in-progress' };
statusData[__WEBPACK_IMPORTED_MODULE_0__activity_state__["a" /* ActivityState */].Failure] = { title: 'Failed', className: 'failed' };
statusData[__WEBPACK_IMPORTED_MODULE_0__activity_state__["a" /* ActivityState */].Success] = { title: 'Success', className: 'success' };
var ActivityStateView = (function () {
    function ActivityStateView() {
        this.template = "<span class=\"runnable-state\">\n    <span class=\"js_icon icon\"></span>\n    <span class=\"js_title title\"></span>\n</span>";
    }
    ActivityStateView.prototype.init = function (dom, viewModel) {
        var statusDataValue = statusData[viewModel];
        dom.root.addClass(statusDataValue.className);
        dom('.js_title').observes(statusDataValue.title);
    };
    return ActivityStateView;
}());



/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActivityState; });
var ActivityState;
(function (ActivityState) {
    ActivityState[ActivityState["InProgress"] = 0] = "InProgress";
    ActivityState[ActivityState["Success"] = 1] = "Success";
    ActivityState[ActivityState["Failure"] = 2] = "Failure";
})(ActivityState || (ActivityState = {}));


/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js, $) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RetryTimer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__countdown_timer__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__duration__ = __webpack_require__(47);


var RetryTimer = (function () {
    function RetryTimer(payload, minInterval, maxInterval, onFailed) {
        if (minInterval === void 0) { minInterval = 5; }
        if (maxInterval === void 0) { maxInterval = 60; }
        if (onFailed === void 0) { onFailed = null; }
        var _this = this;
        this.payload = payload;
        this.minInterval = minInterval;
        this.maxInterval = maxInterval;
        this.onFailed = onFailed;
        this.message = new js.ObservableValue();
        this.isInProgress = new js.ObservableValue();
        this._isRetry = false;
        this.timer = new __WEBPACK_IMPORTED_MODULE_0__countdown_timer__["a" /* CountdownTimer */](function () { return _this.performRetry(); });
        this._messageWire = this.timer.countdownValue.listen(function (countdownValue) {
            if (countdownValue) {
                var formattedDuration = __WEBPACK_IMPORTED_MODULE_1__duration__["a" /* DurationFormatter */].format(countdownValue * 1000);
                _this.message.setValue("in " + formattedDuration.value + " " + formattedDuration.unit);
            }
        });
    }
    RetryTimer.prototype.start = function (sleepBeforeFirstCall) {
        this.timer.reset();
        this._currentRetryInterval = this.minInterval;
        var result = $.Deferred();
        this._currentResult = result;
        if (sleepBeforeFirstCall) {
            this.scheduleRetry();
        }
        else {
            this.performRetry();
        }
        return result.promise();
    };
    RetryTimer.prototype.force = function () {
        this.timer.reset();
        this.performRetry();
    };
    RetryTimer.prototype.reset = function () {
        this.timer.reset();
    };
    RetryTimer.prototype.dispose = function () {
        this.timer.dispose();
        this._messageWire.dispose();
    };
    RetryTimer.prototype.performRetry = function () {
        var _this = this;
        var payloadPromise = this.payload(this._isRetry);
        this.isInProgress.setValue(true);
        this.message.setValue('in progress...');
        // this timeout is for UI only
        setTimeout(function () {
            payloadPromise
                .done(function (response) {
                _this._currentResult.resolve(response);
            })
                .fail(function (error) {
                _this._isRetry = true;
                if (_this.onFailed) {
                    _this.onFailed(error);
                }
                _this.scheduleRetry();
            })
                .always(function () {
                _this.isInProgress.setValue(false);
            });
        }, 10);
    };
    RetryTimer.prototype.scheduleRetry = function () {
        this.timer.schedule(this._currentRetryInterval);
        this._currentRetryInterval = Math.min(this._currentRetryInterval * 2, this.maxInterval);
    };
    return RetryTimer;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0), __webpack_require__(2)))

/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return EventType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SchedulerStateService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_keys__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_filter__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_map__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_map__);



var EventType;
(function (EventType) {
    EventType[EventType["Fired"] = 0] = "Fired";
    EventType[EventType["Completed"] = 1] = "Completed";
})(EventType || (EventType = {}));
var SchedulerStateService = (function () {
    function SchedulerStateService() {
        this._currentInProgress = {};
        this.realtimeBus = new js.Event();
    }
    SchedulerStateService.prototype.synsFrom = function (data) {
        if (data.InProgress) {
            var nextInProgress = {};
            for (var i = 0; i < data.InProgress.length; i++) {
                nextInProgress[data.InProgress[i].UniqueTriggerKey] = true;
            }
            var completed = this.findDiff(this._currentInProgress, nextInProgress), fired = this.findDiff(nextInProgress, this._currentInProgress), completedEvents = __WEBPACK_IMPORTED_MODULE_2_lodash_map___default()(completed, function (x) { return ({ uniqueTriggerKey: x, eventType: EventType.Completed }); }), firedEvents = __WEBPACK_IMPORTED_MODULE_2_lodash_map___default()(fired, function (x) { return ({ uniqueTriggerKey: x, eventType: EventType.Fired }); }), allEvents = completedEvents.concat(firedEvents);
            for (var j = 0; j < allEvents.length; j++) {
                this.realtimeBus.trigger(allEvents[j]);
            }
            this._currentInProgress = nextInProgress;
        }
    };
    SchedulerStateService.prototype.findDiff = function (primary, secondary) {
        var keys = __WEBPACK_IMPORTED_MODULE_0_lodash_keys___default()(primary);
        return __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default()(keys, function (key) { return !secondary[key]; });
        /*__flow(
            __keys,
            __filter((x:string) => !secondary[x]))(primary);*/
    };
    return SchedulerStateService;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActivityInteractionRequest; });
var ActivityInteractionRequest;
(function (ActivityInteractionRequest) {
    ActivityInteractionRequest[ActivityInteractionRequest["ShowTooltip"] = 0] = "ShowTooltip";
    ActivityInteractionRequest[ActivityInteractionRequest["HideTooltip"] = 1] = "HideTooltip";
    ActivityInteractionRequest[ActivityInteractionRequest["ShowDetails"] = 2] = "ShowDetails";
})(ActivityInteractionRequest || (ActivityInteractionRequest = {}));


/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimelineActivityViewModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_duration__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_activities_activity_state__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_each__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_each___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash_each__);




/**
 * A view model for timeline activity to share
 * some logic between tooltip and details dialog.
 */
var TimelineActivityViewModel = (function () {
    function TimelineActivityViewModel(activity) {
        var _this = this;
        this.activity = activity;
        this.duration = new __WEBPACK_IMPORTED_MODULE_0__global_duration__["b" /* Duration */](activity.startedAt, activity.completedAt);
        this.startedAt = new __WEBPACK_IMPORTED_MODULE_1__api__["f" /* NullableDate */](activity.startedAt);
        this.completedAt = new js.ObservableValue();
        this.status = new js.ObservableValue();
        this.errors = new js.ObservableValue();
        this.refreshStatus(activity);
        this._disposables = [
            this.duration,
            activity.completed.listen(function () {
                _this.duration.setEndDate(activity.completedAt);
                _this.completedAt.setValue(new __WEBPACK_IMPORTED_MODULE_1__api__["f" /* NullableDate */](activity.completedAt));
                _this.errors.setValue(activity.errors);
                _this.refreshStatus(activity);
            })
        ];
    }
    TimelineActivityViewModel.prototype.init = function () {
        this.duration.init();
        this.completedAt.setValue(new __WEBPACK_IMPORTED_MODULE_1__api__["f" /* NullableDate */](this.activity.completedAt));
        this.errors.setValue(this.activity.errors);
    };
    TimelineActivityViewModel.prototype.dispose = function () {
        __WEBPACK_IMPORTED_MODULE_3_lodash_each___default()(this._disposables, function (x) { return x.dispose(); });
    };
    TimelineActivityViewModel.prototype.refreshStatus = function (activity) {
        this.status.setValue(this.calculateStatus(activity));
    };
    TimelineActivityViewModel.prototype.calculateStatus = function (activity) {
        if (!activity.completedAt) {
            return __WEBPACK_IMPORTED_MODULE_2__global_activities_activity_state__["a" /* ActivityState */].InProgress;
        }
        if (activity.faulted) {
            return __WEBPACK_IMPORTED_MODULE_2__global_activities_activity_state__["a" /* ActivityState */].Failure;
        }
        return __WEBPACK_IMPORTED_MODULE_2__global_activities_activity_state__["a" /* ActivityState */].Success;
    };
    return TimelineActivityViewModel;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(94);

var TimelineActivity = (function () {
    function TimelineActivity(options, requestSelectionCallback) {
        this.options = options;
        this.requestSelectionCallback = requestSelectionCallback;
        this.position = new js.ObservableValue();
        this.completed = new js.Event();
        this.key = options.key;
        this.startedAt = options.startedAt;
        this.completedAt = options.completedAt;
    }
    TimelineActivity.prototype.complete = function (date, options) {
        this.completedAt = date;
        this.errors = options.errors;
        this.faulted = options.faulted;
        this.completed.trigger();
    };
    ;
    TimelineActivity.prototype.recalculate = function (rangeStart, rangeEnd) {
        var rangeWidth = rangeEnd - rangeStart, activityStart = this.startedAt, activityComplete = this.completedAt || rangeEnd, isOutOfViewport = activityStart <= rangeStart && activityComplete <= rangeStart;
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
    TimelineActivity.prototype.requestSelection = function () {
        this.requestSelectionCallback(__WEBPACK_IMPORTED_MODULE_0__common__["a" /* ActivityInteractionRequest */].ShowTooltip);
    };
    TimelineActivity.prototype.requestDeselection = function () {
        this.requestSelectionCallback(__WEBPACK_IMPORTED_MODULE_0__common__["a" /* ActivityInteractionRequest */].HideTooltip);
    };
    TimelineActivity.prototype.requestDetails = function () {
        this.requestSelectionCallback(__WEBPACK_IMPORTED_MODULE_0__common__["a" /* ActivityInteractionRequest */].ShowDetails);
    };
    return TimelineActivity;
}());
/* harmony default export */ __webpack_exports__["a"] = (TimelineActivity);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 97 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dev_fake_scheduler_server__ = __webpack_require__(281);

var SECONDS = function (x) { return x * 1000; }, MINUTES = function (x) { return SECONDS(60 * x); };
var options = {
    version: "6.9.3.0" || '6-demo',
    quartzVersion: 'in-browser-emulation',
    dotNetVersion: 'none',
    timelineSpan: 3600 * 1000,
    schedulerName: 'DemoScheduler',
}, now = new Date().getTime(), schedule = {
    'Maintenance': {
        'DB_Backup': {
            duration: SECONDS(20),
            triggers: {
                'db_trigger_1': { repeatInterval: MINUTES(1), initialDelay: SECONDS(5) },
                'db_trigger_2': { repeatInterval: MINUTES(1.5) },
            }
        },
        'Compress_Logs': {
            duration: MINUTES(1),
            triggers: {
                'logs_trigger_1': { repeatInterval: MINUTES(3) },
                'logs_trigger_2': { repeatInterval: MINUTES(4), pause: true }
            }
        }
    },
    'Domain': {
        'Email_Sender': {
            duration: SECONDS(10),
            triggers: {
                'email_sender_trigger_1': { repeatInterval: MINUTES(2), repeatCount: 5 }
            }
        },
        'Remove_Inactive_Users': {
            duration: SECONDS(30),
            triggers: {
                'remove_users_trigger_1': { repeatInterval: MINUTES(3), repeatCount: 5, persistAfterExecution: true }
            }
        }
    },
    'Reporting': {
        'Daily Sales': {
            duration: MINUTES(7),
            triggers: {
                'ds_trigger': { repeatInterval: MINUTES(60), }
            }
        },
        'Services Health': {
            duration: MINUTES(2),
            triggers: {
                'hr_trigger': { repeatInterval: MINUTES(30), startDate: now + MINUTES(1) }
            }
        },
        'Resource Consumption': {
            duration: MINUTES(1),
            triggers: {
                'rc_trigger': { repeatInterval: MINUTES(10), startDate: now + MINUTES(2), endDate: now + MINUTES(40), persistAfterExecution: true }
            }
        }
    }
}, schedulerServer = new __WEBPACK_IMPORTED_MODULE_0__dev_fake_scheduler_server__["a" /* FakeSchedulerServer */]({
    dotNetVersion: options.dotNetVersion,
    quartzVersion: options.quartzVersion,
    schedule: schedule,
    schedulerName: options.schedulerName,
    timelineSpan: options.timelineSpan,
    version: options.version
});
var $$ = $, log = console.log || (function () { });
$$.ajax = function (response) {
    var data = response.data;
    log('ajax request', data);
    var deferred = $.Deferred();
    setTimeout(function () {
        var result = schedulerServer.handleRequest(data);
        log('ajax response:', result);
        deferred.resolve(result);
    }, 1000);
    return deferred.promise();
};

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2)))

/***/ }),
/* 99 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_index_less__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__app_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bootstrap_bootstrap_js__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_bootstrapper_bootstrapper__ = __webpack_require__(229);



$(__WEBPACK_IMPORTED_MODULE_2__app_app_bootstrapper_bootstrapper__["a" /* default */]);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2)))

/***/ }),
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bootstrap_js_dropdown__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bootstrap_js_dropdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bootstrap_js_dropdown__);
﻿

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 102 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "loading.gif";

/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = "<section class=\"mainAside\"></section>\n\n<div class=\"mainHeader\"></div>\n\n<section class=\"main-container\">\n    <div class=\"scrollable-area\">\n        <section class=\"js_timeline_back_layer timeline-back-layer\"></section>\n        <section id=\"jobsContainer\"></section>\n    </div>\n</section>\n\n<footer class=\"main-footer\">\n    <div class=\"pull-left\">\n        <div class=\"cq-version-container\">CrystalQuartz Panel <span id=\"selfVersion\" class=\"cq-version\"></span> </div>\n        <div class=\"cq-version-container visible-lg-block\">Quartz.NET <span id=\"quartzVersion\" class=\"cq-version\"></span> </div>\n        <div class=\"cq-version-container visible-lg-block\">.NET <span id=\"dotNetVersion\" class=\"cq-version\"></span></div>\n    </div>\n\n    <div class=\"pull-right\">\n        <span id=\"autoUpdateMessage\">...</span>\n    </div>\n</footer>\n\n<div class=\"js_notifications\"></div>\n\n<div class=\"js_offline_mode\"></div>\n\n<div class=\"js_dialogsContainer\"></div>";

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"progress-indicator\">\n    <div>\n        <img src=\"" + __webpack_require__(103) + "\" />\n        <p class=\"js_commandMessage\"></p>\n    </div>\n</div>";

/***/ }),
/* 106 */
/***/ (function(module, exports) {

module.exports = "<div class=\"dialog-container\">\n    <section class=\"dialog\">\n        <header>\n            <a href=\"#\" class=\"js_close\">&times;</a>\n            <h2>Trigger fire info</h2>\n        </header>\n\n        <div class=\"dialog-content dialog-content-no-padding\">\n            <div class=\"properties-panel\">\n                <header>Summary</header>\n                <table>\n                    <tr>\n                        <td>Fire status</td>\n                        <td class=\"js_status\"></td>\n                    </tr>\n                    <tr>\n                        <td>Trigger started at</td>\n                        <td class=\"js_startedAt\"></td>\n                    </tr>\n                    <tr>\n                        <td>Trigger completed at</td>\n                        <td class=\"js_completedAt\"></td>\n                    </tr>\n                    <tr>\n                        <td>Duration</td>\n                        <td>\n                            <span class=\"js_durationValue\"></span>\n                            <span class=\"js_durationUnit\"></span>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>Fire instance ID</td>\n                        <td class=\"js_fireInstanceId\"></td>\n                    </tr>\n                </table>\n            </div>\n            \n            <section class=\"js_errors\"></section>\n        </div>\n\n        <footer>\n            <a href=\"#\" class=\"button pull-right js_close\">Close</a>\n        </footer>\n    </section>\n</div>";

/***/ }),
/* 107 */
/***/ (function(module, exports) {

module.exports = "<div class=\"dialog-container\">\n    <section class=\"dialog\">\n        <header>\n            <a href=\"#\" class=\"js_close\">&times;</a>\n            \n            <h2>Job details</h2>\n        </header>\n\n        <div class=\"dialog-content dialog-content-no-padding\">\n            <div class=\"properties-panel\">\n                <header>Identity</header>\n                <table class=\"js_identity\"></table>\n            </div>\n            <div class=\"properties-panel\">\n                <header>Summary</header>\n                <table class=\"js_summary\"></table>\n            </div>\n            <div class=\"properties-panel\">\n                <header>Job Data Map</header>\n                <table class=\"js_jobDataMap object-browser\"></table>\n            </div>\n        </div>\n\n        <footer>\n            <a href=\"#\" class=\"button pull-right js_close\">Close</a>\n        </footer>\n    </section>\n</div>";

/***/ }),
/* 108 */
/***/ (function(module, exports) {

module.exports = "<div class=\"dialog-container\">\n    <div class=\"dialog\">\n        <header>\n            <a href=\"#\" class=\"js_close\">&times;</a>\n            <h2>Scheduler details</h2>\n        </header>\n        \n        <section class=\"dialog-content dialog-content-no-padding\">\n            <div class=\"properties-panel\">\n                <header>Summary</header>\n                <table class=\"js_summary\"></table>\n            </div>\n\n            <div class=\"properties-panel\">\n                <header>Status</header>\n                <table class=\"js_status\"></table>\n            </div>\n\n            <div class=\"properties-panel\">\n                <header>Job Store</header>\n                <table class=\"js_jobStore\"></table>\n            </div>\n\n            <div class=\"properties-panel\">\n                <header>Thread Pool</header>\n                <table class=\"js_threadPool\"></table>\n            </div>\n        </section>\n\n        <footer>\n            <a href=\"#\" class=\"button pull-right js_close\">Close</a>\n        </footer>\n    </div>\n</div>";

/***/ }),
/* 109 */
/***/ (function(module, exports) {

module.exports = "<div class=\"dialog-container\">\n    <section class=\"dialog\">\n        <header>\n            <a href=\"#\" class=\"js_close\">&times;</a>\n            \n            <h2>Trigger details</h2>\n        </header>\n\n        <div class=\"dialog-content dialog-content-no-padding\">\n            <div class=\"properties-panel\">\n                <header>Identity</header>\n                <table class=\"js_identity\"></table>\n            </div>\n            <div class=\"properties-panel\">\n                <header>Summary</header>\n                <table class=\"js_summary\"></table>\n            </div>\n            <div class=\"properties-panel\">\n                <header>Schedule</header>\n                <table class=\"js_schedule\"></table>\n            </div>\n            <div class=\"properties-panel\">\n                <header>Job Data Map</header>\n                <table class=\"js_jobDataMap object-browser\"></table>\n            </div>\n        </div>\n\n        <footer>\n            <a href=\"#\" class=\"button pull-right js_close\">Close</a>\n        </footer>\n    </section>\n</div>";

/***/ }),
/* 110 */
/***/ (function(module, exports) {

module.exports = "<div class=\"dialog-container\">\n    <section class=\"dialog\">\n        <header>\n            <a href=\"#\" class=\"js_close\">&times;</a>\n            <h2>Add Trigger</h2>\n        </header>\n\n        <div class=\"dialog-content\">\n            <form class=\"cq-form form-horizontal\">\n                <div class=\"form-group form-group-sm\">\n                    <label for=\"triggerName\" class=\"col-sm-3 control-label\">Trigger Name:</label>\n                    <div class=\"col-sm-9\">\n                        <input id=\"triggerName\" type=\"text\" class=\"triggerName form-control\" />\n\n                        <p class=\"cq-field-description\">\n                            Optional trigger friendly name. Quartz will generate a guid if empty.\n                        </p>\n                    </div>\n                </div>\n\n                <div class=\"cq-form-separator\"></div>\n\n                <div class=\"form-group form-group-sm\">\n                    <label for=\"triggerType\" class=\"col-sm-3 control-label\">Trigger Type:</label>\n                    <div class=\"col-sm-9\">\n                        <select id=\"triggerType\" class=\"form-control triggerType\">\n                            <option value=\"Simple\">Simple</option>\n                            <option value=\"Cron\">Cron</option>\n                        </select>\n                    </div>\n                </div>\n\n                <div class=\"simpleTriggerDetails\">\n                    <div class=\"form-group form-group-sm\">\n                        <label for=\"repeatCount\" class=\"col-sm-3 col-xs-12 control-label\">Repeat Count:</label>\n                        <div class=\"col-sm-5 col-xs-8 repeatCountContainer\">\n                            <input id=\"repeatCount\" type=\"text\" class=\"form-control repeatCount\" />\n                        </div>\n                        <div class=\"col-sm-4 col-xs-4\">\n                            <div class=\"checkbox\">\n                                <label>\n                                    <input type=\"checkbox\" class=\"repeatForever\" /> Repeat forever\n                                </label>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class=\"form-group form-group-sm\">\n                        <label class=\"col-sm-3 col-xs-12 control-label\" for=\"repeatInterval\">Repeat every:</label>\n\n                        <div class=\"col-sm-5 col-xs-6 repeatIntervalContainer\">\n                            <input id=\"repeatInterval\" type=\"text\" class=\"form-control repeatInterval\" />\n                        </div>\n\n                        <div class=\"col-sm-4 col-xs-6\">\n                            <select class=\"form-control repeatIntervalType\">\n                                <option>Milliseconds</option>\n                                <option>Seconds</option>\n                                <option>Minutes</option>\n                                <option>Hours</option>\n                                <option>Days</option>\n                            </select>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"cronTriggerDetails\">\n                    <div class=\"form-group form-group-sm\">\n                        <div>\n                            <label for=\"cronExpression\" class=\"col-sm-3 control-label\">Cron Expression:</label>\n                            <div class=\"col-sm-9\">\n                                <input id=\"cronExpression\" type=\"text\" class=\"form-control cronExpression\" />\n                                <div class=\"cronExpressionContainer\"></div>\n                                <p class=\"cq-field-description\">\n                                    Read more about cron format at <a target=\"_blank\" href=\"https://www.quartz-scheduler.net/documentation/quartz-2.x/tutorial/crontrigger.html\">Quartz.NET docs</a>\n                                </p>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"cq-form-separator\"></div>\n\n                <div class=\"form-group form-group-sm\">\n                    <label for=\"cronExpression\" class=\"col-sm-3 control-label\">Job Data Map:</label>\n                    \n                    <div class=\"col-sm-5 js_jobDataKeyContainer\">\n                        <input type=\"text\" class=\"js_jobDataKey form-control\" placeholder=\"Enter new key\" />\n                    </div>\n\n                    <div class=\"col-sm-4\">\n                        <button class=\"js_addJobDataMapItem btn btn-sm\">Add Key</button>\n                    </div>\n                </div>\n\n                <div class=\"js_jobDataMapSection form-group form-group-sm\">\n                    <section class=\"col-sm-3\"></section>\n                    <section class=\"col-sm-9\">\n                        <table class=\"job-data-map-input\">\n                            <thead>\n                                <tr>\n                                    <th>Key</th>\n                                    <th>Type</th>\n                                    <th>Value</th>\n                                    <th class=\"job-data-remove\"></th>\n                                </tr>\n                            </thead>\n                            <tbody class=\"js_jobDataMap\"></tbody>\n                        </table>\n                    </section>\n                </div>\n            </form>\n        </div>\n\n        <footer class=\"cq-dialog-footer\">\n            <a href=\"#\" class=\"cancel button pull-left\">Cancel</a>\n\n            <a href=\"#\" class=\"save button button-primary pull-right\">Save Trigger</a>\n        </footer>\n    </section>\n</div>";

/***/ }),
/* 111 */
/***/ (function(module, exports) {

module.exports = "<aside class=\"main-aside\">\n    <ul>\n        <li>\n            <span class=\"aside-value-title\">Uptime</span>\n            <span class=\"aside-value\">\n                <span class=\"value-number js_uptimeValue\"></span>\n            </span>\n            <span class=\"value-measurement-unit js_uptimeMeasurementUnit\"></span>\n        </li>\n        <li>\n            <span class=\"aside-value-title\">Total Jobs</span>\n            <span class=\"aside-value js_totalJobs\"></span>\n        </li>\n        <li>\n            <span class=\"aside-value-title\">Executed</span>\n            <span class=\"aside-value js_executedJobs\"></span>\n            <span class=\"value-measurement-unit\">jobs</span>\n        </li>\n        \n        <li>\n            <span class=\"aside-value-title\">In progress</span>\n            \n            <div class=\"aside-value\">\n                <section class=\"gauge\">\n                    <div class=\"gauge-body\">\n                        <div class=\"gauge-scale\"></div>\n                        <div class=\"gauge-value\"></div>\n                        <div class=\"gauge-center\"></div>\n                    </div>\n                </section>\n                <div class=\"gauge-legend js_inProgressCount\"></div>\n            </div>\n            \n            <span class=\"value-measurement-unit\">jobs</span>\n        </li>\n    </ul>\n</aside>";

/***/ }),
/* 112 */
/***/ (function(module, exports) {

module.exports = "<div class=\"data-row data-row-job-group\">\n    <section class=\"primary-data\">\n        <div class=\"status\"></div>\n\n        <section class=\"actions dropdown\">\n            <a href=\"#\" class=\"actions-toggle dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></a>\n            <ul class=\"js_actions dropdown-menu\"></ul>\n        </section>\n\n        <div class=\"data-container\">\n            <section class=\"data-group name\"></section>\n        </div>\n    </section>\n\n    <section class=\"timeline-data timeline-data-filler\"></section>\n</div>\n\n<section class=\"jobs js_jobs\"></section>";

/***/ }),
/* 113 */
/***/ (function(module, exports) {

module.exports = "<div class=\"data-row data-row-job\">\n    <section class=\"primary-data\">\n        <div class=\"status\"></div>\n        <div class=\"actions dropdown\">\n            <a href=\"#\" class=\"actions-toggle dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></a>\n            <ul class=\"js_actions dropdown-menu\"></ul>\n        </div>\n\n        <div class=\"data-container\">\n            <!--<section class=\"data-group\">-->\n                <a href=\"#\" class=\"data-item ellipsis-link js_viewDetails\">\n                    <span class=\"name\"></span>\n                    <!--<span class=\"ellipsis\">...</span>-->\n                </a>\n            <!--</section>-->\n        </div>\n    </section>\n    <section class=\"timeline-data timeline-data-filler\"></section>\n</div>\n\n<section class=\"triggers\"></section>";

/***/ }),
/* 114 */
/***/ (function(module, exports) {

module.exports = "<div class=\"data-row data-row-trigger js_triggerRow\">\n    <section class=\"primary-data\">\n        <div class=\"status\"></div>\n        <div class=\"actions dropdown\">\n            <a href=\"#\" class=\"actions-toggle dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></a>\n            <ul class=\"js_actions dropdown-menu\"></ul>\n        </div>\n\n        <div class=\"data-container\">\n            <a class=\"data-item ellipsis-link name\"></a>\n            <section class=\"data-item type\"></section>\n            <section class=\"data-item startDate\"></section>\n            <section class=\"data-item endDate\"></section>\n            <section class=\"data-item previousFireDate\"></section>\n            <section class=\"data-item nextFireDate\"></section>\n        </div>\n    </section>\n    <section class=\"timeline-data js-timeline-data\"></section>\n</div>";

/***/ }),
/* 115 */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-header\">\n    <section class=\"scheduler-header\">\n        <div class=\"scheduler-caption\">\n            <div class=\"status\">\n                <span class=\"scheduler-status js_schedulerStatus\"></span>\n            </div>\n            \n            <a href=\"#\" class=\"scheduler-name js_viewDetails ellipsis-container\">\n                <span class=\"js_schedulerName\"></span>\n                <span class=\"ellipsis\">...</span>\n            </a>\n        </div>\n\n        <div class=\"scheduler-toolbar\">\n            \n            \n            <ul class=\"list-unstyled secondary-actions\">\n                <li class=\"actions dropdown\">\n                    <a href=\"#\" class=\"actions-toggle dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></a>\n\n                    <ul class=\"js_actions list-unstyled dropdown-menu\"></ul>\n                </li>\n            </ul>\n            \n            <ul class=\"js_primaryActions list-unstyled primary-actions\"></ul>\n        </div>\n\n        <div class=\"js_commandProgress\"></div>\n    </section>\n\n    <section class=\"data-header\">\n        <section class=\"primary-data\">\n            <div class=\"status\"></div>\n            <div class=\"actions\"></div>\n\n            <div class=\"data-container\">\n                <section class=\"data-header-item\">Trigger</section>\n                <section class=\"data-header-item\">Schedule</section>\n                <section class=\"data-header-item\">Start Date</section>\n                <section class=\"data-header-item\">End Date</section>\n                <section class=\"data-header-item\">Previous Fire Date</section>\n                <section class=\"data-header-item\">Next Fire Date</section>\n            </div>\n        </section>\n\n        <div id=\"ticksCaptions\" class=\"ticks-container\"></div>\n    </section>\n</div>";

/***/ }),
/* 116 */
/***/ (function(module, exports) {

module.exports = "<section class=\"offline-mode\" style=\"\">\n    <div class=\"offline-mode-overlay\"></div>\n    <div class=\"filler\"></div>\n    <div class=\"offline-mode-container\">\n        <section class=\"offline-mode-body\">\n            <h1>Server is offline since <span class=\"js_since\"></span></h1>\n\n            <p>Please make sure the server application at <span class=\"js_address\"></span> is up and running.</p>\n\n            <footer>\n                Retry <span class=\"js_retryIn\"></span>\n                <a href=\"javascript:void(0)\" class=\"js_retryNow\">Retry now</a>\n            </footer>\n        </section>\n    </div>\n</section>";

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(9),
    root = __webpack_require__(5);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(171),
    hashDelete = __webpack_require__(172),
    hashGet = __webpack_require__(173),
    hashHas = __webpack_require__(174),
    hashSet = __webpack_require__(175);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(9),
    root = __webpack_require__(5);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(9),
    root = __webpack_require__(5);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(34),
    setCacheAdd = __webpack_require__(196),
    setCacheHas = __webpack_require__(197);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(5);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(9),
    root = __webpack_require__(5);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),
/* 124 */
/***/ (function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),
/* 125 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),
/* 126 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.every` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`.
 */
function arrayEvery(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (!predicate(array[index], index, array)) {
      return false;
    }
  }
  return true;
}

module.exports = arrayEvery;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(152),
    isArguments = __webpack_require__(40),
    isArray = __webpack_require__(1),
    isBuffer = __webpack_require__(73),
    isIndex = __webpack_require__(35),
    isTypedArray = __webpack_require__(75);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),
/* 128 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(11);

/**
 * The base implementation of `_.every` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`
 */
function baseEvery(collection, predicate) {
  var result = true;
  baseEach(collection, function(value, index, collection) {
    result = !!predicate(value, index, collection);
    return result;
  });
  return result;
}

module.exports = baseEvery;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(11);

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;


/***/ }),
/* 131 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var createBaseFor = __webpack_require__(160);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(55),
    isArray = __webpack_require__(1);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),
/* 134 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.gt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than `other`,
 *  else `false`.
 */
function baseGt(value, other) {
  return value > other;
}

module.exports = baseGt;


/***/ }),
/* 135 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(17),
    isObjectLike = __webpack_require__(20);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(52),
    equalArrays = __webpack_require__(67),
    equalByTag = __webpack_require__(162),
    equalObjects = __webpack_require__(163),
    getTag = __webpack_require__(168),
    isArray = __webpack_require__(1),
    isBuffer = __webpack_require__(73),
    isTypedArray = __webpack_require__(75);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(52),
    baseIsEqual = __webpack_require__(63);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(74),
    isMasked = __webpack_require__(178),
    isObject = __webpack_require__(19),
    toSource = __webpack_require__(72);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(17),
    isLength = __webpack_require__(41),
    isObjectLike = __webpack_require__(20);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(69),
    nativeKeys = __webpack_require__(191);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),
/* 142 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.lt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than `other`,
 *  else `false`.
 */
function baseLt(value, other) {
  return value < other;
}

module.exports = baseLt;


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(11),
    isArrayLike = __webpack_require__(13);

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsMatch = __webpack_require__(138),
    getMatchData = __webpack_require__(165),
    matchesStrictComparable = __webpack_require__(71);

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(63),
    get = __webpack_require__(215),
    hasIn = __webpack_require__(216),
    isKey = __webpack_require__(37),
    isStrictComparable = __webpack_require__(70),
    matchesStrictComparable = __webpack_require__(71),
    toKey = __webpack_require__(29);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;


/***/ }),
/* 146 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(62);

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;


/***/ }),
/* 148 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.reduce` and `_.reduceRight`, without support
 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initAccum Specify using the first or last element of
 *  `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initAccum
      ? (initAccum = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

module.exports = baseReduce;


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(12),
    overRest = __webpack_require__(195),
    setToString = __webpack_require__(199);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(209),
    defineProperty = __webpack_require__(66),
    identity = __webpack_require__(12);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(11);

/**
 * The base implementation of `_.some` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function baseSome(collection, predicate) {
  var result;

  baseEach(collection, function(value, index, collection) {
    result = predicate(value, index, collection);
    return !result;
  });
  return !!result;
}

module.exports = baseSome;


/***/ }),
/* 152 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(16),
    arrayMap = __webpack_require__(54),
    isArray = __webpack_require__(1),
    isSymbol = __webpack_require__(21);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),
/* 154 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),
/* 155 */
/***/ (function(module, exports) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(57),
    baseAssignValue = __webpack_require__(58);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(5);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(149),
    isIterateeCall = __webpack_require__(36);

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(13);

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;


/***/ }),
/* 160 */
/***/ (function(module, exports) {

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(8),
    isArrayLike = __webpack_require__(13),
    keys = __webpack_require__(7);

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(16),
    Uint8Array = __webpack_require__(122),
    eq = __webpack_require__(30),
    equalArrays = __webpack_require__(67),
    mapToArray = __webpack_require__(189),
    setToArray = __webpack_require__(198);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var getAllKeys = __webpack_require__(164);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(133),
    getSymbols = __webpack_require__(167),
    keys = __webpack_require__(7);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

var isStrictComparable = __webpack_require__(70),
    keys = __webpack_require__(7);

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(16);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(53),
    stubArray = __webpack_require__(222);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

var DataView = __webpack_require__(117),
    Map = __webpack_require__(33),
    Promise = __webpack_require__(119),
    Set = __webpack_require__(120),
    WeakMap = __webpack_require__(123),
    baseGetTag = __webpack_require__(17),
    toSource = __webpack_require__(72);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),
/* 169 */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(65),
    isArguments = __webpack_require__(40),
    isArray = __webpack_require__(1),
    isIndex = __webpack_require__(35),
    isLength = __webpack_require__(41),
    toKey = __webpack_require__(29);

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(28);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),
/* 172 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(28);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(28);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(28);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(16),
    isArguments = __webpack_require__(40),
    isArray = __webpack_require__(1);

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ }),
/* 177 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(157);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),
/* 179 */
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(26);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(26);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(26);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(26);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(118),
    ListCache = __webpack_require__(25),
    Map = __webpack_require__(33);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(27);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(27);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(27);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(27);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),
/* 189 */
/***/ (function(module, exports) {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

var memoize = __webpack_require__(219);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(194);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(68);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(97)(module)))

/***/ }),
/* 193 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 194 */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(124);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),
/* 196 */
/***/ (function(module, exports) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),
/* 197 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),
/* 198 */
/***/ (function(module, exports) {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(150),
    shortOut = __webpack_require__(200);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),
/* 200 */
/***/ (function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(25);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),
/* 202 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),
/* 203 */
/***/ (function(module, exports) {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),
/* 204 */
/***/ (function(module, exports) {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(25),
    Map = __webpack_require__(33),
    MapCache = __webpack_require__(34);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(190);

/** Used to match property names within property paths. */
var reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(57),
    copyObject = __webpack_require__(156),
    createAssigner = __webpack_require__(158),
    isArrayLike = __webpack_require__(13),
    isPrototype = __webpack_require__(69),
    keys = __webpack_require__(7);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assign({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3 }
 */
var assign = createAssigner(function(object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

module.exports = assign;


/***/ }),
/* 208 */
/***/ (function(module, exports) {

/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */
function compact(array) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = compact;


/***/ }),
/* 209 */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

var arrayEvery = __webpack_require__(126),
    baseEvery = __webpack_require__(129),
    baseIteratee = __webpack_require__(8),
    isArray = __webpack_require__(1),
    isIterateeCall = __webpack_require__(36);

/**
 * Checks if `predicate` returns truthy for **all** elements of `collection`.
 * Iteration is stopped once `predicate` returns falsey. The predicate is
 * invoked with three arguments: (value, index|key, collection).
 *
 * **Note:** This method returns `true` for
 * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
 * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
 * elements of empty collections.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`.
 * @example
 *
 * _.every([true, 1, null, 'yes'], Boolean);
 * // => false
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': false },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.every(users, { 'user': 'barney', 'active': false });
 * // => false
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.every(users, ['active', false]);
 * // => true
 *
 * // The `_.property` iteratee shorthand.
 * _.every(users, 'active');
 * // => false
 */
function every(collection, predicate, guard) {
  var func = isArray(collection) ? arrayEvery : baseEvery;
  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = every;


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(131),
    baseIteratee = __webpack_require__(8),
    toInteger = __webpack_require__(225);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(60);

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

var arrayEach = __webpack_require__(125),
    baseEach = __webpack_require__(11),
    castFunction = __webpack_require__(64),
    isArray = __webpack_require__(1);

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(61),
    castFunction = __webpack_require__(64);

/**
 * Iterates over own enumerable string keyed properties of an object and
 * invokes `iteratee` for each property. The iteratee is invoked with three
 * arguments: (value, key, object). Iteratee functions may exit iteration
 * early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 0.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forOwnRight
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forOwn(object, iteratee) {
  return object && baseForOwn(object, castFunction(iteratee));
}

module.exports = forOwn;


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(62);

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

var baseHasIn = __webpack_require__(135),
    hasPath = __webpack_require__(170);

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;


/***/ }),
/* 217 */
/***/ (function(module, exports) {

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

var baseExtremum = __webpack_require__(59),
    baseGt = __webpack_require__(134),
    identity = __webpack_require__(12);

/**
 * Computes the maximum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * _.max([]);
 * // => undefined
 */
function max(array) {
  return (array && array.length)
    ? baseExtremum(array, identity, baseGt)
    : undefined;
}

module.exports = max;


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(34);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

var baseProperty = __webpack_require__(146),
    basePropertyDeep = __webpack_require__(147),
    isKey = __webpack_require__(37),
    toKey = __webpack_require__(29);

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

var arrayReduce = __webpack_require__(128),
    baseEach = __webpack_require__(11),
    baseIteratee = __webpack_require__(8),
    baseReduce = __webpack_require__(148),
    isArray = __webpack_require__(1);

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;

  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}

module.exports = reduce;


/***/ }),
/* 222 */
/***/ (function(module, exports) {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),
/* 223 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

var toNumber = __webpack_require__(226);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

var toFinite = __webpack_require__(224);

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(19),
    isSymbol = __webpack_require__(21);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(153);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),
/* 228 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js, $) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__application_view__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_timers_timer__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__favicon_renderer__ = __webpack_require__(230);



var BootstrapperView = (function () {
    function BootstrapperView() {
    }
    BootstrapperView.prototype.init = function (viewModel) {
        /**
         * This is not actually a view as we do some connections to existing
         * app loading UI. So we use low-level jquery methods to do rendering
         * here.
         */
        var _this = this;
        var $root = js.dom('.js_appLoading').$, $overlay = js.dom('.js_appLoadingOverlay').$, $messages = $root.find('.js_loadingMessages'), $loadingError = js.dom('.js_appLoadingError'), $loadingErrorMessage = js.dom('.js_appLoadingErrorMessage'), $retryIn = js.dom('.js_retryIn'), $retryNow = js.dom('.js_retryNow');
        $loadingErrorMessage.observes(viewModel.errorMessage);
        $retryIn.observes(viewModel.retryIn);
        $loadingErrorMessage.on('focusin').react(function () { return viewModel.cancelAutoRetry(); });
        $retryNow.on('click').react(function () { return viewModel.retryNow(); });
        var messages = [], messageHandleTimer = new __WEBPACK_IMPORTED_MODULE_1__global_timers_timer__["a" /* Timer */](), messageHandler = function () {
            if (messages.length === 0 && viewModel.status.getValue()) {
                /**
                 * Pre-loading stage is complete.
                 * Application is ready for rendering.
                 */
                messageHandleTimer.dispose();
                setTimeout(function () {
                    js.dom('#application').render(__WEBPACK_IMPORTED_MODULE_0__application_view__["a" /* default */], viewModel.applicationViewModel);
                    viewModel.onAppRendered();
                    _this.fadeOut($loadingError.$);
                    _this.fadeOut($overlay);
                    _this.fadeOut($root);
                }, 10);
            }
            else {
                if (messages.length > 0) {
                    var currentMessage = messages.splice(0, 1)[0];
                    $messages.find('li').addClass('sliding');
                    $messages.append('<li>' + currentMessage + '</li>');
                }
                messageHandleTimer.schedule(messageHandler, 600);
            }
        };
        /**
         * Initiate messages pulling cycle.
         */
        messageHandler();
        viewModel.customStylesUrl.listen(function (url) {
            var fileref = $("<link/>");
            fileref.attr("rel", "stylesheet");
            fileref.attr("type", "text/css");
            fileref.attr("href", url);
            $root.closest('html').find('head').append(fileref);
        });
        viewModel.statusMessage.listen(function (message) {
            if (message) {
                messages.push(message);
            }
        });
        viewModel.failed.listen(function (failed) {
            if (failed) {
                $loadingError.$.show();
                $loadingError.$.css('opacity', '1');
                $root.hide();
            }
            else {
                $loadingError.$.css('opacity', '0.3');
                $root.show();
            }
        });
        var faviconRenderer = new __WEBPACK_IMPORTED_MODULE_2__favicon_renderer__["a" /* FaviconRenderer */]();
        viewModel.favicon.listen(function (faviconStatus, oldFaviconStatus) {
            if (faviconStatus !== null && faviconStatus !== undefined && faviconStatus !== oldFaviconStatus) {
                faviconRenderer.render(faviconStatus);
            }
        });
        viewModel.title.listen(function (title) {
            if (title) {
                document.title = title;
            }
        });
    };
    BootstrapperView.prototype.fadeOut = function ($target) {
        $target.css('opacity', 0);
        setTimeout(function () { return $target.remove(); }, 1000);
    };
    return BootstrapperView;
}());
/* harmony default export */ __webpack_exports__["a"] = (BootstrapperView);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0), __webpack_require__(2)))

/***/ }),
/* 229 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bootstrapper_view_model__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bootstrapper_view__ = __webpack_require__(228);


/* harmony default export */ __webpack_exports__["a"] = (function () {
    var bootstrapperViewModel = new __WEBPACK_IMPORTED_MODULE_0__bootstrapper_view_model__["a" /* default */]();
    new __WEBPACK_IMPORTED_MODULE_1__bootstrapper_view__["a" /* default */]().init(bootstrapperViewModel);
    bootstrapperViewModel.start();
});;


/***/ }),
/* 230 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FaviconRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bootstrapper_view_model__ = __webpack_require__(77);

var COLOR_PRIMARY = '#38C049', COLOR_SECONDARY = '#E5D45B', COLOR_ERROR = '#CB4437', COLOR_WHITE = '#FFFFFF';
function drawCircle(context, color, angleStart, angleEnd, radius) {
    if (radius === void 0) { radius = 5; }
    context.beginPath();
    context.arc(8, 8, radius, angleStart, angleEnd);
    context.fillStyle = color;
    context.fill();
}
var LoadingFaviconRenderer = (function () {
    function LoadingFaviconRenderer() {
    }
    LoadingFaviconRenderer.prototype.draw = function (context) {
        drawCircle(context, COLOR_WHITE, 0, Math.PI * 2, 6);
        drawCircle(context, COLOR_PRIMARY, Math.PI / 2, Math.PI * 1.5);
        drawCircle(context, COLOR_SECONDARY, Math.PI * 1.5, Math.PI / 2);
    };
    return LoadingFaviconRenderer;
}());
var SolidFaviconRenderer = (function () {
    function SolidFaviconRenderer(color) {
        this.color = color;
    }
    SolidFaviconRenderer.prototype.draw = function (context) {
        drawCircle(context, this.color, 0, 2 * Math.PI);
        context.strokeStyle = COLOR_WHITE;
        context.stroke();
    };
    return SolidFaviconRenderer;
}());
var BrokenFaviconRenderer = (function () {
    function BrokenFaviconRenderer() {
    }
    BrokenFaviconRenderer.prototype.draw = function (context) {
        drawCircle(context, COLOR_PRIMARY, Math.PI / 2, Math.PI * 1.5);
        drawCircle(context, COLOR_SECONDARY, Math.PI * 1.5, Math.PI / 2);
        context.beginPath();
        var crossOriginX = 9, crossOriginY = 8, crossWidth = 5;
        context.beginPath();
        context.strokeStyle = COLOR_ERROR;
        context.lineWidth = 2;
        context.moveTo(crossOriginX, crossOriginY);
        context.lineTo(crossOriginX + crossWidth, crossOriginY + crossWidth);
        context.moveTo(crossOriginX, crossOriginY + crossWidth);
        context.lineTo(crossOriginX + crossWidth, crossOriginY);
        context.stroke();
    };
    return BrokenFaviconRenderer;
}());
var FaviconRenderer = (function () {
    function FaviconRenderer() {
        this._factory = {};
        this._factory[__WEBPACK_IMPORTED_MODULE_0__bootstrapper_view_model__["b" /* FaviconStatus */].Loading] = function () { return new LoadingFaviconRenderer(); };
        this._factory[__WEBPACK_IMPORTED_MODULE_0__bootstrapper_view_model__["b" /* FaviconStatus */].Ready] = function () { return new SolidFaviconRenderer(COLOR_SECONDARY); };
        this._factory[__WEBPACK_IMPORTED_MODULE_0__bootstrapper_view_model__["b" /* FaviconStatus */].Active] = function () { return new SolidFaviconRenderer(COLOR_PRIMARY); };
        this._factory[__WEBPACK_IMPORTED_MODULE_0__bootstrapper_view_model__["b" /* FaviconStatus */].Broken] = function () { return new BrokenFaviconRenderer(); };
    }
    FaviconRenderer.prototype.render = function (faviconStatus) {
        var $canvas = $('<canvas/>'), $link = $('<link class="cq-favicon" rel="icon" type="image"/>'), canvas = $canvas[0];
        if (typeof canvas.getContext == 'function') {
            $canvas.attr('width', 16);
            $canvas.attr('height', 16);
            var context = canvas.getContext('2d');
            this._factory[faviconStatus]().draw(context);
            $link.attr('href', canvas.toDataURL('image/png'));
            var $head = $('head');
            $head.find('.cq-favicon').remove();
            $head.append($link);
        }
    };
    return FaviconRenderer;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2)))

/***/ }),
/* 231 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApplicationModel; });
var ApplicationModel = (function () {
    function ApplicationModel() {
        this.schedulerName = new js.ObservableValue();
        this.autoUpdateMessage = new js.ObservableValue();
        this.isOffline = new js.ObservableValue();
        this.inProgressCount = new js.ObservableValue();
        this.onDataChanged = new js.Event();
        this.onDataInvalidate = new js.Event();
    }
    ApplicationModel.prototype.setData = function (data) {
        this.onDataChanged.trigger(data);
        if (data && data.Name && this.schedulerName.getValue() !== data.Name) {
            this.schedulerName.setValue(data.Name);
        }
        var inProgressValue = (data.InProgress || []).length;
        if (this.inProgressCount.getValue() !== inProgressValue) {
            this.inProgressCount.setValue(inProgressValue);
        }
    };
    /**
     * Causes application to reload all job gorups, jobs and triggers.
     */
    ApplicationModel.prototype.invalidateData = function () {
        this.onDataInvalidate.trigger(null);
    };
    ApplicationModel.prototype.goOffline = function () {
        this.offlineSince = new Date().getTime();
        if (!this.isOffline.getValue()) {
            this.isOffline.setValue(true);
        }
        this.autoUpdateMessage.setValue('offline');
    };
    ApplicationModel.prototype.goOnline = function () {
        this.offlineSince = null;
        if (!!this.isOffline.getValue()) {
            this.isOffline.setValue(false);
        }
    };
    return ApplicationModel;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 232 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_aside_aside_view_model__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__main_content_activities_synschronizer__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__main_content_job_group_job_group_view_model__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__main_header_header_view_model__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dialogs_dialog_manager__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__scheduler_state_service__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__offline_mode_offline_mode_view_model__ = __webpack_require__(267);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils_date__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__dialogs_activity_details_activity_details_view_model__ = __webpack_require__(81);









var ApplicationViewModel = (function () {
    function ApplicationViewModel(application, commandService, environment, notificationService, timelineInitializer) {
        var _this = this;
        this.application = application;
        this.commandService = commandService;
        this.environment = environment;
        this.notificationService = notificationService;
        this._schedulerStateService = new __WEBPACK_IMPORTED_MODULE_5__scheduler_state_service__["a" /* SchedulerStateService */]();
        this._serverInstanceMarker = null;
        this.dialogManager = new __WEBPACK_IMPORTED_MODULE_4__dialogs_dialog_manager__["a" /* DialogManager */]();
        this.jobGroups = js.observableList();
        this.offlineMode = new js.ObservableValue();
        this.timeline = timelineInitializer.timeline;
        this.globalActivitiesSynchronizer = timelineInitializer.globalActivitiesSynchronizer;
        this.mainAside = new __WEBPACK_IMPORTED_MODULE_0__main_aside_aside_view_model__["a" /* MainAsideViewModel */](this.application);
        this.mainHeader = new __WEBPACK_IMPORTED_MODULE_3__main_header_header_view_model__["a" /* default */](this.timeline, this.commandService, this.application, this.dialogManager);
        commandService.onCommandFailed.listen(function (error) { return notificationService.showError(error.errorMessage); });
        commandService.onDisconnected.listen(function () { return application.goOffline(); });
        this.groupsSynchronizer = new __WEBPACK_IMPORTED_MODULE_1__main_content_activities_synschronizer__["a" /* default */](function (group, groupViewModel) { return group.Name === groupViewModel.name; }, function (group) { return new __WEBPACK_IMPORTED_MODULE_2__main_content_job_group_job_group_view_model__["a" /* JobGroupViewModel */](group, _this.commandService, _this.application, _this.timeline, _this.dialogManager, _this._schedulerStateService); }, this.jobGroups);
        application.onDataChanged.listen(function (data) { return _this.setData(data); });
        application.isOffline.listen(function (isOffline) {
            var offlineModeViewModel = isOffline ?
                new __WEBPACK_IMPORTED_MODULE_6__offline_mode_offline_mode_view_model__["a" /* OfflineModeViewModel */](_this.application.offlineSince, _this.commandService, _this.application) :
                null;
            _this.offlineMode.setValue(offlineModeViewModel);
        });
        this.timeline.detailsRequested.listen(function (activity) {
            _this.dialogManager.showModal(new __WEBPACK_IMPORTED_MODULE_8__dialogs_activity_details_activity_details_view_model__["a" /* default */](activity), function (_) { });
        });
    }
    Object.defineProperty(ApplicationViewModel.prototype, "autoUpdateMessage", {
        get: function () {
            return this.application.autoUpdateMessage;
        },
        enumerable: true,
        configurable: true
    });
    ApplicationViewModel.prototype.setData = function (data) {
        if (this._serverInstanceMarker !== null && this._serverInstanceMarker !== data.ServerInstanceMarker) {
            this.notificationService.showError('Server restart detected at ' + __WEBPACK_IMPORTED_MODULE_7__utils_date__["a" /* default */].smartDateFormat(new Date().getTime()));
            this.commandService.resetEvents();
            this.timeline.clearSlots();
        }
        this._serverInstanceMarker = data.ServerInstanceMarker;
        this.groupsSynchronizer.sync(data.JobGroups);
        this.mainHeader.updateFrom(data);
        this._schedulerStateService.synsFrom(data);
        this.globalActivitiesSynchronizer.updateFrom(data);
    };
    return ApplicationViewModel;
}());
/* harmony default export */ __webpack_exports__["a"] = (ApplicationViewModel);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 233 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__application_tmpl_html__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__application_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__application_tmpl_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__main_aside_aside_view__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__main_content_job_group_job_group_view__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__main_header_header_view__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dialogs_dialogs_view_factory__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__dialogs_scheduler_details_scheduler_details_view__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__dialogs_scheduler_details_scheduler_details_view_model__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__dialogs_trigger_trigger_dialog_view__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__dialogs_trigger_trigger_dialog_view_model__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__dialogs_job_details_job_details_view__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__dialogs_job_details_job_details_view_model__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__dialogs_trigger_details_trigger_details_view__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__dialogs_trigger_details_trigger_details_view_model__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__dialogs_activity_details_activity_details_view_model__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__dialogs_activity_details_activity_details_view__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__notification_notifications_view__ = __webpack_require__(266);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__timeline_timeline_global_activity_view__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__timeline_timeline_tooltips_view__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__offline_mode_offline_mode_view__ = __webpack_require__(268);



















var ApplicationView = (function () {
    function ApplicationView() {
        this.template = __WEBPACK_IMPORTED_MODULE_0__application_tmpl_html___default.a;
    }
    ApplicationView.prototype.init = function (dom, viewModel) {
        var environment = viewModel.environment;
        dom('#selfVersion').$.text(environment.SelfVersion);
        dom('#quartzVersion').$.text(environment.QuartzVersion);
        dom('#dotNetVersion').$.text(environment.DotNetVersion);
        dom('#autoUpdateMessage').observes(viewModel.autoUpdateMessage);
        dom('.mainAside').render(__WEBPACK_IMPORTED_MODULE_1__main_aside_aside_view__["a" /* MainAsideView */], viewModel.mainAside);
        dom('.mainHeader').render(__WEBPACK_IMPORTED_MODULE_3__main_header_header_view__["a" /* default */], viewModel.mainHeader);
        dom('#jobsContainer').observes(viewModel.jobGroups, __WEBPACK_IMPORTED_MODULE_2__main_content_job_group_job_group_view__["a" /* JobGroupView */]);
        dom('.js_timeline_back_layer').observes(viewModel.timeline.globalSlot.activities, __WEBPACK_IMPORTED_MODULE_16__timeline_timeline_global_activity_view__["a" /* default */]);
        var timelineTooltipsRenderer = new __WEBPACK_IMPORTED_MODULE_17__timeline_timeline_tooltips_view__["a" /* default */](viewModel.globalActivitiesSynchronizer);
        dom.manager.manage(timelineTooltipsRenderer);
        timelineTooltipsRenderer.render(dom('.js_timeline_back_layer'), viewModel.timeline);
        var dialogsConfig = [
            { viewModel: __WEBPACK_IMPORTED_MODULE_6__dialogs_scheduler_details_scheduler_details_view_model__["a" /* default */], view: __WEBPACK_IMPORTED_MODULE_5__dialogs_scheduler_details_scheduler_details_view__["a" /* default */] },
            { viewModel: __WEBPACK_IMPORTED_MODULE_8__dialogs_trigger_trigger_dialog_view_model__["a" /* default */], view: __WEBPACK_IMPORTED_MODULE_7__dialogs_trigger_trigger_dialog_view__["a" /* default */] },
            { viewModel: __WEBPACK_IMPORTED_MODULE_10__dialogs_job_details_job_details_view_model__["a" /* default */], view: __WEBPACK_IMPORTED_MODULE_9__dialogs_job_details_job_details_view__["a" /* default */] },
            { viewModel: __WEBPACK_IMPORTED_MODULE_13__dialogs_activity_details_activity_details_view_model__["a" /* default */], view: __WEBPACK_IMPORTED_MODULE_14__dialogs_activity_details_activity_details_view__["a" /* default */] },
            { viewModel: __WEBPACK_IMPORTED_MODULE_12__dialogs_trigger_details_trigger_details_view_model__["a" /* TriggerDetailsViewModel */], view: __WEBPACK_IMPORTED_MODULE_11__dialogs_trigger_details_trigger_details_view__["a" /* TriggerDetailsView */] },
        ];
        dom('.js_offline_mode').observes(viewModel.offlineMode, __WEBPACK_IMPORTED_MODULE_18__offline_mode_offline_mode_view__["a" /* OfflineModeView */]);
        dom('.js_notifications').render(new __WEBPACK_IMPORTED_MODULE_15__notification_notifications_view__["a" /* default */](), viewModel.notificationService.notifications);
        dom('.js_dialogsContainer').render(new __WEBPACK_IMPORTED_MODULE_4__dialogs_dialogs_view_factory__["a" /* default */]().createView(dialogsConfig), viewModel.dialogManager);
    };
    return ApplicationView;
}());
/* harmony default export */ __webpack_exports__["a"] = (ApplicationView);


/***/ }),
/* 234 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_last__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_last___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_last__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_filter__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_filter__);


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
        this._commands = __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default()(this._commands, function (c) { return c !== command; });
        this.updateState();
    };
    CommandProgressViewModel.prototype.updateState = function () {
        this.active.setValue(this._commands.length > 0);
        this.commandsCount.setValue(this._commands.length);
        if (this._commands.length > 0) {
            this.currentCommand.setValue(__WEBPACK_IMPORTED_MODULE_0_lodash_last___default()(this._commands).message);
        }
    };
    return CommandProgressViewModel;
}());
/* harmony default export */ __webpack_exports__["a"] = (CommandProgressViewModel);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 235 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__command_progress_tmpl_html__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__command_progress_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__command_progress_tmpl_html__);

var CommandProgressView = (function () {
    function CommandProgressView() {
        this.template = __WEBPACK_IMPORTED_MODULE_0__command_progress_tmpl_html___default.a;
    }
    CommandProgressView.prototype.init = function (dom, viewModel) {
        dom('.js_commandMessage').observes(viewModel.currentCommand);
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
/* harmony default export */ __webpack_exports__["a"] = (CommandProgressView);


/***/ }),
/* 236 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PauseGroupCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ResumeGroupCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return DeleteGroupCommand; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abstract_command__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_mappers__ = __webpack_require__(22);
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
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
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
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
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
        _this.mapper = __WEBPACK_IMPORTED_MODULE_1__common_mappers__["a" /* SCHEDULER_DATA_MAPPER */];
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
/* 237 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataLoader; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commands_global_commands__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_filter__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_flatten__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_flatten___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash_flatten__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_map__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_lodash_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_compact__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_compact___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash_compact__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash_min__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_lodash_min__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__global_timers_timer__ = __webpack_require__(15);








var DataLoader = (function () {
    function DataLoader(applicationModel, commandService) {
        var _this = this;
        this.applicationModel = applicationModel;
        this.commandService = commandService;
        this._autoUpdateTimer = new __WEBPACK_IMPORTED_MODULE_7__global_timers_timer__["a" /* Timer */]();
        applicationModel.onDataChanged.listen(function (data) { return _this.setData(data); });
        applicationModel.onDataInvalidate.listen(function (data) { return _this.invalidateData(); });
        applicationModel.isOffline.listen(function (isOffline) {
            if (isOffline) {
                _this.goOffline();
            }
        });
    }
    DataLoader.prototype.start = function () {
        this.updateData();
    };
    DataLoader.prototype.goOffline = function () {
        this.resetTimer();
    };
    DataLoader.prototype.invalidateData = function () {
        this.resetTimer();
        this.updateData();
    };
    DataLoader.prototype.setData = function (data) {
        this.resetTimer();
        var nextUpdateDate = this.calculateNextUpdateDate(data), sleepInterval = this.calculateSleepInterval(nextUpdateDate);
        this.scheduleUpdateIn(sleepInterval);
    };
    DataLoader.prototype.scheduleRecovery = function () {
        this.scheduleUpdateIn(DataLoader.DEFAULT_UPDATE_INTERVAL);
    };
    DataLoader.prototype.scheduleUpdateIn = function (sleepInterval) {
        var _this = this;
        var now = new Date(), actualUpdateDate = new Date(now.getTime() + sleepInterval), message = 'next update at ' + actualUpdateDate.toTimeString();
        this.applicationModel.autoUpdateMessage.setValue(message);
        this._autoUpdateTimer.schedule(function () {
            _this.updateData();
        }, sleepInterval);
    };
    DataLoader.prototype.resetTimer = function () {
        this._autoUpdateTimer.reset();
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
        this.applicationModel.autoUpdateMessage.setValue('updating...');
        this.commandService
            .executeCommand(new __WEBPACK_IMPORTED_MODULE_0__commands_global_commands__["b" /* GetDataCommand */]())
            .fail(function (error) {
            if (!error.disconnected) {
                _this.scheduleRecovery();
            }
            // we do not schedule recovery
            // if server is not available as
            // this should be done by
            // Offline Mode Screen
        })
            .done(function (data) {
            _this.applicationModel.setData(data);
        });
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
        var allJobs = __WEBPACK_IMPORTED_MODULE_3_lodash_flatten___default()(__WEBPACK_IMPORTED_MODULE_4_lodash_map___default()(data.JobGroups, function (group) { return group.Jobs; })), allTriggers = __WEBPACK_IMPORTED_MODULE_3_lodash_flatten___default()(__WEBPACK_IMPORTED_MODULE_4_lodash_map___default()(allJobs, function (job) { return job.Triggers; })), activeTriggers = __WEBPACK_IMPORTED_MODULE_2_lodash_filter___default()(allTriggers, function (trigger) { return trigger.Status === __WEBPACK_IMPORTED_MODULE_1__api__["b" /* ActivityStatus */].Active; }), nextFireDates = __WEBPACK_IMPORTED_MODULE_5_lodash_compact___default()(__WEBPACK_IMPORTED_MODULE_4_lodash_map___default()(activeTriggers, function (trigger) { return trigger.NextFireDate == null ? null : trigger.NextFireDate; }));
        return nextFireDates.length > 0 ? new Date(__WEBPACK_IMPORTED_MODULE_6_lodash_min___default()(nextFireDates)) : null;
    };
    DataLoader.prototype.getExecutingNowBasedUpdateDate = function (data) {
        if (data.InProgress && data.InProgress.length > 0) {
            return this.nowPlusMilliseconds(DataLoader.DEFAULT_UPDATE_INTERVAL_IN_PROGRESS);
        }
        return null;
    };
    DataLoader.prototype.calculateNextUpdateDate = function (data) {
        var inProgressBasedUpdateDate = this.getExecutingNowBasedUpdateDate(data), triggersBasedUpdateDate = this.getLastActivityFireDate(data) || this.getDefaultUpdateDate();
        if (inProgressBasedUpdateDate && triggersBasedUpdateDate.getTime() > inProgressBasedUpdateDate.getTime()) {
            return inProgressBasedUpdateDate;
        }
        return triggersBasedUpdateDate;
    };
    DataLoader.prototype.nowPlusMilliseconds = function (value) {
        return new Date(new Date().getTime() + value);
    };
    return DataLoader;
}());

DataLoader.DEFAULT_UPDATE_INTERVAL = 30000; // 30sec
DataLoader.MAX_UPDATE_INTERVAL = 300000; // 5min
DataLoader.MIN_UPDATE_INTERVAL = 10000; // 10sec
DataLoader.DEFAULT_UPDATE_INTERVAL_IN_PROGRESS = 20000; // 20sec


/***/ }),
/* 238 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dialog_view_base__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_errors_view__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__main_content_nullable_date_view__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global_activities_activity_state_view__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__activity_details_tmpl_html__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__activity_details_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__activity_details_tmpl_html__);
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





var ActivityDetailsView = (function (_super) {
    __extends(ActivityDetailsView, _super);
    function ActivityDetailsView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.template = __WEBPACK_IMPORTED_MODULE_4__activity_details_tmpl_html___default.a;
        return _this;
    }
    ActivityDetailsView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        var activityModel = viewModel.activityModel, duration = activityModel.duration;
        dom('.js_fireInstanceId').observes(viewModel.fireInstanceId);
        dom('.js_durationValue').observes(duration.value);
        dom('.js_durationUnit').observes(duration.measurementUnit);
        dom('.js_startedAt').observes(activityModel.startedAt, __WEBPACK_IMPORTED_MODULE_2__main_content_nullable_date_view__["a" /* NullableDateView */]);
        dom('.js_completedAt').observes(activityModel.completedAt, __WEBPACK_IMPORTED_MODULE_2__main_content_nullable_date_view__["a" /* NullableDateView */]);
        dom('.js_errors').observes(activityModel.errors, __WEBPACK_IMPORTED_MODULE_1__common_errors_view__["a" /* ErrorsView */]);
        dom('.js_status').observes(activityModel.status, __WEBPACK_IMPORTED_MODULE_3__global_activities_activity_state_view__["a" /* ActivityStateView */]);
        viewModel.loadDetails();
    };
    return ActivityDetailsView;
}(__WEBPACK_IMPORTED_MODULE_0__dialog_view_base__["a" /* default */]));
/* harmony default export */ __webpack_exports__["a"] = (ActivityDetailsView);


/***/ }),
/* 239 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ErrorsView; });
var ErrorsView = (function () {
    function ErrorsView() {
        this.template = "\n<div class=\"properties-panel\">\n    <header>Errors</header>\n    <ul class=\"errors\"></ul>\n</div>";
    }
    ErrorsView.prototype.init = function (dom, errors) {
        dom('ul').observes(errors, ErrorMessageView);
    };
    return ErrorsView;
}());

var ErrorMessageView = (function () {
    function ErrorMessageView() {
        this.template = "<li class=\"error-message\"></li>";
    }
    ErrorMessageView.prototype.init = function (dom, errorMessage) {
        var $li = dom('li');
        $li.observes(errorMessage.text);
        $li.$.css('padding-left', ((errorMessage.level + 1) * 15) + 'px');
    };
    return ErrorMessageView;
}());


/***/ }),
/* 240 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobDataMapItemView; });
var OptionView = (function () {
    function OptionView() {
        this.template = '<option></option>';
    }
    OptionView.prototype.init = function (dom, viewModel) {
        var $option = dom('option');
        $option.$.prop('value', viewModel.code);
        $option.$.text(viewModel.label);
    };
    return OptionView;
}());
var VariantOptionView = (function () {
    function VariantOptionView() {
        this.template = '<option></option>';
    }
    VariantOptionView.prototype.init = function (dom, viewModel) {
        var $option = dom('option');
        $option.$.prop('value', viewModel.value);
        $option.$.text(viewModel.label);
    };
    return VariantOptionView;
}());
var JobDataMapItemView = (function () {
    function JobDataMapItemView() {
        this.template = "\n<tr class=\"no-border\">\n    <td class=\"js_key job-data-key\"></td>\n    <td class=\"job-data-input-type\">\n        <select class=\"js_inputType form-control form-control-sm\"></select>\n    </td>\n    <td class=\"\">\n        <input class=\"js_value form-control form-control-sm\" type=\"text\" />\n        <select class=\"js_inputTypeVariants form-control form-control-sm\"></select>\n    </td>\n    <td class=\"job-data-remove\"><a href=\"javascript:void(0);\" class=\"js_remove\">&times;</a></td>\n</tr>\n<tr class=\"no-padding\">\n    <td></td>\n    <td colspan=\"2\">\n        <p class=\"js_error error\"></p>\n    </td>\n    <td></td>\n</tr>";
    }
    JobDataMapItemView.prototype.init = function (dom, viewModel) {
        var $valueInput = dom('.js_value');
        $valueInput.$.prop('placeholder', 'Enter ' + viewModel.key + ' value');
        dom('.js_key').observes(viewModel.key);
        $valueInput.observes(viewModel.value, { bidirectional: true });
        var $inputTypeSelect = dom('.js_inputType');
        $inputTypeSelect.observes(viewModel.inputTypes, OptionView);
        $inputTypeSelect.observes(viewModel.inputTypeCode, { bidirectional: true, command: viewModel.setInputTypeCode });
        var $valueSelect = dom('.js_inputTypeVariants');
        $valueSelect.observes(viewModel.variants, VariantOptionView);
        $valueSelect.observes(viewModel.selectedVariantValue, { bidirectional: true });
        dom.manager.manage(viewModel.hasVariants.listen(function (hasVariants) {
            $valueInput.$.css('display', hasVariants ? 'none' : 'inline');
            $valueSelect.$.css('display', !hasVariants ? 'none' : 'inline');
        }));
        dom('.js_remove').on('click').react(viewModel.remove);
        var $error = dom('.js_error');
        $error.observes(viewModel.error);
        dom.manager.manage(viewModel.error.listen(function (error) {
            $error.$.css('display', error ? 'block' : 'none');
        }));
    };
    return JobDataMapItemView;
}());



/***/ }),
/* 241 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobDataMapItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_find__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_find___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_find__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__commands_job_data_map_commands__ = __webpack_require__(79);


var JobDataMapItem = (function () {
    function JobDataMapItem(key, inputTypes, cachedVariants, commandService) {
        this.key = key;
        this.inputTypes = inputTypes;
        this.cachedVariants = cachedVariants;
        this.commandService = commandService;
        this.value = new js.ObservableValue();
        this.selectedVariantValue = new js.ObservableValue();
        this.error = new js.ObservableValue();
        this.inputTypeCode = new js.ObservableValue();
        this.variants = new js.ObservableList();
        this.hasVariants = new js.ObservableValue();
        this.onRemoved = new js.Event();
        if (inputTypes.length > 0) {
            this.setInputTypeCode(inputTypes[0].code);
        }
    }
    JobDataMapItem.prototype.remove = function () {
        this.onRemoved.trigger();
    };
    JobDataMapItem.prototype.setInputTypeCode = function (value) {
        var _this = this;
        this.inputTypeCode.setValue(value);
        var inputType = __WEBPACK_IMPORTED_MODULE_0_lodash_find___default()(this.inputTypes, function (x) { return x.code === value; });
        if (inputType && inputType.hasVariants) {
            if (this.cachedVariants[inputType.code]) {
                this.setVariants(this.cachedVariants[inputType.code]);
            }
            else {
                this.commandService
                    .executeCommand(new __WEBPACK_IMPORTED_MODULE_1__commands_job_data_map_commands__["b" /* GetInputTypeVariantsCommand */](inputType))
                    .then(function (variants) {
                    _this.cachedVariants[inputType.code] = variants;
                    _this.setVariants(variants);
                });
            }
            this.hasVariants.setValue(true);
        }
        else {
            this.hasVariants.setValue(false);
            this.variants.setValue([]);
        }
    };
    JobDataMapItem.prototype.getActualValue = function () {
        if (this.hasVariants.getValue()) {
            return this.selectedVariantValue.getValue();
        }
        return this.value.getValue();
    };
    JobDataMapItem.prototype.setVariants = function (variants) {
        this.variants.setValue(variants);
        if (variants.length > 0) {
            this.selectedVariantValue.setValue(variants[0].value);
        }
    };
    return JobDataMapItem;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 242 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__property__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_date__ = __webpack_require__(10);


var ValueFormatter = (function () {
    function ValueFormatter() {
    }
    ValueFormatter.format = function (value, typeCode) {
        if (value == null || value == undefined) {
            return '';
        }
        if (typeCode === __WEBPACK_IMPORTED_MODULE_0__property__["b" /* PropertyType */].Type) {
            var type = value;
            return "<span class=\"namespace\">" + type.Namespace + ".</span><span class=\"name\">" + type.Name + "</span><span class=\"assembly\">, " + type.Assembly + "</span>";
        }
        if (typeCode === __WEBPACK_IMPORTED_MODULE_0__property__["b" /* PropertyType */].Date) {
            return __WEBPACK_IMPORTED_MODULE_1__utils_date__["a" /* default */].smartDateFormat(value);
        }
        return value.toString();
    };
    return ValueFormatter;
}());
/* harmony default export */ __webpack_exports__["a"] = (ValueFormatter);


/***/ }),
/* 243 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DialogManager; });
var DialogManager = (function () {
    function DialogManager() {
        this.visibleDialogs = new js.ObservableList();
    }
    DialogManager.prototype.showModal = function (viewModel, resultHandler) {
        var _this = this;
        while (this.visibleDialogs.getValue().length > 0) {
            // support only 1 visible dialog for now
            this.closeTopModal();
        }
        var wiresToDispose = [];
        var dispose = function () {
            for (var i = 0; i < wiresToDispose.length; i++) {
                wiresToDispose[i].dispose();
            }
            _this.visibleDialogs.remove(viewModel);
        };
        var accespedWire = viewModel.accepted.listen(function (result) {
            resultHandler(result);
            dispose();
        });
        var canceledWire = viewModel.canceled.listen(function () {
            dispose();
        });
        wiresToDispose.push(accespedWire);
        wiresToDispose.push(canceledWire);
        this.visibleDialogs.add(viewModel);
    };
    DialogManager.prototype.closeTopModal = function () {
        var dialogs = this.visibleDialogs.getValue();
        if (dialogs.length > 0) {
            var topDialog = dialogs[dialogs.length - 1];
            topDialog.cancel();
        }
    };
    return DialogManager;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 244 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {var DialogsViewFactory = (function () {
    function DialogsViewFactory() {
    }
    DialogsViewFactory.prototype.createView = function (config) {
        return (function () {
            function class_1() {
                this.template = "<div class=\"dialogs-overlay js_dialogsOverlay\"></div>\n<div class=\"js_dialogs\"></div>";
            }
            class_1.prototype.init = function (dom, dialogManager) {
                var viewSelector = function (dialog) {
                    for (var i = 0; i < config.length; i++) {
                        if (dialog instanceof config[i].viewModel) {
                            return config[i].view;
                        }
                    }
                    throw new Error('Unknown dialog view model');
                };
                var $overlay = dom('.js_dialogsOverlay').$;
                dom('.js_dialogs').observes(dialogManager.visibleDialogs, viewSelector);
                var timerRef = null;
                dom.manager.manage(dialogManager.visibleDialogs.count().listen(function (visibleDialogsCount) {
                    if (timerRef) {
                        clearTimeout(timerRef);
                        timerRef = null;
                    }
                    if (visibleDialogsCount) {
                        $overlay.css('display', 'block');
                        timerRef = setTimeout(function () {
                            $overlay.css('opacity', '0.8');
                        }, 10);
                    }
                    else {
                        $overlay.css('opacity', '0');
                        timerRef = setTimeout(function () {
                            $overlay.css('display', 'none');
                        }, 1000);
                    }
                }));
                /**
                 * Handle escape button click.
                 */
                $(document).keyup(function (e) {
                    if (e.keyCode === 27) {
                        dialogManager.closeTopModal();
                    }
                });
            };
            return class_1;
        }());
    };
    return DialogsViewFactory;
}());
/* harmony default export */ __webpack_exports__["a"] = (DialogsViewFactory);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2)))

/***/ }),
/* 245 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dialog_view_base__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_property_view__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__job_details_tmpl_html__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__job_details_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__job_details_tmpl_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_object_browser__ = __webpack_require__(82);
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




var JobDetailsView = (function (_super) {
    __extends(JobDetailsView, _super);
    function JobDetailsView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.template = __WEBPACK_IMPORTED_MODULE_2__job_details_tmpl_html___default.a;
        return _this;
    }
    JobDetailsView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        dom('.js_identity').observes(viewModel.identity, __WEBPACK_IMPORTED_MODULE_1__common_property_view__["a" /* default */]);
        dom('.js_summary').observes(viewModel.summary, __WEBPACK_IMPORTED_MODULE_1__common_property_view__["a" /* default */]);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__common_object_browser__["a" /* RENDER_PROPERTIES */])(dom('.js_jobDataMap'), viewModel.jobDataMap);
        viewModel.loadDetails();
    };
    return JobDetailsView;
}(__WEBPACK_IMPORTED_MODULE_0__dialog_view_base__["a" /* default */]));
/* harmony default export */ __webpack_exports__["a"] = (JobDetailsView);


/***/ }),
/* 246 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dialog_view_base__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_property_view__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scheduler_details_tmpl_html__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scheduler_details_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__scheduler_details_tmpl_html__);
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



var SchedulerDetailsView = (function (_super) {
    __extends(SchedulerDetailsView, _super);
    function SchedulerDetailsView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.template = __WEBPACK_IMPORTED_MODULE_2__scheduler_details_tmpl_html___default.a;
        return _this;
    }
    SchedulerDetailsView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        dom('.js_summary').observes(viewModel.summary, __WEBPACK_IMPORTED_MODULE_1__common_property_view__["a" /* default */]);
        dom('.js_status').observes(viewModel.status, __WEBPACK_IMPORTED_MODULE_1__common_property_view__["a" /* default */]);
        dom('.js_jobStore').observes(viewModel.jobStore, __WEBPACK_IMPORTED_MODULE_1__common_property_view__["a" /* default */]);
        dom('.js_threadPool').observes(viewModel.threadPool, __WEBPACK_IMPORTED_MODULE_1__common_property_view__["a" /* default */]);
        viewModel.loadDetails();
    };
    return SchedulerDetailsView;
}(__WEBPACK_IMPORTED_MODULE_0__dialog_view_base__["a" /* default */]));
/* harmony default export */ __webpack_exports__["a"] = (SchedulerDetailsView);


/***/ }),
/* 247 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TriggerDetailsView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dialog_view_base__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_property_view__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__trigger_details_tmpl_html__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__trigger_details_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__trigger_details_tmpl_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_object_browser__ = __webpack_require__(82);
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




var TriggerDetailsView = (function (_super) {
    __extends(TriggerDetailsView, _super);
    function TriggerDetailsView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.template = __WEBPACK_IMPORTED_MODULE_2__trigger_details_tmpl_html___default.a;
        return _this;
    }
    TriggerDetailsView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        dom('.js_summary').observes(viewModel.summary, __WEBPACK_IMPORTED_MODULE_1__common_property_view__["a" /* default */]);
        dom('.js_identity').observes(viewModel.identity, __WEBPACK_IMPORTED_MODULE_1__common_property_view__["a" /* default */]);
        dom('.js_schedule').observes(viewModel.schedule, __WEBPACK_IMPORTED_MODULE_1__common_property_view__["a" /* default */]);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__common_object_browser__["a" /* RENDER_PROPERTIES */])(dom('.js_jobDataMap'), viewModel.jobDataMap);
        viewModel.loadDetails();
    };
    return TriggerDetailsView;
}(__WEBPACK_IMPORTED_MODULE_0__dialog_view_base__["a" /* default */]));



/***/ }),
/* 248 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dialog_view_base__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_job_data_map_item_view__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__trigger_dialog_tmpl_html__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__trigger_dialog_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__trigger_dialog_tmpl_html__);
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
var TriggerDialogView = (function (_super) {
    __extends(TriggerDialogView, _super);
    function TriggerDialogView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.template = __WEBPACK_IMPORTED_MODULE_2__trigger_dialog_tmpl_html___default.a;
        return _this;
    }
    TriggerDialogView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
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
        //dom('.js_jobDataKey').observes(viewModel.newJobDataKey, { bidirectional: true, event: 'keyup' });
        this.valueAndValidator(dom('.js_jobDataKey'), dom('.js_jobDataKeyContainer'), viewModel.newJobDataKey, viewModel.validators, { bidirectional: true, event: 'keyup' });
        var $jobDataMapSection = dom('.js_jobDataMapSection');
        var $jobDataMap = dom('.js_jobDataMap');
        $jobDataMap.observes(viewModel.jobDataMap, __WEBPACK_IMPORTED_MODULE_1__common_job_data_map_item_view__["a" /* JobDataMapItemView */]);
        var $addJobDataKeyButton = dom('.js_addJobDataMapItem');
        $addJobDataKeyButton.on('click').react(viewModel.addJobDataMapItem);
        dom.manager.manage(viewModel.canAddJobDataKey.listen(function (value) { return $addJobDataKeyButton.$.prop('disabled', !value); }));
        dom.manager.manage(viewModel.jobDataMap.count().listen(function (itemsCount) {
            $jobDataMapSection.$.css('display', itemsCount > 0 ? 'block' : 'none');
        }));
    };
    TriggerDialogView.prototype.valueAndValidator = function (dom, validatorDom, source, validators, observationOptions) {
        if (observationOptions === void 0) { observationOptions = null; }
        dom.observes(source, observationOptions);
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
            dom.on((observationOptions ? observationOptions.event : null) || 'blur').react(sourceValidator.makeDirty, sourceValidator);
        }
    };
    return TriggerDialogView;
}(__WEBPACK_IMPORTED_MODULE_0__dialog_view_base__["a" /* default */]));
/* harmony default export */ __webpack_exports__["a"] = (TriggerDialogView);


/***/ }),
/* 249 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_map__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_flatMap__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_flatMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_flatMap__);



var GlobalActivitiesSynchronizer = (function () {
    function GlobalActivitiesSynchronizer(timeline) {
        this.timeline = timeline;
    }
    GlobalActivitiesSynchronizer.prototype.updateFrom = function (data) {
        this._currentData = data;
        this._currentFlatData = null;
        var globalTimelineActivities = this.timeline.getGlobalActivities();
        if (globalTimelineActivities.length > 0) {
            this.ensureHaveFlattenData();
            for (var i = 0; i < globalTimelineActivities.length; i++) {
                this.internalUpdateActivity(globalTimelineActivities[i]);
            }
        }
    };
    GlobalActivitiesSynchronizer.prototype.updateActivity = function (activity) {
        if (!this._currentData) {
            return;
        }
        this.ensureHaveFlattenData();
        this.internalUpdateActivity(activity);
    };
    GlobalActivitiesSynchronizer.prototype.getSlotIndex = function (slot, reverse) {
        this.ensureHaveFlattenData();
        var totalItems = this._currentFlatData.length;
        for (var j = 0; j < totalItems; j++) {
            var item = this._currentFlatData[j];
            if (slot.key === item.key) {
                return reverse ? totalItems - j : j;
            }
        }
        return null;
    };
    GlobalActivitiesSynchronizer.prototype.makeSlotKey = function (scope, key) {
        return scope + ':' + key;
    };
    GlobalActivitiesSynchronizer.prototype.internalUpdateActivity = function (activity) {
        if (activity.scope === __WEBPACK_IMPORTED_MODULE_0__api__["c" /* SchedulerEventScope */].Scheduler) {
            /**
             * Scheduler global activity fills the entire timeline area,
             * so we just update edges.
             */
            activity.updateVerticalPostion(0, this._currentFlatData.length);
            return;
        }
        for (var j = 0; j < this._currentFlatData.length; j++) {
            var item = this._currentFlatData[j];
            if (activity.scope === item.scope && activity.itemKey === item.key) {
                activity.updateVerticalPostion(j, item.size);
            }
        }
    };
    GlobalActivitiesSynchronizer.prototype.ensureHaveFlattenData = function () {
        var _this = this;
        if (this._currentFlatData) {
            return;
        }
        this._currentFlatData = __WEBPACK_IMPORTED_MODULE_2_lodash_flatMap___default()(this._currentData.JobGroups, function (jobGroup) {
            var flattenJobs = __WEBPACK_IMPORTED_MODULE_2_lodash_flatMap___default()(jobGroup.Jobs, function (job) {
                var flattenTriggers = __WEBPACK_IMPORTED_MODULE_1_lodash_map___default()(job.Triggers, function (t) { return ({ scope: __WEBPACK_IMPORTED_MODULE_0__api__["c" /* SchedulerEventScope */].Trigger, key: _this.makeSlotKey(__WEBPACK_IMPORTED_MODULE_0__api__["c" /* SchedulerEventScope */].Trigger, t.UniqueTriggerKey), size: 1 }); });
                return [
                    { scope: __WEBPACK_IMPORTED_MODULE_0__api__["c" /* SchedulerEventScope */].Job, key: _this.makeSlotKey(__WEBPACK_IMPORTED_MODULE_0__api__["c" /* SchedulerEventScope */].Job, jobGroup.Name) + '.' + job.Name, size: flattenTriggers.length + 1 }
                ].concat(flattenTriggers);
            });
            return [
                { scope: __WEBPACK_IMPORTED_MODULE_0__api__["c" /* SchedulerEventScope */].Group, key: _this.makeSlotKey(__WEBPACK_IMPORTED_MODULE_0__api__["c" /* SchedulerEventScope */].Group, jobGroup.Name), size: flattenJobs.length + 1 }
            ].concat(flattenJobs);
        });
    };
    return GlobalActivitiesSynchronizer;
}());
/* harmony default export */ __webpack_exports__["a"] = (GlobalActivitiesSynchronizer);


/***/ }),
/* 250 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var SeparatorView = (function () {
    function SeparatorView() {
        this.template = '<li role="separator" class="divider"></li>';
    }
    return SeparatorView;
}());
/* harmony default export */ __webpack_exports__["a"] = (SeparatorView);


/***/ }),
/* 251 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Owner; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_each__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_each___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_each__);

var Owner = (function () {
    function Owner() {
        this._properties = [];
    }
    Owner.prototype.own = function (property) {
        this._properties.push(property);
        return property;
    };
    Owner.prototype.dispose = function () {
        __WEBPACK_IMPORTED_MODULE_0_lodash_each___default()(this._properties, function (p) { return p.dispose(); });
    };
    return Owner;
}());



/***/ }),
/* 252 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CountdownTimer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__timer__ = __webpack_require__(15);

var CountdownTimer = (function () {
    function CountdownTimer(action) {
        this.action = action;
        this._timer = new __WEBPACK_IMPORTED_MODULE_0__timer__["a" /* Timer */]();
        this.countdownValue = new js.ObservableValue();
    }
    CountdownTimer.prototype.schedule = function (delaySeconds) {
        var _this = this;
        if (delaySeconds <= 0) {
            this.performAction();
        }
        else {
            this.countdownValue.setValue(delaySeconds);
            this._timer.schedule(function () { return _this.schedule(delaySeconds - 1); }, 1000);
        }
    };
    CountdownTimer.prototype.reset = function () {
        this._timer.reset();
    };
    CountdownTimer.prototype.force = function () {
        this.reset();
        this.performAction();
    };
    CountdownTimer.prototype.dispose = function () {
        this._timer.dispose();
    };
    CountdownTimer.prototype.performAction = function () {
        if (this.action) {
            this.action();
        }
    };
    return CountdownTimer;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 253 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MainAsideViewModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_number__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_duration__ = __webpack_require__(47);


var MainAsideViewModel = (function () {
    function MainAsideViewModel(application) {
        var _this = this;
        this.application = application;
        this.uptime = null;
        this.jobsTotal = new js.ObservableValue();
        this.jobsExecuted = new js.ObservableValue();
        var waitingText = '...';
        this.inProgressCount = this.application.inProgressCount;
        this.uptime = new __WEBPACK_IMPORTED_MODULE_1__global_duration__["b" /* Duration */]();
        this.jobsTotal.setValue(waitingText);
        this.jobsExecuted.setValue(waitingText);
        application.onDataChanged.listen(function (data) { return _this.updateAsideData(data); });
    }
    MainAsideViewModel.prototype.updateAsideData = function (data) {
        this.uptime.setStartDate(data.RunningSince);
        this.jobsTotal.setValue(__WEBPACK_IMPORTED_MODULE_0__utils_number__["a" /* default */].formatLargeNumber(data.JobsTotal));
        this.jobsExecuted.setValue(__WEBPACK_IMPORTED_MODULE_0__utils_number__["a" /* default */].formatLargeNumber(data.JobsExecuted));
    };
    return MainAsideViewModel;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 254 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MainAsideView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__aside_tmpl_html__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__aside_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__aside_tmpl_html__);

var MainAsideView = (function () {
    function MainAsideView() {
        this.template = __WEBPACK_IMPORTED_MODULE_0__aside_tmpl_html___default.a;
    }
    MainAsideView.prototype.init = function (dom, viewModel) {
        //dom('.js_uptimeValue').observes(viewModel.uptimeValue, { encode: false });
        dom('.js_uptimeMeasurementUnit').observes(viewModel.uptime.measurementUnit);
        dom('.js_totalJobs').observes(viewModel.jobsTotal);
        dom('.js_executedJobs').observes(viewModel.jobsExecuted);
        dom('.js_inProgressCount').observes(viewModel.inProgressCount);
        var $gaugeBody = dom('.gauge-body').$;
        dom.manager.manage(viewModel.inProgressCount.listen(function (value) {
            var angle = 180 * value / parseInt(viewModel.jobsTotal.getValue(), 10);
            $gaugeBody.css('transform', 'rotate(' + Math.min(angle, 180) + 'deg)');
        }));
        var $uptimeValue = dom('.js_uptimeValue').$;
        dom.manager.manage(viewModel.uptime.value.listen(function (value) {
            if (value === null) {
                $uptimeValue.addClass('empty');
                $uptimeValue.text('none');
            }
            else {
                $uptimeValue.removeClass('empty');
                $uptimeValue.text(value);
            }
        }));
    };
    return MainAsideView;
}());



/***/ }),
/* 255 */
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
                dom.$.removeClass(oldValue.code);
            }
            if (newValue) {
                dom.$
                    .addClass(newValue.code)
                    .attr('title', 'Status: ' + newValue.title);
            }
        });
    };
    return ActivityStatusView;
}());



/***/ }),
/* 256 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobGroupViewModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commands_job_group_commands__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__activity_view_model__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__activities_synschronizer__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__job_job_view_model__ = __webpack_require__(258);
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
    function JobGroupViewModel(group, commandService, applicationModel, timeline, dialogManager, schedulerStateService) {
        var _this = _super.call(this, group, commandService, applicationModel) || this;
        _this.timeline = timeline;
        _this.dialogManager = dialogManager;
        _this.schedulerStateService = schedulerStateService;
        _this.jobs = js.observableList();
        _this.jobsSynchronizer = new __WEBPACK_IMPORTED_MODULE_2__activities_synschronizer__["a" /* default */](function (job, jobViewModel) { return job.Name === jobViewModel.name; }, function (job) { return new __WEBPACK_IMPORTED_MODULE_3__job_job_view_model__["a" /* JobViewModel */](job, _this.name, _this.commandService, _this.applicationModel, _this.timeline, _this.dialogManager, _this.schedulerStateService); }, _this.jobs);
        return _this;
    }
    JobGroupViewModel.prototype.updateFrom = function (group) {
        _super.prototype.updateFrom.call(this, group);
        this.jobsSynchronizer.sync(group.Jobs);
    };
    JobGroupViewModel.prototype.getDeleteConfirmationsText = function () {
        return 'Are you sure you want to delete all jobs?';
    };
    JobGroupViewModel.prototype.getPauseAction = function () {
        var _this = this;
        return {
            title: 'Pause all jobs',
            command: function () { return new __WEBPACK_IMPORTED_MODULE_0__commands_job_group_commands__["a" /* PauseGroupCommand */](_this.name); }
        };
    };
    JobGroupViewModel.prototype.getResumeAction = function () {
        var _this = this;
        return {
            title: 'Resume all jobs',
            command: function () { return new __WEBPACK_IMPORTED_MODULE_0__commands_job_group_commands__["b" /* ResumeGroupCommand */](_this.name); }
        };
    };
    JobGroupViewModel.prototype.getDeleteAction = function () {
        var _this = this;
        return {
            title: 'Delete all jobs',
            command: function () { return new __WEBPACK_IMPORTED_MODULE_0__commands_job_group_commands__["c" /* DeleteGroupCommand */](_this.name); }
        };
    };
    return JobGroupViewModel;
}(__WEBPACK_IMPORTED_MODULE_1__activity_view_model__["a" /* ManagableActivityViewModel */]));


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 257 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobGroupView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__activity_view__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__job_job_view__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_actions_separator__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__job_group_tmpl_html__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__job_group_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__job_group_tmpl_html__);
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
        _this.template = __WEBPACK_IMPORTED_MODULE_3__job_group_tmpl_html___default.a;
        return _this;
    }
    JobGroupView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        dom('.js_jobs').observes(viewModel.jobs, __WEBPACK_IMPORTED_MODULE_1__job_job_view__["a" /* JobView */]);
        /*
        dom.onUnrender().listen(() => {
            dom.$.fadeOut();
        });*/
    };
    JobGroupView.prototype.composeActions = function (viewModel) {
        return [
            viewModel.pauseAction,
            viewModel.resumeAction,
            new __WEBPACK_IMPORTED_MODULE_2__global_actions_separator__["a" /* default */](),
            viewModel.deleteAction
        ];
    };
    return JobGroupView;
}(__WEBPACK_IMPORTED_MODULE_0__activity_view__["a" /* ActivityView */]));



/***/ }),
/* 258 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobViewModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commands_job_commands__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__activity_view_model__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__activities_synschronizer__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__trigger_trigger_view_model__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dialogs_trigger_trigger_dialog_view_model__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__dialogs_job_details_job_details_view_model__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__command_action__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__global_actions_action__ = __webpack_require__(88);
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
    function JobViewModel(job, group, commandService, applicationModel, timeline, dialogManager, schedulerStateService) {
        var _this = _super.call(this, job, commandService, applicationModel) || this;
        _this.job = job;
        _this.group = group;
        _this.timeline = timeline;
        _this.dialogManager = dialogManager;
        _this.schedulerStateService = schedulerStateService;
        _this.triggers = js.observableList();
        _this.executeNowAction = new __WEBPACK_IMPORTED_MODULE_6__command_action__["a" /* default */](_this.applicationModel, _this.commandService, 'Execute Now', function () { return new __WEBPACK_IMPORTED_MODULE_0__commands_job_commands__["a" /* ExecuteNowCommand */](_this.group, _this.name); });
        _this.addTriggerAction = new __WEBPACK_IMPORTED_MODULE_7__global_actions_action__["a" /* default */]('Add Trigger', function () { return _this.addTrigger(); });
        _this.triggersSynchronizer = new __WEBPACK_IMPORTED_MODULE_2__activities_synschronizer__["a" /* default */](function (trigger, triggerViewModel) { return trigger.Name === triggerViewModel.name; }, function (trigger) { return new __WEBPACK_IMPORTED_MODULE_3__trigger_trigger_view_model__["a" /* TriggerViewModel */](trigger, _this.commandService, _this.applicationModel, _this.timeline, _this.dialogManager, _this.schedulerStateService); }, _this.triggers);
        return _this;
    }
    JobViewModel.prototype.loadJobDetails = function () {
        this.dialogManager.showModal(new __WEBPACK_IMPORTED_MODULE_5__dialogs_job_details_job_details_view_model__["a" /* default */](this.job, this.commandService), function (result) { });
    };
    JobViewModel.prototype.updateFrom = function (job) {
        _super.prototype.updateFrom.call(this, job);
        this.triggersSynchronizer.sync(job.Triggers);
    };
    JobViewModel.prototype.getDeleteConfirmationsText = function () {
        return 'Are you sure you want to delete job?';
    };
    JobViewModel.prototype.getPauseAction = function () {
        var _this = this;
        return {
            title: 'Pause all triggers',
            command: function () { return new __WEBPACK_IMPORTED_MODULE_0__commands_job_commands__["b" /* PauseJobCommand */](_this.group, _this.name); }
        };
    };
    JobViewModel.prototype.getResumeAction = function () {
        var _this = this;
        return {
            title: 'Resume all triggers',
            command: function () { return new __WEBPACK_IMPORTED_MODULE_0__commands_job_commands__["c" /* ResumeJobCommand */](_this.group, _this.name); }
        };
    };
    JobViewModel.prototype.getDeleteAction = function () {
        var _this = this;
        return {
            title: 'Delete job',
            command: function () { return new __WEBPACK_IMPORTED_MODULE_0__commands_job_commands__["d" /* DeleteJobCommand */](_this.group, _this.name); }
        };
    };
    JobViewModel.prototype.addTrigger = function () {
        var _this = this;
        this.dialogManager.showModal(new __WEBPACK_IMPORTED_MODULE_4__dialogs_trigger_trigger_dialog_view_model__["a" /* default */](this.job, this.commandService), function (result) {
            if (result) {
                _this.applicationModel.invalidateData();
            }
        });
    };
    return JobViewModel;
}(__WEBPACK_IMPORTED_MODULE_1__activity_view_model__["a" /* ManagableActivityViewModel */]));


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 259 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__activity_view__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__trigger_trigger_view__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__job_tmpl_html__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__job_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__job_tmpl_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global_actions_separator__ = __webpack_require__(24);
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
        _this.template = __WEBPACK_IMPORTED_MODULE_2__job_tmpl_html___default.a;
        return _this;
    }
    JobView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        dom('.triggers').observes(viewModel.triggers, __WEBPACK_IMPORTED_MODULE_1__trigger_trigger_view__["a" /* TriggerView */]);
        dom('.js_viewDetails').on('click').react(viewModel.loadJobDetails);
    };
    JobView.prototype.composeActions = function (viewModel) {
        return [
            viewModel.pauseAction,
            viewModel.resumeAction,
            new __WEBPACK_IMPORTED_MODULE_3__global_actions_separator__["a" /* default */](),
            viewModel.deleteAction,
            new __WEBPACK_IMPORTED_MODULE_3__global_actions_separator__["a" /* default */](),
            viewModel.executeNowAction,
            viewModel.addTriggerAction
        ];
    };
    return JobView;
}(__WEBPACK_IMPORTED_MODULE_0__activity_view__["a" /* ActivityView */]));



/***/ }),
/* 260 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TriggerViewModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__commands_trigger_commands__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dialogs_trigger_details_trigger_details_view_model__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__activity_view_model__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scheduler_state_service__ = __webpack_require__(93);
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
    function TriggerViewModel(trigger, commandService, applicationModel, timeline, dialogManager, schedulerStateService) {
        var _this = _super.call(this, trigger, commandService, applicationModel) || this;
        _this.trigger = trigger;
        _this.timeline = timeline;
        _this.dialogManager = dialogManager;
        _this.schedulerStateService = schedulerStateService;
        _this.startDate = js.observableValue();
        _this.endDate = js.observableValue();
        _this.previousFireDate = js.observableValue();
        _this.nextFireDate = js.observableValue();
        _this.triggerType = js.observableValue();
        _this.executing = new js.ObservableValue();
        var slotKey = 3 + ':' + trigger.UniqueTriggerKey;
        _this._group = trigger.GroupName;
        _this.timelineSlot = timeline.findSlotBy(slotKey) || timeline.addSlot({ key: slotKey });
        _this._realtimeWire = schedulerStateService.realtimeBus.listen(function (event) {
            if (event.uniqueTriggerKey === trigger.UniqueTriggerKey) {
                if (event.eventType === __WEBPACK_IMPORTED_MODULE_4__scheduler_state_service__["b" /* EventType */].Fired) {
                    _this.executing.setValue(true);
                }
                else {
                    _this.executing.setValue(false);
                }
            }
        });
        return _this;
    }
    TriggerViewModel.prototype.releaseState = function () {
        this.timeline.removeSlot(this.timelineSlot);
    };
    TriggerViewModel.prototype.updateFrom = function (trigger) {
        _super.prototype.updateFrom.call(this, trigger);
        this.startDate.setValue(new __WEBPACK_IMPORTED_MODULE_0__api__["f" /* NullableDate */](trigger.StartDate));
        this.endDate.setValue(new __WEBPACK_IMPORTED_MODULE_0__api__["f" /* NullableDate */](trigger.EndDate));
        this.previousFireDate.setValue(new __WEBPACK_IMPORTED_MODULE_0__api__["f" /* NullableDate */](trigger.PreviousFireDate));
        this.nextFireDate.setValue(new __WEBPACK_IMPORTED_MODULE_0__api__["f" /* NullableDate */](trigger.NextFireDate));
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
        return 'Are you sure you want to unschedue the trigger?';
    };
    TriggerViewModel.prototype.getPauseAction = function () {
        var _this = this;
        return {
            title: 'Pause trigger',
            command: function () { return new __WEBPACK_IMPORTED_MODULE_1__commands_trigger_commands__["b" /* PauseTriggerCommand */](_this._group, _this.name); }
        };
    };
    TriggerViewModel.prototype.getResumeAction = function () {
        var _this = this;
        return {
            title: 'Resume trigger',
            command: function () { return new __WEBPACK_IMPORTED_MODULE_1__commands_trigger_commands__["c" /* ResumeTriggerCommand */](_this._group, _this.name); }
        };
    };
    TriggerViewModel.prototype.getDeleteAction = function () {
        var _this = this;
        return {
            title: 'Delete trigger',
            command: function () { return new __WEBPACK_IMPORTED_MODULE_1__commands_trigger_commands__["d" /* DeleteTriggerCommand */](_this._group, _this.name); }
        };
    };
    TriggerViewModel.prototype.requestCurrentActivityDetails = function () {
        this.timelineSlot.requestCurrentActivityDetails();
    };
    TriggerViewModel.prototype.showDetails = function () {
        this.dialogManager.showModal(new __WEBPACK_IMPORTED_MODULE_2__dialogs_trigger_details_trigger_details_view_model__["a" /* TriggerDetailsViewModel */](this.trigger, this.commandService), function () { });
    };
    return TriggerViewModel;
}(__WEBPACK_IMPORTED_MODULE_3__activity_view_model__["a" /* ManagableActivityViewModel */]));


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 261 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TriggerView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__activity_view__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__nullable_date_view__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__timeline_timeline_slot_view__ = __webpack_require__(274);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__trigger_tmpl_html__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__trigger_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__trigger_tmpl_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__global_actions_separator__ = __webpack_require__(24);
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
        _this.template = __WEBPACK_IMPORTED_MODULE_3__trigger_tmpl_html___default.a;
        return _this;
    }
    TriggerView.prototype.init = function (dom, viewModel) {
        _super.prototype.init.call(this, dom, viewModel);
        dom('.js-timeline-data').render(__WEBPACK_IMPORTED_MODULE_2__timeline_timeline_slot_view__["a" /* default */], viewModel.timelineSlot);
        dom('.status').on('click').react(viewModel.requestCurrentActivityDetails);
        dom('.startDate').observes(viewModel.startDate, __WEBPACK_IMPORTED_MODULE_1__nullable_date_view__["a" /* NullableDateView */]);
        dom('.endDate').observes(viewModel.endDate, __WEBPACK_IMPORTED_MODULE_1__nullable_date_view__["a" /* NullableDateView */]);
        dom('.previousFireDate').observes(viewModel.previousFireDate, __WEBPACK_IMPORTED_MODULE_1__nullable_date_view__["a" /* NullableDateView */]);
        dom('.nextFireDate').observes(viewModel.nextFireDate, __WEBPACK_IMPORTED_MODULE_1__nullable_date_view__["a" /* NullableDateView */]);
        dom('.type').observes(viewModel.triggerType);
        dom('.name').on('click').react(viewModel.showDetails);
        var $row = dom('.js_triggerRow').$;
        dom.manager.manage(viewModel.executing.listen(function (isExecuting) {
            if (isExecuting) {
                $row.addClass("executing");
            }
            else {
                $row.removeClass("executing");
            }
        }));
        /*
        dom.onUnrender().listen(() => {
            dom('.name').$.text(viewModel.name);
            dom('.type').$.text('Trigger complete');

            var $root = dom.root.$;
            $root.css('background', '#CCCCCC');
            $root.fadeOut('slow', () => {
                dom.root.remove();
            });
        });*/
    };
    TriggerView.prototype.composeActions = function (viewModel) {
        return [
            viewModel.pauseAction,
            viewModel.resumeAction,
            new __WEBPACK_IMPORTED_MODULE_4__global_actions_separator__["a" /* default */](),
            viewModel.deleteAction
        ];
    };
    return TriggerView;
}(__WEBPACK_IMPORTED_MODULE_0__activity_view__["a" /* ActivityView */]));



/***/ }),
/* 262 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commands_scheduler_commands__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__command_progress_command_progress_view_model__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dialogs_scheduler_details_scheduler_details_view_model__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__command_action__ = __webpack_require__(43);




var MainHeaderViewModel = (function () {
    function MainHeaderViewModel(timeline, commandService, application, dialogManager) {
        this.timeline = timeline;
        this.commandService = commandService;
        this.application = application;
        this.dialogManager = dialogManager;
        this.name = new js.ObservableValue();
        this.instanceId = js.observableValue();
        this.status = new js.ObservableValue();
        //isRemote = new js.ObservableValue<boolean>();
        //schedulerType = new js.ObservableValue<string>();
        this.startAction = new __WEBPACK_IMPORTED_MODULE_3__command_action__["a" /* default */](this.application, this.commandService, 'Start', function () { return new __WEBPACK_IMPORTED_MODULE_0__commands_scheduler_commands__["a" /* StartSchedulerCommand */](); });
        this.pauseAllAction = new __WEBPACK_IMPORTED_MODULE_3__command_action__["a" /* default */](this.application, this.commandService, 'Pause All', function () { return new __WEBPACK_IMPORTED_MODULE_0__commands_scheduler_commands__["b" /* PauseSchedulerCommand */](); });
        this.resumeAllAction = new __WEBPACK_IMPORTED_MODULE_3__command_action__["a" /* default */](this.application, this.commandService, 'Resume All', function () { return new __WEBPACK_IMPORTED_MODULE_0__commands_scheduler_commands__["c" /* ResumeSchedulerCommand */](); });
        this.standbyAction = new __WEBPACK_IMPORTED_MODULE_3__command_action__["a" /* default */](this.application, this.commandService, 'Standby', function () { return new __WEBPACK_IMPORTED_MODULE_0__commands_scheduler_commands__["d" /* StandbySchedulerCommand */](); });
        this.shutdownAction = new __WEBPACK_IMPORTED_MODULE_3__command_action__["a" /* default */](this.application, this.commandService, 'Shutdown', function () { return new __WEBPACK_IMPORTED_MODULE_0__commands_scheduler_commands__["e" /* StopSchedulerCommand */](); }, 'Are you sure you want to shutdown scheduler?');
        this.commandProgress = new __WEBPACK_IMPORTED_MODULE_1__command_progress_command_progress_view_model__["a" /* default */](this.commandService);
    }
    MainHeaderViewModel.prototype.updateFrom = function (data) {
        this.name.setValue(data.Name);
        this.instanceId.setValue(data.InstanceId);
        this.status.setValue(data.Status);
        //this.isRemote.setValue(data.IsRemote);
        //this.schedulerType.setValue(data.SchedulerTypeName);
        this.startAction.enabled = data.Status === 'ready';
        this.shutdownAction.enabled = (data.Status !== 'shutdown');
        this.standbyAction.enabled = data.Status === 'started';
        this.pauseAllAction.enabled = data.Status === 'started';
        this.resumeAllAction.enabled = data.Status === 'started';
    };
    MainHeaderViewModel.prototype.showSchedulerDetails = function () {
        this.dialogManager.showModal(new __WEBPACK_IMPORTED_MODULE_2__dialogs_scheduler_details_scheduler_details_view_model__["a" /* default */](this.commandService), function (result) { });
    };
    return MainHeaderViewModel;
}());
/* harmony default export */ __webpack_exports__["a"] = (MainHeaderViewModel);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 263 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__timeline_timeline_captions_view__ = __webpack_require__(270);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__command_progress_command_progress_view__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_actions_action_view__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global_actions_actions_utils__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__global_actions_separator__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__header_tmpl_html__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__header_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__header_tmpl_html__);






var MainHeaderView = (function () {
    function MainHeaderView() {
        this.template = __WEBPACK_IMPORTED_MODULE_5__header_tmpl_html___default.a;
    }
    MainHeaderView.prototype.init = function (dom, viewModel) {
        dom('.js_schedulerName').observes(viewModel.name);
        dom('.ticks-container').render(__WEBPACK_IMPORTED_MODULE_0__timeline_timeline_captions_view__["a" /* default */], viewModel.timeline);
        dom('.js_commandProgress').render(__WEBPACK_IMPORTED_MODULE_1__command_progress_command_progress_view__["a" /* default */], viewModel.commandProgress);
        dom('.js_viewDetails').on('click').react(viewModel.showSchedulerDetails);
        var actions = [
            viewModel.pauseAllAction,
            viewModel.resumeAllAction,
            new __WEBPACK_IMPORTED_MODULE_4__global_actions_separator__["a" /* default */](),
            viewModel.standbyAction,
            viewModel.shutdownAction
        ];
        __WEBPACK_IMPORTED_MODULE_3__global_actions_actions_utils__["a" /* default */].render(dom('.js_actions'), actions);
        dom('.js_primaryActions').render(__WEBPACK_IMPORTED_MODULE_2__global_actions_action_view__["a" /* default */], viewModel.startAction);
        //        const js_standby = dom('.js_standby');
        //
        //        js_standby.className('disabled').observes(viewModel.canStandby);
        var $status = dom('.js_schedulerStatus').$ /*,
              startSchedulerDom = dom('.js_startScheduler'),
              shutdownSchedulerDom = dom('.js_shutdownScheduler')*/;
        //        dom.manager.manage(
        //            viewModel.canStart.listen(canStart => {
        //                if (canStart) {
        //                    startSchedulerDom.$
        //                        .addClass('highlight')
        //                        .removeClass('disabled')
        //                        .prop('disabled', false);
        //                } else {
        //                    startSchedulerDom.$
        //                        .addClass('disabled')
        //                        .removeClass('highlight')
        //                        .prop('disabled', true);
        //                }
        //            }));
        /*
        dom.manager.manage(
            viewModel.canShutdown.listen(canShutdown => {
                if (canShutdown) {
                    shutdownSchedulerDom.$.removeClass('disabled');
                } else {
                    shutdownSchedulerDom.$.addClass('disabled');
                }
            }));*/
        dom.manager.manage(viewModel.status.listen(function (newValue, oldValue) {
            if (oldValue) {
                $status.removeClass(oldValue);
            }
            if (newValue) {
                $status.addClass(newValue);
            }
            $status.attr('title', 'Scheduler is ' + newValue);
        }, true));
        //startSchedulerDom.on('click').react(viewModel.startScheduler);
        /*
        shutdownSchedulerDom.on('click').react(() => {
            if (confirm('Are you sure you want to shutdown scheduler?')) {
                viewModel.stopScheduler();
            }
        });*/
    };
    return MainHeaderView;
}());
/* harmony default export */ __webpack_exports__["a"] = (MainHeaderView);


/***/ }),
/* 264 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DefaultNotificationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__notification__ = __webpack_require__(265);

var DefaultNotificationService = (function () {
    function DefaultNotificationService() {
        var _this = this;
        this.notifications = new js.ObservableList();
        window['showError'] = function (m) { return _this.showError(m); };
    }
    DefaultNotificationService.prototype.showError = function (content) {
        var _this = this;
        var notification = new __WEBPACK_IMPORTED_MODULE_0__notification__["a" /* default */](content);
        var toDispose = notification.outdated.listen(function () {
            _this.hide(notification);
            toDispose.dispose();
        });
        this.notifications.add(notification);
    };
    DefaultNotificationService.prototype.hide = function (notification) {
        this.notifications.remove(notification);
    };
    return DefaultNotificationService;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 265 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {var Notification = (function () {
    function Notification(content) {
        this.content = content;
        this.outdated = new js.Event();
        this._timerRef = null;
        this.scheduleClosing();
    }
    Notification.prototype.forceClosing = function () {
        this.clearTimer();
        this.close();
    };
    Notification.prototype.disableClosing = function () {
        this.clearTimer();
    };
    Notification.prototype.enableClosing = function () {
        this.scheduleClosing();
    };
    Notification.prototype.scheduleClosing = function () {
        var _this = this;
        this._timerRef = setTimeout(function () {
            _this.outdated.trigger(null);
            _this.close();
        }, 7000);
    };
    Notification.prototype.close = function () {
        this.outdated.trigger(null);
    };
    Notification.prototype.clearTimer = function () {
        if (this._timerRef) {
            clearTimeout(this._timerRef);
            this._timerRef = null;
        }
    };
    return Notification;
}());
/* harmony default export */ __webpack_exports__["a"] = (Notification);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 266 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var NotificationView = (function () {
    function NotificationView() {
        this.template = "\n<li class=\"showing\">\n    <a href=\"#\" class=\"js_content\"></a>\n</li>";
    }
    NotificationView.prototype.init = function (dom, notification) {
        var $content = dom('.js_content');
        $content.observes(notification.content);
        $content.on('click').react(notification.forceClosing);
        $content.on('mouseenter').react(notification.disableClosing);
        $content.on('mouseleave').react(notification.enableClosing);
        setTimeout(function () {
            dom.$.removeClass('showing');
        });
        var wire = dom.onUnrender().listen(function () {
            dom.$.addClass('hiding');
            setTimeout(function () {
                dom.$.remove();
                wire.dispose();
            }, 500);
        });
    };
    return NotificationView;
}());
var NotificationsView = (function () {
    function NotificationsView() {
        this.template = "<ul class=\"notifications\"></ul>";
    }
    NotificationsView.prototype.init = function (dom, notifications) {
        dom('ul').observes(notifications, NotificationView);
    };
    return NotificationsView;
}());
/* harmony default export */ __webpack_exports__["a"] = (NotificationsView);


/***/ }),
/* 267 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OfflineModeViewModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_timers_retry_timer__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__commands_global_commands__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_date__ = __webpack_require__(10);



var OfflineModeViewModel = (function () {
    function OfflineModeViewModel(initialSince, commandService, application) {
        var _this = this;
        this.initialSince = initialSince;
        this.commandService = commandService;
        this.application = application;
        this._retryTimer = new __WEBPACK_IMPORTED_MODULE_0__global_timers_retry_timer__["a" /* RetryTimer */](function () { return _this.recover(); }, 10, 60 * 3);
        this.retryIn = this._retryTimer.message;
        this.isInProgress = this._retryTimer.isInProgress;
        this.since = new js.ObservableValue();
        this.serverUrl = window.location.href;
    }
    OfflineModeViewModel.prototype.initState = function () {
        var _this = this;
        this.setFormattedSince();
        this._retryTimer
            .start(true)
            .done(function (data) { return _this.handleRecoveredData(data); });
    };
    OfflineModeViewModel.prototype.releaseState = function () {
        this._retryTimer.dispose();
    };
    OfflineModeViewModel.prototype.retryNow = function () {
        this._retryTimer.force();
    };
    OfflineModeViewModel.prototype.recover = function () {
        this.setFormattedSince();
        return this.commandService
            .executeCommand(new __WEBPACK_IMPORTED_MODULE_1__commands_global_commands__["b" /* GetDataCommand */]());
    };
    OfflineModeViewModel.prototype.handleRecoveredData = function (data) {
        this.application.setData(data);
        this.application.goOnline();
    };
    OfflineModeViewModel.prototype.setFormattedSince = function () {
        this.since.setValue(__WEBPACK_IMPORTED_MODULE_2__utils_date__["a" /* default */].smartDateFormat(this.initialSince));
    };
    return OfflineModeViewModel;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 268 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OfflineModeView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__offline_mode_tmpl_html__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__offline_mode_tmpl_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__offline_mode_tmpl_html__);

var OfflineModeView = (function () {
    function OfflineModeView() {
        this.template = __WEBPACK_IMPORTED_MODULE_0__offline_mode_tmpl_html___default.a;
    }
    OfflineModeView.prototype.init = function (dom, viewModel) {
        setTimeout(function () { return dom.root.$.addClass('visible'); }, 100);
        dom('.js_since').observes(viewModel.since);
        dom('.js_address').observes(viewModel.serverUrl);
        dom('.js_retryIn').observes(viewModel.retryIn);
        var $retryNow = dom('.js_retryNow');
        $retryNow.on('click').react(viewModel.retryNow);
        $retryNow.className('disabled').observes(viewModel.isInProgress);
    };
    return OfflineModeView;
}());



/***/ }),
/* 269 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js, $) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommandService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_assign__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_map__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_max__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_max___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_max__);



var CommandService = (function () {
    function CommandService() {
        this.onCommandStart = new js.Event();
        this.onCommandComplete = new js.Event();
        this.onCommandFailed = new js.Event();
        this.onEvent = new js.Event();
        this.onDisconnected = new js.Event();
        this._minEventId = 0;
    }
    CommandService.prototype.resetEvents = function () {
        this._minEventId = 0;
    };
    CommandService.prototype.executeCommand = function (command) {
        var _this = this;
        var result = $.Deferred(), data = __WEBPACK_IMPORTED_MODULE_0_lodash_assign___default()(command.data, { command: command.code, minEventId: this._minEventId }), that = this;
        this.onCommandStart.trigger(command);
        $.post('', data)
            .done(function (response) {
            var comandResult = response;
            if (comandResult._ok) {
                var mappedResult = command.mapper ? command.mapper(response) : response;
                result.resolve(mappedResult);
                /* Events handling */
                var eventsResult = mappedResult, events = eventsResult.Events;
                if (events && events.length > 0) {
                    for (var i = 0; i < events.length; i++) {
                        _this.onEvent.trigger(events[i]);
                    }
                    _this._minEventId = __WEBPACK_IMPORTED_MODULE_2_lodash_max___default()(__WEBPACK_IMPORTED_MODULE_1_lodash_map___default()(events, function (e) { return e.id; }));
                }
            }
            else {
                result.reject({
                    errorMessage: comandResult._err,
                    details: null
                });
            }
            return response;
        })
            .fail(function () {
            _this.onDisconnected.trigger();
            result.reject({
                disconnected: true,
                errorMessage: 'Server is not available'
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


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0), __webpack_require__(2)))

/***/ }),
/* 270 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__timeline_tick_view__ = __webpack_require__(276);

var TimelineCaptionsView = (function () {
    function TimelineCaptionsView() {
        this.template = '<ul class="timeline-captions"></ul>';
    }
    TimelineCaptionsView.prototype.init = function (dom, timeline) {
        var $ticks = dom('.timeline-captions');
        $ticks.observes(timeline.ticks.items, __WEBPACK_IMPORTED_MODULE_0__timeline_tick_view__["a" /* default */]);
        $ticks.$.css('width', (100 + 100 * timeline.ticks.millisecondsPerTick / timeline.timelineSizeMilliseconds) + '%');
        var wire = timeline.ticks.shift.listen(function (shiftPercent) {
            $ticks.$.css('left', (-shiftPercent) + '%');
        });
        dom.manager.manage(wire);
    };
    return TimelineCaptionsView;
}());
/* harmony default export */ __webpack_exports__["a"] = (TimelineCaptionsView);


/***/ }),
/* 271 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var TimelineGlobalActivityView = (function () {
    function TimelineGlobalActivityView() {
        this.template = "<div class=\"timeline-global-item\">\n            <span class=\"timeline-marker-pick js_tooltip_trigger\"></span>\n            <span class=\"timeline-marker-arrow js_tooltip_trigger\"></span>\n            <span class=\"timeline-marker-body js_tooltip_trigger\"></span>\n        </div>";
    }
    TimelineGlobalActivityView.prototype.init = function (dom, activity) {
        var $root = dom.root.$ /*,
              $tooltip = dom('.js_tooltip').$,
              $tooltipContent = $tooltip.find('.content')*/;
        dom.$.addClass(activity.typeCode);
        //$tooltipContent.text(activity.description);
        /*
        if (activity.typeCode === 'paused') {
            $tooltip.addClass('left');
        } else {
            $tooltip.addClass('right');
        }*/
        //var tooltipHideTrigger = null;
        dom('.js_tooltip_trigger, .js_tooltip').on('mouseenter').react(function () {
            activity.requestSelection();
            //            if (tooltipHideTrigger === null) {
            //                activity.requestSelection();
            //
            //                $tooltip
            //                    .css('opacity', '1')
            //                    .css('visibility', 'visible');
            //            } else {
            //                clearTimeout(tooltipHideTrigger);
            //                tooltipHideTrigger = null;
            //}
        });
        dom('.js_tooltip_trigger, .js_tooltip').on('mouseleave').react(function () {
            activity.requestDeselection();
            //            tooltipHideTrigger = setTimeout(() => {
            //                $tooltip
            //                    .css('opacity', '0')
            //                    .css('visibility', 'hidden');
            //                tooltipHideTrigger = null;
            //            }, 2000);
        });
        dom.manager.manage(activity.position.listen(function (position) {
            if (!position) {
                return;
            }
            $root.css('left', position.left + '%');
        }));
        dom.manager.manage(activity.verticalPosition.listen(function (position) {
            if (!position) {
                return;
            }
            $root
                .css('top', (position.top * 20) + 'px')
                .css('height', (position.height * 20) + 'px');
        }));
    };
    ;
    return TimelineGlobalActivityView;
}());
/* harmony default export */ __webpack_exports__["a"] = (TimelineGlobalActivityView);
;


/***/ }),
/* 272 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimelineGlobalActivity; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__timeline_activity__ = __webpack_require__(96);
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

var TimelineGlobalActivity = (function (_super) {
    __extends(TimelineGlobalActivity, _super);
    function TimelineGlobalActivity(globalOptions, requestSelectionCallback) {
        var _this = _super.call(this, { startedAt: globalOptions.occurredAt, completedAt: globalOptions.occurredAt, key: null }, requestSelectionCallback) || this;
        _this.globalOptions = globalOptions;
        _this.verticalPosition = new js.ObservableValue();
        return _this;
    }
    Object.defineProperty(TimelineGlobalActivity.prototype, "typeCode", {
        get: function () { return this.globalOptions.typeCode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimelineGlobalActivity.prototype, "scope", {
        get: function () { return this.globalOptions.scope; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimelineGlobalActivity.prototype, "itemKey", {
        get: function () { return this.globalOptions.itemKey; },
        enumerable: true,
        configurable: true
    });
    TimelineGlobalActivity.prototype.updateVerticalPostion = function (top, height) {
        this.verticalPosition.setValue({
            top: top,
            height: height
        });
    };
    return TimelineGlobalActivity;
}(__WEBPACK_IMPORTED_MODULE_0__timeline_activity__["a" /* default */]));


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 273 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimelineInitializer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__timeline__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__global_activities_synchronizer__ = __webpack_require__(249);



var TimelineInitializer = (function () {
    function TimelineInitializer(timelineSizeMilliseconds) {
        this.timeline = new __WEBPACK_IMPORTED_MODULE_0__timeline__["a" /* default */](timelineSizeMilliseconds);
        this.globalActivitiesSynchronizer = new __WEBPACK_IMPORTED_MODULE_2__global_activities_synchronizer__["a" /* default */](this.timeline);
    }
    TimelineInitializer.prototype.start = function (eventsSource) {
        var _this = this;
        this.timeline.init();
        eventsSource.listen(function (event) { return _this.handleEvent(event); });
    };
    TimelineInitializer.prototype.handleEvent = function (event) {
        var scope = event.scope, eventType = event.eventType, isGlobal = !(scope === __WEBPACK_IMPORTED_MODULE_1__api__["c" /* SchedulerEventScope */].Trigger && (eventType === __WEBPACK_IMPORTED_MODULE_1__api__["d" /* SchedulerEventType */].Fired || eventType === __WEBPACK_IMPORTED_MODULE_1__api__["d" /* SchedulerEventType */].Complete));
        if (isGlobal) {
            var typeCode = __WEBPACK_IMPORTED_MODULE_1__api__["d" /* SchedulerEventType */][eventType].toLowerCase(), options = {
                occurredAt: event.date,
                typeCode: typeCode,
                itemKey: this.globalActivitiesSynchronizer.makeSlotKey(scope, event.itemKey),
                scope: scope
            }, globalActivity = this.timeline.addGlobalActivity(options);
            this.globalActivitiesSynchronizer.updateActivity(globalActivity);
        }
        else {
            var slotKey = this.globalActivitiesSynchronizer.makeSlotKey(scope, event.itemKey), activityKey = event.fireInstanceId;
            if (eventType === __WEBPACK_IMPORTED_MODULE_1__api__["d" /* SchedulerEventType */].Fired) {
                var slot = this.timeline.findSlotBy(slotKey) || this.timeline.addSlot({ key: slotKey }), existingActivity = slot.findActivityBy(activityKey);
                if (!existingActivity) {
                    this.timeline.addActivity(slot, {
                        key: activityKey,
                        startedAt: event.date
                    });
                }
            }
            else if (eventType === __WEBPACK_IMPORTED_MODULE_1__api__["d" /* SchedulerEventType */].Complete) {
                var completeSlot = this.timeline.findSlotBy(slotKey), activity = !!completeSlot ?
                    completeSlot.findActivityBy(activityKey) :
                    (this.timeline.preservedActivity && this.timeline.preservedActivity.key === activityKey ? this.timeline.preservedActivity : null);
                if (activity) {
                    activity.complete(event.date, {
                        faulted: event.faulted,
                        errors: event.errors
                    });
                }
            }
        }
    };
    return TimelineInitializer;
}());



/***/ }),
/* 274 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var TimelineActivityView = (function () {
    function TimelineActivityView() {
        this.template = '<div class="timeline-item"></div>';
    }
    TimelineActivityView.prototype.init = function (dom, activity) {
        var $root = dom.root.$;
        dom.$.addClass('key-' + activity.key);
        dom('.timeline-item').on('mouseenter').react(function () { return activity.requestSelection(); });
        dom('.timeline-item').on('mouseleave').react(function () { return activity.requestDeselection(); });
        dom('.timeline-item').on('click').react(function () { return activity.requestDetails(); });
        var wire = activity.position.listen(function (position) {
            if (!position) {
                return;
            }
            $root
                .css('left', position.left + '%')
                .css('width', position.width + '%');
        });
        var faultedClassUpdater = function () {
            if (activity.faulted) {
                dom.$.addClass('faulted');
            }
        };
        dom.manager.manage(activity.completed.listen(function (completionOptions) {
            faultedClassUpdater();
        }));
        dom.manager.manage(wire);
        faultedClassUpdater();
    };
    ;
    return TimelineActivityView;
}());
;
var TimelineSlotView = (function () {
    function TimelineSlotView() {
        this.template = '<div class="timeline-slot"><section class="timeline-slot-activities"></section></div>';
    }
    TimelineSlotView.prototype.init = function (dom, slot) {
        dom('.timeline-slot-activities').observes(slot.activities, TimelineActivityView);
    };
    ;
    return TimelineSlotView;
}());
/* harmony default export */ __webpack_exports__["a"] = (TimelineSlotView);
;


/***/ }),
/* 275 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__timeline_activity__ = __webpack_require__(96);

var TimelineSlot = (function () {
    function TimelineSlot(options) {
        this.activities = new js.ObservableList();
        this.key = options.key;
    }
    TimelineSlot.prototype.add = function (activity, selectionRequestCallback) {
        var result = new __WEBPACK_IMPORTED_MODULE_0__timeline_activity__["a" /* default */](activity, function (requestType) { return selectionRequestCallback(result, requestType); });
        this.activities.add(result);
        return result;
    };
    ;
    TimelineSlot.prototype.remove = function (activity) {
        this.activities.remove(activity);
    };
    ;
    /**
     * Removes all activities from the slot
     */
    TimelineSlot.prototype.clear = function () {
        this.activities.clear();
    };
    TimelineSlot.prototype.isEmpty = function () {
        return this.activities.getValue().length === 0;
    };
    ;
    TimelineSlot.prototype.isBusy = function () {
        return !!this.findCurrentActivity();
    };
    TimelineSlot.prototype.recalculate = function (range) {
        var activities = this.activities.getValue(), rangeStart = range.start, rangeEnd = range.end, removed = [];
        for (var i = 0; i < activities.length; i++) {
            var activity = activities[i];
            if (!activity.recalculate(rangeStart, rangeEnd)) {
                this.activities.remove(activity);
                removed.push(activity);
            }
        }
        return {
            isEmpty: this.isEmpty(),
            removedActivities: removed
        };
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
    TimelineSlot.prototype.requestCurrentActivityDetails = function () {
        var currentActivity = this.findCurrentActivity();
        if (currentActivity) {
            currentActivity.requestDetails();
        }
    };
    TimelineSlot.prototype.findCurrentActivity = function () {
        var activities = this.activities.getValue();
        for (var i = activities.length - 1; i >= 0; i--) {
            if (!activities[i].completedAt) {
                return activities[i];
            }
        }
        return null;
    };
    return TimelineSlot;
}());
/* harmony default export */ __webpack_exports__["a"] = (TimelineSlot);
;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 276 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_date__ = __webpack_require__(10);

var TimelineTickView = (function () {
    function TimelineTickView() {
        this.template = '<li class="timeline-tick"><span></span></li>';
    }
    TimelineTickView.prototype.init = function (dom, viewModel) {
        dom('span').observes(this.formatDate(new Date(viewModel.tickDate)));
        dom.root.$.css('width', viewModel.width + '%');
    };
    ;
    TimelineTickView.prototype.formatDate = function (date) {
        return __WEBPACK_IMPORTED_MODULE_0__utils_date__["a" /* default */].timeFormat(date);
        /* todo: cross-culture implementation */
        /*
        var minutes = date.getMinutes(),
            seconds = date.getSeconds();

        return date.getHours() + ':' +
            (minutes <= 9 ? '0' : '') + minutes +
            ':' +
            (seconds <= 9 ? '0' : '') + seconds;*/
    };
    return TimelineTickView;
}());
/* harmony default export */ __webpack_exports__["a"] = (TimelineTickView);


/***/ }),
/* 277 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {var TimelineTicks = (function () {
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
/* harmony default export */ __webpack_exports__["a"] = (TimelineTicks);
;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 278 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($, js) {/* unused harmony export TriggerActivityTooltipView */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__main_content_nullable_date_view__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__timeline_activity_view_model__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global_activities_activity_state_view__ = __webpack_require__(90);




var RenderedTooltip = (function () {
    function RenderedTooltip($root, positionListener, renderedView) {
        this.$root = $root;
        this.positionListener = positionListener;
        this.renderedView = renderedView;
    }
    RenderedTooltip.prototype.dispose = function () {
        var _this = this;
        this.$root.find('.js_actual_content').removeClass('js_actual_content');
        this.$root.addClass('closing');
        setTimeout(function () {
            _this.$root.remove();
            _this.positionListener.dispose();
            _this.renderedView.dispose();
        }, 1000);
    };
    return RenderedTooltip;
}());
var TimelineTooltipsView = (function () {
    function TimelineTooltipsView(globalActivitiesSynchronizer) {
        this.globalActivitiesSynchronizer = globalActivitiesSynchronizer;
    }
    TimelineTooltipsView.prototype.render = function (dom, timeline) {
        var _this = this;
        var currentTooltip = null;
        var disposeCurrentTooltip = function () {
            if (currentTooltip) {
                currentTooltip.dispose();
                currentTooltip = null;
            }
        };
        var localTooltipWidth = 300, localTooltipWidthHalf = localTooltipWidth / 2, localTooltipPickMargin = 6, localTooltipMinLeftArrowMargin = 6;
        timeline.selectedActivity.listen(function (data) {
            disposeCurrentTooltip();
            if (data) {
                var activity = data.activity, isGlobal_1 = data.slot === null;
                var $currentTooltip = $("<div class=\"timeline-tooltip js_tooltip\">\n                        <div class=\"arrow\"></div>\n                        <div class=\"content js_actual_content\"></div>\n                    </div>"), $currentTooltipContent = $currentTooltip.find('.content');
                if (!isGlobal_1) {
                    $currentTooltip.addClass('local');
                    $currentTooltip.css('bottom', (_this.globalActivitiesSynchronizer.getSlotIndex(data.slot, true) * 20) + 'px');
                }
                else {
                    var globalActivity = activity;
                    $currentTooltip.addClass('global');
                    $currentTooltip.addClass(globalActivity.typeCode);
                    $currentTooltip.css('top', (globalActivity.verticalPosition.getValue().top * 20) + 'px');
                }
                var positionListener = activity.position.listen(function (p) {
                    if (p) {
                        if (isGlobal_1) {
                            $currentTooltip.css('left', p.left + '%');
                        }
                        else {
                            var containerWidth = dom.$.width(), tooltipPointerOriginPercent = p.left + p.width / 2, tooltipOrigin = containerWidth * tooltipPointerOriginPercent / 100 - localTooltipPickMargin;
                            var contentLeft = void 0;
                            if (tooltipOrigin < localTooltipWidthHalf) {
                                contentLeft = tooltipOrigin >= localTooltipMinLeftArrowMargin ? -tooltipOrigin : -localTooltipMinLeftArrowMargin;
                            }
                            else if (tooltipOrigin + localTooltipWidthHalf > containerWidth) {
                                contentLeft = -(localTooltipWidth - (containerWidth - tooltipOrigin));
                            }
                            else {
                                contentLeft = -localTooltipWidthHalf;
                            }
                            $currentTooltipContent.css('left', contentLeft + 'px');
                            $currentTooltip.css('left', tooltipPointerOriginPercent + '%');
                        }
                    }
                });
                dom.$.append($currentTooltip);
                var renderedView = js.dom('.js_tooltip .js_actual_content')
                    .render(isGlobal_1 ? GlobalActivityTooltipView : TriggerActivityTooltipView, activity);
                currentTooltip = new RenderedTooltip($currentTooltip, positionListener, renderedView);
                setTimeout(function () {
                    if (currentTooltip) {
                        currentTooltip.$root.addClass('visible');
                    }
                }, 100);
                $currentTooltip.on('mouseenter', function () { return timeline.preserveCurrentSelection(); });
                $currentTooltip.on('mouseleave', function () { return timeline.resetCurrentSelection(); });
            }
        });
    };
    TimelineTooltipsView.prototype.dispose = function () {
    };
    return TimelineTooltipsView;
}());
/* harmony default export */ __webpack_exports__["a"] = (TimelineTooltipsView);
var GlobalActivityTooltipView = (function () {
    function GlobalActivityTooltipView() {
        this.template = "<p class=\"tooltip-content\"><span class=\"js_message\"></span> at </p>\n<p class=\"tooltip-content\"><span class=\"js_date\"></span></p>";
    }
    GlobalActivityTooltipView.prototype.init = function (dom, viewModel) {
        dom('.js_message').observes(__WEBPACK_IMPORTED_MODULE_0__api__["c" /* SchedulerEventScope */][viewModel.scope] + ' ' + viewModel.typeCode);
        dom('.js_date').observes(new __WEBPACK_IMPORTED_MODULE_0__api__["f" /* NullableDate */](viewModel.startedAt), __WEBPACK_IMPORTED_MODULE_1__main_content_nullable_date_view__["a" /* NullableDateView */]);
    };
    return GlobalActivityTooltipView;
}());
var TriggerActivityTooltipView = (function () {
    function TriggerActivityTooltipView() {
        this.template = "<table class=\"tooltip-content\">\n    <tr>\n        <td rowspan=\"3\" class=\"js_state icon-only\" style=\"padding: 3px 0 0 0; vertical-align: top;\"></td>\n        <th>Trigger fired at</th>\n        <td class=\"js_startedAt\"></td>\n        \n    </tr>\n    <tr>\n        <th>Trigger completed at</th>\n        <td class=\"js_completedAt\"></td>\n    </tr>\n    <tr>\n        <th>Duration</th>\n        <td style=\"color: #dec82f;\">\n            <span class=\"js_durationValue\"></span>\n            <span class=\"js_durationUnit\"></span>\n        </td>\n    </tr>\n</table>";
    }
    TriggerActivityTooltipView.prototype.init = function (dom, viewModel) {
        var activityViewModel = new __WEBPACK_IMPORTED_MODULE_2__timeline_activity_view_model__["a" /* TimelineActivityViewModel */](viewModel);
        dom.manager.manage(activityViewModel);
        var duration = activityViewModel.duration;
        dom('.js_durationValue').observes(duration.value);
        dom('.js_durationUnit').observes(duration.measurementUnit);
        dom('.js_startedAt').observes(new __WEBPACK_IMPORTED_MODULE_0__api__["f" /* NullableDate */](viewModel.startedAt), __WEBPACK_IMPORTED_MODULE_1__main_content_nullable_date_view__["a" /* NullableDateView */]);
        dom('.js_completedAt').observes(activityViewModel.completedAt, __WEBPACK_IMPORTED_MODULE_1__main_content_nullable_date_view__["a" /* NullableDateView */]);
        dom('.js_state').observes(activityViewModel.status, __WEBPACK_IMPORTED_MODULE_3__global_activities_activity_state_view__["a" /* ActivityStateView */]);
        activityViewModel.init();
    };
    return TriggerActivityTooltipView;
}());


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2), __webpack_require__(0)))

/***/ }),
/* 279 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(js) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__timeline_slot__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__timeline_ticks__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__timeline_global_activity__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__global_timers_timer__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_each__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_each___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash_each__);






var Timeline = (function () {
    function Timeline(timelineSizeMilliseconds) {
        this.timelineSizeMilliseconds = timelineSizeMilliseconds;
        this._timeRef = null;
        this._resetSelectionTimer = new __WEBPACK_IMPORTED_MODULE_4__global_timers_timer__["a" /* Timer */]();
        this.globalSlot = new __WEBPACK_IMPORTED_MODULE_1__timeline_slot__["a" /* default */]({ key: ' timeline_global' });
        this.range = new js.ObservableValue();
        this.slots = new js.ObservableList();
        this.ticks = new __WEBPACK_IMPORTED_MODULE_2__timeline_ticks__["a" /* default */](10, this.timelineSizeMilliseconds);
        this.selectedActivity = new js.ObservableValue();
        this.detailsRequested = new js.Event();
        /**
         * We remember the activity that is displayed
         * in the tooltip or details dialog to update
         * it in case of removing of the corresponding
         * slot from the timeline.
         */
        this.preservedActivity = null;
    }
    Timeline.prototype.init = function () {
        var _this = this;
        this.ticks.init();
        this.updateInterval();
        this._timeRef = setInterval(function () {
            _this.updateInterval();
        }, 1000);
    };
    Timeline.prototype.activityInteractionRequestHandler = function (slot, activity, requestType) {
        switch (requestType) {
            case __WEBPACK_IMPORTED_MODULE_0__common__["a" /* ActivityInteractionRequest */].ShowTooltip:
                {
                    var currentSelection = this.selectedActivity.getValue();
                    if (!currentSelection || currentSelection.activity !== activity) {
                        this.preservedActivity = activity;
                        this.selectedActivity.setValue({
                            activity: activity,
                            slot: slot
                        });
                    }
                    this.preserveCurrentSelection();
                    break;
                }
            case __WEBPACK_IMPORTED_MODULE_0__common__["a" /* ActivityInteractionRequest */].HideTooltip:
                {
                    this.resetCurrentSelection();
                    break;
                }
            case __WEBPACK_IMPORTED_MODULE_0__common__["a" /* ActivityInteractionRequest */].ShowDetails:
                {
                    /**
                     * We hide current tooltip bacause it
                     * does not make any sense to show it
                     * if details dialog is visible.
                     */
                    this.hideTooltip();
                    this.preservedActivity = activity;
                    this.detailsRequested.trigger(activity);
                    break;
                }
        }
    };
    Timeline.prototype.preserveCurrentSelection = function () {
        this._resetSelectionTimer.reset();
    };
    Timeline.prototype.resetCurrentSelection = function () {
        var _this = this;
        this._resetSelectionTimer.schedule(function () {
            _this.hideTooltip();
        }, 2000);
    };
    Timeline.prototype.addSlot = function (slotOptions) {
        var result = new __WEBPACK_IMPORTED_MODULE_1__timeline_slot__["a" /* default */](slotOptions);
        this.slots.add(result);
        return result;
    };
    ;
    Timeline.prototype.removeSlot = function (slot) {
        this.slots.remove(slot);
    };
    Timeline.prototype.addActivity = function (slot, activityOptions) {
        var _this = this;
        var actualActivity = slot.add(activityOptions, function (activity, requestType) { return _this.activityInteractionRequestHandler(slot, activity, requestType); });
        this.recalculateSlot(slot, this.range.getValue());
        return actualActivity;
    };
    Timeline.prototype.addGlobalActivity = function (options) {
        var _this = this;
        var activity = new __WEBPACK_IMPORTED_MODULE_3__timeline_global_activity__["a" /* TimelineGlobalActivity */](options, function (requestType) { return _this.activityInteractionRequestHandler(null, activity, requestType); });
        this.globalSlot.activities.add(activity);
        this.recalculateSlot(this.globalSlot, this.range.getValue());
        return activity;
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
    Timeline.prototype.getGlobalActivities = function () {
        return this.globalSlot.activities.getValue();
    };
    Timeline.prototype.clearSlots = function () {
        var slots = this.slots.getValue();
        for (var i = 0; i < slots.length; i++) {
            slots[i].clear();
        }
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
        this.recalculateSlot(this.globalSlot, range);
    };
    Timeline.prototype.recalculateSlot = function (slot, range) {
        var _this = this;
        if (!range) {
            return;
        }
        var slotRecalculateResult = slot.recalculate(range), currentTooltipActivityData = this.selectedActivity.getValue();
        if (currentTooltipActivityData && currentTooltipActivityData.slot === slot) {
            /**
             * We need to check if visible tooltip's
             * activity is not the one that has just been
             * removed from the timeline.
             */
            __WEBPACK_IMPORTED_MODULE_5_lodash_each___default()(slotRecalculateResult.removedActivities || [], function (x) {
                if (currentTooltipActivityData.activity === x) {
                    _this.hideTooltip();
                }
            });
        }
    };
    Timeline.prototype.hideTooltip = function () {
        this.selectedActivity.setValue(null);
        this.preservedActivity = null;
    };
    return Timeline;
}());
/* harmony default export */ __webpack_exports__["a"] = (Timeline);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 280 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var NumberUtils = (function () {
    function NumberUtils() {
    }
    NumberUtils.formatLargeNumber = function (value) {
        if (value === null || value === undefined) {
            return null;
        }
        // just a simple optimization for small numbers as it is a common case
        if (value < this.THRESHOLDS[this.THRESHOLDS.length - 1].value) {
            return value.toString();
        }
        for (var i = 0; i < this.THRESHOLDS.length; i++) {
            var thresholdValue = this.THRESHOLDS[i].value;
            if (value > thresholdValue) {
                return Math.floor(value / thresholdValue).toString() + this.THRESHOLDS[i].suffix;
            }
        }
        return value.toString();
    };
    return NumberUtils;
}());
/* harmony default export */ __webpack_exports__["a"] = (NumberUtils);
NumberUtils.THRESHOLDS = [
    { value: 1000000000, suffix: 'B' },
    { value: 1000000, suffix: 'M' },
    { value: 1000, suffix: 'K' }
];


/***/ }),
/* 281 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FakeSchedulerServer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fake_scheduler__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_map__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_map__);



var FakeSchedulerServer = (function () {
    function FakeSchedulerServer(options) {
        var _this = this;
        this._scheduler = new __WEBPACK_IMPORTED_MODULE_0__fake_scheduler__["a" /* FakeScheduler */](options.schedulerName, options.schedule);
        this._commandHandlers = {
            'get_env': function () { return ({
                _ok: 1,
                sv: options.version,
                qv: options.quartzVersion,
                dnv: options.dotNetVersion,
                ts: options.timelineSpan
            }); },
            'get_input_types': function (args) { return ({
                _ok: 1,
                i: [
                    { "_": 'string', l: 'string' },
                    { "_": 'int', l: 'int' },
                    { "_": 'long', l: 'long' },
                    { "_": 'float', l: 'float' },
                    { "_": 'double', l: 'double' },
                    { "_": 'boolean', l: 'boolean', v: 1 },
                    { "_": 'ErrorTest', l: 'Error test' }
                ]
            }); },
            'get_input_type_variants': function (args) { return ({
                _ok: 1,
                i: [
                    { "_": 'true', l: 'True' },
                    { "_": 'false', l: 'False' }
                ]
            }); },
            'get_data': function (args) {
                return _this.mapCommonData(args);
            },
            'resume_trigger': function (args) {
                _this._scheduler.resumeTrigger(args.trigger);
                return _this.mapCommonData(args);
            },
            'pause_trigger': function (args) {
                _this._scheduler.pauseTrigger(args.trigger);
                return _this.mapCommonData(args);
            },
            'delete_trigger': function (args) {
                _this._scheduler.deleteTrigger(args.trigger);
                return _this.mapCommonData(args);
            },
            'pause_job': function (args) {
                _this._scheduler.pauseJob(args.group, args.job);
                return _this.mapCommonData(args);
            },
            'resume_job': function (args) {
                _this._scheduler.resumeJob(args.group, args.job);
                return _this.mapCommonData(args);
            },
            'delete_job': function (args) {
                _this._scheduler.deleteJob(args.group, args.job);
                return _this.mapCommonData(args);
            },
            'pause_group': function (args) {
                _this._scheduler.pauseGroup(args.group);
                return _this.mapCommonData(args);
            },
            'resume_group': function (args) {
                _this._scheduler.resumeGroup(args.group);
                return _this.mapCommonData(args);
            },
            'delete_group': function (args) {
                _this._scheduler.deleteGroup(args.group);
                return _this.mapCommonData(args);
            },
            'get_scheduler_details': function (args) { return ({
                _ok: 1,
                ism: _this._scheduler.status === __WEBPACK_IMPORTED_MODULE_1__app_api__["a" /* SchedulerStatus */].Ready,
                jsc: false,
                jsp: false,
                je: _this._scheduler.jobsExecuted,
                rs: _this._scheduler.startedAt,
                siid: 'IN_BROWSER',
                sn: _this._scheduler.name,
                isr: false,
                t: null,
                isd: _this._scheduler.status === __WEBPACK_IMPORTED_MODULE_1__app_api__["a" /* SchedulerStatus */].Shutdown,
                ist: _this._scheduler.status === __WEBPACK_IMPORTED_MODULE_1__app_api__["a" /* SchedulerStatus */].Started,
                tps: 1,
                tpt: null,
                v: 'In-Browser Emulation'
            }); },
            'get_job_details': function (args) { return ({
                _ok: true,
                jd: {
                    ced: true,
                    ds: '',
                    pjd: false,
                    d: false,
                    t: 'SampleJob|Sample|InBrowser',
                    rr: false // RequestsRecovery
                },
                jdm: {
                    '_': 'object',
                    v: {
                        'Test1': { '_': 'single', k: 1, v: 'String value' },
                        'Test2': {
                            '_': 'object',
                            k: 1,
                            v: {
                                "FirstName": { '_': 'single', v: 'John' },
                                "LastName": { '_': 'single', v: 'Smith' },
                                "TestError": { '_': 'error', _err: 'Exception text' }
                            }
                        },
                        'Test3': {
                            '_': 'enumerable',
                            v: [
                                { '_': 'single', v: 'Value 1' },
                                { '_': 'single', v: 'Value 2' },
                                { '_': 'single', v: 'Value 3' }
                            ]
                        }
                    }
                } // todo: take actual from job
            }); },
            'start_scheduler': function (args) {
                _this._scheduler.start();
                return _this.mapCommonData(args);
            },
            'pause_scheduler': function (args) {
                _this._scheduler.pauseAll();
                return _this.mapCommonData(args);
            },
            'resume_scheduler': function (args) {
                _this._scheduler.resumeAll();
                return _this.mapCommonData(args);
            },
            'standby_scheduler': function (args) {
                _this._scheduler.standby();
                return _this.mapCommonData(args);
            },
            'stop_scheduler': function (args) {
                _this._scheduler.shutdown();
                return _this.mapCommonData(args);
            },
            'add_trigger': function (args) {
                var triggerType = args.triggerType;
                var i = 0, errors = null;
                while (args['jobDataMap[' + i + '].Key']) {
                    if (args['jobDataMap[' + i + '].InputTypeCode'] === 'ErrorTest') {
                        errors = errors || {};
                        errors[args['jobDataMap[' + i + '].Key']] = 'Testing error message';
                    }
                    i++;
                }
                if (args.JobDataMapItem)
                    if (triggerType !== 'Simple') {
                        return {
                            _err: 'Only "Simple" trigger type is supported by in-browser fake scheduler implementation'
                        };
                    }
                var job = args.job, group = args.group, name = args.name, trigger = {
                    repeatCount: args.repeatForever ? null : args.repeatCount,
                    repeatInterval: args.repeatInterval
                };
                _this._scheduler.triggerJob(group, job, name, trigger);
                var result = _this.mapCommonData(args);
                result.ve = errors;
                return result;
            },
            'execute_job': function (args) {
                _this._scheduler.executeNow(args.group, args.job);
                return _this.mapCommonData(args);
            }
        };
        this._scheduler.init();
        this._scheduler.start();
    }
    FakeSchedulerServer.prototype.handleRequest = function (data) {
        var handler = this._commandHandlers[data.command];
        if (handler) {
            return handler(data);
        }
        return { _err: 'Fake scheduler server does not support command ' + data.command };
    };
    FakeSchedulerServer.prototype.mapCommonData = function (args) {
        var scheduler = this._scheduler, data = scheduler.getData();
        return {
            _ok: 1,
            sim: scheduler.startedAt,
            rs: scheduler.startedAt,
            n: data.name,
            st: scheduler.status.code,
            je: scheduler.jobsExecuted,
            jt: data.jobsCount,
            ip: __WEBPACK_IMPORTED_MODULE_2_lodash_map___default()(scheduler.inProgress, function (ip) { return ip.fireInstanceId + '|' + ip.trigger.name; }),
            jg: __WEBPACK_IMPORTED_MODULE_2_lodash_map___default()(data.groups, function (g) { return ({
                n: g.name,
                s: g.getStatus().value,
                jb: __WEBPACK_IMPORTED_MODULE_2_lodash_map___default()(g.jobs, function (j) { return ({
                    n: j.name,
                    s: j.getStatus().value,
                    gn: g.name,
                    _: g.name + '_' + j.name,
                    tr: __WEBPACK_IMPORTED_MODULE_2_lodash_map___default()(j.triggers, function (t) { return ({
                        '_': t.name,
                        n: t.name,
                        s: t.getStatus().value,
                        sd: t.startDate,
                        ed: t.endDate,
                        nfd: t.nextFireDate,
                        pfd: t.previousFireDate,
                        tc: 'simple',
                        tb: (t.repeatCount === null ? '-1' : t.repeatCount.toString()) + '|' + t.repeatInterval + '|' + t.executedCount
                    }); })
                }); })
            }); }),
            ev: __WEBPACK_IMPORTED_MODULE_2_lodash_map___default()(scheduler.findEvents(+args.minEventId), function (ev) {
                var result = {
                    '_': ev.id + "|" + ev.date + "|" + ev.eventType + "|" + ev.scope,
                    k: ev.itemKey,
                    fid: ev.fireInstanceId
                };
                if (ev.faulted) {
                    result['_err'] = ev.errors ?
                        __WEBPACK_IMPORTED_MODULE_2_lodash_map___default()(ev.errors, function (er) { return ({ "_": er.text, l: er.level }); }) :
                        1;
                }
                return result;
            }
            //`${ev.id}|${ev.date}|${ev.eventType}|${ev.scope}|${ev.fireInstanceId}|${ev.itemKey}`
            )
        };
    };
    return FakeSchedulerServer;
}());



/***/ }),
/* 282 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Activity */
/* unused harmony export CompositeActivity */
/* unused harmony export JobGroup */
/* unused harmony export Job */
/* unused harmony export Trigger */
/* unused harmony export SchedulerEvent */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FakeScheduler; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_api__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_filter__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_map__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_each__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_each___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash_each__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_keys__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_lodash_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_min__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash_min__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash_flatMap__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash_flatMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_lodash_flatMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_lodash_some__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_lodash_some___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_lodash_some__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_lodash_find__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_lodash_find___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_lodash_find__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__app_global_timers_timer__ = __webpack_require__(15);
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










var Activity = (function () {
    function Activity(name) {
        this.name = name;
    }
    return Activity;
}());

var CompositeActivity = (function (_super) {
    __extends(CompositeActivity, _super);
    function CompositeActivity(name) {
        return _super.call(this, name) || this;
    }
    CompositeActivity.prototype.getStatus = function () {
        var activities = this.getNestedActivities(), activitiesCount = activities.length;
        if (activitiesCount === 0) {
            return __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Complete;
        }
        var activeCount = 0, completeCount = 0, pausedCount = 0;
        for (var i = 0; i < activitiesCount; i++) {
            var activity = activities[i], status_1 = activity.getStatus();
            if (status_1 === __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Mixed) {
                return __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Mixed;
            }
            else if (status_1 === __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Active) {
                activeCount++;
            }
            else if (status_1 === __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Paused) {
                pausedCount++;
            }
            else if (status_1 === __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Complete) {
                completeCount++;
            }
        }
        if (activeCount === activitiesCount) {
            return __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Active;
        }
        if (pausedCount === activitiesCount) {
            return __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Paused;
        }
        if (completeCount === activitiesCount) {
            return __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Complete;
        }
        return __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Mixed;
    };
    CompositeActivity.prototype.setStatus = function (status) {
        __WEBPACK_IMPORTED_MODULE_3_lodash_each___default()(this.getNestedActivities(), function (a) { return a.setStatus(status); });
    };
    return CompositeActivity;
}(Activity));

var JobGroup = (function (_super) {
    __extends(JobGroup, _super);
    function JobGroup(name, jobs) {
        var _this = _super.call(this, name) || this;
        _this.jobs = jobs;
        return _this;
    }
    JobGroup.prototype.getNestedActivities = function () {
        return this.jobs;
    };
    JobGroup.prototype.findJob = function (jobName) {
        return __WEBPACK_IMPORTED_MODULE_8_lodash_find___default()(this.jobs, function (j) { return j.name === jobName; });
    };
    return JobGroup;
}(CompositeActivity));

var Job = (function (_super) {
    __extends(Job, _super);
    function Job(name, duration, triggers) {
        var _this = _super.call(this, name) || this;
        _this.duration = duration;
        _this.triggers = triggers;
        return _this;
    }
    Job.prototype.getNestedActivities = function () {
        return this.triggers;
    };
    return Job;
}(CompositeActivity));

var Trigger = (function (_super) {
    __extends(Trigger, _super);
    function Trigger(name, status, repeatInterval, repeatCount, initialDelay, startDate, endDate, persistAfterExecution, duration) {
        var _this = _super.call(this, name) || this;
        _this.status = status;
        _this.repeatInterval = repeatInterval;
        _this.repeatCount = repeatCount;
        _this.initialDelay = initialDelay;
        _this.startDate = startDate;
        _this.endDate = endDate;
        _this.persistAfterExecution = persistAfterExecution;
        _this.duration = duration;
        _this.executedCount = 0;
        return _this;
    }
    Trigger.prototype.getStatus = function () {
        return this.status;
    };
    Trigger.prototype.setStatus = function (status) {
        this.status = status;
    };
    Trigger.prototype.isDone = function () {
        if (this.repeatCount !== null && this.executedCount >= this.repeatCount) {
            return true;
        }
        if (this.endDate !== null && this.endDate < new Date().getTime()) {
            return true;
        }
        return false;
    };
    return Trigger;
}(Activity));

var SchedulerEvent = (function () {
    function SchedulerEvent(id, date, scope, eventType, itemKey, fireInstanceId, faulted, errors) {
        if (faulted === void 0) { faulted = false; }
        if (errors === void 0) { errors = null; }
        this.id = id;
        this.date = date;
        this.scope = scope;
        this.eventType = eventType;
        this.itemKey = itemKey;
        this.fireInstanceId = fireInstanceId;
        this.faulted = faulted;
        this.errors = errors;
    }
    return SchedulerEvent;
}());

var FakeScheduler = (function () {
    function FakeScheduler(name, schedule) {
        this.name = name;
        this.schedule = schedule;
        this.startedAt = null;
        this.status = __WEBPACK_IMPORTED_MODULE_0__app_api__["a" /* SchedulerStatus */].Ready;
        this._events = [];
        this._fireInstanceId = 1;
        this._latestEventId = 1;
        this._timer = new __WEBPACK_IMPORTED_MODULE_9__app_global_timers_timer__["a" /* Timer */]();
        this.jobsExecuted = 0;
        this.inProgress = [];
    }
    FakeScheduler.prototype.mapTrigger = function (name, duration, trigger) {
        return new Trigger(name, trigger.pause ? __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Paused : __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Active, trigger.repeatInterval, trigger.repeatCount || null, trigger.initialDelay || 0, trigger.startDate || null, trigger.endDate || null, !!trigger.persistAfterExecution, duration);
    };
    FakeScheduler.prototype.init = function () {
        var _this = this;
        var mapJob = function (name, data) { return new Job(name, data.duration, __WEBPACK_IMPORTED_MODULE_2_lodash_map___default()(__WEBPACK_IMPORTED_MODULE_4_lodash_keys___default()(data.triggers), function (key) { return _this.mapTrigger(key, data.duration, data.triggers[key]); })); }, mapJobGroup = function (name, data) { return new JobGroup(name, __WEBPACK_IMPORTED_MODULE_2_lodash_map___default()(__WEBPACK_IMPORTED_MODULE_4_lodash_keys___default()(data), function (key) { return mapJob(key, data[key]); })); };
        this._groups = __WEBPACK_IMPORTED_MODULE_2_lodash_map___default()(__WEBPACK_IMPORTED_MODULE_4_lodash_keys___default()(this.schedule), function (key) { return mapJobGroup(key, _this.schedule[key]); });
        this._triggers = __WEBPACK_IMPORTED_MODULE_6_lodash_flatMap___default()(this._groups, function (g) { return __WEBPACK_IMPORTED_MODULE_6_lodash_flatMap___default()(g.jobs, function (j) { return j.triggers; }); });
    };
    FakeScheduler.prototype.initTrigger = function (trigger) {
        trigger.startDate = trigger.startDate || new Date().getTime(),
            trigger.nextFireDate = trigger.startDate + trigger.initialDelay;
    };
    FakeScheduler.prototype.start = function () {
        var _this = this;
        var now = new Date().getTime();
        if (this.startedAt === null) {
            this.startedAt = now;
        }
        this.status = __WEBPACK_IMPORTED_MODULE_0__app_api__["a" /* SchedulerStatus */].Started;
        __WEBPACK_IMPORTED_MODULE_3_lodash_each___default()(this._triggers, function (trigger) {
            _this.initTrigger(trigger);
        });
        this.pushEvent(__WEBPACK_IMPORTED_MODULE_0__app_api__["c" /* SchedulerEventScope */].Scheduler, __WEBPACK_IMPORTED_MODULE_0__app_api__["d" /* SchedulerEventType */].Resumed, null);
        this.doStateCheck();
    };
    FakeScheduler.prototype.getData = function () {
        return {
            name: this.name,
            groups: this._groups,
            jobsCount: __WEBPACK_IMPORTED_MODULE_6_lodash_flatMap___default()(this._groups, function (g) { return g.jobs; }).length
        };
    };
    FakeScheduler.prototype.findEvents = function (minEventId) {
        return __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default()(this._events, function (ev) { return ev.id > minEventId; });
    };
    FakeScheduler.prototype.doStateCheck = function () {
        var _this = this;
        this._timer.reset();
        var now = new Date().getTime(), triggersToStop = __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default()(this.inProgress, function (item) {
            return item.completesAt <= now;
        });
        __WEBPACK_IMPORTED_MODULE_3_lodash_each___default()(triggersToStop, function (item) {
            var index = _this.inProgress.indexOf(item);
            _this.inProgress.splice(index, 1);
            _this.jobsExecuted++;
            item.trigger.executedCount++;
            _this.pushEvent(__WEBPACK_IMPORTED_MODULE_0__app_api__["c" /* SchedulerEventScope */].Trigger, __WEBPACK_IMPORTED_MODULE_0__app_api__["d" /* SchedulerEventType */].Complete, item.trigger.name, item.fireInstanceId);
        });
        if (this.status === __WEBPACK_IMPORTED_MODULE_0__app_api__["a" /* SchedulerStatus */].Started) {
            var triggersToStart = __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default()(this._triggers, function (trigger) {
                return trigger.status === __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Active &&
                    (!trigger.isDone()) &&
                    trigger.nextFireDate <= now &&
                    !_this.isInProgress(trigger);
            });
            __WEBPACK_IMPORTED_MODULE_3_lodash_each___default()(triggersToStart, function (trigger) {
                var fireInstanceId = (_this._fireInstanceId++).toString();
                trigger.previousFireDate = now;
                trigger.nextFireDate = now + trigger.repeatInterval;
                _this.inProgress.push({
                    trigger: trigger,
                    startedAt: now,
                    completesAt: now + trigger.duration,
                    fireInstanceId: fireInstanceId
                });
                _this.pushEvent(__WEBPACK_IMPORTED_MODULE_0__app_api__["c" /* SchedulerEventScope */].Trigger, __WEBPACK_IMPORTED_MODULE_0__app_api__["d" /* SchedulerEventType */].Fired, trigger.name, fireInstanceId);
            });
        }
        var triggersToDeactivate = __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default()(this._triggers, function (trigger) { return trigger.isDone(); });
        __WEBPACK_IMPORTED_MODULE_3_lodash_each___default()(triggersToDeactivate, function (trigger) {
            if (trigger.persistAfterExecution) {
                trigger.setStatus(__WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Complete);
            }
            else {
                _this.deleteTriggerInstance(trigger);
            }
        });
        var nextUpdateAt = null;
        if (this.inProgress.length > 0) {
            nextUpdateAt = __WEBPACK_IMPORTED_MODULE_5_lodash_min___default()(__WEBPACK_IMPORTED_MODULE_2_lodash_map___default()(this.inProgress, function (item) { return item.startedAt + item.trigger.duration; }));
        }
        var activeTriggers = __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default()(this._triggers, function (trigger) { return trigger.status === __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Active && trigger.nextFireDate; });
        if (this.status !== __WEBPACK_IMPORTED_MODULE_0__app_api__["a" /* SchedulerStatus */].Shutdown && activeTriggers.length > 0) {
            var nextTriggerFireAt = __WEBPACK_IMPORTED_MODULE_5_lodash_min___default()(__WEBPACK_IMPORTED_MODULE_2_lodash_map___default()(activeTriggers, function (item) { return item.nextFireDate; }));
            nextUpdateAt = nextUpdateAt === null ? nextTriggerFireAt : Math.min(nextUpdateAt, nextTriggerFireAt);
        }
        if (nextUpdateAt === null) {
            if (this.status === __WEBPACK_IMPORTED_MODULE_0__app_api__["a" /* SchedulerStatus */].Shutdown) {
                this._timer.dispose();
            }
            else {
                this.status = __WEBPACK_IMPORTED_MODULE_0__app_api__["a" /* SchedulerStatus */].Empty;
            }
        }
        else {
            if (this.status === __WEBPACK_IMPORTED_MODULE_0__app_api__["a" /* SchedulerStatus */].Empty) {
                this.status = __WEBPACK_IMPORTED_MODULE_0__app_api__["a" /* SchedulerStatus */].Started;
            }
            var nextUpdateIn = nextUpdateAt - now;
            this._timer.schedule(function () { return _this.doStateCheck(); }, nextUpdateIn);
        }
    };
    FakeScheduler.prototype.isInProgress = function (trigger) {
        return __WEBPACK_IMPORTED_MODULE_7_lodash_some___default()(this.inProgress, function (item) { return item.trigger === trigger; });
    };
    FakeScheduler.prototype.pushEvent = function (scope, eventType, itemKey, fireInstanceId) {
        var faulted = Math.random() > 0.5; /* todo: failure rate per job */
        this._events.push({
            id: this._latestEventId++,
            date: new Date().getTime(),
            scope: scope,
            eventType: eventType,
            itemKey: itemKey,
            fireInstanceId: fireInstanceId,
            faulted: faulted,
            errors: faulted ? [new __WEBPACK_IMPORTED_MODULE_0__app_api__["e" /* ErrorMessage */](0, 'Test exception text'), new __WEBPACK_IMPORTED_MODULE_0__app_api__["e" /* ErrorMessage */](1, 'Inner exception text')] : null
        });
        while (this._events.length > 1000) {
            this._events.splice(0, 1);
        }
    };
    FakeScheduler.prototype.findTrigger = function (triggerName) {
        var result = __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default()(this._triggers, function (t) { return t.name === triggerName; });
        return result.length > 0 ? result[0] : null;
    };
    FakeScheduler.prototype.findGroup = function (groupName) {
        var result = __WEBPACK_IMPORTED_MODULE_1_lodash_filter___default()(this._groups, function (t) { return t.name === groupName; });
        return result.length > 0 ? result[0] : null;
    };
    FakeScheduler.prototype.changeTriggerStatus = function (triggerName, status) {
        var trigger = this.findTrigger(triggerName);
        if (trigger) {
            trigger.setStatus(status);
        }
        this.doStateCheck();
        this.pushEvent(__WEBPACK_IMPORTED_MODULE_0__app_api__["c" /* SchedulerEventScope */].Trigger, this.getEventTypeBy(status), trigger.name);
    };
    FakeScheduler.prototype.changeJobStatus = function (groupName, jobName, status) {
        var group = this.findGroup(groupName);
        if (group) {
            var job = group.findJob(jobName);
            job.setStatus(status);
            this.doStateCheck();
            this.pushEvent(__WEBPACK_IMPORTED_MODULE_0__app_api__["c" /* SchedulerEventScope */].Job, this.getEventTypeBy(status), group.name + '.' + job.name);
        }
    };
    FakeScheduler.prototype.changeGroupStatus = function (groupName, status) {
        var group = this.findGroup(groupName);
        if (group) {
            group.setStatus(status);
            this.doStateCheck();
            this.pushEvent(__WEBPACK_IMPORTED_MODULE_0__app_api__["c" /* SchedulerEventScope */].Group, this.getEventTypeBy(status), group.name);
        }
    };
    FakeScheduler.prototype.changeSchedulerStatus = function (status) {
        __WEBPACK_IMPORTED_MODULE_3_lodash_each___default()(this._groups, function (g) { return g.setStatus(status); });
        this.doStateCheck();
        this.pushEvent(__WEBPACK_IMPORTED_MODULE_0__app_api__["c" /* SchedulerEventScope */].Scheduler, this.getEventTypeBy(status), null);
    };
    FakeScheduler.prototype.getEventTypeBy = function (status) {
        if (status === __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Paused) {
            return __WEBPACK_IMPORTED_MODULE_0__app_api__["d" /* SchedulerEventType */].Paused;
        }
        if (status === __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Active) {
            return __WEBPACK_IMPORTED_MODULE_0__app_api__["d" /* SchedulerEventType */].Resumed;
        }
        throw new Error('Unsupported activity status ' + status.title);
    };
    FakeScheduler.prototype.resumeTrigger = function (triggerName) {
        this.changeTriggerStatus(triggerName, __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Active);
    };
    FakeScheduler.prototype.pauseTrigger = function (triggerName) {
        this.changeTriggerStatus(triggerName, __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Paused);
    };
    FakeScheduler.prototype.deleteTrigger = function (triggerName) {
        var trigger = this.findTrigger(triggerName);
        if (trigger) {
            this.deleteTriggerInstance(trigger);
        }
    };
    FakeScheduler.prototype.deleteTriggerInstance = function (trigger) {
        this.removeTriggerFromMap(trigger);
        var allJobs = __WEBPACK_IMPORTED_MODULE_6_lodash_flatMap___default()(this._groups, function (g) { return g.jobs; });
        __WEBPACK_IMPORTED_MODULE_3_lodash_each___default()(allJobs, function (job) {
            var triggerIndex = job.triggers.indexOf(trigger);
            if (triggerIndex > -1) {
                job.triggers.splice(triggerIndex, 1);
            }
        });
    };
    FakeScheduler.prototype.removeTriggerFromMap = function (trigger) {
        var index = this._triggers.indexOf(trigger);
        this._triggers.splice(index, 1);
    };
    FakeScheduler.prototype.deleteJob = function (groupName, jobName) {
        var _this = this;
        var group = this.findGroup(groupName), job = group.findJob(jobName), jobIndex = group.jobs.indexOf(job);
        group.jobs.splice(jobIndex, 1);
        __WEBPACK_IMPORTED_MODULE_3_lodash_each___default()(job.triggers, function (trigger) { return _this.removeTriggerFromMap(trigger); });
    };
    FakeScheduler.prototype.deleteGroup = function (groupName) {
        var _this = this;
        var group = this.findGroup(groupName), groupIndex = this._groups.indexOf(group), triggers = __WEBPACK_IMPORTED_MODULE_6_lodash_flatMap___default()(group.jobs, function (j) { return j.triggers; });
        this._groups.splice(groupIndex, 1);
        __WEBPACK_IMPORTED_MODULE_3_lodash_each___default()(triggers, function (trigger) { return _this.removeTriggerFromMap(trigger); });
    };
    FakeScheduler.prototype.pauseJob = function (groupName, jobName) {
        this.changeJobStatus(groupName, jobName, __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Paused);
    };
    FakeScheduler.prototype.resumeJob = function (groupName, jobName) {
        this.changeJobStatus(groupName, jobName, __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Active);
    };
    FakeScheduler.prototype.pauseGroup = function (groupName) {
        this.changeGroupStatus(groupName, __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Paused);
    };
    FakeScheduler.prototype.resumeGroup = function (groupName) {
        this.changeGroupStatus(groupName, __WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Active);
    };
    FakeScheduler.prototype.pauseAll = function () {
        this.changeSchedulerStatus(__WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Paused);
    };
    FakeScheduler.prototype.resumeAll = function () {
        this.changeSchedulerStatus(__WEBPACK_IMPORTED_MODULE_0__app_api__["b" /* ActivityStatus */].Active);
    };
    FakeScheduler.prototype.standby = function () {
        this.status = __WEBPACK_IMPORTED_MODULE_0__app_api__["a" /* SchedulerStatus */].Ready;
        this.pushEvent(__WEBPACK_IMPORTED_MODULE_0__app_api__["c" /* SchedulerEventScope */].Scheduler, __WEBPACK_IMPORTED_MODULE_0__app_api__["d" /* SchedulerEventType */].Paused, null);
    };
    FakeScheduler.prototype.shutdown = function () {
        this.status = __WEBPACK_IMPORTED_MODULE_0__app_api__["a" /* SchedulerStatus */].Shutdown;
        this._groups = [];
        this._triggers = [];
        this.doStateCheck();
        alert('Fake in-browser scheduler has just been shut down. Just refresh the page to make it start again!');
    };
    FakeScheduler.prototype.triggerJob = function (groupName, jobName, triggerName, triggerData) {
        var group = this.findGroup(groupName), job = group.findJob(jobName), trigger = this.mapTrigger(triggerName || GuidUtils.generate(), job.duration, triggerData);
        job.triggers.push(trigger);
        this._triggers.push(trigger);
        this.initTrigger(trigger);
        this.doStateCheck();
    };
    FakeScheduler.prototype.executeNow = function (groupName, jobName) {
        this.triggerJob(groupName, jobName, null, { repeatCount: 1, repeatInterval: 1 });
    };
    return FakeScheduler;
}());

var GuidUtils = (function () {
    function GuidUtils() {
    }
    GuidUtils.generate = function () {
        var s4 = function () { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
    return GuidUtils;
}());


/***/ }),
/* 283 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(99);
module.exports = __webpack_require__(98);


/***/ })
/******/ ]);