import DialogViewBase from '../dialog-view-base';

import ViewModel from './job-details-view-model';
import { PropertyView } from '../common/property-view';
import JobDetailsViewModel from './job-details-view-model';
import { List, Value } from 'john-smith/view/components';
import { DomElement } from 'john-smith/view';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OptionalDisposables } from 'john-smith/common';
import { RENDER_PROPERTIES } from '../common/object-browser';

// import TEMPLATE from './job-details.tmpl.html';

// import { RENDER_PROPERTIES } from '../common/object-browser';
// import { CHANGE_DOM_DISPLAY } from "../schedule-job/steps/view-commons";

export default class JobDetailsView extends DialogViewBase<ViewModel> {
    constructor(viewModel: JobDetailsViewModel) {
        super(viewModel, 'Job Details');
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
                            <table class="js_identity">
                                <List view={PropertyView} model={this.viewModel.identity}></List>
                            </table>
                        </div>
                        <div class="properties-panel">
                            <header>Summary</header>
                            <table class="js_summary">
                                <List view={PropertyView} model={this.viewModel.summary}></List>
                            </table>
                        </div>
                        <div class="properties-panel">
                            <header>Job Data Map</header>
                            <table class="js_jobDataMap object-browser">
                                {RENDER_PROPERTIES(this.viewModel.jobDataMap)}
                            </table>
                        </div>
                    </div>
                }

                if (state === 'error') {
                    return <div class="dialog-global-error js_stateError">{this.viewModel.errorMessage}</div>;
                }

                return <div class="dialog-loading-message js_stateUnknown">
                    Loading Job details...
                </div>
            }} model={this.viewModel.state}></Value>





                </div>;
            }

// template = TEMPLATE;
    //
    // init(dom: js.IDom, viewModel:ViewModel) {
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
    //     RENDER_PROPERTIES(dom('.js_jobDataMap'), viewModel.jobDataMap);
    //
    //     viewModel.loadDetails();
    // }
}
