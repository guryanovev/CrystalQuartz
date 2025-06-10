import { ICommand } from './contracts';

export abstract class AbstractCommand<T> implements ICommand<T> {
    abstract code: string;
    data: any;
    abstract message: string;

    protected constructor() {
        this.data = {};
    }
}
