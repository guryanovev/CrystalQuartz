import { ObservableValue } from 'john-smith/reactive';

export default class Action {
    disabled = new ObservableValue<boolean>(false);

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
