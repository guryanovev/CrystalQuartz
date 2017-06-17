export enum PropertyType {
    String,
    Boolean,
    Type,
    Numeric
}

export class Property {
    constructor(
        public title: string,
        public value: any,
        public valueType: PropertyType) { }
}