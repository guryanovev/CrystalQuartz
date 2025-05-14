import { JobDataMapItem } from './job-data-map';
import {InputType} from '../../api';
import {InputTypeVariant} from '../../api';
import { View } from 'john-smith/view';
import { List } from 'john-smith/view/components/list';
import { SelectOptionView } from './select-option-view';
import { Value } from 'john-smith/view/components/value';
import { VirtualNode } from 'john-smith/view/components/virtual-node';

export const OptionView = (viewModel: InputType) => <option value={viewModel.code}>{viewModel.label}</option>;

// todo replace with SelectOptionView?
const VariantOptionView = (viewModel: InputTypeVariant) => <option value={viewModel.value}>{viewModel.label}</option>;

export class JobDataMapItemView implements View {

    constructor(private readonly viewModel: JobDataMapItem) {
    }

    template = () =>
        <VirtualNode children={[
            <tr class="no-border">
                <td class="js_key job-data-key">{this.viewModel.key}</td>
                <td class="job-data-input-type">
                    <select class="js_inputType form-select form-select-sm" $value={this.viewModel.inputTypeCode}>
                        <List
                            view={option => <option value={option.code}>{option.label}</option>}
                            model={this.viewModel.inputTypes}></List>
                    </select>
                </td>
                <td class="">
                    <Value view={hasVariants => {
                        if (hasVariants) {
                            return <select class="js_inputTypeVariants form-select form-select-sm">
                                <List
                                    view={option => <option value={option.value}>{option.label}</option>}
                                    model={this.viewModel.variants}></List>
                            </select>;
                        }

                        return <input
                            class="js_value form-control form-control-sm"
                            type="text"
                            placeholder={'Enter ' + this.viewModel.key + ' value'}
                            $value={this.viewModel.value}/>;
                    }} model={this.viewModel.hasVariants}></Value>


                </td>
                <td class="job-data-remove">
                    <button
                        class="btn btn-light btn-sm"
                        style="min-width: 27px"
                        _click={() => this.viewModel.remove() }>&times;</button>
                </td>
            </tr>,

            <tr class="no-padding">
                <td></td>
                <td colspan="2">
                    <Value view={errorText => <p class="error">{errorText}</p>} model={this.viewModel.error}></Value>
                </td>
                <td></td>
            </tr>
        ]}>
        </VirtualNode>;

    // init(dom: js.IDom, viewModel: JobDataMapItem): void{
    //     let $valueInput = dom('.js_value');
    //
    //     $valueInput.$.prop('placeholder', 'Enter ' + viewModel.key + ' value');
    //     dom('.js_key').observes(viewModel.key);
    //     $valueInput.observes(viewModel.value, { bidirectional: true });
    //
    //     const $inputTypeSelect = dom('.js_inputType');
    //     $inputTypeSelect.observes(viewModel.inputTypes, OptionView);
    //     $inputTypeSelect.observes(viewModel.inputTypeCode, { bidirectional: true, command: viewModel.setInputTypeCode });
    //
    //     const $valueSelect = dom('.js_inputTypeVariants');
    //     $valueSelect.observes(viewModel.variants, VariantOptionView);
    //     $valueSelect.observes(viewModel.selectedVariantValue, { bidirectional: true });
    //
    //     dom.manager.manage(viewModel.hasVariants.listen(hasVariants => {
    //         $valueInput.$.css('display', hasVariants ? 'none' : 'inline');
    //         $valueSelect.$.css('display', !hasVariants ? 'none' : 'inline');
    //     }));
    //
    //     dom('.js_remove').on('click').react(viewModel.remove);
    //
    //     const $error = dom('.js_error');
    //     $error.observes(viewModel.error);
    //     dom.manager.manage(viewModel.error.listen(error => {
    //         $error.$.css('display', error ? 'block' : 'none');
    //     }));
    // }
}
