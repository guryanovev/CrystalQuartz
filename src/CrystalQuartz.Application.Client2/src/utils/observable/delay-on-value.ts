import { Disposable } from 'john-smith/common';
import { Listenable, ListenerCallback, ObservableValue } from 'john-smith/reactive';

class DelayedListenable<T> implements Listenable<T> {
    constructor(
        private readonly nested: Listenable<T>,
        private readonly delayMap: Map<T, number>
    ) {
    }

    listen(listener: ListenerCallback<T>, raiseInitial?: boolean | undefined): Disposable {
        let timer: ReturnType<typeof setTimeout> | null = null;

        return this.nested.listen((value: T) => {
            if (timer != null) {
                clearTimeout(timer);
            }

            if (this.delayMap.has(value)) {
                timer = setTimeout(() => {
                    listener(value);
                }, this.delayMap.get(value));
            } else {
                listener(value);
            }
        }, raiseInitial);
    }
}

export const DELAY_ON_VALUE = <T>(source: Listenable<T>, delayMap: Map<T, number>): Listenable<T> => {
    return new DelayedListenable(source, delayMap);
}
