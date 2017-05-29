/// <reference path="../node_modules/@types/jquery/index.d.ts" />

declare module js {
    class ExplicitManager implements IDomManager {
        _slaves: IManageable[];
        constructor();
        manage(manageable: IManageable): void;
        dispose(): void;
        getViewModel(): any;
        getParent(): IDomManager;
        onUnrender(): IEvent<any>;
    }
    var dom: IDom;
    var observableValue: <T>() => ObservableValue<T>;
    var observableList: <T>() => ObservableList<T>;
    var dependentValue: (evaluate: Function, ...dependencies: IObservable<any>[]) => any;
    var init: () => void;
    interface ICommandOptions {
        fetch?: string;
    }
    interface ICommandArgumentFetcher {
        (target: IElement): any;
    }
    class CommandConfig {
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        constructor(_manager: IDomManager, _event: string, _target: IElement, _options: ICommandOptions, _fetcherFactory: IFetcherFactory);
        react(callback: Function, context?: any): void;
    }
    class CommandWire implements IManageable {
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        constructor(_argumentFetcher: ICommandArgumentFetcher, _eventType: string, _callback: Function, _target: IElement, _context: any);
        dispose(): void;
        init(): void;
    }
    /**
     * Represents something that could be disposed.
     */
    interface IDisposable {
        dispose(): void;
    }
    /**
     * Represents something that could be initialized.
     */
    interface IInitializable {
        init(): void;
    }
    /**
     * Represents an object that has a particular lifecycle.
     * It could be initialized once it goes to stage and disposed when it is no longer needed.
     */
    interface IManageable extends IDisposable, IInitializable {
    }
    /**
     * Someone who can manage.
     */
    interface IManager extends IDisposable {
        manage(manageable: IManageable | IDisposable): void;
    }
    /**
     * Wrapper around HTML element
     */
    interface IElement {
        $: any;
        empty: () => void;
        appendHtml: (html: string) => IElement;
        findRelative: (query: string) => IElement;
        remove: () => void;
        getNodeName: () => string;
        addClass: (className: string) => void;
        removeClass: (className: string) => void;
        setHtml(html: string): any;
        setText(text: string): any;
        getValue: () => string;
        setValue(value: string): any;
        getAttribute(attribute: string): any;
        setAttribute(attribute: string, value: string): any;
        getProperty(property: string): any;
        setProperty(property: string, value: any): any;
        attachEventHandler(event: string, callback: (target: IElement) => void): any;
        detachEventHandler(event: string, handler: any): any;
    }
    /**
     * Describes the type of string value
     */
    module ValueType {
        /** The value contains plain text */
        var text: string;
        /** The value contains prepared html */
        var html: string;
        /** The value contains an object that could be transformed to html */
        var unknown: string;
    }
    interface IMarkupResolver {
        /**
         * Resolves markup object and returns valid html string.
         * @param markup
         */
        resolve(markup: any): string;
    }
    interface ListenerOptions {
        renderer?: IValueRenderer;
        formatter?: IValueFormatter;
        valueType?: string;
        fetch?: string;
        view?: any;
        type?: string;
        encode?: boolean;
        bidirectional?: boolean;
        event?: string;
        command?: Function;
        commandContext?: any;
    }
    interface IDom extends IDisposable {
        $: JQuery;
        root: IElement;
        manager: IDomManager;
        (selector: string): IListenerDom;
        find(selector: string): IListenerDom;
        onUnrender(): IEvent<any>;
    }
    interface IListenerDom {
        $: JQuery;
        root: IElement;
        manager: IDomManager;
        <T>(observable: IObservable<T>): void;
        <T>(value: T): void;
        observes<T>(observable: IObservable<T>, viewClass: Function): void;
        observes<T>(observable: IObservable<T>, options: any): void;
        observes<T>(value: T, viewClass: Function): void;
        observes<T>(value: T, options?: ListenerOptions): void;
        observes(value: any, options?: ListenerOptions): void;
        on(event: string, options?: ICommandOptions): CommandConfig;
        render(view: any, viewModel?: IViewModel): any;
    }
    class ObservationConfig {
        /* removed*/
        private factory;
        constructor(_manager: IManager, factory: (observable: IObservable<Object>) => IManageable);
        observes<T>(observable: IObservable<T>): void;
        observes<T>(value: T): void;
    }
    interface IDomFactory {
        create(root: IElement, manager: IDomManager): IDom;
    }
    class DomFactory implements IDomFactory {
        /* removed*/
        /* removed*/
        /* removed*/
        constructor(_renderListenerFactory: RenderListenerFactory, _viewFactory: IViewFactory, _fetcherFactory: IFetcherFactory);
        create(root: IElement, manager: IDomManager): IDom;
    }
    interface IEvent<TEventArg> {
        listen(listener: () => void): IDisposable;
        listen(listener: (arg: TEventArg) => void): IDisposable;
    }
    class Event<TEventArg> implements IEvent<TEventArg>, IDisposable {
        /* removed*/
        constructor();
        listen(listener: () => void): IDisposable;
        listen(listener: (arg: TEventArg) => void): IDisposable;
        trigger(): void;
        trigger(arg: TEventArg): void;
        dispose(): void;
        getListenersCount(): number;
        hasListeners(): boolean;
        private removeListener(listener);
    }
    class FetcherType {
        static Value: string;
        static CheckedAttribute: string;
    }
    interface IFetcherFactory {
        getByKey(key: string): IFetcher;
        getForElement(element: IElement): any;
    }
    interface IFetcher {
        isSuitableFor(element: IElement): boolean;
        valueToElement(value: any, element: IElement): void;
        valueFromElement(element: IElement): any;
    }
    class ValueFetcher implements IFetcher {
        isSuitableFor(element: IElement): boolean;
        valueToElement(value: any, element: IElement): void;
        valueFromElement(element: IElement): any;
    }
    class CheckedAttributeFetcher implements IFetcher {
        isSuitableFor(element: IElement): boolean;
        valueToElement(value: any, element: IElement): void;
        valueFromElement(element: IElement): any;
    }
    class FetcherFactory implements IFetcherFactory {
        /* removed*/
        getForElement(element: IElement): any;
        getByKey(key: string): IFetcher;
        registerFetcher(key: string, fetcher: IFetcher): FetcherFactory;
    }
    class JQueryElement implements IElement {
        $: any;
        /* removed*/
        constructor(target: any);
        empty(): void;
        appendHtml(html: string): IElement;
        getNodeName(): string;
        findRelative(query: string): IElement;
        remove(): void;
        getTarget(): any;
        setText(text: string): void;
        setHtml(html: string): void;
        addClass(className: string): void;
        removeClass(className: string): void;
        attachEventHandler(event: string, callback: (target: IElement) => void): () => boolean;
        detachEventHandler(event: string, handler: any): void;
        getValue(): string;
        setValue(value: string): string;
        getAttribute(attribute: string): any;
        setAttribute(attribute: string, value: string): void;
        getProperty(property: string): any;
        setProperty(property: string, value: any): void;
    }
    class JQueryMarkupResolver implements IMarkupResolver {
        resolve(markup: any): string;
    }
    interface ICustomListener<T> {
        (element: IElement, value: T): void;
    }
    class CustomListenerRenderer<T> implements IValueRenderer {
        private payload;
        constructor(payload: ICustomListener<T>);
        render(value: any, destination: IElement): IRenderedValue;
    }
    class RenderValueListener<T> implements IManageable {
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        constructor(_observable: IObservable<T>, _contentDestination: IElement, _renderer: IValueRenderer);
        init(): void;
        dispose(): void;
        private doRender(value);
        private disposeCurrentValue();
    }
    interface IRenderedValueData {
        value: any;
        renderedValue: IRenderedValue;
    }
    class RenderListHandler<T> implements IManageable {
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        constructor(_observable: IObservable<T[]>, _contentDestination: IElement, _renderer: IValueRenderer);
        dispose(): void;
        init(): void;
        private findRenderedValue(value);
        private removeRenderedValue(renderedValue);
        private doRender(value, reason);
        private appendItems(items);
    }
    class RenderListenerFactory {
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        constructor(_defaultFormatter: IValueFormatter, _markupResolver: IMarkupResolver, _viewFactory: IViewFactory, _fetcherFactory: IFetcherFactory);
        createListener(observable: IObservable<Object>, dom: IListenerDom, options: ListenerOptions): IManageable;
        private getRenderer(options, dom, observable);
        isList(bindable: IObservable<Object>): boolean;
    }
    enum DataChangeReason {
        replace = 0,
        add = 1,
        remove = 2,
        initial = 3,
    }
    interface IChangeDetails<T> {
        reason: DataChangeReason;
        portion: T;
    }
    interface IListenerCallback<T> {
        (value: T, oldValue?: T, details?: IChangeDetails<T>): void;
    }
    interface IObservable<T> {
        getValue(): T;
        listen(listener: IListenerCallback<T>, raiseInitial?: boolean): IDisposable;
    }
    class ListenerLink<T> implements IDisposable {
        private allListeners;
        private currentListener;
        constructor(allListeners: IListenerCallback<T>[], currentListener: IListenerCallback<T>);
        dispose(): void;
    }
    class ObservableValue<T> implements IObservable<T> {
        /* removed*/
        /* removed*/
        constructor();
        getValue(): T;
        setValue(value: T): void;
        listen(listener: IListenerCallback<T>, raiseInitial?: boolean): IDisposable;
        getListenersCount(): number;
        getListener(index: number): IListenerCallback<T>;
        notifyListeners(newValue: T, oldValue: T, details: IChangeDetails<T>): void;
        hasValue(): boolean;
    }
    class ObservableList<T> extends ObservableValue<T[]> {
        /* removed*/
        constructor();
        setValue(value: T[]): void;
        add(...args: T[]): void;
        remove(...args: T[]): void;
        /** Removes all items from the list */
        clear(): void;
        /** Returns a bindable value that stores size of the list */
        count(): ObservableValue<number>;
        forEach(callback: any, thisArg: any): void;
        private reactOnChange(newItems, oldItems, details);
        private notifyCountListeners();
    }
    class DependentValue<T> extends ObservableValue<T> {
        /* removed*/
        /* removed*/
        /* removed*/
        constructor(evaluate: () => any, dependencies: IObservable<any>[]);
        getValue(): any;
        setValue(value: any): void;
        notifyDependentListeners(causedByDependency: IObservable<any>, newDependencyValue: any): void;
        private setupListener(dependency);
    }
    class StaticObservableValue<T> implements IObservable<T> {
        /* removed*/
        constructor(_value: T);
        getValue(): T;
        listen(listener: IListenerCallback<T>): IDisposable;
    }
    /**
     * Converts a value to string representation.
     */
    interface IValueFormatter {
        (value: any): string;
    }
    /**
     * Represents rendered value
     */
    interface IRenderedValue extends IDisposable {
        [others: string]: any;
    }
    /**
     * Renders value to DOM element.
     */
    interface IValueRenderer {
        render(value: any, destination: IElement): IRenderedValue;
    }
    /**
     * A base class for formatting-based renderers.
     * @abstract
     */
    class FormatterBasedRenderer implements IValueRenderer {
        /* removed*/
        constructor(formatter: IValueFormatter);
        render(value: any, destination: IElement): IRenderedValue;
        /**
         * @abstract
         * @param formattedValue
         */
        doRender(formattedValue: string, destination: IElement): void;
    }
    /**
     * Appends encoded text to destination element.
     */
    class TextRenderer extends FormatterBasedRenderer {
        constructor(formatter: IValueFormatter);
        doRender(formattedValue: string, destination: IElement): void;
    }
    /**
     * Appends html markup to destination element.
     */
    class HtmlRenderer extends FormatterBasedRenderer {
        constructor(formatter: IValueFormatter);
        doRender(formattedValue: string, destination: IElement): void;
    }
    /**
     * Appends html markup to destination element.
     */
    class ResolvableMarkupRenderer extends FormatterBasedRenderer {
        /* removed*/
        constructor(formatter: IValueFormatter, markupResolver: IMarkupResolver);
        doRender(formattedValue: string, destination: IElement): void;
    }
    class ViewValueRenderer implements IValueRenderer {
        /* removed*/
        /* removed*/
        /* removed*/
        constructor(viewFactory: IViewFactory, viewDescriptor: any, _parent: IDomManager);
        render(value: any, destination: IElement): IRenderedValue;
    }
    class FetcherToRendererAdapter implements IValueRenderer {
        /* removed*/
        constructor(fetcher: IFetcher);
        render(formattedValue: string, destination: IElement): IRenderedValue;
    }
    module Utils {
        var isNullOrUndefined: (value: any) => boolean;
        /**
         * Checks if provided object is a function.
         * @param target An object to check.
         * @returns {boolean}
         */
        var isFunction: (target: any) => boolean;
        /**
         *
         */
        var wrapObjectWithSelfFunction: <TTarget, TFunctionResult>(target: TTarget, payload: Function) => any;
    }
    module ArrayUtils {
        var removeItem: <T>(array: T[], itemToRemove: T) => void;
    }
    module DisposingUtils {
        var noop: () => void;
        var noopDisposable: IDisposable;
    }
    interface IDomManager extends IManager {
        getViewModel(): any;
        getParent(): IDomManager;
        onUnrender(): IEvent<any>;
    }
    /**
     * Optional view model interface
     */
    interface IViewModel {
        initState?: () => void;
        releaseState?: () => void;
    }
    /**
     * Describes the data needed for creating a view.
     */
    interface IView<TViewModel extends IViewModel> {
        template: any;
        deep?: number;
        init?(dom: IDom, viewModel: TViewModel): void;
        init?<TParentViewModel>(dom: IDom, viewModel: TViewModel, parentViewModel: TParentViewModel): void;
    }
    /**
     * Resolves provided vew descriptor and creates view.
     */
    interface IViewFactory {
        resolve<TViewModel extends IViewModel>(destination: IElement, dataDescriptor: any, viewModel: any, parent: IDomManager): IComposedView;
    }
    interface IComposedView extends IManageable {
        getRootElement(): IElement;
    }
    class ComposedView<TViewModel extends IViewModel> implements IDomManager, IComposedView {
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        /* removed*/
        constructor(_viewData: IView<TViewModel>, _viewModel: TViewModel, _markupResolver: IMarkupResolver, _destination: IElement, _domFactory: IDomFactory, _parent: IDomManager);
        onUnrender(): IEvent<any>;
        manage(manageable: IManageable | IDisposable): void;
        init(): void;
        getViewModel(): any;
        getParent(): IDomManager;
        private attachViewToRoot(root);
        getRootElement(): IElement;
        unrenderView(): void;
        dispose(): void;
        private fetchViewModels(deep);
    }
    /**
     * Default implementation of IViewFactory
     */
    class DefaultViewFactory implements IViewFactory {
        /* removed*/
        /* removed*/
        constructor(_markupResolver: IMarkupResolver);
        setDomFactory(domFactory: IDomFactory): void;
        resolve(destination: IElement, dataDescriptor: any, viewModel: any, parent: IDomManager): IComposedView;
    }
}
