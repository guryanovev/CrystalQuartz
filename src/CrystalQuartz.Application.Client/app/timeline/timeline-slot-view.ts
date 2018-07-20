import TimelineSlot from './timeline-slot';
import TimelineActivity from './timeline-activity';

class TimelineActivityView implements js.IView<TimelineActivity> {
    template = '<div class="timeline-item"></div>';

    init(dom: js.IDom, activity: TimelineActivity) {
        var $root = dom.root.$;

        dom.$.addClass('key-' + activity.key);

        dom('.timeline-item').on('mouseenter').react(() => activity.requestSelection());
        dom('.timeline-item').on('mouseleave').react(() => activity.requestDeselection());

        var wire = activity.position.listen(position => {
            if (!position) {
                return;
            }

            $root
                .css('left', position.left + '%')
                .css('width', position.width + '%');
        });

        dom.manager.manage(wire);
    };
};

export default class TimelineSlotView implements js.IView<TimelineSlot> {
    template = '<div class="timeline-slot"><section class="timeline-slot-activities"></section></div>';

    init(dom: js.IDom, slot: TimelineSlot) {
        dom('.timeline-slot-activities').observes(slot.activities, TimelineActivityView);
    };
};