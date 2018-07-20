import { ICommand } from './contracts';

export class AbstractCommand<T> implements ICommand<T> {
    code: string;
    data: any;
    message: string;

    constructor() {
        this.data = {};
    }
}