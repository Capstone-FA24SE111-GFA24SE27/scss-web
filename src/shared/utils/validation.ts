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

export async function fetchImageAsFile(url: string, fileName: string) {
  try {
    // Fetch the image data
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Convert response to a Blob
    const blob = await response.blob();

    // Create a File object from the Blob
    const file = new File([blob], fileName, { type: blob.type });

    return file;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function checkImageUrl(url: string): Promise<boolean> {
  if (url.trim() === '') return false;

  try {
    // Make a HEAD request to check the headers
    const res = await fetch(url, { method: 'HEAD', mode: 'cors' });

    // // Ensure the request is successful
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

export const validateMeetingUrl = (url: string): string | boolean => {
  // Regular expression for Google Meet URL validation
  const googleMeetRegex = /^https:\/\/meet\.google\.com\/[a-zA-Z0-9-]+$/;

  // Regular expression for Zoom URL validation
  const zoomRegex = /^https:\/\/zoom\.us\/j\/\d+$/;

  // Regular expression for Microsoft Teams URL validation
  const teamsRegex = /^https:\/\/teams\.microsoft\.com\/l\/meetup-join\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+$/;

  // Check if the URL matches any of the patterns and return the corresponding platform name
  if (googleMeetRegex.test(url)) {
    return 'MEET'; // Google Meet
  }

  if (zoomRegex.test(url)) {
    return 'ZOOM'; // Zoom
  }

  if (teamsRegex.test(url)) {
    return 'TEAMS'; // Microsoft Teams
  }
  
  // Return error message if the URL does not match any pattern
  return '';
};