import { ObservableList, ObservableValue } from 'john-smith/reactive';
import { EnvironmentData, JobGroup, SchedulerData } from '../api';
import { ApplicationModel } from '../application-model';
import ActivityDetailsViewModel from '../dialogs/activity-details/activity-details-view-model';
import { DialogManager } from '../dialogs/dialog-manager';
import GlobalActivitiesSynchronizer from '../global-activities-synchronizer';
import { DefaultNotificationService } from '../notification/notification-service';
import { SchedulerStateService } from '../scheduler-state-service';
import { CommandService } from '../services';
import Timeline from '../timeline/timeline';
import { TimelineInitializer } from '../timeline/timeline-initializer';
import DateUtils from '../utils/date';
import { MainAsideViewModel } from './main-aside/aside.view-model';
import ActivitiesSynschronizer from './main-content/activities-synschronizer';
import { JobGroupViewModel } from './main-content/job-group/job-group-view-model';
import MainHeaderViewModel from './main-header/header-view-model';
import { OfflineModeViewModel } from './offline-mode/offline-mode-view-model';

export class MainViewModel {
  private groupsSynchronizer: ActivitiesSynschronizer<JobGroup, JobGroupViewModel>;
  private _schedulerStateService = new SchedulerStateService();
  private _serverInstanceMarker: number | null = null;

  public readonly dialogManager = new DialogManager();

  public readonly timeline: Timeline;

  public readonly mainAside: MainAsideViewModel;
  public readonly mainHeader: MainHeaderViewModel;

  public readonly jobGroups = new ObservableList<JobGroupViewModel>();
  public readonly offlineMode = new ObservableValue<OfflineModeViewModel | null>(null);

  public readonly globalActivitiesSynchronizer: GlobalActivitiesSynchronizer;

  public constructor(
    private application: ApplicationModel,
    private commandService: CommandService,
    public environment: EnvironmentData,
    public notificationService: DefaultNotificationService,
    timelineInitializer: TimelineInitializer
  ) {
    this.timeline = timelineInitializer.timeline;
    this.globalActivitiesSynchronizer = timelineInitializer.globalActivitiesSynchronizer;

    this.mainAside = new MainAsideViewModel(this.application);
    this.mainHeader = new MainHeaderViewModel(
      this.timeline,
      this.commandService,
      this.application,
      this.dialogManager
    );

    commandService.onCommandFailed.listen((error) =>
      notificationService.showError(error.errorMessage)
    );
    commandService.onDisconnected.listen(() => application.goOffline());

    this.groupsSynchronizer = new ActivitiesSynschronizer<JobGroup, JobGroupViewModel>(
      (group: JobGroup, groupViewModel: JobGroupViewModel) => group.Name === groupViewModel.name,
      (group: JobGroup) =>
        new JobGroupViewModel(
          group,
          this.commandService,
          this.application,
          this.timeline,
          this.dialogManager,
          this._schedulerStateService
        ),
      this.jobGroups
    );

    application.onDataChanged.listen((data) => this.setData(data));

    application.isOffline.listen((isOffline) => {
      const offlineModeViewModel = isOffline
        ? new OfflineModeViewModel(
            this.application.offlineSince!,
            this.commandService,
            this.application
          )
        : null;

      this.offlineMode.setValue(offlineModeViewModel);
    });

    this.timeline.detailsRequested.listen((activity) => {
      this.dialogManager.showModal(new ActivityDetailsViewModel(activity), (_) => {});
    });
  }

  public get autoUpdateMessage() {
    return this.application.autoUpdateMessage;
  }

  private setData(data: SchedulerData) {
    if (
      this._serverInstanceMarker !== null &&
      this._serverInstanceMarker !== data.ServerInstanceMarker
    ) {
      this.notificationService.showError(
        'Server restart detected at ' + DateUtils.smartDateFormat(new Date().getTime())
      );
      this.commandService.resetEvents();
      this.timeline.clearSlots();
    }

    this._serverInstanceMarker = data.ServerInstanceMarker;

    this.groupsSynchronizer.sync(data.JobGroups);
    this.mainHeader.updateFrom(data);
    this._schedulerStateService.synsFrom(data);
    this.globalActivitiesSynchronizer.updateFrom(data);
  }
}
