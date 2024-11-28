import { storage } from "@/packages";
import { ref, deleteObject } from "firebase/storage"; // Import deleteObject


export const deleteFile = async (path) => {
  try {
    const fileRef = ref(storage, path); // Create a reference to the file
    await deleteObject(fileRef); // Delete the file from Firebase Storage
    console.log(`File at path ${path} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
};
