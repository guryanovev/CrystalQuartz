const getDate = (date: number | Date): Date => {
  if (date instanceof Date) {
    return date;
  }

  return new Date(date);
};

interface IFormatter {
  (date: number | Date): string;
}

class DateLocaleEnvironment {
  public constructor(
    public dateFormatter: IFormatter,
    public timeFormatter: IFormatter
  ) {}
}

class LocaleEnvironmentFactory {
  private _hours12Formatter = (date: number | Date) => {
    const dateObject = getDate(date);
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();
    const isPm = hours > 12;

    return (
      this.padZeros(isPm ? hours - 12 : hours) +
      ':' +
      this.padZeros(minutes) +
      (seconds > 0 ? ':' + this.padZeros(seconds) : '') +
      ' ' +
      (isPm ? 'PM' : 'AM')
    );
  };

  private _hours24Formatter = (date: number | Date) => {
    const dateObject = getDate(date);
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();

    return (
      this.padZeros(hours) +
      ':' +
      this.padZeros(minutes) +
      (seconds > 0 ? ':' + this.padZeros(seconds) : '')
    );
  };

  private padZeros(value: number): string {
    if (value < 10) {
      return '0' + value;
    }

    return value.toString();
  }

  private is24HoursFormat(): boolean {
    const markerDate = new Date(2017, 4, 28, 17, 26);

    return markerDate.toLocaleTimeString().indexOf('17') >= 0;
  }

  public createEnvironment(): DateLocaleEnvironment {
    const dateFormatter = (date: number | Date) => getDate(date).toLocaleDateString();

    return new DateLocaleEnvironment(
      dateFormatter,
      this.is24HoursFormat() ? this._hours24Formatter : this._hours12Formatter
    );
  }
}

const localeEnvironment: DateLocaleEnvironment = new LocaleEnvironmentFactory().createEnvironment();

export default class DateUtils {
  public static smartDateFormat(date: number | Date): string {
    const now = new Date();
    const today = now.setHours(0, 0, 0, 0); // start time of local date
    const tomorrow = today + 86400000;
    const dateObject = getDate(date);
    const dateTicks = dateObject.getTime();
    const shouldOmitDate = dateTicks >= today && dateTicks <= tomorrow;

    return (
      (shouldOmitDate ? '' : localeEnvironment.dateFormatter(dateObject) + ' ') +
      localeEnvironment.timeFormatter(dateObject)
    );
  }

  public static timeFormat(date: number | Date): string {
    return localeEnvironment.timeFormatter(date);
  }
}
