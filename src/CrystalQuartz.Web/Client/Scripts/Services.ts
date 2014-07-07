/// <reference path="../Definitions/jquery.d.ts"/> 
/// <reference path="Models.ts"/> 

class SchedulerService {
    getData(): JQueryPromise<SchedulerData> {
        var data = {
            command: 'get_data'
        };

        return $.post('CrystalQuartzPanel.axd', data);
    }
}