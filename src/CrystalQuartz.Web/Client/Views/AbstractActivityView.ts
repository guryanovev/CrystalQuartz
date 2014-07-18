/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="_NullableDate.ts"/> 
/// <reference path="_ActivityStatus.ts"/> 

class ActivityView<T extends ManagableActivity> implements js.IView<ManagableActivityViewModel<T>> {
    template = ''; // abstract

    init(dom: js.IDom, viewModel: ManagableActivityViewModel<T>) {
        dom('.name').observes(viewModel.name);

        dom('.status').observes(viewModel, ActivityStatusView2);

        viewModel.canPause.listen((value) => {
            if (value) {
                dom('.actions .pause').$.removeClass('disabled');
            } else {
                dom('.actions .pause').$.addClass('disabled');
            }
        });

        viewModel.canStart.listen((value) => {
            if (value) {
                dom('.actions .resume').$.removeClass('disabled');
            } else {
                dom('.actions .resume').$.addClass('disabled');
            }
        });

        dom('.actions .pause').on('click').react(viewModel.pause);
        dom('.actions .resume').on('click').react(viewModel.resume);
    }
}   