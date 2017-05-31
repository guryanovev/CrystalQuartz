import { CommandService } from '../services';
import { GetEnvironmentDataCommand, GetDataCommand } from '../commands/global-commands';
import { SchedulerData, EnvironmentData } from '../api';
import { ApplicationModel } from '../application-model';
import { DataLoader } from '../data-loader';
import ApplicationViewModel from '../application-view-model';

export default class BootstrapperViewModel {
    statusMessage = new js.ObservableValue<string>();
    status = new js.ObservableValue<boolean>();

    applicationViewModel: ApplicationViewModel;

    start() {
        const commandService = new CommandService(),
              applicationModel = new ApplicationModel(),
              dataLoader = new DataLoader(applicationModel, commandService);

        commandService.onCommandFailed.listen(console.log); // todo

        

        this.statusMessage.setValue('Loading environment settings');
        const initPromise = commandService.executeCommand<EnvironmentData>(new GetEnvironmentDataCommand()).then(envData => {
            this.applicationViewModel = new ApplicationViewModel(applicationModel, commandService, envData);
            this.statusMessage.setValue('Loading initial scheduler data');

            return commandService.executeCommand<SchedulerData>(new GetDataCommand()).then(schedulerData => {
                // todo handle getData failures as it`s a common case
                this.statusMessage.setValue('Done');
                return {
                    envData: envData,
                    schedulerData: schedulerData
                };
            });
        });

        // todo: handle failed state
        initPromise.done(data => {
            /**
             * That would trigger application services.
             */
            applicationModel.setData(data.schedulerData);
            this.status.setValue(true);
        });
    }
}