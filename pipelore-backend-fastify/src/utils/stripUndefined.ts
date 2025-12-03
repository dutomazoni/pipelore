// function to remove undefined from the update input object
export function stripUndefined<T extends Record<string, any>>(obj: Partial<T>): Partial<T> {
    const entries = Object.entries(obj).filter(([_, v]) => v !== undefined);
    return Object.fromEntries(entries) as Partial<T>;
}
