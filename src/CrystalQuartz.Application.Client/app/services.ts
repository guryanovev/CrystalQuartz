import { ICommand } from './commands/contracts';
import { Property, SchedulerEvent } from './api';

import __assign from 'lodash/assign';
import __map from 'lodash/map';
import __max from 'lodash/max';

//import * as _ from 'lodash';

export interface CommandResult {
    _ok: boolean;
    _err: string;
}

export interface ErrorInfo {
    errorMessage: string;
    details?: Property[];
}

export class CommandService {
    onCommandStart = new js.Event<ICommand<any>>();
    onCommandComplete = new js.Event<ICommand<any>>();
    onCommandFailed = new js.Event<ErrorInfo>();
    onEvent = new js.Event<SchedulerEvent>();

    private _minEventId = 0;

    executeCommand<T>(command: ICommand<T>): JQueryPromise<T> {
        var result = $.Deferred(),
            data = __assign(command.data, { command: command.code, minEventId: this._minEventId }),
            that = this;

        this.onCommandStart.trigger(command);

        $.post('', data)
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

                        this._minEventId = __max<number>(__map(events, e => e.Id));
                    }
                } else {
                    result.reject({
                        errorMessage: comandResult._err,
                        details: null
                    });
                }

                return response;
            })
            .fail(function () {
                result.reject({
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
                that.onCommandFailed.trigger(comandResult);
            });
    }
}

