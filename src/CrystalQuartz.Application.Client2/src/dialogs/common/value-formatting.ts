import { TypeInfo } from '../../api';
import DateUtils from '../../utils/date';
import { PropertyType } from './property';

export default class ValueFormatter {
  public static format(value: any, typeCode: PropertyType) {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeCode === PropertyType.Type) {
      const type = <TypeInfo>value;

      return `<span class="namespace">${type.Namespace}.</span><span class="name">${type.Name}</span><span class="assembly">, ${type.Assembly}</span>`;
    }

    if (typeCode === PropertyType.Date) {
      return DateUtils.smartDateFormat(value);
    }

    return value.toString();
  }
}
