import { ObservableValue } from 'john-smith/reactive';
import { Event } from 'john-smith/reactive/event';
import { ErrorMessage } from '../api';
import {
  ActivityInteractionRequest,
  IActivitySize,
  ITimelineActivityOptions,
  TimelineActivityCompletionOptions,
} from './common';

export default class TimelineActivity {
  public position = new ObservableValue<IActivitySize | null>(null);
  public completed = new Event<unknown>();

  public key: string | null;
  public startedAt: number | undefined;
  public completedAt: number | undefined;

  public faulted: boolean = false;
  public errors: ErrorMessage[] | null = null;

  public constructor(
    options: ITimelineActivityOptions,
    private requestSelectionCallback: (requestType: ActivityInteractionRequest) => void
  ) {
    this.key = options.key;
    this.startedAt = options.startedAt;
    this.completedAt = options.completedAt;
  }

  public complete(date: number, options: TimelineActivityCompletionOptions) {
    this.completedAt = date;
    this.errors = options.errors;
    this.faulted = options.faulted;
    this.completed.trigger(null);
  }

  public recalculate(rangeStart: number, rangeEnd: number) {
    const rangeWidth = rangeEnd - rangeStart;
    const activityStart = this.startedAt!;
    const activityComplete = this.completedAt || rangeEnd;
    const isOutOfViewport = activityStart <= rangeStart && activityComplete <= rangeStart;

    if (isOutOfViewport) {
      return false;
    }

    const viewPortActivityStart = activityStart < rangeStart ? rangeStart : activityStart;

    this.position.setValue({
      left: (100 * (viewPortActivityStart - rangeStart)) / rangeWidth,
      width: (100 * (activityComplete - viewPortActivityStart)) / rangeWidth,
    });

    return true;
  }

  public requestSelection() {
    this.requestSelectionCallback(ActivityInteractionRequest.ShowTooltip);
  }

  public requestDeselection() {
    this.requestSelectionCallback(ActivityInteractionRequest.HideTooltip);
  }

  public requestDetails() {
    this.requestSelectionCallback(ActivityInteractionRequest.ShowDetails);
  }
}
