import { TypeInfo } from '../../api';

export enum PropertyType {
  String,
  Boolean,
  Type,
  Numeric,
  Array,
  Object,
  Date,
}

export class PlainProperty {
  public constructor(
    public title: string,
    public value: string | null | undefined | TypeInfo | number | boolean,
    public valueType: PropertyType
  ) {}
}
