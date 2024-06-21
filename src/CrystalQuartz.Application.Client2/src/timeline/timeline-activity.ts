import {
    IActivitySize,
    ITimelineActivityOptions,
    TimelineActivityCompletionOptions,
    ActivityInteractionRequest
} from './common';
import { Event } from 'john-smith/reactive/event';

import { ErrorMessage } from '../api';
import { ObservableValue } from 'john-smith/reactive';

export default class TimelineActivity {
    position = new ObservableValue<IActivitySize | null>(null);
    completed = new Event<any>();

    key: string | null;
    startedAt: number | undefined;
    completedAt: number | undefined;

    faulted: boolean = false;
    errors: ErrorMessage[] | null = null;

    constructor(private options: ITimelineActivityOptions, private requestSelectionCallback: (requestType: ActivityInteractionRequest) => void) {
        this.key = options.key;

        this.startedAt = options.startedAt;
        this.completedAt = options.completedAt;
    }

    complete(date: number, options: TimelineActivityCompletionOptions) {
        this.completedAt = date;
        this.errors = options.errors;
        this.faulted = options.faulted;
        this.completed.trigger(null);
    };

    recalculate(rangeStart: number, rangeEnd: number) {
        const rangeWidth = rangeEnd - rangeStart,

              activityStart = this.startedAt!,
              activityComplete = this.completedAt || rangeEnd,

              isOutOfViewport = activityStart <= rangeStart && activityComplete <= rangeStart;

        if (isOutOfViewport) {
            return false;
        }

        const viewPortActivityStart = activityStart < rangeStart ? rangeStart : activityStart;

        this.position.setValue({
            left: 100 * (viewPortActivityStart - rangeStart) / rangeWidth,
            width: 100 * (activityComplete - viewPortActivityStart) / rangeWidth
        });

        return true;
    };

    requestSelection() {
        this.requestSelectionCallback(ActivityInteractionRequest.ShowTooltip);
    }

    requestDeselection() {
        this.requestSelectionCallback(ActivityInteractionRequest.HideTooltip);
    }

    requestDetails() {
        this.requestSelectionCallback(ActivityInteractionRequest.ShowDetails);
    }
}
