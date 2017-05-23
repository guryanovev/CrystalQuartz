import { Trigger  } from '../../api';

import { TriggerViewModel } from './trigger-view-model';

import { ActivityView } from '../activity-view';
import { NullableDateView } from '../nullable-date-view';

export class TriggerView extends ActivityView<Trigger> {
    template = "#TriggerView";

    init(dom: js.IDom, viewModel: TriggerViewModel) {
        super.init(dom, viewModel);
        dom('.startDate').observes(viewModel.startDate, NullableDateView);
        dom('.endDate').observes(viewModel.endDate, NullableDateView);
        dom('.previousFireDate').observes(viewModel.previousFireDate, NullableDateView);
        dom('.nextFireDate').observes(viewModel.nextFireDate, NullableDateView);
        dom('.type').observes(viewModel.triggerType);

        dom.onUnrender().listen(() => {
            dom('.name').$.text(viewModel.name);
            dom('.type').$.text('Trigger complete');

            var $root = dom.root.$;
            $root.css('background', '#CCCCCC');
            $root.fadeOut('slow', () => {
                dom.root.remove();
            });
        });
    }


}   