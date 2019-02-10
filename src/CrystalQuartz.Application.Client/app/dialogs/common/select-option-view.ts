import {SelectOption} from './select-option';

export class SelectOptionView implements js.IView<SelectOption|string> {
    template = '<option></option>';

    init(dom: js.IDom, viewModel: SelectOption | string) {
        const $option = dom('option');

        const actualOption: SelectOption = (typeof viewModel === 'string') ? { title: viewModel, value: viewModel } : viewModel;

        $option.$.prop('value', actualOption.value);
        $option.$.text(actualOption.title);
    }
}