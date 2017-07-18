export default class Action {
    disabled = new js.ObservableValue<boolean>();

    constructor(
        public title: string,
        private callback: () => void) { }

    set enabled(value: boolean) {
        this.disabled.setValue(!value);
    }

    execute() {
        this.callback();
    }
}