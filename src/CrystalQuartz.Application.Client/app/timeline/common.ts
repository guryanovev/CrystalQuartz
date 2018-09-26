import {ErrorMessage} from "../api";

export enum ActivityInteractionRequest {
    ShowTooltip,
    HideTooltip,
    ShowDetails
}

export interface IActivitySize {
    left: number;
    width: number;
}

export interface IRange {
    start: number;
    end: number;
}

export interface ITimelineTickItem {
    tickDate: number;
    width: number;
}

export interface ITimelineActivityOptions {
    key: string;
    startedAt?: number;
    completedAt?: number;
}

export interface ITimelineGlobalActivityOptions {
    occurredAt: number;
    itemKey: string;
    scope: number;
    typeCode: string;
}

export interface ITimelineSlotOptions {
    key: string;
}

export interface TimelineActivityCompletionOptions {
    faulted: boolean;
    errors: ErrorMessage[];
}

