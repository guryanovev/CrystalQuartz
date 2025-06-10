import { Property, PropertyType } from './property';
import formatter from './value-formatting';

export const PropertyView = (property: Property) => (
  <tr>
    <td>{property.title}</td>
    <td $innerHTML={formatter.format(property.value, property.valueType)}></td>
  </tr>
);
