import { Location } from 'react-router-dom';

export const navigateUp = (location: Location, levels: number): string => {
  // Get the current path
  const currentPath = location.pathname;

  // Split the path into segments
  const pathSegments = currentPath.split('/').filter(Boolean); // Filter removes empty segments

  // Calculate the new number of segments after going up the specified levels
  const newPathSegments = pathSegments.slice(0, -levels);

  // Join the remaining segments back to create the new path
  if (newPathSegments.length > 0) {
    return `/${newPathSegments.join('/')}`; // Construct new path
  }

  // If at the root or trying to go beyond it, return root or some other fallback
  return '/'; // Fallback to root
};

