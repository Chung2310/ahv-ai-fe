import axios from 'axios';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!uploadPreset || !cloudName) {
    throw new Error('Thiếu cấu hình Cloudinary trong .env');
  }

  formData.append('upload_preset', uploadPreset);
  
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  try {
    const response = await axios.post(url, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error('Lỗi khi upload lên Cloudinary:', error);
    throw new Error('Không thể upload tệp tin, vui lòng thử lại.');
  }
};
