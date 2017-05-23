import { ManagableActivity, ActivityStatus, SchedulerData } from '../api';
import { CommandService } from '../services';
import { ApplicationModel } from '../application-model';
import { ICommand } from '../commands/contracts';

export class ManagableActivityViewModel<TActivity extends ManagableActivity> {
    name: string;
    status = js.observableValue<ActivityStatus>();
    canStart = js.observableValue<boolean>();
    canPause = js.observableValue<boolean>();
    canDelete = js.observableValue<boolean>();

    constructor(
        activity: ManagableActivity,
        public commandService: CommandService,
        public applicationModel: ApplicationModel) {

        this.name = activity.Name;
    }

    updateFrom(activity: TActivity) {
        this.status.setValue(activity.Status);
        this.canStart.setValue(activity.CanStart);
        this.canPause.setValue(activity.CanPause);
        this.canDelete.setValue(activity.CanDelete);
    }

    resume() {
        this.commandService
            .executeCommand(this.createResumeCommand())
            .done(data => this.applicationModel.setData(data));
    }

    pause() {
        this.commandService
            .executeCommand(this.createPauseCommand())
            .done(data => this.applicationModel.setData(data));
    }

    delete() {
        if (confirm(this.getDeleteConfirmationsText())) {
            this.commandService
                .executeCommand(this.createDeleteCommand())
                .done(data => this.applicationModel.setData(data));
        }
    }

    getDeleteConfirmationsText(): string {
        return 'Are you sure?';
    }

    createResumeCommand(): ICommand<SchedulerData> {
        throw new Error("Abstract method call");
    }

    createPauseCommand(): ICommand<SchedulerData> {
        throw new Error("Abstract method call");
    }

    createDeleteCommand(): ICommand<SchedulerData> {
        throw new Error("Abstract method call");
    }
}