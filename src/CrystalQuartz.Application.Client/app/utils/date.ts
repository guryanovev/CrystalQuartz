const getDate = (date: number | Date): Date => {
    if (date instanceof Date) {
        return date;
    }

    return new Date(date);
};

interface IFormatter {
    (date: number|Date): string;
}

class DateLocaleEnvironment {
    constructor(
        public dateFormatter: IFormatter,
        public timeFormatter: IFormatter) { }
}

class LocaleEnvironmentFactory {
    private _hours12Formatter = (date: number | Date) => {
        const dateObject = getDate(date),
              hours = dateObject.getHours(),
              minutes = dateObject.getMinutes(),
              seconds = dateObject.getSeconds(),
              isPm = hours > 12;

        return this.padZeros(isPm ? hours - 12 : hours) + ':' + this.padZeros(minutes)  +
            (seconds > 0 ? (':' + this.padZeros(seconds)) : '') + ' ' +
            (isPm ? 'PM' : 'AM');
    };

    private _hours24Formatter = (date: number | Date) => {
        const dateObject = getDate(date),
              hours = dateObject.getHours(),
              minutes = dateObject.getMinutes(),
              seconds = dateObject.getSeconds();

        return this.padZeros(hours) + ':' + this.padZeros(minutes) + (seconds > 0 ? (':' + seconds) : '');
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

    createEnvironment(): DateLocaleEnvironment {
        const dateFormatter = (date: number | Date) => getDate(date).toLocaleDateString();

        return new DateLocaleEnvironment(
            dateFormatter,
            this.is24HoursFormat() ? this._hours24Formatter : this._hours12Formatter);
    }
}

const localeEnvironment: DateLocaleEnvironment = new LocaleEnvironmentFactory().createEnvironment();

export default class DateUtils {
    static smartDateFormat(date: number|Date): string {
        const today = new Date().getTime(),
            tomorrow = today + 86400000,
            dateObject = getDate(date),
            dateTicks = dateObject.getTime(),
            shouldAddDate = dateTicks >= today && dateTicks <= tomorrow;

        return (shouldAddDate ? localeEnvironment.dateFormatter(dateObject) + ' ' : '') + 
            localeEnvironment.timeFormatter(dateObject);
    }
}
