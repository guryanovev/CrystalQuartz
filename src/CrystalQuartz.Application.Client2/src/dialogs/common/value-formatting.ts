import { TypeInfo } from '../../api';
import DateUtils from '../../utils/date';
import { PropertyType } from './plainProperty';

export default class ValueFormatter {
  public static format(
    value: string | null | undefined | TypeInfo | number | boolean,
    typeCode: PropertyType
  ) {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeCode === PropertyType.Type) {
      const type = <TypeInfo>value;

      return `<span class="namespace">${type.Namespace}.</span><span class="name">${type.Name}</span><span class="assembly">, ${type.Assembly}</span>`;
    }

    if (typeCode === PropertyType.Date) {
      return DateUtils.smartDateFormat(value as number);
    }

    return value.toString();
  }
}
