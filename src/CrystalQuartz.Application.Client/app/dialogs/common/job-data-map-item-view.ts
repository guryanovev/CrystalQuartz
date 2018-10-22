import { JobDataMapItem } from './job-data-map';

export class JobDataMapItemView implements js.IView<JobDataMapItem> {
    template = `
<tr>
    <td class="js_key job-data-key"></td>
    <td class="">
        <input class="js_value form-control form-control-sm" type="text" />
    </td>
    <td class="job-data-remove"><a href="javascript:void(0);" class="js_remove">&times;</a></td>
</tr>`;

    init(dom: js.IDom, viewModel: JobDataMapItem): void{
        let $value = dom('.js_value');

        $value.$.prop('placeholder', 'Enter ' + viewModel.key + ' value');
        dom('.js_key').observes(viewModel.key);
        $value.observes(viewModel.value, { bidirectional: true });

        dom('.js_remove').on('click').react(viewModel.remove);
    }
}