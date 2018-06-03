export class Duration implements js.IDisposable {
    value = new js.ObservableValue<string>();
    measurementUnit = new js.ObservableValue<string>();

    private _timerRef: number = null;

    private _ranges = [
        { title: 'sec', edge: 1000 },
        { title: 'min', edge: 60 },
        { title: 'hours', edge: 60 },
        { title: 'days', edge: 24 }
    ];

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
        if (this._timerRef) {
            clearTimeout(this._timerRef);
            this._timerRef = null;
        }
    }

    private calculate() {
        this.releaseTimer();

        if (!this.startDate) {
            this.value.setValue(null);
            this.measurementUnit.setValue('');

            return;
        }

        const durationMilliseconds = (this.endDate || new Date().getTime()) - this.startDate;

        let ratio = 1;

        for (var i = 0; i < this._ranges.length; i++) {
            const rangeItem = this._ranges[i];
            ratio *= rangeItem.edge;

            const ratioUnits = durationMilliseconds / ratio,
                isLastItem = i === this._ranges.length - 1;

            if (isLastItem || this.isCurrentRange(durationMilliseconds, i, ratio)) {
                this.value.setValue(Math.floor(ratioUnits).toString());
                this.measurementUnit.setValue(' ' + rangeItem.title);

                if (!this.endDate) {
                    this._timerRef = setTimeout(() => this.calculate(), ratio / 2);
                }

                return;
            }
        }
    }

    private isCurrentRange(uptimeMilliseconds: number, index: number, ratioMultiplier: number) {
        return (uptimeMilliseconds / (this._ranges[index + 1].edge * ratioMultiplier)) < 1;
    }
}