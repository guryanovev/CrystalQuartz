/// <reference path="../Definitions/jquery.d.ts"/> 
/// <reference path="../Definitions/lodash.d.ts"/> 
/// <reference path="Models.ts"/> 

class SchedulerService {
    getData(): JQueryPromise<SchedulerData> {
//        var data = {
//            command: 'get_data'
//        };
//
//        return $.post('CrystalQuartzPanel.axd', data);

        return this.executeCommand<SchedulerData>(new GetDataCommand());
    }

    executeCommand<T>(command: ICommand<T>): JQueryPromise<T> {
        return $.post('CrystalQuartzPanel.axd', _.assign(command.data, { command: command.code }));
    }
}

