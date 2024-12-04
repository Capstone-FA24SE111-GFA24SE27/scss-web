import { storage } from "@/packages";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

const isValidImage = (file) => {
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  return validImageTypes.includes(file.type);
};

export const uploadFile = async (
  file,
  path = `images/${Date.now()}`,
  onprogress = (progress) => { }
) => {
  try {
    // File type validation
    if (!isValidImage(file)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    // File size validation (optional)
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds the maximum allowed size of 5MB.');
    }

    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Return a promise that resolves with the download URL after the upload is complete
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress)
          onprogress(progress)
        },
        (error) => {
          console.error("Error uploading file:", error);
          reject(new Error("Failed to upload file"));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File uploaded successfully, available at ', downloadURL);
            resolve(downloadURL); // Return the download URL when upload is successful
          } catch (error) {
            reject(new Error("Failed to get download URL"));
          }
        }
      );
    });

  } catch (error) {
    console.error("Error uploading file: ", error);
    throw new Error("Failed to upload file");
  }
};
