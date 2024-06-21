export default class NumberUtils {
    private static THRESHOLDS = [
        { value: 1000000000, suffix: 'B' },
        { value: 1000000, suffix: 'M' },
        { value: 1000, suffix: 'K' }
    ];

    static formatLargeNumber(value: number): string | null {
        if (value === null || value === undefined) {
            return null;
        }

        // just a simple optimization for small numbers as it is a common case
        if (value < this.THRESHOLDS[this.THRESHOLDS.length - 1].value) {
            return value.toString();
        }

        for (let i = 0; i < this.THRESHOLDS.length; i++) {
            const thresholdValue = this.THRESHOLDS[i].value;
            if (value > thresholdValue) {
                return Math.floor(value / thresholdValue).toString() + this.THRESHOLDS[i].suffix;
            }
        }

        return value.toString();
    }
}
