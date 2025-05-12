import TimelineSlot from './timeline-slot';
import TimelineActivity from './timeline-activity';
import { List } from 'john-smith/view/components';
import { View } from 'john-smith/view';
import { map } from 'john-smith/reactive/transformers/map';

class TimelineActivityView implements View {

    constructor(private readonly activity: TimelineActivity) {
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
                'faulted': map(this.activity.completed, () => this.activity.faulted)
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
