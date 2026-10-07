export const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const ensureUniqueSlug = async (Model, slug, excludeId = null) => {
  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const query = { slug: uniqueSlug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const exists = await Model.findOne(query);
    if (!exists) {
      break;
    }
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};
