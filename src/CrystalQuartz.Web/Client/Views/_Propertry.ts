/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="../Scripts/Models.ts"/> 
/// <reference path="SchedulerView.ts"/> 

class PropertyView implements js.IView<Property> {
    template = '<tr>' +
                   '<td class="name"></td>' +
                   '<td class="value"></td>' +
               '</tr>';

    init(dom: js.IDom, value: Property) {
        dom('.name').observes(value.Name);
        dom('.value').observes(value.Value);
    }
}  