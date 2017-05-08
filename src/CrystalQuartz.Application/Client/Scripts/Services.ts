/// <reference path="../Definitions/jquery.d.ts"/> 
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Definitions/lodash.d.ts"/> 
/// <reference path="Models.ts"/> 

interface CommandResult {
    Success: boolean;
    ErrorMessage: string;
    ErrorDetails: Property[];
}

interface ErrorInfo {
    errorMessage: string;
    details?: Property[];
}

class SchedulerService {
    onCommandStart = new js.Event<ICommand<any>>();
    onCommandComplete = new js.Event<ICommand<any>>();
    onCommandFailed = new js.Event<ErrorInfo>();

    private _minEventId = 0;

    getData(): JQueryPromise<SchedulerData> {
        return this.executeCommand<SchedulerData>(new GetDataCommand());
    }

    executeCommand<T>(command: ICommand<T>): JQueryPromise<T> {
        var result = $.Deferred(),
            data = _.assign(command.data, { command: command.code, minEventId: this._minEventId }),
            that = this;

        this.onCommandStart.trigger(command);

        $.post('', data)
            .done(response => {
                var comandResult = <CommandResult> response;
                if (comandResult.Success) {
                    result.resolve(response);

                    /* Events handling */
                    var eventsResult: any = comandResult,
                        events: any[] = eventsResult.Events;

                    if (events && events.length > 0) {
                        this._minEventId = _.max(_.map(events, e => e.Id));
                    }
                } else {
                    result.reject({
                        errorMessage: comandResult.ErrorMessage,
                        details: comandResult.ErrorDetails
                    });
                }
                
                return response;
            })
            .fail(function() {
                result.reject({
                    errorMessage: 'Unknown error while executing the command'
                });
            });

        return result
            .promise()
            .always(function () {
                that.onCommandComplete.trigger(command);
            })
            .fail(function(response) {
                var comandResult = <ErrorInfo> response;
                that.onCommandFailed.trigger(comandResult);
            });
    }
}

