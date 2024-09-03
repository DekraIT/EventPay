// Type guard function to check if a value is a number
export function isNumber(value: any): value is number {
    return typeof value === 'number' && !Number.isNaN(value);
}