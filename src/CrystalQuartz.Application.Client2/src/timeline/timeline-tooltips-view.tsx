import { Activity, NullableDate, SchedulerEventScope } from '../api';

import Timeline, { ISelectedActivityData } from './timeline';
import { TimelineGlobalActivity } from './timeline-global-activity';
import TimelineActivity from './timeline-activity';
import GlobalActivitiesSynchronizer from '../global-activities-synchronizer';
import { NullableDateView } from '../main/main-content/nullable-date-view';
import {TimelineActivityViewModel} from "./timeline-activity-view-model";
import {ActivityStateView} from "../global/activities/activity-state-view";
import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { Disposable, OptionalDisposables } from 'john-smith/common';
import { Value } from 'john-smith/view/components';
import { map } from 'john-smith/reactive/transformers/map';
import { OnInit } from 'john-smith/view/hooks';
import { DomEngine } from 'john-smith/view/dom-engine';
import TimelineSlot from './timeline-slot';
import { Listenable } from 'john-smith/reactive';
import { ActivityStatusView } from '../main/main-content/activity-status-view';

class RenderedTooltip implements Disposable {
    constructor(
        public $root: any, // todo
        private positionListener: Disposable,
        private renderedView: Disposable
    ) {
    }

    dispose() {
        this.$root.find('.js_actual_content').removeClass('js_actual_content');
        this.$root.addClass('closing');

        setTimeout(() => {
            this.$root.remove();
            this.positionListener.dispose();
            this.renderedView.dispose();
        }, 1000);
    }
}

export class LocalTooltipView implements View, OnInit {
    private _activityViewModel: TimelineActivityViewModel;

    constructor(
        private readonly viewModel: {
            activity: TimelineActivity,
            slot: TimelineSlot,
            globalActivitiesSynchronizer: GlobalActivitiesSynchronizer,
            containerWidthCalculator: () => number
    }) {
        this._activityViewModel = new TimelineActivityViewModel(viewModel.activity);
    }

    template(): HtmlDefinition {
        const activity = this.viewModel.activity;

        const
            localTooltipWidth = 300,
            localTooltipWidthHalf = localTooltipWidth / 2,
            localTooltipPickMargin = 6,
            localTooltipMinLeftArrowMargin = 6;

        let classes: Record<string, boolean> = { 'local': true };
        let styles =  'bottom: ' + (this.viewModel.globalActivitiesSynchronizer.getSlotIndex(this.viewModel.slot, true)! * 20) + 'px';

        const transformedPosition: Listenable<[number, number]> = map(this.viewModel.activity.position, p => {
            if (p === null) {
                return [0, 0];
            }

            const
                containerWidth = this.viewModel.containerWidthCalculator(),
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

            return [tooltipPointerOriginPercent, contentLeft];
        });

        return <div class="timeline-tooltip js_tooltip" $className={classes} style={map(transformedPosition, p => styles + '; left: ' + p[0] + '%')}>
            <div class="arrow"></div>
            <div class="content js_actual_content" style={map(transformedPosition, p => 'left: ' + p[1] + 'px')}>
                <table class="tooltip-content">
                    <tr>
                        <td rowspan="3" class="js_state icon-only"
                            style="padding: 3px 0 0 0; vertical-align: top;">
                            <Value view={ActivityStateView} model={this._activityViewModel.status}></Value>
                        </td>
                        <th>Trigger fired at</th>
                        <td class="js_startedAt">
                            <Value view={NullableDateView} model={this._activityViewModel.startedAt}></Value>
                        </td>
                    </tr>
                    <tr>
                        <th>Trigger completed at</th>
                        <td class="js_completedAt">
                            <Value view={NullableDateView} model={this._activityViewModel.completedAt}></Value>
                        </td>
                    </tr>
                    <tr>
                        <th>Duration</th>
                        <td style="color: #dec82f;">
                            <span class="js_durationValue">{this._activityViewModel.duration.value}</span>
                            <span class="js_durationUnit">{this._activityViewModel.duration.measurementUnit}</span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>;
    }

