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
  const parts = normalized.split(/[\s,;\/\-\\(\)&]+/).filter(Boolean); // Split by various delimiters
  const uniqueParts = Array.from(new Set(parts)); // Get unique parts
  normalized = uniqueParts.join(' '); // Rejoin with single spaces

  // Trim any remaining leading/trailing non-alphanumeric characters
  normalized = normalized.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');

  return normalized.trim(); // Final trim
};

import slugify from 'slugify';

export const simpleSlugify = (text: string) => {
  return slugify(text, { lower: true, strict: true });
};

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
  categoriesData: any[],
  sharedSubcategories: any[]
): StructuredCategory[] => {
  const structuredCategories: StructuredCategory[] = [];

  const findSubcategory = (name: string, subcategories: any[]) => {
    const normalizedName = normalizeCategoryName(name);
    return subcategories.find(
      (sub) =>
        normalizeCategoryName(sub.name) === normalizedName ||
        simpleSlugify(sub.name) === simpleSlugify(name)
    );
  };

  const processCategoryGroup = (groupName: string, subcategoryNames: string[]): StructuredCategory => {
    const groupSlug = simpleSlugify(groupName);
    const subcategories: StructuredSubcategory[] = [];

    subcategoryNames.forEach(subName => {
      const foundSub = findSubcategory(subName, sharedSubcategories);
      if (foundSub) {
        subcategories.push({
          id: foundSub.id,
          name: foundSub.name,
          slug: foundSub.slug || simpleSlugify(foundSub.name),
        });
      } else {
        categoriesData.forEach(cat => {
          if (cat.category_subcategories) {
            const foundInCat = findSubcategory(subName, cat.category_subcategories.map((link: any) => link.subcategory_id));
            if (foundInCat && !subcategories.some(s => s.id === foundInCat.id)) {
                subcategories.push({
                    id: foundInCat.id,
                    name: foundInCat.name,
                    slug: foundInCat.slug || simpleSlugify(foundInCat.name),
                });
            }
          }
        });

        if (!subcategories.some(s => simpleSlugify(s.name) === simpleSlugify(subName))) {
          console.warn(`Subcategory "${subName}" not found in fetched data. Creating placeholder.`);
          subcategories.push({
            id: simpleSlugify(subName),
            name: subName,
            slug: simpleSlugify(subName),
          });
        }
      }
    });

    return {
      id: groupSlug,
      name: groupName,
      slug: groupSlug,
      subcategories,
    };
  };

  structuredCategories.push(
    processCategoryGroup('Office Range', [
      'Visitor Office Chairs',
      'Staff Office Chairs',
      'Manager Office Chairs',
      'Executive Office Chairs',
      'Gaming Chairs',
      'Visitor Benches',
      'Lab Chair',
    ])
  );
  structuredCategories.push(
    processCategoryGroup('Waiting Benches Range', [
      'Steel Benche',
      'Plastic Benche',
      'Wooden Benche',
    ])
  );
  structuredCategories.push(
    processCategoryGroup('Dining Range', [
      'Dining Table Sets',
      'Dining Tables',
      'Dining Chairs',
      'Bar Stools',
    ])
  );
  structuredCategories.push(
    processCategoryGroup('Folding Range', [
      'Folding Chair',
      'Folding Table Sets',
    ])
  );
  structuredCategories.push(
    processCategoryGroup('Molded Range', [
      'Plastic Chairs',
      'Plastic Table',
      'Plastic & Table Sets',
      'Namaz Chair',
    ])
  );
  structuredCategories.push(
    processCategoryGroup('Outdoor Range', [
      'Rattan Sofa',
      'Outdoor Chair',
      'UPVC Craft',
      'Waste Bin',
      'Swing Range',
      'Play Ground Swing',
    ])
  );
  structuredCategories.push(
    processCategoryGroup('Study Range', [
      'Study Chairs',
      'Joint Desks',
      'Study Desk Benches',
    ])
  );

  return structuredCategories;
};
