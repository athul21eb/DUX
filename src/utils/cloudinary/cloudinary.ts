

'use server'
import 'server-only'
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default  async function uploadFile(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset");

    // Determine resource type: "image" for images, "raw" for documents
    const isImage = file.type.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Upload failed: ${errorData.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    return data.secure_url; // Returns the public URL
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
}
