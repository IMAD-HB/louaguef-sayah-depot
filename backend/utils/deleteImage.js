import { v2 as cloudinary } from "cloudinary";

const deleteImage = async (public_id) => {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    console.error("❌ فشل حذف الصورة:", err.message);
  }
};

export default deleteImage;
