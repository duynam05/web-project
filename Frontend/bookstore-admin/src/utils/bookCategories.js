export function splitBookCategories(categoryValue) {
  if (!categoryValue) {
    return [];
  }

  const values = Array.isArray(categoryValue) ? categoryValue : [categoryValue];
  const seen = new Set();

  return values
    .flatMap((value) => String(value).split(/\s*[,;]\s*/))
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => {
      const normalized = value.toLowerCase();
      if (seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    });
}

export function hasCategoryMatch(categoryValue, selectedCategory) {
  if (!selectedCategory || selectedCategory === 'all') {
    return true;
  }

  return splitBookCategories(categoryValue).some(
    (category) => category.toLowerCase() === selectedCategory.toLowerCase(),
  );
}
