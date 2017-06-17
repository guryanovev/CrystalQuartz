import { Property } from './property';

export default class PropertyView implements js.IView<Property> {
    template = 
`<tr>
    <td class="js_title"></td>
    <td class="js_value"></td>
</tr>`;

    init(dom: js.IDom, viewModel: Property): void {
        dom('.js_title').observes(viewModel.title);
        dom('.js_value').observes(viewModel.value);
    }
}