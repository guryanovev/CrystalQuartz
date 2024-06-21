import { Listenable } from 'john-smith/reactive';

export interface ValidatorOptions<T> {
    source: Listenable<T>;
    key?: any;
    condition?: Listenable<boolean>;
}
