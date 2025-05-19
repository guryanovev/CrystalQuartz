import { TriggerViewModel } from './trigger-view-model';
import { NullableDateView } from '../nullable-date-view';
import { DomElement, View } from 'john-smith/view';
import { TimelineSlotView } from '../../../timeline/timeline-slot-view';
import Separator from '../../../global/actions/separator';
import { ActivityStatusView } from '../activity-status-view';
import { List, Value } from 'john-smith/view/components';
import ActionView from '../../../global/actions/action-view';
import { ObservableValue } from 'john-smith/reactive';
import { OnUnrender } from 'john-smith/view/hooks';
import { DomEngine } from 'john-smith/view/dom-engine';

export class TriggerView implements View, OnUnrender {
    private readonly _removing = new ObservableValue<boolean>(false);

    constructor(private readonly viewModel: TriggerViewModel) {
    }

    public onUnrender(unrender: () => void, root: DomElement | null, domEngine: DomEngine): void {
        console.log('unrender trigger');

        this._removing.setValue(true);

        setTimeout(() => {
            unrender();
        }, 100000);
    }

    template() {
        const actions = [
                this.viewModel.pauseAction,
                this.viewModel.resumeAction,
                new Separator(),
                this.viewModel.deleteAction
            ];

        return <div
            class="data-row data-row-trigger js_triggerRow"
            $className={{ 'executing': this.viewModel.executing, 'removing': this._removing }}>
            <section class="primary-data">
                <div class="status" _click={this.viewModel.requestCurrentActivityDetails}>
                    <Value view={ActivityStatusView} model={this.viewModel}></Value>
                </div>
                <div class="actions dropdown">
                    <a href="#" class="actions-toggle dropdown-toggle" data-bs-toggle="dropdown"></a>
                    <ul class="js_actions dropdown-menu">
                        <List view={ActionView} model={actions}></List>
                    </ul>
                </div>

                <div class="data-container">
                    <a class="data-item ellipsis-link name" _click={this.viewModel.showDetails}>{this.viewModel.name}</a>
                    <section class="data-item type">{this.viewModel.triggerType}</section>
                    <section class="data-item startDate">
                        <Value view={NullableDateView} model={this.viewModel.startDate}></Value>
                    </section>
                    <section class="data-item endDate">
                        <Value view={NullableDateView} model={this.viewModel.endDate}></Value>
                    </section>
                    <section class="data-item previousFireDate">
                        <Value view={NullableDateView} model={this.viewModel.previousFireDate}></Value>
                    </section>
                    <section class="data-item nextFireDate">
                        <Value view={NullableDateView} model={this.viewModel.nextFireDate}></Value>
                    </section>
                </div>
            </section>
            <section class="timeline-data js-timeline-data">
                <Value view={TimelineSlotView} model={this.viewModel.timelineSlot}></Value>
            </section>
        </div>;
    }
}
