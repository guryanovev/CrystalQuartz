/// <reference path="../Definitions/john-smith-latest.d.ts"/> 
/// <reference path="../Scripts/Timeline.ts"/> 

class TimelineActivityView implements js.IView<TimelineActivity> {
    template = '<div class="timeline-item"></div>';

    init(dom: js.IDom, activity: TimelineActivity) {
        var $root = dom.root.$;

        var wire = activity.position.listen(position => {
            if (!position) {
                return;
            }

            $root
                .css('left', position.left + '%')
                .css('width', position.width + '%');
        });

        dom.onUnrender().listen(() => {
            wire.dispose();
        });
    };
};

class TimelineSlotView implements js.IView<TimelineSlot> {
    template = '<div class="timeline-slot"><div class="timeline-slot-title"><span></span></div><section class="timeline-slot-activities"></section></div>';

    init(dom: js.IDom, slot:TimelineSlot) {
        dom('span').observes(slot.title);
        dom('.timeline-slot-activities').observes(slot.activities, TimelineActivityView);
    };
};

class TimelineTickView implements js.IView<ITimelineTickItem> {
    template = '<div class="timeline-tick"><div class="timeline-tick-border"></div><span><p></p></span></div>';

    init(dom: js.IDom, viewModel: ITimelineTickItem) {
        dom('p').observes(this.formatDate(new Date(viewModel.tickDate)));
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
};

class TimelineView implements js.IView<Timeline> {
    template = '#TimelineView';

    init(dom: js.IDom, timeline: Timeline) {
        var $ticks = dom('.timeline-captions');
        $ticks.observes(timeline.ticks.items, TimelineTickView);
        dom('.timeline-body').observes(timeline.slots, TimelineSlotView);

        $ticks.$.css('width', (100 + 100 * timeline.ticks.millisecondsPerTick / timeline.timelineSizeMilliseconds) + '%');

        var wire = timeline.ticks.shift.listen(shiftPercent => {
            $ticks.$.css('left', (- shiftPercent) + '%');
        });

        dom.onUnrender().listen(() => {
            wire.dispose();
        });
    }
}