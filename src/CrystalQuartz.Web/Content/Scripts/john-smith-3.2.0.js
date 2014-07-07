/// <reference path="../libs/jquery.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
    })();
    js.ExplicitManager = ExplicitManager;

    js.dom;
    js.observableValue = function () {
        return new ObservableValue();
    };
    js.observableList = function () {
        return new ObservableList();
    };
    js.dependentValue = function (evaluate) {
        var dependencies = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            dependencies[_i] = arguments[_i + 1];
        }
        return new DependentValue(evaluate, dependencies);
    };

    js.init = function () {
        var markupResolver = new JQueryMarkupResolver();
        var defaultFormatter = function (value) {
            return value.toString();
        };

        var fetcherFactory = new FetcherFactory().registerFetcher(FetcherType.Value, new ValueFetcher()).registerFetcher(FetcherType.CheckedAttribute, new CheckedAttributeFetcher());

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
            } else {
                fetcher = this._fetcherFactory.getForElement(this._target);
            }

            var argumentFetcher = null;
            if (fetcher) {
                argumentFetcher = function (target) {
                    return fetcher.valueFromElement(target);
                };
            }

            var actualContext = context || this._manager.getViewModel();
            var wire = new CommandWire(argumentFetcher, this._event, callback, this._target, actualContext);
            this._manager.manage(wire);
        };
        return CommandConfig;
    })();
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
                } else {
                    _this._callback.call(_this._context, commandArgument);
                }
            });
        };
        return CommandWire;
    })();
    js.CommandWire = CommandWire;

    

    

    

    

    

    /**
    * Describes the type of string value
    */
    (function (ValueType) {
        /** The value contains plain text */
        ValueType.text = "text";

        /** The value contains prepared html */
        ValueType.html = "html";

        /** The value contains an object that could be transformed to html */
        ValueType.unknown = "unknown";
    })(js.ValueType || (js.ValueType = {}));
    var ValueType = js.ValueType;

    /// <reference path="../libs/jquery.d.ts"/>
    /// <reference path="Common.ts"/>
    /// <reference path="Listeners.ts"/>
    /// <reference path="Observables.ts"/>
    /// <reference path="Renderers.ts"/>
    /// <reference path="JQuery.ts"/>
    /// <reference path="Commands.ts"/>
    /// <reference path="Fetchers.ts"/>
    /// <reference path="Utils.ts"/>
    /// <reference path="Views.ts"/>
    /// <reference path="Events.ts"/>
    

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
    })();

    var ListenerDom = (function () {
        function ListenerDom(_rootElement, _manager, _renderListenerFactory, _viewFactory, _fetcherFactory) {
            var _this = this;
            this._rootElement = _rootElement;
            this._manager = _manager;
            this._renderListenerFactory = _renderListenerFactory;
            this._viewFactory = _viewFactory;
            this._fetcherFactory = _fetcherFactory;
            this.root = _rootElement;

            var textConfig = new ObservationConfig(this._manager, function (observable) {
                return _this.createRenderListener(observable, { valueType: ValueType.text });
            });
            var htmlConfig = new ObservationConfig(this._manager, function (observable) {
                return _this.createRenderListener(observable, { valueType: ValueType.html });
            });

            this.$ = this._rootElement.$;
            this.text = Utils.wrapObjectWithSelfFunction(textConfig, function (config, value) {
                return config.observes(value);
            });

            this.html = Utils.wrapObjectWithSelfFunction(htmlConfig, function (config, value) {
                return config.observes(value);
            });

            this.manager = this._manager;
        }
        ListenerDom.prototype.listener = function (listener) {
            var _this = this;
            return new ObservationConfig(this._manager, function (observable) {
                return _this.createRenderListener(observable, { renderer: new CustomListenerRenderer(listener) });
            });
        };

        ListenerDom.prototype.className = function (className) {
            return this.listener(function (element, value) {
                var hasClass = !!value;
                if (hasClass) {
                    element.addClass(className);
                } else {
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
        };

        ListenerDom.prototype.on = function (event, options) {
            return new CommandConfig(this._manager, event, this._rootElement, options, this._fetcherFactory);
        };

        ListenerDom.prototype.createRenderListener = function (observable, options) {
            var listener = this;
            return this._renderListenerFactory.createListener(observable, listener, options);
        };
        return ListenerDom;
    })();

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
    })();
    js.ObservationConfig = ObservationConfig;

    var ListenerUtils;
    (function (ListenerUtils) {
        ListenerUtils.getObservable = function (candidate) {
            if (candidate && candidate.getValue && candidate.listen) {
                return candidate;
            }

            return new js.StaticObservableValue(candidate);
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

            return Utils.wrapObjectWithSelfFunction(actualDom, function (dom, selector) {
                return dom.find(selector);
            });
        };
        return DomFactory;
    })();
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
    })();
    js.Event = Event;
    var FetcherType = (function () {
        function FetcherType() {
        }
        FetcherType.Value = "value";
        FetcherType.CheckedAttribute = "checkedAttribute";
        return FetcherType;
    })();
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
    })();
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
    })();
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
    })();
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
    })();
    js.JQueryElement = JQueryElement;

    var JQueryMarkupResolver = (function () {
        function JQueryMarkupResolver() {
        }
        JQueryMarkupResolver.prototype.resolve = function (markup) {
            var $markup;
            if (markup instanceof jQuery) {
                $markup = markup;
            } else {
                try  {
                    $markup = $(markup);
                } catch (error) {
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
    })();
    js.JQueryMarkupResolver = JQueryMarkupResolver;

    var CustomListenerRenderer = (function () {
        function CustomListenerRenderer(payload) {
            this.payload = payload;
        }
        CustomListenerRenderer.prototype.render = function (value, destination) {
            this.payload(destination, value);

            return {
                element: destination,
                dispose: function () {
                }
            };
        };
        return CustomListenerRenderer;
    })();
    js.CustomListenerRenderer = CustomListenerRenderer;

    var RenderValueListener = (function () {
        function RenderValueListener(_observable, _contentDestination, _renderer) {
            this._observable = _observable;
            this._contentDestination = _contentDestination;
            this._renderer = _renderer;
        }
        RenderValueListener.prototype.init = function () {
            var _this = this;
            this._link = this._observable.listen(function (value) {
                return _this.doRender(value);
            });
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
    })();
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
            this._link = this._observable.listen(function (value, oldValue, details) {
                return _this.doRender(details.portion, details.reason);
            });
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

            if (reason == 2 /* remove */) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var itemRenderedValue = this.findRenderedValue(item);
                    if (itemRenderedValue) {
                        itemRenderedValue.dispose();
                        this.removeRenderedValue(itemRenderedValue);
                    }
                }
            } else if (reason == 1 /* add */) {
                this.appendItems(value);
            } else {
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
    })();
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
                } else {
                    /** use default renderer if no view in options */
                    if (!options.valueType) {
                        if (options.formatter) {
                            /** if custom formatter used we assume that formatted value might be of unknown type */
                            options.valueType = ValueType.unknown;
                        } else {
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
            } else {
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
            } else if (bindable) {
                var value = bindable.getValue();
                if (value instanceof Array) {
                    return true;
                }
            }

            return false;
        };
        return RenderListenerFactory;
    })();
    js.RenderListenerFactory = RenderListenerFactory;

    /// <reference path="Common.ts"/>
    /// <reference path="Utils.ts"/>
    (function (DataChangeReason) {
        DataChangeReason[DataChangeReason["replace"] = 0] = "replace";
        DataChangeReason[DataChangeReason["add"] = 1] = "add";
        DataChangeReason[DataChangeReason["remove"] = 2] = "remove";
        DataChangeReason[DataChangeReason["initial"] = 3] = "initial";
    })(js.DataChangeReason || (js.DataChangeReason = {}));
    var DataChangeReason = js.DataChangeReason;

    var ListenerLink = (function () {
        function ListenerLink(allListeners, currentListener) {
            this.allListeners = allListeners;
            this.currentListener = currentListener;
        }
        ListenerLink.prototype.dispose = function () {
            ArrayUtils.removeItem(this.allListeners, this.currentListener);
        };
        return ListenerLink;
    })();
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
            this.notifyListeners(value, oldValue, { reason: 0 /* replace */, portion: value });
        };

        ObservableValue.prototype.listen = function (listener, raiseInitial) {
            this._listeners.push(listener);
            if (raiseInitial === undefined || raiseInitial === true) {
                this.notifyListeners(this.getValue(), this.getValue(), { reason: 3 /* initial */, portion: this.getValue() });
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
    })();
    js.ObservableValue = ObservableValue;

    var ObservableList = (function (_super) {
        __extends(ObservableList, _super);
        function ObservableList() {
            _super.call(this);
            _super.prototype.setValue.call(this, []);
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
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var oldValue = this.getValue().slice(0);
            var array = this.getValue();
            for (var i = 0; i < args.length; i++) {
                array.push(args[i]);
            }

            this.reactOnChange(this.getValue(), oldValue, { reason: 1 /* add */, portion: args });
        };

        ObservableList.prototype.remove = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var oldValue = this.getValue().slice(0);
            var array = this.getValue();
            for (var i = 0; i < args.length; i++) {
                ArrayUtils.removeItem(array, args[i]);
            }

            this.reactOnChange(this.getValue(), oldValue, { reason: 2 /* remove */, portion: args });
        };

        /** Removes all items from the list */
        ObservableList.prototype.clear = function () {
            var removed = this.getValue().splice(0, this.getValue().length);
            this.reactOnChange(this.getValue(), removed, { reason: 2 /* remove */, portion: removed });
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
                } else {
                    this._count.setValue(0);
                }
            }
        };
        return ObservableList;
    })(ObservableValue);
    js.ObservableList = ObservableList;

    var DependentValue = (function (_super) {
        __extends(DependentValue, _super);
        function DependentValue(evaluate, dependencies) {
            _super.call(this);

            this._dependencies = dependencies;
            this._evaluateValue = evaluate;
            this._dependencyValues = [];

            var that = this;
            for (var i = 0; i < dependencies.length; i++) {
                var dependency = dependencies[i];
                dependency.listen(function (newValue, oldValue, details) {
                    var actualValue = newValue;
                    if (details.reason !== 0 /* replace */) {
                        actualValue = dependency.getValue();
                    }

                    that.notifyDependentListeners(dependency, actualValue);
                }, false);

                this._dependencyValues[i] = dependency.getValue();
            }
        }
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
                listener(newValue, oldValue, { portion: newValue, reason: 0 /* replace */ });
            }
        };
        return DependentValue;
    })(ObservableValue);
    js.DependentValue = DependentValue;

    var StaticObservableValue = (function () {
        function StaticObservableValue(_value) {
            this._value = _value;
        }
        StaticObservableValue.prototype.getValue = function () {
            return this._value;
        };

        StaticObservableValue.prototype.listen = function (listener) {
            listener(this.getValue(), null, { reason: 3 /* initial */, portion: this.getValue() });
            return { dispose: function () {
                } };
        };
        return StaticObservableValue;
    })();
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
                dispose: function () {
                    _this.doRender('', destination);
                }
            };
        };

        /**
        * @abstract
        * @param formattedValue
        */
        FormatterBasedRenderer.prototype.doRender = function (formattedValue, destination) {
        };
        return FormatterBasedRenderer;
    })();
    js.FormatterBasedRenderer = FormatterBasedRenderer;

    /**
    * Appends encoded text to destination element.
    */
    var TextRenderer = (function (_super) {
        __extends(TextRenderer, _super);
        function TextRenderer(formatter) {
            _super.call(this, formatter);
        }
        TextRenderer.prototype.doRender = function (formattedValue, destination) {
            destination.setText(formattedValue);
        };
        return TextRenderer;
    })(FormatterBasedRenderer);
    js.TextRenderer = TextRenderer;

    /**
    * Appends html markup to destination element.
    */
    var HtmlRenderer = (function (_super) {
        __extends(HtmlRenderer, _super);
        function HtmlRenderer(formatter) {
            _super.call(this, formatter);
        }
        HtmlRenderer.prototype.doRender = function (formattedValue, destination) {
            destination.setHtml(formattedValue);
        };
        return HtmlRenderer;
    })(FormatterBasedRenderer);
    js.HtmlRenderer = HtmlRenderer;

    /**
    * Appends html markup to destination element.
    */
    var ResolvableMarkupRenderer = (function (_super) {
        __extends(ResolvableMarkupRenderer, _super);
        function ResolvableMarkupRenderer(formatter, markupResolver) {
            _super.call(this, formatter);
            this._markupResolver = markupResolver;
        }
        ResolvableMarkupRenderer.prototype.doRender = function (formattedValue, destination) {
            var markup = this._markupResolver.resolve(formattedValue);
            destination.setHtml(markup);
        };
        return ResolvableMarkupRenderer;
    })(FormatterBasedRenderer);
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
    })();
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
    })();
    js.FetcherToRendererAdapter = FetcherToRendererAdapter;

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
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                args.splice(0, 0, result);
                return payload.apply(this, args);
            };

            for (var key in target) {
                result[key] = target[key];
            }

            return result;
        };
    })(js.Utils || (js.Utils = {}));
    var Utils = js.Utils;

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
    })(js.ArrayUtils || (js.ArrayUtils = {}));
    var ArrayUtils = js.ArrayUtils;

    (function (DisposingUtils) {
        DisposingUtils.noop = function () {
        };
        DisposingUtils.noopDisposable = {
            dispose: DisposingUtils.noop
        };
    })(js.DisposingUtils || (js.DisposingUtils = {}));
    var DisposingUtils = js.DisposingUtils;

    

    

    

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
            this._slaves.push(manageable);
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
                } else {
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
            } else {
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
    })();
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
                var newInstance = new dataDescriptor();
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
    })();
    js.DefaultViewFactory = DefaultViewFactory;
})(js || (js = {}));

js.init();
