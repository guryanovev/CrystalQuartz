import DialogViewBase from '../dialog-view-base';

import { TriggerDetailsViewModel } from './trigger-details-view-model';
import PropertyView from '../common/property-view';

import TEMPLATE from './trigger-details.tmpl.html';

import { RENDER_PROPERTIES } from '../common/object-browser';
import { CHANGE_DOM_DISPLAY } from "../schedule-job/steps/view-commons";

export class TriggerDetailsView extends DialogViewBase<TriggerDetailsViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel:TriggerDetailsViewModel) {
        super.init(dom, viewModel);

        const stateUi = [
            { code: 'unknown', dom: dom('.js_stateUnknown') },
            { code: 'error', dom: dom('.js_stateError') },
            { code: 'ready', dom: dom('.js_stateReady') }
        ];

        dom.manager.manage(viewModel.state.listen(state => {
            CHANGE_DOM_DISPLAY(stateUi, state.toString());
        }));

        dom('.js_summary').observes(viewModel.summary, PropertyView);
        dom('.js_identity').observes(viewModel.identity, PropertyView);
        dom('.js_schedule').observes(viewModel.schedule, PropertyView);
        dom('.js_stateError').observes(viewModel.errorMessage);

        RENDER_PROPERTIES(dom('.js_jobDataMap'), viewModel.jobDataMap);

        viewModel.loadDetails();
    }
}