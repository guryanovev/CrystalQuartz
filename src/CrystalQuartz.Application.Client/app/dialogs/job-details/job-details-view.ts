import DialogViewBase from '../dialog-view-base';

import ViewModel from './job-details-view-model';
import PropertyView from '../common/property-view';
import { PropertyValue, Property } from '../../api';

import TEMPLATE from './job-details.tmpl.html';

import __map from 'lodash/map';
import __flatMap from 'lodash/flatMap';

const IS_SINGLE = (value: PropertyValue) => {
    return value === null || value.isSingle();
};

const RESOLVE_VIEW = (value: PropertyValue) => {
    return (value === null || value.isSingle()) ? SinglePropertyValueView : MultiPropertyValueView;
};

class SinglePropertyValueView implements js.IView<PropertyValue> {
    template = '<span></span>';

    init(dom: js.IDom, data: PropertyValue) {
        if (data === null) {
            dom.root.addClass('property-value null');
            dom.root.setText('null');
        } else if (data.typeCode === 'single') {
            dom.root.addClass('property-value');
            dom.root.setText(data.rawValue);
        } else if (data.typeCode === 'error') {
            dom.root.addClass('property-value property-error');
            dom.root.setText(data.errorMessage);
        }
    }
}

class MultiPropertyValueView implements js.IView<PropertyValue> {
    template = '<ul><ul>';

    init(dom: js.IDom, data: PropertyValue) {
        if (data.nestedProperties.length > 0) {
            dom.find('ul').observes(data.nestedProperties, TreePropertyView);
        } else {
            dom.find('ul').observes([new Property('No items', new PropertyValue('single', null, null, null, data.level + 1))], TreePropertyView);
            //dom.find('ul').root.appendHtml('<li>No items</li>');
        }
    }
}

class TreePropertyView implements js.IView<Property> {
    template =
`<tr>
    <td class="js_title property-title"></td>
    <td class="js_value property-value"></td>
</tr>`;

    init(dom: js.IDom, data: Property) {
        dom('.js_title').$.css('padding-left', ((data.value ? data.value.level : 0) * 15) + 'px');
        dom('.js_title').observes(data.title);

//        if (IS_SINGLE(data.value)) {
//            dom('js_value').observes(data.value, SinglePropertyValueView);
//        } else {
//            dom.root.
//
//        }

        const $li = dom('li');

        $li.$.addClass('level-' + (data.value ? data.value.level : 0));
        $li.observes(data.value, RESOLVE_VIEW(data.value));
    }
}

class PropertyValueView implements js.IView<PropertyValue> {
    template = '<table class="object-browser-root"></table>';

    init(dom: js.IDom, data: PropertyValue) {
        dom.find('div').render(RESOLVE_VIEW(data), data);
    }
}

export default class JobDetailsView extends DialogViewBase<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel:ViewModel) {
        super.init(dom, viewModel);

        dom('.js_summary').observes(viewModel.summary, PropertyView);
        //dom('.js_jobDataMap').observes(viewModel.jobDataMap, PropertyValueView);

        dom('.js_jobDataMap').observes(viewModel.jobDataMap, (value: PropertyValue) => IS_SINGLE(value) ? null : FlatObjectRootView);

        viewModel.loadDetails();
    }
}

class FlatObjectItem {
    constructor(
        public title: string,
        public value: string,
        public code: string,
        public level: number) { }
}

export class FlatObjectRootView implements js.IView<PropertyValue> {
    template = `<tbody></tbody>`;

    init(dom: js.IDom, viewModel: PropertyValue) {
        const flattenViewModel = this.flatNestedProperties(viewModel, 1);

        dom('tbody').observes(flattenViewModel, FlatObjectItemView);
    }

    private flatNestedProperties(value: PropertyValue, level: number): FlatObjectItem[] {
        if (value.nestedProperties.length === 0) {
            return [
                new FlatObjectItem(value.typeCode === 'object' ? 'No properties exposed' : 'No items', '', 'empty', level)
            ];
        }

        return __flatMap(
            value.nestedProperties,
            (p:Property) => {
                if (IS_SINGLE(p.value)) {
                    const singleData = this.mapSinglePropertyValue(p.value);

                    return [new FlatObjectItem(p.title, singleData.value, singleData.code, level)];
                }

                const head = new FlatObjectItem(p.title, '', '', level);

                return [
                    head,
                    ...this.flatNestedProperties(p.value, level + 1)
                ];
            });
    }

    private mapSinglePropertyValue(value: PropertyValue): { value: string, code: string } {
        if (value === null) {
            return { value: 'Null', code: 'null' };
        } else if (value.typeCode === 'single') {
            return { value: value.rawValue, code: 'single' };
        } else if (value.typeCode === 'error') {
            return { value: value.errorMessage, code: 'error' };
        }

        throw new Error('Unknown type code: ' + value.typeCode);
    }
}

export class FlatObjectItemView implements js.IView<FlatObjectItem> {
    template =
`<tr>
    <td class="js_title property-title"></td>
    <td class="js_value property-value"></td>
</tr>`;

    init(dom: js.IDom, viewModel: FlatObjectItem) {
        dom('.js_title').$.css('padding-left', (viewModel.level * 15) + 'px');

        dom('.js_title').observes(viewModel.title);
        dom('.js_value').root.addClass(viewModel.code);
        dom('.js_value').observes(viewModel.value);
    }
}