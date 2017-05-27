import { ITimelineTickItem } from './common';

export default class TimelineTickView implements js.IView<ITimelineTickItem> {
    template = '<li class="timeline-tick"><span></span></li>';

    init(dom: js.IDom, viewModel: ITimelineTickItem) {
        dom('span').observes(this.formatDate(new Date(viewModel.tickDate)));
        dom.root.$.css('width', viewModel.width + '%');
    };

    private formatDate(date) {
        /* todo: cross-culture implementation */
        var minutes = date.getMinutes(),
            seconds = date.getSeconds();

        return date.getHours() + ':' +
            (minutes <= 9 ? '0' : '') + minutes +
            ':' +
            (seconds <= 9 ? '0' : '') + seconds;
    }
}