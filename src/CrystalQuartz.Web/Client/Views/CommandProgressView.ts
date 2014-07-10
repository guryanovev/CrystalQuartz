/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/ViewModels.ts"/> 
/// <reference path="SchedulerView.ts"/> 
/// <reference path="../Views/JobGroupView.ts"/> 

class CommandProgressView implements js.IView<CommandProgressViewModel> {
    template = '<div id="commandProgressOverlay"></div>' +
               '<section id="commandInfo">' +
                   'Executing command' +
               '</section>';

    init(dom: js.IDom, viewModel: CommandProgressViewModel) {
        dom('#commandInfo').observes(viewModel.commandsCount);

        var $overlay = dom('#commandProgressOverlay').$;
        var $popup = dom('#commandInfo').$;

        viewModel.active.listen((value => {
            if (value) {
                $overlay.show();
                $popup.show();
            } else {
                $overlay.hide();
                $popup.hide();
            }
        }));
    }
} 