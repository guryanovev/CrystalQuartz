import {Timer} from "./timer";

export class DurationFormatter {
    private static _ranges = [
        { title: 'sec', edge: 1000 },
        { title: 'min', edge: 60 },
        { title: 'hours', edge: 60 },
        { title: 'days', edge: 24 }
    ];

    static format(durationMilliseconds) {
        let ratio = 1;

        for (var i = 0; i < this._ranges.length; i++) {
            const rangeItem = this._ranges[i];
            ratio *= rangeItem.edge;

            const ratioUnits = durationMilliseconds / ratio,
                isLastItem = i === this._ranges.length - 1;

            if (isLastItem || this.isCurrentRange(durationMilliseconds, i, ratio)) {
                return {
                    value: Math.floor(ratioUnits).toString(),
                    unit: rangeItem.title,
                    ratio: ratio
                };
            }
        }

        return null; // should not ever get here
    }

    private static isCurrentRange(uptimeMilliseconds: number, index: number, ratioMultiplier: number) {
        return (uptimeMilliseconds / (this._ranges[index + 1].edge * ratioMultiplier)) < 1;
    }
}

export class Duration implements js.IDisposable {
    value = new js.ObservableValue<string>();
    measurementUnit = new js.ObservableValue<string>();

    private _timer = new Timer();

    constructor(
        private startDate?: number,
        private endDate?: number) {

        const waitingText = '...';

        this.value.setValue(waitingText);
    }

    init() {
        this.calculate();
    }

    setStartDate(date: number) {
        this.startDate = date;
        this.calculate();
    }

    setEndDate(date: number) {
        this.endDate = date;
        this.calculate();
    }

    dispose() {
        this.releaseTimer();
    }

    private releaseTimer() {
        this._timer.reset();
    }

    private calculate() {
        this.releaseTimer();

        if (!this.startDate) {
            this.value.setValue(null);
            this.measurementUnit.setValue('');

            return;
        }

        const
            durationMilliseconds = (this.endDate || new Date().getTime()) - this.startDate,
            formattedDuration = DurationFormatter.format(durationMilliseconds);

        if (formattedDuration) {
            this.value.setValue(formattedDuration.value);
            this.measurementUnit.setValue(' ' + formattedDuration.unit);

            if (!this.endDate) {
                this._timer.schedule(() => this.calculate(), formattedDuration.ratio / 2);
            }
        }
    }
}