import { ObservableList, ObservableValue } from 'john-smith/reactive';
import {
  CronTriggerType,
  PropertyValue,
  SimpleTriggerType,
  Trigger,
  TriggerDetails,
} from '../../api';
import { GetTriggerDetailsCommand } from '../../commands/trigger-commands';
import { CommandService, ErrorInfo } from '../../services';
import { PlainProperty, PropertyType } from '../common/plainProperty';
import { DialogViewModel } from '../dialog-view-model';

export class TriggerDetailsViewModel extends DialogViewModel<void> {
  public summary = new ObservableList<PlainProperty>();
  public identity = new ObservableList<PlainProperty>();
  public schedule = new ObservableList<PlainProperty>();
  public jobDataMap = new ObservableValue<PropertyValue | null>(null);

  public constructor(
    private trigger: Trigger,
    private commandService: CommandService
  ) {
    super();

    this.state.setValue('unknown');
  }

  public loadDetails() {
    this.commandService
      .executeCommand<TriggerDetails>(
        new GetTriggerDetailsCommand(this.trigger.GroupName, this.trigger.Name),
        true
      )
      .then((details) => {
        const trigger = details.trigger;

        if (!trigger) {
          this.goToErrorState('No details found, the trigger no longer available.');
          return;
        }

        const identityProperties = [
          new PlainProperty('Name', trigger.Name, PropertyType.String),
          new PlainProperty('Group', trigger.GroupName, PropertyType.String),
        ];

        if (details.secondaryData) {
          identityProperties.push(
            new PlainProperty('Description', details.secondaryData.description, PropertyType.String)
          );
        }

        this.identity.setValue(identityProperties);
        const scheduleProperties = [
          new PlainProperty('Trigger Type', trigger.TriggerType.Code, PropertyType.String),
        ];

        switch (trigger.TriggerType.Code) {
          case 'simple':
            const simpleTrigger = <SimpleTriggerType>trigger.TriggerType;

            scheduleProperties.push(
              new PlainProperty(
                'Repeat Count',
                simpleTrigger.RepeatCount === -1 ? 'forever' : simpleTrigger.RepeatCount,
                PropertyType.String
              )
            );
            scheduleProperties.push(
              new PlainProperty(
                'Repeat Interval',
                simpleTrigger.RepeatInterval,
                PropertyType.String
              )
            );
            scheduleProperties.push(
              new PlainProperty(
                'Times Triggered',
                simpleTrigger.TimesTriggered,
                PropertyType.Numeric
              )
            );
            break;
          case 'cron':
            const cronTrigger = <CronTriggerType>trigger.TriggerType;

            scheduleProperties.push(
              new PlainProperty('Cron Expression', cronTrigger.CronExpression, PropertyType.String)
            );
            break;
        }

        this.schedule.setValue(scheduleProperties);

        if (details.secondaryData) {
          this.summary.setValue([
            new PlainProperty('Priority', details.secondaryData.priority, PropertyType.Numeric),
            new PlainProperty(
              'Misfire Instruction',
              this.getFriendlyMisfireInstruction(details.secondaryData.misfireInstruction, trigger),
              PropertyType.String
            ),
          ]);
        }

        this.jobDataMap.setValue(details.jobDataMap);

        this.state.setValue('ready');
      })
      .catch((error: ErrorInfo) => {
        console.log('error', error);
        this.goToErrorState(error.errorMessage);
      });
  }

  private getFriendlyMisfireInstruction(misfireInstruction: number, trigger: Trigger) {
    if (!trigger) {
      return misfireInstruction.toString();
    }

    if (misfireInstruction === 0) {
      return 'Not Set';
    }

    return (
      (trigger.TriggerType.supportedMisfireInstructions[misfireInstruction] || 'Unknown') +
      ' (' +
      misfireInstruction +
      ')'
    );
  }
}
