import { ICommand } from '../commands/contracts';
import { Property, SchedulerEvent } from '../api';
import { Event } from 'john-smith/reactive/event';

export interface CommandResult {
    _ok: boolean;
    _err: string;
}

export interface ErrorInfo {
    errorMessage: string;
    details?: Property[];
    disconnected?: boolean;
}

export class CommandService {
    onCommandStart = new Event<ICommand<any>>();
    onCommandComplete = new Event<ICommand<any>>();
    onCommandFailed = new Event<ErrorInfo>();
    onEvent = new Event<SchedulerEvent>();
    onDisconnected = new Event<unknown>();

    private _minEventId = 0;

    constructor(
        private readonly _url: string,
        private readonly _headers: { [key: string]: string } | null
    ) {
    }

    resetEvents() {
        this._minEventId = 0;
    }

    executeCommand<T>(command: ICommand<T>, suppressError: boolean = false): Promise<T> {
        const data = {
            ...command.data,
            ...{ command: command.code, minEventId: this._minEventId }
        };

        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        })

        this.onCommandStart.trigger(command);

        return fetch(this._url, { method: 'POST', body: new URLSearchParams(data), headers: this._headers ?? undefined })
            .catch(() => {
                this.onDisconnected.trigger(null);

                return Promise.reject({
                    disconnected: true,
                    errorMessage: 'Server is not available'
                });
            })
            .then(res => res.json())
            .then(response => {
                var comandResult = <CommandResult>response;
                if (comandResult._ok) {
                    const mappedResult = command.mapper ? command.mapper(response) : response;

                    /* Events handling */
                    var eventsResult: any = mappedResult,
                        events: SchedulerEvent[] = eventsResult.Events;

                    if (events && events.length > 0) {
                        for (var i = 0; i < events.length; i++) {
                            this.onEvent.trigger(events[i]);
                        }

                        this._minEventId = events.reduce((acc, current) => Math.max(acc, current.id), 0);
                    }

                    return mappedResult;
                } else {
                    return Promise.reject({
                        errorMessage: comandResult._err,
                        details: null
                    });
                }
            })
            .catch(reason => {
                if (!suppressError || reason.disconnected) {
                    this.onCommandFailed.trigger(reason);
                }

                return Promise.reject(reason);
            })
            .finally(() => {
                this.onCommandComplete.trigger(command);
            });
    }
}

