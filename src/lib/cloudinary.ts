// lib/cloudinary.ts
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Gambling-App'); // Replace with your actual upload preset
    formData.append('cloud_name', 'djrdw0sqz'); // Replace with your actual Cloudinary cloud name
  
    const response = await fetch('https://api.cloudinary.com/v1_1/djrdw0sqz/image/upload', {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Image upload failed');
    }
  
    const data = await response.json();
    return data.secure_url as string;
  };
  