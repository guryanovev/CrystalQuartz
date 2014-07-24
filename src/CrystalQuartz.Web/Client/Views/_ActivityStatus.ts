/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="SchedulerView.ts"/> 

interface IStatusAware {
    status: js.ObservableValue<ActivityStatus>;
}

class ActivityStatusView2 implements js.IView<IStatusAware> {
    template = '<span class="cq-activity-status">' +
		           '<span class="cq-activity-status-primary"></span>' +
		           '<span class="cq-activity-status-secondary"></span>' +
	           '</span>';

    init(dom: js.IDom, statusAware: IStatusAware) {
        statusAware.status.listen((newValue: ActivityStatus, oldValue?: ActivityStatus) => {
            if (oldValue) {
                dom.$.removeClass(oldValue.Code);
            } 

            if (newValue) {
                dom.$
                    .addClass(newValue.Code)
                    .attr('title', 'Status: ' + newValue.Name);
            }
        });
    }
}  