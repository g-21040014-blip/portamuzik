/**
 * Category Validation & Integrity Rules
 * Restricts forbidden or outdated naming conventions containing:
 * - 'takwim'
 * - 'takwin'
 * - '2027'
 * - '2007'
 */

export const FORBIDDEN_CATEGORY_PATTERNS = [
  'takwim',
  'takwin',
  '2027',
  '2007',
] as const;

export const isForbiddenCategory = (cat: string | undefined | null): boolean => {
  if (!cat) return false;
  const normalized = cat.trim().toLowerCase();
  return FORBIDDEN_CATEGORY_PATTERNS.some((pattern) => normalized.includes(pattern));
};

export interface CategoryValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateCategoryName = (name: string): CategoryValidationResult => {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: 'Sila masukkan nama kategori.',
    };
  }

  if (isForbiddenCategory(trimmed)) {
    return {
      isValid: false,
      errorMessage:
        'Kategori mengandungi perkataan yang tidak dibenarkan ("takwim", "takwin", "2027", "2007"). Sila gunakan nama kategori yang sah.',
    };
  }

  return { isValid: true };
};
