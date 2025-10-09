export const cleanHtml = (html: string) => {
  /*
   * Comprehensive cleaning for product descriptions:
   * 1. Unescape any double-escaped newlines (\\n to \n).
   * 2. Extract and format links: Replaces <a href="URL">Text</a> with "Text (URL)".
   * 3. Strip all remaining HTML tags.
   * 4. Replace multiple spaces with a single space, then trim.
   */
  let cleaned = html.replace(/\\n/g, '\n'); // 1. Unescape newlines

  // 2. Extract and format links
  cleaned = cleaned.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*?>(.*?)<\/a>/gi, '[Link: $2 ($1)]');

  // 3. Strip all remaining HTML tags
  cleaned = cleaned.replace(/<[^>]*>?/gm, '');

  // 4. Replace multiple spaces with a single space, then trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
};

/**
 * Normalizes a category name for consistent storage and lookup.
 * This involves cleaning HTML, converting to lowercase, and further standardization.
 */
export const normalizeCategoryName = (name: string) => {
  let normalized = cleanHtml(name || ''); // Ensure name is a string before cleaning
  normalized = normalized.toLowerCase();

  // Handle common typos or variations (e.g., 'firniture' -> 'furniture')
  normalized = normalized.replace(/firniture/g, 'furniture');

  // Aggressively split by common delimiters, filter unique, and re-join
  const parts = normalized.split(/[\s,;\/\-()&]+/).filter(Boolean); // Split by various delimiters
  const uniqueParts = Array.from(new Set(parts)); // Get unique parts
  normalized = uniqueParts.join(' '); // Rejoin with single spaces

  // Trim any remaining leading/trailing non-alphanumeric characters
  normalized = normalized.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');

  return normalized.trim(); // Final trim
};

import slugify from 'slugify';
// import { v4 as uuidv4 } from 'uuid'; // Removed as it's not used in this file

export const simpleSlugify = (text: string) => {
  return slugify(text, { lower: true, strict: true });
};

export interface RawSubcategoryData {
  id: string;
  name: string;
  slug?: string;
}

export interface RawCategoryData {
  id: string;
  name: string;
  slug?: string;
  subcategories?: RawSubcategoryData[]; // Directly use subcategories from DB fetch
}

export interface StructuredSubcategory {
  id: string;
  name: string;
  slug: string;
}

export interface StructuredCategory {
  id: string;
  name: string;
  slug: string;
  subcategories: StructuredSubcategory[];
}

export const transformCategories = (
  categoriesData: RawCategoryData[],
): StructuredCategory[] => {
  // const structuredCategories: StructuredCategory[] = []; // Removed as it was declared but never used

  const processCategoryGroup = (groupName: string): StructuredCategory | null => {
    const existingCategory = categoriesData.find(cat =>
      normalizeCategoryName(cat.name) === normalizeCategoryName(groupName)
    );

    if (!existingCategory) {
      console.warn(`transformCategories: Top-level category "${groupName}" not found in database. Skipping.`);
      return null;
    }

    const groupId = existingCategory.id;
    const groupSlug = existingCategory.slug || simpleSlugify(existingCategory.name);

    // Directly use subcategories from the fetched existingCategory
    const subcategories: StructuredSubcategory[] = (existingCategory.subcategories || []).map(sub => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug || simpleSlugify(sub.name),
    }));

    return {
      id: groupId,
      name: groupName,
      slug: groupSlug,
      subcategories,
    };
  };

  const predefinedCategoryGroups = [
    processCategoryGroup('Office Range'),
    processCategoryGroup('Waiting Benches Range'),
    processCategoryGroup('Dining Range'),
    processCategoryGroup('Folding Range'),
    processCategoryGroup('Moulded Range'), // Changed 'Molded Range' to 'Moulded Range'
    processCategoryGroup('Outdoor Range'),
    processCategoryGroup('Study Range'),
  ];

  return predefinedCategoryGroups.filter((group): group is StructuredCategory => group !== null);
};
