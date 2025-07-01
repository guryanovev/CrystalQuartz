import { OptionalDisposables } from 'john-smith/common';
import { Listenable } from 'john-smith/reactive';
import { map } from 'john-smith/reactive/transformers/map';
import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { Value } from 'john-smith/view/components';
import { OnInit } from 'john-smith/view/hooks';
import { NullableDate, SchedulerEventScope } from '../api';
import GlobalActivitiesSynchronizer from '../global-activities-synchronizer';
import { ActivityStateView } from '../global/activities/activity-state-view';
import { NullableDateView } from '../main/main-content/nullable-date-view';
import Timeline from './timeline';
import TimelineActivity from './timeline-activity';
import { TimelineActivityViewModel } from './timeline-activity-view-model';
import { TimelineGlobalActivity } from './timeline-global-activity';
import TimelineSlot from './timeline-slot';

export class LocalTooltipView implements View, OnInit {
  private readonly _activityViewModel: TimelineActivityViewModel;

  public constructor(
    private readonly viewModel: {
      activity: TimelineActivity;
      slot: TimelineSlot;
      globalActivitiesSynchronizer: GlobalActivitiesSynchronizer;
      containerWidthCalculator: () => number;
    }
  ) {
    this._activityViewModel = new TimelineActivityViewModel(viewModel.activity);
  }

  public template(): HtmlDefinition {
    const localTooltipWidth = 300;
    const localTooltipWidthHalf = localTooltipWidth / 2;
    const localTooltipPickMargin = 6;
    const localTooltipMinLeftArrowMargin = 6;

    const classes: Record<string, boolean> = { local: true };
    const styles =
      'bottom: ' +
      this.viewModel.globalActivitiesSynchronizer.getSlotIndex(this.viewModel.slot, true)! * 20 +
      'px';

    const transformedPosition: Listenable<[number, number]> = map(
      this.viewModel.activity.position,
      (p) => {
        if (p === null) {
          return [0, 0];
        }

        const containerWidth = this.viewModel.containerWidthCalculator();
        const tooltipPointerOriginPercent = p.left + p.width / 2;
        const tooltipOrigin =
          (containerWidth * tooltipPointerOriginPercent) / 100 - localTooltipPickMargin;

        let contentLeft: number;

        if (tooltipOrigin < localTooltipWidthHalf) {
          contentLeft =
            tooltipOrigin >= localTooltipMinLeftArrowMargin
              ? -tooltipOrigin
              : -localTooltipMinLeftArrowMargin;
        } else if (tooltipOrigin + localTooltipWidthHalf > containerWidth) {
          contentLeft = -(localTooltipWidth - (containerWidth - tooltipOrigin));
        } else {
          contentLeft = -localTooltipWidthHalf;
        }

        return [tooltipPointerOriginPercent, contentLeft];
      }
    );

    return (
      <div
        class="timeline-tooltip"
        $className={classes}
        style={map(transformedPosition, (p) => styles + '; left: ' + p[0] + '%')}
        _mouseenter={() => this.viewModel.activity.requestSelection()}
        _mouseleave={() => this.viewModel.activity.requestDeselection()}
      >
        <div class="arrow"></div>
        <div class="content" style={map(transformedPosition, (p) => 'left: ' + p[1] + 'px')}>
          <table class="tooltip-content">
            <tr>
              <td rowspan="3" class="icon-only" style="padding: 3px 0 0 0; vertical-align: top;">
                <Value view={ActivityStateView} model={this._activityViewModel.status}></Value>
              </td>
              <th>Trigger fired at</th>
              <td>
                <Value view={NullableDateView} model={this._activityViewModel.startedAt}></Value>
              </td>
            </tr>
            <tr>
              <th>Trigger completed at</th>
              <td>
                <Value view={NullableDateView} model={this._activityViewModel.completedAt}></Value>
              </td>
            </tr>
            <tr>
              <th>Duration</th>
              <td style="color: #dec82f;">
                <span>{this._activityViewModel.duration.value}</span>
                <span>{this._activityViewModel.duration.measurementUnit}</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    );
  }

  /** @inheritdoc */
  public onInit(root: DomElement | null): OptionalDisposables {
    this._activityViewModel.init();

    setTimeout(() => {
      if (root !== null) {
        root.createClassNames().add('visible');
      }
    }, 100);

    return this._activityViewModel;
  }
}

export class GlobalTooltipView implements View, OnInit {
  public constructor(
    private readonly viewModel: {
      activity: TimelineGlobalActivity;
    }
  ) {}

  public template() {
    const activity = this.viewModel.activity;
    const styles = 'top: ' + activity.verticalPosition.getValue()!.top * 20 + 'px';

    const actualStyles = map(activity.position, (p) => {
      if (p === null) {
        return styles;
      }

      return styles + '; left: ' + p.left + '%';
    });

    const message = SchedulerEventScope[activity.scope] + ' ' + activity.typeCode;
    const date = new NullableDate(activity.startedAt ?? null);

    return (
      <div
        class="timeline-tooltip global"
        style={actualStyles}
        $className={activity.typeCode}
        _mouseenter={() => this.viewModel.activity.requestSelection()}
        _mouseleave={() => this.viewModel.activity.requestDeselection()}
      >
        <div class="arrow"></div>

        <div class="content">
          <p class="tooltip-content">{message} at</p>
          <p class="tooltip-content">
            <Value view={NullableDateView} model={date}></Value>
          </p>
        </div>
      </div>
    );
  }

  public onInit(root: DomElement | null): OptionalDisposables {
    setTimeout(() => {
      if (root !== null) {
        root.createClassNames().add('visible');
      }
    }, 100);
  }
}

export class TimelineTooltipsView implements View {
  public constructor(
    private viewModel: {
      globalActivitiesSynchronizer: GlobalActivitiesSynchronizer;
      timeline: Timeline;
      containerWidthCalculator: () => number;
    }
  ) {}

  public template(): HtmlDefinition {
    return (
      <Value
        view={(selectedActivity) => {
          if (selectedActivity.slot === null) {
            return (
              <Value
                view={GlobalTooltipView}
                model={{
                  activity: selectedActivity.activity as TimelineGlobalActivity,
                }}
              ></Value>
            );
          }

          return (
            <Value
              view={LocalTooltipView}
              model={{
                globalActivitiesSynchronizer: this.viewModel.globalActivitiesSynchronizer,
                activity: selectedActivity.activity,
                slot: selectedActivity.slot,
                containerWidthCalculator: this.viewModel.containerWidthCalculator,
              }}
            ></Value>
          );
        }}
        model={this.viewModel.timeline.selectedActivity}
      ></Value>
    );
  }
}
