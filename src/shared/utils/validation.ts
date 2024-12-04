export const validateHTML = (value) => {
  const hasImage = /<img[^>]*>/i.test(value); // Check if there's an <img> tag
  const strippedContent = value
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim(); // Remove whitespace
  return strippedContent.length > 0 || hasImage; // Pass if there's meaningful text or an <img> tag
}