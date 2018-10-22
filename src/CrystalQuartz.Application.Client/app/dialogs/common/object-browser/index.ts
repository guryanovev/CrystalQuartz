import {Property, PropertyValue} from "../../../api";
import __flatMap from "lodash/flatMap";
import DateUtils from "../../../utils/date";

const IS_SINGLE = (value: PropertyValue) => {
    return value === null || value.isSingle();
};

export var RENDER_PROPERTIES = (dom: js.IListenerDom, properties: js.IObservable<PropertyValue>) => {
    dom.observes(properties, p => IS_SINGLE(p) ? null : FlatObjectRootView)
}

class FlatObjectItem {
    constructor(
        public title: string,
        public value: string,
        public code: string,
        public level: number) { }
}

class FlatObjectRootView implements js.IView<PropertyValue> {
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

        const result = __flatMap(
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

        if (value.isOverflow) {
            return [...result, new FlatObjectItem('...', 'Rest items hidden', 'overflow', level)]
        }

        return result;
    }

    private mapSinglePropertyValue(value: PropertyValue): { value: string, code: string } {
        if (value === null) {
            return { value: 'Null', code: 'null' };
        } else if (value.typeCode === 'single') {
            return { value: this.formatSingleValue(value), code: 'single' };
        } else if (value.typeCode === 'error') {
            return { value: value.errorMessage, code: 'error' };
        } else if (value.typeCode === '...') {
            return { value: '...', code: 'overflow' };
        }

        throw new Error('Unknown type code: ' + value.typeCode);
    }

    private formatSingleValue(value: PropertyValue) {
        if (value.kind === 3) {
            try {
                return DateUtils.smartDateFormat(parseInt(value.rawValue, 10));
            } catch (e) {
            }
        }

        return value.rawValue;
    }
}

class FlatObjectItemView implements js.IView<FlatObjectItem> {
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