export const generateSlug = (title = "") =>
  title
    .trim()
    .replace(/[^a-zA-Z0-9\-\s]/gi, "")
    .replace(/\s/gi, "-")
    .toLowerCase();
