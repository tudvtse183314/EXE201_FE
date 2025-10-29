// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Firebase configuration
// ⚠️ Lưu ý: storageBucket nên là dạng '<project-id>.appspot.com'
// Nếu Firebase Console hiển thị 'petvibe-f221b.firebasestorage.app' thì dùng cái đó
// Hoặc dùng 'petvibe-f221b.appspot.com' (cách viết truyền thống)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY || "AIzaSyDFFCmpPlE5xWOn1Zj7YocFfaLCFwdUVMw",
  authDomain: "petvibe-f221b.firebaseapp.com",
  projectId: "petvibe-f221b",
  storageBucket: "petvibe-f221b.firebasestorage.app", // hoặc "petvibe-f221b.appspot.com"
  messagingSenderId: "201503691895",
  appId: "1:201503691895:web:7043287e0772e24003e272",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

/**
 * Upload image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - Folder path in storage (default: "products")
 * @returns {Promise<string>} Download URL of the uploaded image
 */
export async function uploadImage(file, folder = "products") {
  try {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const fileRef = ref(storage, safeName);
    
    console.log("🔥 Firebase: Uploading image to", safeName);
    await uploadBytes(fileRef, file);
    
    const downloadURL = await getDownloadURL(fileRef);
    console.log("🔥 Firebase: Upload successful, URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("🔥 Firebase: Upload error:", error);
    throw new Error(`Upload thất bại: ${error.message}`);
  }
}

/**
 * Delete image from Firebase Storage by URL
 * @param {string} downloadUrl - Full download URL of the image to delete
 */
export async function deleteImageByUrl(downloadUrl) {
  try {
    if (!downloadUrl || !downloadUrl.includes("firebasestorage.googleapis.com")) {
      console.warn("🔥 Firebase: Invalid URL for deletion:", downloadUrl);
      return; // Bỏ qua nếu không phải Firebase URL
    }

    // Extract path from URL
    const urlObj = new URL(downloadUrl);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)\?/);
    if (!pathMatch) {
      console.warn("🔥 Firebase: Cannot extract path from URL");
      return;
    }

    const decodedPath = decodeURIComponent(pathMatch[1]);
    const fileRef = ref(storage, decodedPath);
    await deleteObject(fileRef);
    console.log("🔥 Firebase: Image deleted successfully:", decodedPath);
  } catch (error) {
    // Bỏ qua lỗi nếu file không tồn tại hoặc URL không hợp lệ
    console.warn("🔥 Firebase: Delete skipped or failed:", error.message);
  }
}

