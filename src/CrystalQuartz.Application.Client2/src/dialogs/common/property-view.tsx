import { PlainProperty } from './plainProperty';
import formatter from './value-formatting';

export const PropertyView = (property: PlainProperty) => (
  <tr>
    <td>{property.title}</td>
    <td $innerHTML={formatter.format(property.value, property.valueType)}></td>
  </tr>
);
