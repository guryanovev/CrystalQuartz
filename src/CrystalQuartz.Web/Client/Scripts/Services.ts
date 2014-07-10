/// <reference path="../Definitions/jquery.d.ts"/> 
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Definitions/lodash.d.ts"/> 
/// <reference path="Models.ts"/> 

class SchedulerService {
    onCommandStart = new js.Event<ICommand<any>>();
    onCommandComplete = new js.Event<ICommand<any>>();

    getData(): JQueryPromise<SchedulerData> {
        return this.executeCommand<SchedulerData>(new GetDataCommand());
    }

    executeCommand<T>(command: ICommand<T>): JQueryPromise<T> {
        var data = _.assign(command.data, { command: command.code });

        this.onCommandStart.trigger(command);

        return $.post('CrystalQuartzPanel.axd', data)
            .done(result => {
                this.onCommandComplete.trigger(command);
                return result;
            });
    }
    }

