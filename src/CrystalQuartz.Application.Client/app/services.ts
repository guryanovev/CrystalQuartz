import { ICommand } from './commands/contracts';
import { Property, SchedulerEvent } from './api';

import __assign from 'lodash/assign';
import __map from 'lodash/map';
import __max from 'lodash/max';

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
    onCommandStart = new js.Event<ICommand<any>>();
    onCommandComplete = new js.Event<ICommand<any>>();
    onCommandFailed = new js.Event<ErrorInfo>();
    onEvent = new js.Event<SchedulerEvent>();
    onDisconnected = new js.Event();

    private _minEventId = 0;

    constructor(
        private readonly _url: string,
        private readonly _headers: { [key: string]: string } | null
    ) {
    }

    resetEvents() {
        this._minEventId = 0;
    }

    executeCommand<T>(command: ICommand<T>, suppressError: boolean = false): JQueryPromise<T> {
        var result = $.Deferred(),
            data = __assign(command.data, { command: command.code, minEventId: this._minEventId }),
            that = this;

        this.onCommandStart.trigger(command);

        const postSettings : JQueryAjaxSettings = {
            url: this._url,
            data: data
        };

        if (this._headers !== null) {
            postSettings.headers = this._headers;
        }

        $.post(postSettings)
            .done(response => {
                var comandResult = <CommandResult>response;
                if (comandResult._ok) {
                    const mappedResult = command.mapper ? command.mapper(response) : response;
                    result.resolve(mappedResult);

                    /* Events handling */
                    var eventsResult: any = mappedResult,
                        events: SchedulerEvent[] = eventsResult.Events;

                    if (events && events.length > 0) {
                        for (var i = 0; i < events.length; i++) {
                            this.onEvent.trigger(events[i]);
                        }

                        this._minEventId = __max<number>(__map(events, e => e.id));
                    }
                } else {
                    result.reject({
                        errorMessage: comandResult._err,
                        details: null
                    });
                }

                return response;
            })
            .fail(() => {
                this.onDisconnected.trigger();

                result.reject({
                    disconnected: true,
                    errorMessage: 'Server is not available'
                });
            });

        return result
            .promise()
            .always(function () {
                that.onCommandComplete.trigger(command);
            })
            .fail(function (response) {
                var comandResult = <ErrorInfo>response;

                if (!suppressError || comandResult.disconnected) {
                    that.onCommandFailed.trigger(comandResult);
                }
            });
    }
}

