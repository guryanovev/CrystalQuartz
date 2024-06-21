import {SelectOption} from './select-option';

export const SelectOptionView = (viewModel: SelectOption|string) => {
    const actualOption: SelectOption = (typeof viewModel === 'string') ? { title: viewModel, value: viewModel } : viewModel;

    return <option value={actualOption.value}>{actualOption.title}</option>;
};
