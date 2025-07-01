import { ApplicationModel } from '../application-model';
import { CommandService } from '../services';
import { IDialogManager } from './dialog-manager';
import { ScheduleJobOptions, ScheduleJobViewModel } from './schedule-job/schedule-job-view-model';

export const SHOW_SCHEDULE_JOB_DIALOG = (
  dialogManager: IDialogManager,
  application: ApplicationModel,
  commandService: CommandService,
  options?: ScheduleJobOptions
) => {
  dialogManager.showModal(
    new ScheduleJobViewModel(application, commandService, options),
    (result) => {
      if (result) {
        application.invalidateData();
      }
    }
  );
};
