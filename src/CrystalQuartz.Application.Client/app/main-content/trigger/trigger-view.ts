import { Trigger  } from '../../api';

import { TriggerViewModel } from './trigger-view-model';

import { ActivityView } from '../activity-view';
import { NullableDateView } from '../nullable-date-view';
import TimelineSlotView from '../../timeline/timeline-slot-view';

import TEMPLATE from './trigger.tmpl.html';

import Action from '../../global/actions/action';
import Separator from '../../global/actions/separator';

export class TriggerView extends ActivityView<TriggerViewModel> {
    template = <string>TEMPLATE;

    init(dom: js.IDom, viewModel: TriggerViewModel) {
        super.init(dom, viewModel);
               
        if (viewModel.environment.IsReadOnly) {dom('.js_shown').$.hide();};
        dom('.js-timeline-data').render(TimelineSlotView, viewModel.timelineSlot);

        dom('.status').on('click').react(viewModel.requestCurrentActivityDetails);
        dom('.startDate').observes(viewModel.startDate, NullableDateView);
        dom('.endDate').observes(viewModel.endDate, NullableDateView);
        dom('.previousFireDate').observes(viewModel.previousFireDate, NullableDateView);
        dom('.nextFireDate').observes(viewModel.nextFireDate, NullableDateView);
        dom('.type').observes(viewModel.triggerType);

        dom('.name').on('click').react(viewModel.showDetails);

        var $row = dom('.js_triggerRow').$;

        dom.manager.manage(viewModel.executing.listen(isExecuting => {
            if (isExecuting) {
                $row.addClass("executing");
            } else {
                $row.removeClass("executing");
            }
        }));

        /*
        dom.onUnrender().listen(() => {
            dom('.name').$.text(viewModel.name);
            dom('.type').$.text('Trigger complete');

            var $root = dom.root.$;
            $root.css('background', '#CCCCCC');
            $root.fadeOut('slow', () => {
                dom.root.remove();
            });
        });*/
    }

    composeActions(viewModel: TriggerViewModel): (Action | Separator)[] {
        return [
            viewModel.pauseAction,
            viewModel.resumeAction,
            new Separator(),
            viewModel.deleteAction
        ];
    }
}   