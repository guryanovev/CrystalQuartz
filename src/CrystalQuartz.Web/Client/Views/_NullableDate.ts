/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="SchedulerView.ts"/> 

class NullableDateView implements js.IView<NullableDate> {
    template = '<span class="cq-date"></span>';

    init(dom: js.IDom, value: NullableDate) {
        if (value.isEmpty()) {
            dom.$.append('<span class="cq-none">[none]</span>');
        } else {
            dom.$.append(value.getDateString());
        }
    }
} 