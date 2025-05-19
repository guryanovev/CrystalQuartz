import TimelineSlot from './timeline-slot';
import TimelineActivity from './timeline-activity';
import { List } from 'john-smith/view/components';
import { DomElement, View } from 'john-smith/view';
import { map } from 'john-smith/reactive/transformers/map';
import { ObservableValue } from 'john-smith/reactive';
import { OnInit, OnUnrender } from 'john-smith/view/hooks';
import { OptionalDisposables } from 'john-smith/common';
import { DomEngine } from 'john-smith/view/dom-engine';

class TimelineActivityView implements View, OnInit {
    private readonly _faulted = new ObservableValue<boolean>(this.activity.faulted);

    constructor(private readonly activity: TimelineActivity) {
    }

    public onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
        return [
            this.activity.completed.listen(() => {
                this._faulted.setValue(this.activity.faulted)
            })
        ];
    }

    template() {
        const style = map(
            this.activity.position,
            position => {
                if (position === null) {
                    return '';
                }

                return 'left: ' + position.left + '%; width: ' + position.width + '%;';
            }
        );
        
        return <div
            class="timeline-item"
            $className={{
                ['key-' + this.activity.key]: true,
                'faulted': this._faulted
            }}
            style={style}
            _mouseenter={this.activity.requestSelection}
            _mouseleave={this.activity.requestDeselection}
            _click={this.activity.requestDetails}
        ></div>;
    }
}

export const TimelineSlotView = (slot: TimelineSlot) =>
    <div class="timeline-slot">
        <section class="timeline-slot-activities">
            <List view={TimelineActivityView} model={slot.activities}></List>
        </section>
    </div>;
