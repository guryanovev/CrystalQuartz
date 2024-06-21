import { ITimelineTickItem } from './common';
import DateUtils from '../utils/date';
import { View } from 'john-smith/view';

export default class TimelineTickView implements View {

    constructor(
        private readonly viewModel: ITimelineTickItem
    ) {
    }

    template() {
        return <li class="timeline-tick" style={'width: ' + this.viewModel.width + '%'}>
            <span>{this.formatDate(new Date(this.viewModel.tickDate))}</span>
        </li>;
    }

    private formatDate(date: number | Date) {
        return DateUtils.timeFormat(date);
    }
}
