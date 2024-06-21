import { List } from 'john-smith/view/components';
import Timeline from './timeline';
import TimelineTickView from './timeline-tick-view';
import { View } from 'john-smith/view';
import { map } from 'john-smith/reactive/transformers/map';

export default class TimelineCaptionsView implements View {

    constructor(
        private timeline: Timeline
    ) {
    }

    template() {
        const width = (100 + 100 * this.timeline.ticks.millisecondsPerTick / this.timeline.timelineSizeMilliseconds) + '%';
        const styles = map(
            this.timeline.ticks.shift,
            shiftPercent => `width: ${width}; left: ${-shiftPercent}%;`
        );

        return <ul class="timeline-captions" style={styles}>
            <List view={TimelineTickView} model={this.timeline.ticks.items}></List>
        </ul>;
    }
}
