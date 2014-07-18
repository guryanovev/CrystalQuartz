/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="_NullableDate.ts"/> 
/// <reference path="_ActivityStatus.ts"/> 

class ActivityView<T extends ManagableActivity> implements js.IView<ManagableActivityViewModel<T>> {
    template = ''; // abstract

    init(dom: js.IDom, viewModel: ManagableActivityViewModel<T>) {
        dom('.name').observes(viewModel.name);

        dom('.status').observes(viewModel, ActivityStatusView2);

        var $$pause = dom('.actions .pause');
        var $$resume = dom('.actions .resume');

        viewModel.canPause.listen((value) => {
            if (value) {
                $$pause.$.removeClass('disabled');
            } else {
                $$pause.$.addClass('disabled');
            }
        });
        
        viewModel.canStart.listen((value) => {
            if (value) {
                $$resume.$.removeClass('disabled');
            } else {
                $$resume.$.addClass('disabled');
            }
        });

        this.handleClick($$pause, viewModel.pause, viewModel);
        this.handleClick($$resume, viewModel.resume, viewModel);
    }

    private handleClick(link: js.IListenerDom, callback: () => void, viewModel: any) {
        var $link = link.$;
        link.on('click').react(() => {
            if (!$link.is('.disabled')) {
                callback.call(viewModel);
            }
        });
    }
}   