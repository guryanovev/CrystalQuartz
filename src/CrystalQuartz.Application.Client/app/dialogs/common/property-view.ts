import { Property, PropertyType } from './property';

import formatter from './value-formatting';

export default class PropertyView implements js.IView<Property> {
    template = 
`<tr>
    <td class="js_title"></td>
    <td class="js_value"></td>
</tr>`;

    init(dom: js.IDom, viewModel: Property): void {
        dom('.js_title').observes(viewModel.title);

        dom('.js_value').observes(formatter.format(viewModel.value, viewModel.valueType), { encode: false });
    }
}