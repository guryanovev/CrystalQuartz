export class NullableDate {
  public readonly isEmpty = this.date == null;

  public constructor(public readonly date: number | null) {}
}
