import { Trigger, NullableDate, SchedulerData, SimpleTriggerType, CronTriggerType } from '../../api';
import { ICommand } from '../../commands/contracts';
import { PauseTriggerCommand, ResumeTriggerCommand, DeleteTriggerCommand } from '../../commands/trigger-commands';
import { CommandService } from '../../services';
import { ApplicationModel } from '../../application-model';
import { ManagableActivityViewModel } from '../activity-view-model';

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

    private _group: string;

    constructor(trigger: Trigger, commandService: CommandService, applicationModel: ApplicationModel) {
        super(trigger, commandService, applicationModel);
    }

    updateFrom(trigger: Trigger) {
        this._group = trigger.GroupName;

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

    createResumeCommand(): ICommand<SchedulerData> {
        return new ResumeTriggerCommand(this._group, this.name);
    }

    createPauseCommand(): ICommand<SchedulerData> {
        return new PauseTriggerCommand(this._group, this.name);
    }

    createDeleteCommand(): ICommand<SchedulerData> {
        return new DeleteTriggerCommand(this._group, this.name);
    }
}