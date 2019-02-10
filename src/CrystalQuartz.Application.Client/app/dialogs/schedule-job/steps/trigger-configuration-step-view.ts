import TEMPLATE from './trigger-configuration-step.tmpl.html';
import { SelectOptionView } from '../../common/select-option-view';
import { CHANGE_DOM_DISPLAY } from './view-commons';
import { JobConfigurationStep } from './job-configuration-step';
import { JobType } from './job-configuration-step';
import {TriggerConfigurationStep} from './trigger-configuration-step';

export class TriggerConfigurationStepView implements js.IView<TriggerConfigurationStep> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: TriggerConfigurationStep): void {
        
    }
}