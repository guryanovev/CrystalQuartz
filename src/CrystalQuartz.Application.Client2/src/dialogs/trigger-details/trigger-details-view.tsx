import DialogViewBase from '../dialog-view-base';

import { TriggerDetailsViewModel } from './trigger-details-view-model';
import { PropertyView } from '../common/property-view';
import { List, Value } from 'john-smith/view/components';
import { OnInit } from 'john-smith/view/hooks';
import { DomElement } from 'john-smith/view';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OptionalDisposables } from 'john-smith/common';
import { RENDER_PROPERTIES } from '../common/object-browser';

// import TEMPLATE from './trigger-details.tmpl.html';

// import { RENDER_PROPERTIES } from '../common/object-browser';
// import { CHANGE_DOM_DISPLAY } from "../schedule-job/steps/view-commons";

export class TriggerDetailsView extends DialogViewBase<TriggerDetailsViewModel> implements OnInit {

    constructor(viewModel: TriggerDetailsViewModel) {
        super(viewModel, 'Trigger Details');
    }


    onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
        this.viewModel.loadDetails();

        return super.onInit(root, domEngine);
    }

    protected getBodyContent(): JSX.IElement {
        return <div class="dialog-content dialog-content-no-padding">
            <Value view={state => {
                if (state === 'ready') {
                    return <div class="js_stateReady">
                        <div class="properties-panel">
                            <header>Identity</header>
                            <table>
                                <tbody>
                                    <List view={PropertyView} model={this.viewModel.identity}></List>
                                </tbody>
                            </table>
                        </div>
                        <div class="properties-panel">
                            <header>Summary</header>
                            <table>
                                <tbody>
                                    <List view={PropertyView} model={this.viewModel.summary}></List>
                                </tbody>
                            </table>
                        </div>
                        <div class="properties-panel">
                            <header>Schedule</header>
                            <table>
                                <tbody>
                                    <List view={PropertyView} model={this.viewModel.schedule}></List>
                                </tbody>
                            </table>
                        </div>
                        <div class="properties-panel">
                            <header>Job Data Map</header>
                            <table class="object-browser">
                                {RENDER_PROPERTIES(this.viewModel.jobDataMap)}
                            </table>
                        </div>
                    </div>;
                }

                if (state === 'error') {
                    return <div class="dialog-global-error js_stateError">{this.viewModel.errorMessage}</div>;
                }

                return <div class="dialog-loading-message js_stateUnknown">
                    Loading trigger details...
                </div>;
            }} model={this.viewModel.state}></Value>
        </div>;
    }

// template = TEMPLATE;
    //
    // init(dom: js.IDom, viewModel:TriggerDetailsViewModel) {
    //     super.init(dom, viewModel);
    //
    //     const stateUi = [
    //         { code: 'unknown', dom: dom('.js_stateUnknown') },
    //         { code: 'error', dom: dom('.js_stateError') },
    //         { code: 'ready', dom: dom('.js_stateReady') }
    //     ];
    //
    //     dom.manager.manage(viewModel.state.listen(state => {
    //         CHANGE_DOM_DISPLAY(stateUi, state.toString());
    //     }));
    //
    //     dom('.js_summary').observes(viewModel.summary, PropertyView);
    //     dom('.js_identity').observes(viewModel.identity, PropertyView);
    //     dom('.js_schedule').observes(viewModel.schedule, PropertyView);
    //     dom('.js_stateError').observes(viewModel.errorMessage);
    //
    //     RENDER_PROPERTIES(dom('.js_jobDataMap'), viewModel.jobDataMap);
    //
    //     viewModel.loadDetails();
    // }
}
