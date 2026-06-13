import { createHash } from "crypto";

import { slugify } from "@/lib/slug";

export const MAX_PRODUCT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

type ProductImageExtension = "jpg" | "jpeg" | "png" | "webp";
type ProductImageMimeType = "image/jpeg" | "image/png" | "image/webp";

type CloudinaryConfig = {
  apiKey: string;
  apiSecret: string;
  cloudName: string;
  folder: string | null;
};

type DetectedImageType = {
  extension: Exclude<ProductImageExtension, "jpeg">;
  mimeType: ProductImageMimeType;
};

type UploadProductImageInput = {
  file: File;
  productName: string;
  productSlug: string;
};

type UploadProductImageResult = {
  url: string;
};

const allowedExtensions = ["jpg", "jpeg", "png", "webp"] as const;

export class ProductImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductImageUploadError";
  }
}

export function getProductImageFile(formData: FormData): File | null {
  const value = formData.get("imageFile");

  if (typeof File === "undefined" || !(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

export async function uploadProductImage({
  file,
  productName,
  productSlug,
}: UploadProductImageInput): Promise<UploadProductImageResult> {
  const config = getCloudinaryConfig();

  if (!config) {
    throw new ProductImageUploadError(
      "Upload de arquivo não configurado. Configure as variáveis CLOUDINARY_* ou use a URL manual.",
    );
  }

  const { buffer, imageType } = await validateProductImageFile(file);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const publicId = createPublicId(productName, productSlug);
  const signedParams: Record<string, string> = {
    public_id: publicId,
    timestamp,
  };

  if (config.folder) {
    signedParams.folder = config.folder;
  }

  const uploadFormData = new FormData();
  const uploadBlob = new Blob([new Uint8Array(buffer)], {
    type: imageType.mimeType,
  });

  uploadFormData.append("file", uploadBlob, `${publicId}.${imageType.extension}`);
  uploadFormData.append("api_key", config.apiKey);
  uploadFormData.append("signature", signCloudinaryParams(signedParams, config.apiSecret));

  for (const [key, value] of Object.entries(signedParams)) {
    uploadFormData.append(key, value);
  }

  let response: Response;

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`,
      {
        body: uploadFormData,
        method: "POST",
      },
    );
  } catch {
    throw new ProductImageUploadError(
      "Não foi possível conectar ao Cloudinary. Tente novamente ou use a URL manual.",
    );
  }

  const responseBody = await readJsonResponse(response);

  if (!response.ok) {
    throw new ProductImageUploadError(
      "Não foi possível enviar a imagem para o Cloudinary. Verifique as configurações ou use a URL manual.",
    );
  }

  if (!isCloudinaryUploadResponse(responseBody)) {
    throw new ProductImageUploadError(
      "O Cloudinary não retornou uma URL válida. Tente novamente ou use a URL manual.",
    );
  }

  return {
    url: responseBody.secure_url,
  };
}

async function validateProductImageFile(file: File): Promise<{
  buffer: Buffer;
  imageType: DetectedImageType;
}> {
  if (file.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
    throw new ProductImageUploadError("A imagem deve ter no máximo 5 MB.");
  }

  const extension = getAllowedExtension(file.name);

  if (!extension) {
    throw new ProductImageUploadError("Envie uma imagem nos formatos JPG, PNG ou WebP.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (buffer.byteLength === 0) {
    throw new ProductImageUploadError("Escolha um arquivo de imagem para enviar.");
  }

  if (buffer.byteLength > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
    throw new ProductImageUploadError("A imagem deve ter no máximo 5 MB.");
  }

  if (isSvgFile(file, buffer)) {
    throw new ProductImageUploadError("SVG não é permitido. Envie uma imagem JPG, PNG ou WebP.");
  }

  const imageType = detectImageType(buffer);

  if (!imageType) {
    throw new ProductImageUploadError(
      "O arquivo não parece ser uma imagem JPG, PNG ou WebP válida.",
    );
  }

  if (!isExtensionCompatible(extension, imageType.extension)) {
    throw new ProductImageUploadError(
      "A extensão do arquivo não corresponde ao conteúdo da imagem.",
    );
  }

  return {
    buffer,
    imageType,
  };
}

function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return {
    apiKey,
    apiSecret,
    cloudName,
    folder: sanitizeCloudinaryFolder(process.env.CLOUDINARY_FOLDER),
  };
}

function sanitizeCloudinaryFolder(value: string | undefined): string | null {
  const sanitized = value
    ?.split("/")
    .map((segment) => slugify(segment))
    .filter(Boolean)
    .join("/")
    .trim();

  return sanitized || null;
}

function createPublicId(productName: string, productSlug: string): string {
  const baseName = slugify(productName) || productSlug || "produto";
  return `${baseName}-${Date.now()}`;
}

function signCloudinaryParams(params: Record<string, string>, apiSecret: string): string {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

function getAllowedExtension(fileName: string): ProductImageExtension | null {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension || !isAllowedExtension(extension)) {
    return null;
  }

  return extension;
}

function isAllowedExtension(extension: string): extension is ProductImageExtension {
  return allowedExtensions.includes(extension as ProductImageExtension);
}

function isExtensionCompatible(
  extension: ProductImageExtension,
  detectedExtension: DetectedImageType["extension"],
): boolean {
  if (detectedExtension === "jpg") {
    return extension === "jpg" || extension === "jpeg";
  }

  return extension === detectedExtension;
}

function isSvgFile(file: File, buffer: Buffer): boolean {
  if (file.type.toLowerCase() === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
    return true;
  }

  const head = buffer.subarray(0, 512).toString("utf8").trimStart().toLowerCase();

  return head.startsWith("<svg") || (head.startsWith("<?xml") && head.includes("<svg"));
}

function detectImageType(buffer: Buffer): DetectedImageType | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return {
      extension: "jpg",
      mimeType: "image/jpeg",
    };
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return {
      extension: "png",
      mimeType: "image/png",
    };
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return {
      extension: "webp",
      mimeType: "image/webp",
    };
  }

  return null;
}

async function readJsonResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function isCloudinaryUploadResponse(value: unknown): value is { secure_url: string } {
  if (!isRecord(value) || typeof value.secure_url !== "string") {
    return false;
  }

  try {
    const url = new URL(value.secure_url);
    return url.protocol === "https:" && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
