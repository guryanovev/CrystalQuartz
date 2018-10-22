export class JobDataMapItem {
    value = new js.ObservableValue<string>();

    onRemoved = new js.Event();

    constructor(public key: string) {
    }

    remove() {
        this.onRemoved.trigger();
    }
}