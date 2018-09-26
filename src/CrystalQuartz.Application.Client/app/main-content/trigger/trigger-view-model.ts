import { Trigger, NullableDate, SchedulerData, SimpleTriggerType, CronTriggerType } from '../../api';
import { ICommand } from '../../commands/contracts';
import { PauseTriggerCommand, ResumeTriggerCommand, DeleteTriggerCommand } from '../../commands/trigger-commands';
import { CommandService } from '../../services';
import { ApplicationModel } from '../../application-model';
import { ManagableActivityViewModel } from '../activity-view-model';

import TimelineSlot from '../../timeline/timeline-slot';
import Timeline from '../../timeline/timeline';

import { IDialogManager } from '../../dialogs/dialog-manager';

import { ISchedulerStateService, EventType } from '../../scheduler-state-service';

interface TimespanPart {
    multiplier: number;
    pluralLabel: string;
    label: string;
}

export class TriggerViewModel extends ManagableActivityViewModel<Trigger> {
    startDate = js.observableValue<NullableDate>();
    endDate = js.observableValue<NullableDate>();
    previousFireDate = js.observableValue<NullableDate>();
    nextFireDate = js.observableValue<NullableDate>();
    triggerType = js.observableValue<string>();
    executing = new js.ObservableValue<boolean>();

    timelineSlot: TimelineSlot;

    private _group: string;
    private _realtimeWire: js.IDisposable;

    constructor(
        trigger: Trigger,
        commandService: CommandService,
        applicationModel: ApplicationModel,
        private timeline: Timeline,
        private dialogManager: IDialogManager,
        private schedulerStateService: ISchedulerStateService) {

        super(trigger, commandService, applicationModel);

        const slotKey = 3 + ':' + trigger.UniqueTriggerKey;

        this._group = trigger.GroupName;
        this.timelineSlot = timeline.findSlotBy(slotKey) || timeline.addSlot({ key: slotKey });
        this._realtimeWire = schedulerStateService.realtimeBus.listen(event => {
            if (event.uniqueTriggerKey === trigger.UniqueTriggerKey) {
                if (event.eventType === EventType.Fired) {
                    this.executing.setValue(true);
                } else {
                    this.executing.setValue(false);
                }    
            }
        });
    }

    releaseState() {
        this.timeline.removeSlot(this.timelineSlot);
    }

    updateFrom(trigger: Trigger) {
        super.updateFrom(trigger);

        this.startDate.setValue(new NullableDate(trigger.StartDate));
        this.endDate.setValue(new NullableDate(trigger.EndDate));
        this.previousFireDate.setValue(new NullableDate(trigger.PreviousFireDate));
        this.nextFireDate.setValue(new NullableDate(trigger.NextFireDate));

        var triggerType = trigger.TriggerType;
        var triggerTypeMessage = 'unknown';
        if (triggerType.Code === 'simple') {
            var simpleTriggerType = <SimpleTriggerType>triggerType;

            triggerTypeMessage = 'repeat ';
            if (simpleTriggerType.RepeatCount === -1) {
            } else {
                triggerTypeMessage += simpleTriggerType.RepeatCount + ' times ';
            }

            triggerTypeMessage += 'every ';

            var parts: TimespanPart[] = [
                {
                    label: 'day',
                    pluralLabel: 'days',
                    multiplier: 1000 * 60 * 60 * 24
                },
                {
                    label: 'hour',
                    pluralLabel: 'hours',
                    multiplier: 1000 * 60 * 60
                },
                {
                    label: 'minute',
                    pluralLabel: 'min',
                    multiplier: 1000 * 60
                },
                {
                    label: 'second',
                    pluralLabel: 'sec',
                    multiplier: 1000
                }
            ];

            var diff = simpleTriggerType.RepeatInterval;
            var messagesParts: string[] = [];
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                var currentPartValue = Math.floor(diff / part.multiplier);
                diff -= currentPartValue * part.multiplier;

                if (currentPartValue === 1) {
                    messagesParts.push(part.label);
                } else if (currentPartValue > 1) {
                    messagesParts.push(currentPartValue + ' ' + part.pluralLabel);
                }
            }

            triggerTypeMessage += messagesParts.join(', ');
        } else if (triggerType.Code === 'cron') {
            var cronTriggerType = <CronTriggerType>triggerType;

            triggerTypeMessage = cronTriggerType.CronExpression;
        }

        this.triggerType.setValue(triggerTypeMessage);
    }

    getDeleteConfirmationsText(): string {
        return 'Are you sure you want to unchedule trigger?';
    }

    getPauseAction() {
        return {
            title: 'Pause trigger',
            command: () => new PauseTriggerCommand(this._group, this.name)
        };
    }

    getResumeAction() {
        return {
            title: 'Resume trigger',
            command: () => new ResumeTriggerCommand(this._group, this.name)
        };
    }

    getDeleteAction() {
        return {
            title: 'Delete trigger',
            command: () => new DeleteTriggerCommand(this._group, this.name)
        };
    }

    requestCurrentActivityDetails() {
        this.timelineSlot.requestCurrentActivityDetails();
    }
}