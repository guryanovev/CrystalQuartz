export enum PropertyType {
  String,
  Boolean,
  Type,
  Numeric,
  Array,
  Object,
  Date,
}

export class Property {
  public constructor(
    public title: string,
    public value: any,
    public valueType: PropertyType
  ) {}
}
