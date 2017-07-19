export default class Action {
    disabled = new js.ObservableValue<boolean>();

    constructor(
        public title: string,
        private callback: () => void,
        private confirmMessage?: string) { }

    set enabled(value: boolean) {
        this.disabled.setValue(!value);
    }

    get isDanger() {
        return !!this.confirmMessage;
    }

    execute() {
        if (!this.confirmMessage || confirm(this.confirmMessage)) {
            this.callback();
        }
    }
}