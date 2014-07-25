/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="SchedulerView.ts"/> 
/// <reference path="../Views/JobGroupView.ts"/> 

class CommandProgressView implements js.IView<CommandProgressViewModel> {
    template = '<section class="cq-busy">' +
                   '<div class="cq-busy-image">' +
                       '<img src="CrystalQuartzPanel.axd?path=Images.loading.gif"/>' +
                   '</div>' +
                   '<div id="currentCommand" class="cq-current-command"></div>' +
               '</section>';

    init(dom: js.IDom, viewModel: CommandProgressViewModel) {
        dom('#currentCommand').observes(viewModel.currentCommand);

        var timer = null;
        viewModel.active.listen((value => {
            if (value) {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                dom.$.stop().show();
            } else {
                timer = setTimeout(() => {
                    dom.$.fadeOut();
                }, 1000);
            }
        }));
    }
} 