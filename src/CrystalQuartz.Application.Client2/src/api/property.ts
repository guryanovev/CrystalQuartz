import { PropertyValue } from './property-value';

export class Property {
  public constructor(
    public readonly title: string,
    public readonly value: PropertyValue
  ) {}
}
