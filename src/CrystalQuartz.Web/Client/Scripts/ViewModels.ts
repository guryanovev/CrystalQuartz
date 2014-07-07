/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="Models.ts"/>

class ApplicationViewModel {
    schedulerName = js.observableValue<string>();

    setData(data: SchedulerData) {
        this.schedulerName.setValue(data.Name);
    }
} 