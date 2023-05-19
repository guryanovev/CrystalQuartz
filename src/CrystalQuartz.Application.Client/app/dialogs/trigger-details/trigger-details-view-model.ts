import { DialogViewModel } from '../dialog-view-model';
import { CommandService, ErrorInfo } from '../../services';
import {CronTriggerType, PropertyValue, SimpleTriggerType, Trigger, TriggerDetails} from '../../api';
import {GetTriggerDetailsCommand} from '../../commands/trigger-commands';
import {Property, PropertyType} from '../common/property';

export class TriggerDetailsViewModel extends DialogViewModel<any> {
    summary = new js.ObservableList<Property>();
    identity = new js.ObservableList<Property>();
    schedule = new js.ObservableList<Property>();
    jobDataMap = new js.ObservableValue<PropertyValue>();
    

    constructor(
        private trigger: Trigger,
        private commandService: CommandService) {

        super();

        this.state.setValue('unknown');
    }

    loadDetails() {
        this.commandService
            .executeCommand<TriggerDetails>(new GetTriggerDetailsCommand(this.trigger.GroupName, this.trigger.Name), true)
            .done(details => {
                const trigger = details.trigger;

                if (!trigger) {
                    this.goToErrorState('No details found, the trigger no longer available.')
                    return;
                }
                
                const identityProperties = [
                    new Property('Name', trigger.Name, PropertyType.String),
                    new Property('Group', trigger.GroupName, PropertyType.String)
                ];

                if (details.secondaryData) {
                    identityProperties.push(new Property('Description', details.secondaryData.description, PropertyType.String));
                }

                this.identity.setValue(identityProperties);
                let scheduleProperties = [
                    new Property('Trigger Type', trigger.TriggerType.Code, PropertyType.String)
                ];
                
                switch (trigger.TriggerType.Code) {
                    case 'simple':
                        const simpleTrigger = <SimpleTriggerType>trigger.TriggerType;

                        scheduleProperties.push(new Property(
                            'Repeat Count',
                            simpleTrigger.RepeatCount === -1 ? 'forever' : simpleTrigger.RepeatCount,
                            PropertyType.String));
                        scheduleProperties.push(new Property('Repeat Interval', simpleTrigger.RepeatInterval, PropertyType.String));
                        scheduleProperties.push(new Property('Times Triggered', simpleTrigger.TimesTriggered, PropertyType.Numeric));
                        break;
                    case 'cron':
                        const cronTrigger = <CronTriggerType>trigger.TriggerType;

                        scheduleProperties.push(new Property('Cron Expression', cronTrigger.CronExpression, PropertyType.String));
                        break;
                }

                this.schedule.setValue(scheduleProperties);

                if (details.secondaryData) {
                    this.summary.setValue([
                        new Property('Priority', details.secondaryData.priority, PropertyType.Numeric),
                        new Property(
                            'Misfire Instruction',
                            this.getFriendlyMisfireInstruction(details.secondaryData.misfireInstruction, trigger),
                            PropertyType.String),
                    ]);
                }

                this.jobDataMap.setValue(details.jobDataMap);

                this.state.setValue('ready');
            })
            .fail((error: ErrorInfo) => {
                this.goToErrorState(error.errorMessage);
            });
    }

    private getFriendlyMisfireInstruction(misfireInstruction: number, trigger: Trigger){
        if (!trigger) {
            return misfireInstruction.toString();
        }

        if (misfireInstruction === 0) {
            return 'Not Set';
        }

        return (trigger.TriggerType.supportedMisfireInstructions[misfireInstruction] || 'Unknown') + ' (' + misfireInstruction + ')';
    }
}