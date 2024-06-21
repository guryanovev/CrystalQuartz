import TimelineSlot from './timeline-slot';
import {
    IActivityVerticalPosition,
    TimelineGlobalActivity
} from './timeline-global-activity';
import { View } from 'john-smith/view';

export default class TimelineGlobalActivityView implements View {

    constructor(
        private readonly activity: TimelineGlobalActivity
    ) {
    }

    template = () =>
        <div class="timeline-global-item">
            <span class="timeline-marker-pick js_tooltip_trigger"></span>
            <span class="timeline-marker-arrow js_tooltip_trigger"></span>
            <span class="timeline-marker-body js_tooltip_trigger"></span>
        </div>;

    // init(dom: js.IDom, activity: TimelineGlobalActivity) {
    //     const $root = dom.root.$;
    //
    //     dom.$.addClass(activity.typeCode);
    //
    //     dom('.js_tooltip_trigger, .js_tooltip').on('mouseenter').react(() => {
    //         activity.requestSelection();
    //     });
    //
    //     dom('.js_tooltip_trigger, .js_tooltip').on('mouseleave').react(() => {
    //         activity.requestDeselection();
    //     });
    //
    //     dom.manager.manage(
    //         activity.position.listen(
    //             position => {
    //                 if (!position) {
    //                     return;
    //                 }
    //
    //                 $root.css('left', position.left + '%');
    //             }
    //         )
    //     );
    //
    //     dom.manager.manage(
    //         activity.verticalPosition.listen(
    //             position => {
    //                 if (!position) {
    //                     return;
    //                 }
    //
    //                 $root
    //                     .css('top', (position.top * 20) + 'px')
    //                     .css('height', (position.height * 20) + 'px');
    //             }
    //         )
    //     );
    // };
};
