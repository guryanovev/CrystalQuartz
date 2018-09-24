import {
    IActivitySize,
    ITimelineActivityOptions,
    TimelineActivityCompletionOptions,
    ActivityInteractionRequest
} from './common';

import { ErrorMessage } from '../api';

export default class TimelineActivity {
    position = new js.ObservableValue<IActivitySize>();
    completed = new js.Event();

    key: string;
    startedAt: number;
    completedAt: number;

    faulted: boolean;
    errors: ErrorMessage[];

    constructor(private options: ITimelineActivityOptions, private requestSelectionCallback: (requestType: ActivityInteractionRequest) => void) {
        this.key = options.key;

        this.startedAt = options.startedAt;
        this.completedAt = options.completedAt;
    }

    complete(date: number, options: TimelineActivityCompletionOptions) {
        this.completedAt = date;
        this.errors = options.errors;
        this.faulted = options.faulted;
        this.completed.trigger();
    };

    recalculate(rangeStart: number, rangeEnd: number) {
        const rangeWidth = rangeEnd - rangeStart,

              activityStart = this.startedAt,
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