export function concatArrays(arrays: any[][]): any[] {
    return Array.prototype.concat.apply([], arrays);
}