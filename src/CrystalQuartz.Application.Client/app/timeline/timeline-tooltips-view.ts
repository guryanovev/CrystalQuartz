import Timeline from './timeline';
import { TimelineGlobalActivity } from './timeline-global-activity';
import GlobalActivitiesSynchronizer from '../global-activities-synchronizer';

export default class TimelineTooltipsView implements js.IDisposable {
    constructor(private globalActivitiesSynchronizer: GlobalActivitiesSynchronizer) {
    }

    render(dom: js.IListenerDom, timeline: Timeline) {

        var $currentTooltip: JQuery = null,
            positionListener: js.IDisposable;

        var disposeCurrentTooltip = () => {
            if ($currentTooltip) {
                $currentTooltip.remove();
                positionListener.dispose();
            }
        };

        timeline.selectedActivity.listen(data => {
            disposeCurrentTooltip();

            if (data) {
                const activity = data.activity,
                      isGlobal = data.slot === null;

                $currentTooltip = $(
                    `<div class="timeline-tooltip js_tooltip" style="opacity: 1; visibility: visible;">
                        <div class="arrow"></div>
                        <div class="content">${activity.description}</div>
                    </div>`);

                if (!isGlobal) {
                    $currentTooltip.addClass('local');
                    $currentTooltip.css('bottom', (this.globalActivitiesSynchronizer.getSlotIndex(data.slot, true) * 20) + 'px');
                } else {
                    const globalActivity = <TimelineGlobalActivity>activity;

                    $currentTooltip.addClass(globalActivity.typeCode);
                    $currentTooltip.css('top', (globalActivity.verticalPosition.getValue().top * 20) + 'px');
                }

                positionListener = activity.position.listen(p => {
                    if (p) {
                        if (isGlobal) {
                            $currentTooltip.css('left', p.left + '%');
                        } else {
                            $currentTooltip.css('left', (p.left + p.width/2) + '%');
                        }
                    }
                });

                dom.$.append($currentTooltip);

                $currentTooltip.on('mouseenter', () => timeline.preserveCurrentSelection());
                $currentTooltip.on('mouseleave', () => timeline.resetCurrentSelection());
            }
        });
    }

    dispose(): void {
        
    }
}