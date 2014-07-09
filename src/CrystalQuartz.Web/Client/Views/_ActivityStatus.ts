/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="SchedulerView.ts"/> 

class ActivityStatusView implements js.IView<ActivityStatus> {
    template = '<span class="$activity.Status.ToString().ToLower()">' +
		           '<img title="Status: $activity.Status" alt = "$activity.Status" src = "" >' +
	           '</span>';

    init(dom: js.IDom, value: ActivityStatus) {
        dom.$.addClass(value.Code);
        dom('img').$
            .attr('title', 'Status: ' + value.Name)
            .attr('alt', value.Name)
            .attr('src', 'CrystalQuartzPanel.axd?path=Images.status' + value.Name + '.png');
    }
}  