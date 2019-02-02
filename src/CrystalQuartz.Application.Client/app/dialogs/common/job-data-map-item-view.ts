import { JobDataMapItem } from './job-data-map';
import {InputType} from '../../api';
import {InputTypeVariant} from '../../api';

class OptionView implements js.IView<InputType> {
    template = '<option></option>';

    init(dom: js.IDom, viewModel: InputType) {
        const $option = dom('option');
        $option.$.prop('value', viewModel.code);
        $option.$.text(viewModel.label);
    }
}

class VariantOptionView implements js.IView<InputTypeVariant> {
    template = '<option></option>';

    init(dom: js.IDom, viewModel: InputTypeVariant) {
        const $option = dom('option');
        $option.$.prop('value', viewModel.value);
        $option.$.text(viewModel.label);
    }
}

export class JobDataMapItemView implements js.IView<JobDataMapItem> {
    template = `
<tr class="no-border">
    <td class="js_key job-data-key"></td>
    <td class="job-data-input-type">
        <select class="js_inputType form-control form-control-sm"></select>
    </td>
    <td class="">
        <input class="js_value form-control form-control-sm" type="text" />
        <select class="js_inputTypeVariants form-control form-control-sm"></select>
    </td>
    <td class="job-data-remove"><a href="javascript:void(0);" class="js_remove">&times;</a></td>
</tr>
<tr class="no-padding">
    <td></td>
    <td colspan="2">
        <p class="js_error error"></p>
    </td>
    <td></td>
</tr>`;

    init(dom: js.IDom, viewModel: JobDataMapItem): void{
        let $valueInput = dom('.js_value');

        $valueInput.$.prop('placeholder', 'Enter ' + viewModel.key + ' value');
        dom('.js_key').observes(viewModel.key);
        $valueInput.observes(viewModel.value, { bidirectional: true });

        const $inputTypeSelect = dom('.js_inputType');
        $inputTypeSelect.observes(viewModel.inputTypes, OptionView);
        $inputTypeSelect.observes(viewModel.inputTypeCode, { bidirectional: true, command: viewModel.setInputTypeCode });

        const $valueSelect = dom('.js_inputTypeVariants');
        $valueSelect.observes(viewModel.variants, VariantOptionView);
        $valueSelect.observes(viewModel.selectedVariantValue, { bidirectional: true });

        dom.manager.manage(viewModel.hasVariants.listen(hasVariants => {
            $valueInput.$.css('display', hasVariants ? 'none' : 'inline');
            $valueSelect.$.css('display', !hasVariants ? 'none' : 'inline');
        }));

        dom('.js_remove').on('click').react(viewModel.remove);

        const $error = dom('.js_error');
        $error.observes(viewModel.error);
        dom.manager.manage(viewModel.error.listen(error => {
            $error.$.css('display', error ? 'block' : 'none');
        }));
    }
}