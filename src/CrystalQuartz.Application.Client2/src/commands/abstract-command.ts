import { ICommand } from './contracts';

export abstract class AbstractCommand<T> implements ICommand<T> {
    abstract code: string;
    data: any;
    abstract message: string;

    constructor() {
        this.data = {};
    }
}
