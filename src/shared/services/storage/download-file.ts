import { storage } from "@/packages";
import { getDownloadURL, ref } from "firebase/storage";

export const downloadFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    console.log('Download URL:', url);
    return url;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw new Error("Failed to download file");
  }
};