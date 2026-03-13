/**
 * Utility to create a URL-friendly slug from a string.
 * @param text The string to slugify
 */
export const createSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};
