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

    getData(): JQueryPromise<SchedulerData> {
        return this.executeCommand<SchedulerData>(new GetDataCommand());
    }

    executeCommand<T>(command: ICommand<T>): JQueryPromise<T> {
        var result = $.Deferred(),
            data = _.assign(command.data, { command: command.code }),
            that = this;

        this.onCommandStart.trigger(command);

        $.post('CrystalQuartzPanel.axd', data)
            .done(response => {
                var comandResult = <CommandResult> response;
                if (comandResult.Success) {
                    result.resolve(response);
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

