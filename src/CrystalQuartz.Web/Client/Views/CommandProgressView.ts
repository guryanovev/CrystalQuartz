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

        viewModel.active.listen((value => {
            if (value) {
                dom.$.fadeIn();
                dom.$.fadeIn();
            } else {
                setTimeout(() => {
                    dom.$.fadeOut();
                    dom.$.fadeOut();
                }, 1000);
            }
        }));
    }
} 