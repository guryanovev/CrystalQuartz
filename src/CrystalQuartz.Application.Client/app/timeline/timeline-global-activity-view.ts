import TimelineSlot from './timeline-slot';
import {
    IActivityVerticalPosition,
    TimelineGlobalActivity
} from './timeline-global-activity';

export default class TimelineGlobalActivityView implements js.IView<TimelineGlobalActivity> {
    template = 
        `<div class="timeline-global-item">
            <span class="timeline-marker-pick js_tooltip_trigger"></span>
            <span class="timeline-marker-arrow js_tooltip_trigger"></span>
            <span class="timeline-marker-body js_tooltip_trigger"></span>
        </div>`;

    init(dom: js.IDom, activity: TimelineGlobalActivity) {
        const $root = dom.root.$/*,
              $tooltip = dom('.js_tooltip').$,
              $tooltipContent = $tooltip.find('.content')*/;

        dom.$.addClass(activity.typeCode);
        //$tooltipContent.text(activity.description);

        /*
        if (activity.typeCode === 'paused') {
            $tooltip.addClass('left');
        } else {
            $tooltip.addClass('right');
        }*/

        //var tooltipHideTrigger = null;

        dom('.js_tooltip_trigger, .js_tooltip').on('mouseenter').react(() => {
            activity.requestSelection();

//            if (tooltipHideTrigger === null) {
//                activity.requestSelection();
//
//                $tooltip
//                    .css('opacity', '1')
//                    .css('visibility', 'visible');
//            } else {
//                clearTimeout(tooltipHideTrigger);
//                tooltipHideTrigger = null;
            //}
        });

        dom('.js_tooltip_trigger, .js_tooltip').on('mouseleave').react(() => {
            activity.requestDeselection();

//            tooltipHideTrigger = setTimeout(() => {
//                $tooltip
//                    .css('opacity', '0')
//                    .css('visibility', 'hidden');
//                tooltipHideTrigger = null;
//            }, 2000);
        });

        dom.manager.manage(
            activity.position.listen(
                position => {
                    if (!position) {
                        return;
                    }

                    $root.css('left', position.left + '%');
                }
            )
        );

        dom.manager.manage(
            activity.verticalPosition.listen(
                position => {
                    if (!position) {
                        return;
                    }

                    $root
                        .css('top', (position.top * 20) + 'px')
                        .css('height', (position.height * 20) + 'px');
                }
            )
        );
    };
};