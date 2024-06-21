import { NullableDate } from '../../api';
import { View } from 'john-smith/view';
import DateUtils from '../../utils/date';

export class NullableDateView implements View {

    constructor(private readonly viewModel: NullableDate) {
    }

    template = () => <span class="cq-date">{
        this.viewModel.isEmpty() ?
            <span class="cq-none">[none]</span>
            : DateUtils.smartDateFormat(this.viewModel.getDate()!) || '&nbsp;'
    }</span>;

    // init(dom: js.IDom, value: NullableDate) {
    //     if (value.isEmpty()) {
    //         dom.$.append('<span class="cq-none">[none]</span>');
    //     } else {
    //         dom.$.append(DateUtils.smartDateFormat(value.getDate()) || '&nbsp;');
    //     }
    // }
} 
