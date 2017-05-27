import TimelineSlot from './timeline-slot';
import TimelineActivity from './timeline-activity';

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

export default class TimelineSlotView implements js.IView<TimelineSlot> {
    template = '<div class="timeline-slot"><div class="timeline-slot-title"><span></span></div><section class="timeline-slot-activities"></section></div>';

    init(dom: js.IDom, slot: TimelineSlot) {
        dom('span').observes(slot.title);
        dom('.timeline-slot-activities').observes(slot.activities, TimelineActivityView);
    };
};