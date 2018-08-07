import DialogViewBase from '../dialog-view-base';

import ViewModel from './job-details-view-model';
import PropertyView from '../common/property-view';
import { PropertyValue, Property } from '../../api';

import TEMPLATE from './job-details.tmpl.html';

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
            dom.root.addClass('error');
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
            dom.root.appendHtml('<li>No items</li>');
        }
    }
}

class TreePropertyView implements js.IView<Property> {
    template =
`<li class="clearfix">
    <span class="js_title property-title"></span>
</li>`;

    init(dom: js.IDom, data: Property) {
        dom('.js_title').$.css('padding-left', ((data.value ? data.value.level : 0) * 15) + 'px');
        dom('.js_title').observes(data.title);

        const $li = dom('li');

        $li.$.addClass('level-' + (data.value ? data.value.level : 0));
        $li.observes(data.value, RESOLVE_VIEW(data.value));
    }
}

class PropertyValueView implements js.IView<PropertyValue> {
    template = '<div class="object-browser-root"></div>';

    init(dom: js.IDom, data: PropertyValue) {
        dom.find('div').render(RESOLVE_VIEW(data), data);
    }
}

export default class JobDetailsView extends DialogViewBase<ViewModel> {
    template = TEMPLATE;

    init(dom: js.IDom, viewModel:ViewModel) {
        super.init(dom, viewModel);

        dom('.js_summary').observes(viewModel.summary, PropertyView);
        dom('.js_jobDataMap').observes(viewModel.jobDataMap, PropertyValueView);

        viewModel.loadDetails();
    }
}