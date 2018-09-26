import { NullableDate, SchedulerEventScope} from '../api';

import Timeline from './timeline';
import { TimelineGlobalActivity } from './timeline-global-activity';
import TimelineActivity from './timeline-activity';
import GlobalActivitiesSynchronizer from '../global-activities-synchronizer';
import { NullableDateView } from '../main-content/nullable-date-view';
import {TimelineActivityViewModel} from "./timeline-activity-view-model";
import {ActivityStateView} from "../global/activities/activity-state-view";

class RenderedTooltip implements js.IDisposable {
    constructor(
        public $root: JQuery,
        private positionListener: js.IDisposable,
        private renderedView: js.IDisposable
    ){}

    dispose(){
        this.$root.find('.js_actual_content').removeClass('js_actual_content');
        this.$root.addClass('closing');

        setTimeout(() => {
            this.$root.remove();
            this.positionListener.dispose();
            this.renderedView.dispose();
        }, 1000);
    }
}

export default class TimelineTooltipsView implements js.IDisposable {
    constructor(private globalActivitiesSynchronizer: GlobalActivitiesSynchronizer) {
    }

    render(dom: js.IListenerDom, timeline: Timeline) {
        var currentTooltip: RenderedTooltip = null;

        var disposeCurrentTooltip = () => {
            if (currentTooltip) {
                currentTooltip.dispose();
                currentTooltip = null;
            }
        };

        const
            localTooltipWidth = 300,
            localTooltipWidthHalf = localTooltipWidth / 2,
            localTooltipPickMargin = 6,
            localTooltipMinLeftArrowMargin = 6;

        timeline.selectedActivity.listen(data => {
            disposeCurrentTooltip();

            if (data) {
                const activity = data.activity,
                      isGlobal = data.slot === null;

                var $currentTooltip = $(
                    `<div class="timeline-tooltip js_tooltip">
                        <div class="arrow"></div>
                        <div class="content js_actual_content"></div>
                    </div>`),
                    $currentTooltipContent = $currentTooltip.find('.content');

                if (!isGlobal) {
                    $currentTooltip.addClass('local');
                    $currentTooltip.css('bottom', (this.globalActivitiesSynchronizer.getSlotIndex(data.slot, true) * 20) + 'px');
                } else {
                    const globalActivity = <TimelineGlobalActivity>activity;

                    $currentTooltip.addClass('global');
                    $currentTooltip.addClass(globalActivity.typeCode);
                    $currentTooltip.css('top', (globalActivity.verticalPosition.getValue().top * 20) + 'px');
                }

                var positionListener = activity.position.listen(p => {
                    if (p) {
                        if (isGlobal) {
                            $currentTooltip.css('left', p.left + '%');
                        } else {
                            const
                                containerWidth = dom.$.width(),
                                tooltipPointerOriginPercent = p.left + p.width / 2,
                                tooltipOrigin = containerWidth * tooltipPointerOriginPercent / 100 - localTooltipPickMargin;

                            let contentLeft: number;

                            if (tooltipOrigin < localTooltipWidthHalf) {
                                contentLeft = tooltipOrigin >= localTooltipMinLeftArrowMargin ? -tooltipOrigin : -localTooltipMinLeftArrowMargin;
                            } else if (tooltipOrigin + localTooltipWidthHalf > containerWidth) {
                                contentLeft = -(localTooltipWidth - (containerWidth - tooltipOrigin));
                            } else {
                                contentLeft = -localTooltipWidthHalf;
                            }

                            $currentTooltipContent.css('left', contentLeft + 'px');

                            $currentTooltip.css('left', tooltipPointerOriginPercent + '%');
                        }
                    }
                });

                dom.$.append($currentTooltip);

                var renderedView = js.dom('.js_tooltip .js_actual_content')
                    .render(isGlobal ? GlobalActivityTooltipView : TriggerActivityTooltipView, activity);

                currentTooltip = new RenderedTooltip($currentTooltip, positionListener,  renderedView);

                setTimeout(() => {
                    if (currentTooltip) {
                        currentTooltip.$root.addClass('visible');
                    }
                }, 100);

                $currentTooltip.on('mouseenter', () => timeline.preserveCurrentSelection());
                $currentTooltip.on('mouseleave', () => timeline.resetCurrentSelection());
            }
        });
    }

    dispose(): void {
        
    }
}

class GlobalActivityTooltipView implements js.IView<TimelineGlobalActivity> {
    template =
`<p class="tooltip-content"><span class="js_message"></span> at </p>
<p class="tooltip-content"><span class="js_date"></span></p>`;

    init(dom: js.IDom, viewModel: TimelineGlobalActivity) {
        dom('.js_message').observes(SchedulerEventScope[viewModel.scope] + ' ' + viewModel.typeCode);
        dom('.js_date').observes(new NullableDate(viewModel.startedAt), NullableDateView);
    }
}

export class TriggerActivityTooltipView implements js.IView<TimelineActivity> {
    template =
`<table class="tooltip-content">
    <tr>
        <td rowspan="3" class="js_state icon-only" style="padding: 3px 0 0 0; vertical-align: top;"></td>
        <th>Trigger fired at</th>
        <td class="js_startedAt"></td>
        
    </tr>
    <tr>
        <th>Trigger completed at</th>
        <td class="js_completedAt"></td>
    </tr>
    <tr>
        <th>Duration</th>
        <td style="color: #dec82f;">
            <span class="js_durationValue"></span>
            <span class="js_durationUnit"></span>
        </td>
    </tr>
</table>`;

    init(dom: js.IDom, viewModel: TimelineActivity): void {
        const activityViewModel = new TimelineActivityViewModel(viewModel);

        dom.manager.manage(activityViewModel);

        const duration = activityViewModel.duration;

        dom('.js_durationValue').observes(duration.value);
        dom('.js_durationUnit').observes(duration.measurementUnit);

        dom('.js_startedAt').observes(new NullableDate(viewModel.startedAt), NullableDateView);
        dom('.js_completedAt').observes(activityViewModel.completedAt, NullableDateView);
        dom('.js_state').observes(activityViewModel.status, ActivityStateView);

        activityViewModel.init();
    }
}