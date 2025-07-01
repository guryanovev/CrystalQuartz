import { Listenable } from 'john-smith/reactive';
import { View } from 'john-smith/view';
import { List, Value } from 'john-smith/view/components';
import {
  EllipsisPropertyValue,
  EnumerablePropertyValue,
  ErrorPropertyValue,
  ObjectPropertyValue,
  Property,
  PropertyValue,
  SinglePropertyValue,
} from '../../../api';
import DateUtils from '../../../utils/date';

const IS_SINGLE = (
  value: PropertyValue | null
): value is null | SinglePropertyValue | ErrorPropertyValue | EllipsisPropertyValue => {
  return (
    value === null ||
    value.typeCode === 'single' ||
    value.typeCode === 'error' ||
    value.typeCode === '...'
  );
};

export const RENDER_PROPERTIES = (property: Listenable<PropertyValue | null>): JSX.IElement => {
  return (
    <Value
      view={(prop) => {
        const isSingleProperty = IS_SINGLE(prop);
        if (isSingleProperty) {
          // Note that actually we should never get here because
          // Job Data Map that we render here is either null or ObjectPropertyValue
          // but the contract declares it as PropertyValue on both front and back-end.
          return '';
        }

        return <Value view={FlatObjectRootView} model={prop}></Value>;
      }}
      model={property}
    ></Value>
  );
};

class FlatObjectItem {
  public constructor(
    public title: string,
    public value: string,
    public code: string,
    public level: number
  ) {}
}

class FlatObjectRootView implements View {
  public constructor(private readonly viewModel: ObjectPropertyValue | EnumerablePropertyValue) {}

  public template = () => (
    <tbody>
      <List view={FlatObjectItemView} model={this.flatNestedProperties(this.viewModel, 1)}></List>
    </tbody>
  );

  private flatNestedProperties(
    value: ObjectPropertyValue | EnumerablePropertyValue,
    level: number
  ): FlatObjectItem[] {
    if (value.typeCode === 'object') {
      if (value.nestedProperties.length === 0) {
        return [new FlatObjectItem('No properties exposed', '', 'empty', level)];
      }

      const result = value.nestedProperties.flatMap((p: Property) => {
        if (IS_SINGLE(p.value)) {
          const singleData = this.mapSinglePropertyValue(p.value);

          return [new FlatObjectItem(p.title, singleData.value, singleData.code, level)];
        }

        const head = new FlatObjectItem(p.title, '', '', level);

        return [head, ...this.flatNestedProperties(p.value, level + 1)];
      });

      if (value.overflowed) {
        return [...result, new FlatObjectItem('...', 'Rest items hidden', 'overflow', level)];
      }

      return result;
    }

    if (value.typeCode === 'enumerable') {
      if (value.nestedValues.length === 0) {
        return [new FlatObjectItem('No items', '', 'empty', level)];
      }

      const result = value.nestedValues.flatMap(
        (propertyValue: PropertyValue | null, index: number) => {
          const title = `[${index}]`;

          if (IS_SINGLE(propertyValue)) {
            const singleData = this.mapSinglePropertyValue(propertyValue);

            return [new FlatObjectItem(title, singleData.value, singleData.code, level)];
          }

          const head = new FlatObjectItem(title, '', '', level);

          return [head, ...this.flatNestedProperties(propertyValue, level + 1)];
        }
      );

      if (value.overflowed) {
        return [...result, new FlatObjectItem('...', 'Rest items hidden', 'overflow', level)];
      }

      return result;
    }

    throw new Error('Unsupported property type');

    // if (value.nestedProperties === null || value.nestedProperties.length === 0) {
    //   return [
    //     new FlatObjectItem(
    //       value.typeCode === 'object' ? 'No properties exposed' : 'No items',
    //       '',
    //       'empty',
    //       level
    //     ),
    //   ];
    // }
    //
    // const result = value.nestedProperties.flatMap((p: Property) => {
    //   if (IS_SINGLE(p.value)) {
    //     const singleData = this.mapSinglePropertyValue(p.value);
    //
    //     return [new FlatObjectItem(p.title, singleData.value, singleData.code, level)];
    //   }
    //
    //   const head = new FlatObjectItem(p.title, '', '', level);
    //
    //   return [head, ...this.flatNestedProperties(p.value, level + 1)];
    // });
    //
    // if (value.isOverflow) {
    //   return [...result, new FlatObjectItem('...', 'Rest items hidden', 'overflow', level)];
    // }
    //
    // return result;
  }

  private mapSinglePropertyValue(value: PropertyValue | null): { value: string; code: string } {
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

  private formatSingleValue(value: SinglePropertyValue) {
    if (value.kind === 3) {
      try {
        return DateUtils.smartDateFormat(parseInt(value.rawValue, 10));
      } catch {}
    }

    return value.rawValue;
  }
}

const FlatObjectItemView = (viewModel: FlatObjectItem) => (
  <tr>
    <td class="js_title property-title" style={'padding-left: ' + viewModel.level * 15 + 'px'}>
      {viewModel.title}
    </td>
    <td class="js_value property-value" $className={viewModel.code}>
      {viewModel.value}
    </td>
  </tr>
);
