export function createUniqueSlug(inputString) {
  const slug = inputString
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return slug;
}