    /** @inheritdoc */
    onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
        this._activityViewModel.init();

        setTimeout(() => {
            if (root !== null) {
                root.createClassNames().add('visible');
            }
        }, 100);

        return this._activityViewModel;
    }
}

export class TooltipView implements View, OnInit {
    constructor(
        private readonly viewModel: {
            data: ISelectedActivityData,
            globalActivitiesSynchronizer: GlobalActivitiesSynchronizer,
            containerWidthCalculator: () => number
        }
    ) {
    }

    template() {
        const activity = this.viewModel.data.activity,
              isGlobal = this.viewModel.data.slot === null;

            const
                localTooltipWidth = 300,
                localTooltipWidthHalf = localTooltipWidth / 2,
                localTooltipPickMargin = 6,
                localTooltipMinLeftArrowMargin = 6;

        let classes: Record<string, boolean> = { 'local': !isGlobal, 'global': isGlobal };
        let styles = '';

        if (isGlobal) {
            const globalActivity = activity as TimelineGlobalActivity;
            classes[globalActivity.typeCode] = true;

            styles = 'top: ' + (globalActivity.verticalPosition.getValue()!.top * 20) + 'px';
        } else {
            styles = 'bottom: ' + (this.viewModel.globalActivitiesSynchronizer.getSlotIndex(this.viewModel.data.slot, true)! * 20) + 'px';
        }

        let actualStyles = map(this.viewModel.data.activity.position, p => {
            if (p === null) {
                return undefined;
            }

            if (isGlobal) {
                return styles;
            }

            const
                containerWidth = this.viewModel.containerWidthCalculator(),
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

            //$currentTooltipContent.css('left', contentLeft + 'px');

            return styles + '; left: ' + tooltipPointerOriginPercent + '%';
        })

        return <div class="timeline-tooltip js_tooltip" $className={classes} style={actualStyles}>
            <div class="arrow"></div>
            <div class="content js_actual_content">content goes here</div>
        </div>;
    }

    onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {
        setTimeout(() => {
            if (root !== null) {
                root.createClassNames().add('visible');
            }
        }, 100);
    }
}

export class TimelineTooltipsView implements View {
    constructor(private viewModel: { globalActivitiesSynchronizer: GlobalActivitiesSynchronizer, timeline: Timeline, containerWidthCalculator: () => number }) {
    }

    template(): HtmlDefinition {
        return <Value view={selectedActivity => {
            if (selectedActivity.slot === null) {
                return <span>todo</span>;
            }

            return <Value view={LocalTooltipView} model={{
                globalActivitiesSynchronizer: this.viewModel.globalActivitiesSynchronizer,
                activity: selectedActivity.activity,
                slot: selectedActivity.slot,
                containerWidthCalculator: this.viewModel.containerWidthCalculator
            }}></Value>;
        }} model={this.viewModel.timeline.selectedActivity}></Value>
    }

