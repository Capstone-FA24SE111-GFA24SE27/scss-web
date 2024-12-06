export const validateHTML = (value) => {
  const hasImage = /<img[^>]*>/i.test(value); // Check if there's an <img> tag
  const strippedContent = value
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim(); // Remove whitespace
  return strippedContent.length > 0 || hasImage; // Pass if there's meaningful text or an <img> tag
}


export function checkLink(url: string): boolean {
  const pattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;  // Regex pattern for validating URL
  return pattern.test(url);
}

export async function checkImageUrl(url: string): Promise<boolean> {
  if (url.trim() === '') return false;

  try {
    // Make a HEAD request to check the headers
    const res = await fetch(url, { method: 'HEAD', mode: 'cors' });

    // Ensure the request is successful
    if (!res.ok) {
      console.error("Failed to fetch image URL, status: ", res.status);
      return false;
    }

    // Check the 'Content-Type' header to see if it's an image
    const contentType = res.headers.get('Content-Type');
    return contentType?.startsWith('image/') ?? false;
  } catch (err) {
    console.error("Error while checking the image URL:", err);
    return false;
  }
}


export function checkFirebaseImageUrl(url: string): boolean {
  const prefix = 'https://firebasestorage.googleapis.com/v0/b/scss-e9511.firebasestorage.app';
  return url.startsWith(prefix);
}