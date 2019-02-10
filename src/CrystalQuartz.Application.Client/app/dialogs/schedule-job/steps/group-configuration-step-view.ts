import { GroupConfigurationStep } from './group-configuration-step';

import TEMPLATE from './group-configuration-step.tmpl.html';
import { JobGroupType } from './group-configuration-step';
import { SelectOptionView } from '../../common/select-option-view';
import { CHANGE_DOM_DISPLAY } from './view-commons';

import { RENDER_VALIDATOR } from '../../common/validation/render-validator';

export class GroupConfigurationStepView implements js.IView<GroupConfigurationStep> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel: GroupConfigurationStep): void {
        console.log('init group configuration step vew', dom);

        const jobGroupTypes = [
            { code: JobGroupType.Existing, dom: dom('.js_jobGroupTypeExisting') },
            { code: JobGroupType.New, dom: dom('.js_jobGroupTypeNew') }
        ];

        dom('.js_jobGroupSelect').observes(viewModel.jobGroupType, { bidirectional: true });
        dom('.js_jobGroupSelect').observes(viewModel.jobGroupTypeOptions, SelectOptionView);

        dom.manager.manage(viewModel.jobGroupType.listen(currentJobGroupType => {
            CHANGE_DOM_DISPLAY(jobGroupTypes, currentJobGroupType);
        }));

        dom('.js_existingJobGroupSelect').observes(viewModel.existingJobGroups, SelectOptionView);
        //dom('.js_existingJobGroupSelect').observes(viewModel.selectedJobGroup, { bidirectional: true });
        dom('.js_newJobGroupInput').observes(viewModel.newJobGroup, { bidirectional: true });

        RENDER_VALIDATOR(
            dom('.js_existingJobGroupSelect'),
            dom('.js_existingJobGroupContainer'),
            viewModel.selectedJobGroup,
            viewModel.validators);
    }
}