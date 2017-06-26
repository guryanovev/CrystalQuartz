import DialogViewBase from '../dialog-view-base';

import ViewModel from './job-details-view-model';
import PropertyView from '../common/property-view';

import TEMPLATE from './job-details.tmpl.html';

import __map from 'lodash/map';

interface IGenericObject {
    Title: string;
    TypeCode: string;
    Value: any;
    Level?: number;
}

class ObjectPropertyView implements js.IView<IGenericObject> {
    template =
`<li>
    <span class="js_title property-title"></span>
    <span class="js_value property-value"></span>
    <div class="js_children"></div>
</li>`;

    init(dom: js.IDom, data: IGenericObject) {
        const level = data.Level || 0;

        const $title = dom('.js_title');
        $title.observes(data.Title);
        $title.$.css('padding-left', ((level + 1) * 15) + 'px');

        const dataType = data.TypeCode,
            value = data.Value;

        if (dataType === 'Array' || dataType === 'Object') {
            var children: IGenericObject[] = [];
            if (dataType === 'Array') {
                for (var i = 0; i < value.length; i++) {
                    children.push({
                        Title: '[' + i + ']',
                        TypeCode: value[i].Type,
                        Value: value[i].Value,
                        Level: level + 1
                    });
                }
            } else {
                children = __map(value, (item: any) => {
                    item.Level = level + 1;
                    return item;
                });
            }

            dom('.js_children').observes(children, ObjectBrowserView);
            dom('.js_value').observes('&nbsp;', { encode: false });
        } else {
            dom('.js_value').observes(value || 'Null');
        }
    }
}

class ObjectBrowserView implements js.IView<IGenericObject[]> {
    template = '<ul></ul>';

    init(dom: js.IDom, viewModel: IGenericObject[]) {
        dom('ul').observes(viewModel, ObjectPropertyView);
    }
}

export default class JobDetailsView extends DialogViewBase<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel:ViewModel) {
        super.init(dom, viewModel);

        dom('.js_summary').observes(viewModel.summary, PropertyView);
        dom('.js_jobDataMap').observes(viewModel.jobDataMap, ObjectBrowserView);

        viewModel.loadDetails();
    }
}