    // render(dom: js.IListenerDom, timeline: Timeline) {
    //     var currentTooltip: RenderedTooltip = null;
    //
    //     var disposeCurrentTooltip = () => {
    //         if (currentTooltip) {
    //             currentTooltip.dispose();
    //             currentTooltip = null;
    //         }
    //     };
    //
    //     const
    //         localTooltipWidth = 300,
    //         localTooltipWidthHalf = localTooltipWidth / 2,
    //         localTooltipPickMargin = 6,
    //         localTooltipMinLeftArrowMargin = 6;
    //
    //     timeline.selectedActivity.listen(data => {
    //         disposeCurrentTooltip();
    //
    //         if (data) {
    //             const activity = data.activity,
    //                   isGlobal = data.slot === null;
    //
    //             var $currentTooltip = $(
    //                 `<div class="timeline-tooltip js_tooltip">
    //                     <div class="arrow"></div>
    //                     <div class="content js_actual_content"></div>
    //                 </div>`),
    //                 $currentTooltipContent = $currentTooltip.find('.content');
    //
    //             if (!isGlobal) {
    //                 $currentTooltip.addClass('local');
    //                 $currentTooltip.css('bottom', (this.globalActivitiesSynchronizer.getSlotIndex(data.slot, true) * 20) + 'px');
    //             } else {
    //                 const globalActivity = activity as TimelineGlobalActivity;
    //
    //                 $currentTooltip.addClass('global');
    //                 $currentTooltip.addClass(globalActivity.typeCode);
    //                 $currentTooltip.css('top', (globalActivity.verticalPosition.getValue().top * 20) + 'px');
    //             }
    //
    //             var positionListener = activity.position.listen(p => {
    //                 if (p) {
    //                     if (isGlobal) {
    //                         $currentTooltip.css('left', p.left + '%');
    //                     } else {
    //                         const
    //                             containerWidth = dom.$.width(),
    //                             tooltipPointerOriginPercent = p.left + p.width / 2,
    //                             tooltipOrigin = containerWidth * tooltipPointerOriginPercent / 100 - localTooltipPickMargin;
    //
    //                         let contentLeft: number;
    //
    //                         if (tooltipOrigin < localTooltipWidthHalf) {
    //                             contentLeft = tooltipOrigin >= localTooltipMinLeftArrowMargin ? -tooltipOrigin : -localTooltipMinLeftArrowMargin;
    //                         } else if (tooltipOrigin + localTooltipWidthHalf > containerWidth) {
    //                             contentLeft = -(localTooltipWidth - (containerWidth - tooltipOrigin));
    //                         } else {
    //                             contentLeft = -localTooltipWidthHalf;
    //                         }
    //
    //                         $currentTooltipContent.css('left', contentLeft + 'px');
    //
    //                         $currentTooltip.css('left', tooltipPointerOriginPercent + '%');
    //                     }
    //                 }
    //             });
    //
    //             dom.$.append($currentTooltip);
    //
    //             var renderedView = js.dom('.js_tooltip .js_actual_content')
    //                 .render(isGlobal ? GlobalActivityTooltipView : TriggerActivityTooltipView, activity);
    //
    //             currentTooltip = new RenderedTooltip($currentTooltip, positionListener,  renderedView);
    //
    //             setTimeout(() => {
    //                 if (currentTooltip) {
    //                     currentTooltip.$root.addClass('visible');
    //                 }
    //             }, 100);
    //
    //             $currentTooltip.on('mouseenter', () => timeline.preserveCurrentSelection());
    //             $currentTooltip.on('mouseleave', () => timeline.resetCurrentSelection());
    //         }
    //     });
    // }

    dispose(): void {
        
    }
}

export class GlobalActivityTooltipView implements View {
        constructor(private readonly viewModel: TimelineGlobalActivity) {

                        }
    template = () => <div>
                <p class="tooltip-content"><span class="js_message"></span> at </p>
                <p class="tooltip-content"><span class="js_date"></span></p>
                            </div>;

    // init(dom: js.IDom, viewModel: TimelineGlobalActivity) {
    //     dom('.js_message').observes(SchedulerEventScope[viewModel.scope] + ' ' + viewModel.typeCode);
    //     dom('.js_date').observes(new NullableDate(viewModel.startedAt), NullableDateView);
    // }
}

export class TriggerActivityTooltipView implements View {
    constructor(
        private readonly viewModel: TimelineActivity
    ) {
    }

    template = () => <table class="tooltip-content">
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
</table>;

    // init(dom: js.IDom, viewModel: TimelineActivity): void {
    //     const activityViewModel = new TimelineActivityViewModel(viewModel);
    //
    //     dom.manager.manage(activityViewModel);
    //
    //     const duration = activityViewModel.duration;
    //
    //     dom('.js_durationValue').observes(duration.value);
    //     dom('.js_durationUnit').observes(duration.measurementUnit);
    //
    //     dom('.js_startedAt').observes(new NullableDate(viewModel.startedAt), NullableDateView);
    //     dom('.js_completedAt').observes(activityViewModel.completedAt, NullableDateView);
    //     dom('.js_state').observes(activityViewModel.status, ActivityStateView);
    //
    //     activityViewModel.init();
    // }
}
