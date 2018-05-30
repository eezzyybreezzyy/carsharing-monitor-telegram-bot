export function removeDuplicates(arrayWithDuplicates: any[]): any[] {
    return [...new Set(arrayWithDuplicates)];
}