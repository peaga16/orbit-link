const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Envie uma imagem JPG, PNG, WEBP ou GIF.');
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('A imagem deve ter no máximo 8 MB.');
  }
}

export async function uploadImageToCloudinary(file: File, folder = 'geral') {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no .env.');
  }

  validateImageFile(file);

  const safeFolder = folder.toLowerCase().replace(/[^a-z0-9/_-]/g, '').slice(0, 80) || 'geral';
  const body = new FormData();
  body.append('file', file);
  body.append('folder', `orbit/${safeFolder}`);
  body.append('use_filename', 'true');
  body.append('unique_filename', 'true');
  body.append('overwrite', 'false');

  const authorization = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    headers: { Authorization: `Basic ${authorization}` },
    body,
  });
  const result = await response.json();

  if (!response.ok || !result.secure_url) {
    throw new Error(result?.error?.message || 'Não foi possível enviar a imagem ao Cloudinary.');
  }

  return {
    url: result.secure_url as string,
    publicId: result.public_id as string,
    width: Number(result.width || 0),
    height: Number(result.height || 0),
  };
}
