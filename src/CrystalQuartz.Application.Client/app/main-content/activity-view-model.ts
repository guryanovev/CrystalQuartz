import { ManagableActivity, ActivityStatus, SchedulerData } from '../api';
import { CommandService } from '../services';
import { ApplicationModel } from '../application-model';
import { ICommand } from '../commands/contracts';

import Action from '../global/actions/action';
import CommandAction from '../command-action';

export interface IActionInfo {
    title: string;
    command: () => ICommand<SchedulerData>;
}

export abstract class ManagableActivityViewModel<TActivity extends ManagableActivity> {
    name: string;
    status = js.observableValue<ActivityStatus>();

    resumeAction: Action;
    pauseAction: Action;
    deleteAction: Action;

    constructor(
        activity: ManagableActivity,
        public commandService: CommandService,
        public applicationModel: ApplicationModel) {

        this.name = activity.Name;

        const
            resumeActionInfo = this.getResumeAction(),
            pauseActionInfo = this.getPauseAction(),
            deleteActionInfo = this.getDeleteAction();

        this.resumeAction = new CommandAction(this.applicationModel, this.commandService, resumeActionInfo.title, resumeActionInfo.command);
        this.pauseAction = new CommandAction(this.applicationModel, this.commandService, pauseActionInfo.title, pauseActionInfo.command);
        this.deleteAction = new CommandAction(this.applicationModel, this.commandService, deleteActionInfo.title, deleteActionInfo.command, this.getDeleteConfirmationsText());
    }

    updateFrom(activity: TActivity) {
        this.status.setValue(activity.Status);
        this.resumeAction.enabled = activity.CanStart;
        this.pauseAction.enabled = activity.CanPause;
        this.deleteAction.enabled = activity.CanDelete;
    }

    abstract getDeleteConfirmationsText(): string;
    abstract getResumeAction(): IActionInfo;
    abstract getPauseAction(): IActionInfo;
    abstract getDeleteAction(): IActionInfo;
}