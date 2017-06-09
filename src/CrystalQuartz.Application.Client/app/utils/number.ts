export default class NumberUtils {
    private static LARGE_NUMBER_THRESHOLD = 1000;

    static formatLargeNumber(value: number): string {
        if (value === null || value === undefined) {
            return null;
        }

        if (value < NumberUtils.LARGE_NUMBER_THRESHOLD) {
            return value.toString();
        }

        return Math.floor(value / 1000).toString() + 'K';
    }
}