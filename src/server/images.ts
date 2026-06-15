import { createHash } from "crypto";

import { slugify } from "@/lib/slug";

export const MAX_IMAGE_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_PRODUCT_IMAGE_SIZE_BYTES = MAX_IMAGE_UPLOAD_SIZE_BYTES;

type ImageExtension = "jpg" | "jpeg" | "png" | "webp";
type ImageMimeType = "image/jpeg" | "image/png" | "image/webp";
type ImageUploadErrorClass = new (message: string) => Error;

type CloudinaryConfig = {
  apiKey: string;
  apiSecret: string;
  cloudName: string;
  folder: string | null;
};

type DetectedImageType = {
  extension: Exclude<ImageExtension, "jpeg">;
  mimeType: ImageMimeType;
};

type UploadCloudinaryImageInput = {
  connectionErrorMessage: string;
  errorClass: ImageUploadErrorClass;
  file: File;
  folderSegment?: string;
  invalidResponseMessage: string;
  missingConfigMessage: string;
  publicIdBase: string;
  uploadErrorMessage: string;
};

type UploadProductImageInput = {
  file: File;
  productName: string;
  productSlug: string;
};

type UploadProductImageResult = {
  url: string;
};

type UploadOwnerPhotoInput = {
  file: File;
  ownerName: string | null;
};

const allowedExtensions = ["jpg", "jpeg", "png", "webp"] as const;

export class ProductImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductImageUploadError";
  }
}

export class OwnerPhotoUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OwnerPhotoUploadError";
  }
}

export function getProductImageFile(formData: FormData): File | null {
  const value = formData.get("imageFile");

  if (typeof File === "undefined" || !(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

export function getOwnerPhotoFile(formData: FormData): File | null {
  const value = formData.get("ownerPhoto");

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
  return uploadCloudinaryImage({
    connectionErrorMessage:
      "Não foi possível conectar ao Cloudinary. Tente novamente ou use a URL manual.",
    errorClass: ProductImageUploadError,
    file,
    invalidResponseMessage:
      "O Cloudinary não retornou uma URL válida. Tente novamente ou use a URL manual.",
    missingConfigMessage:
      "Upload de arquivo não configurado. Configure as variáveis CLOUDINARY_* ou use a URL manual.",
    publicIdBase: createProductPublicIdBase(productName, productSlug),
    uploadErrorMessage:
      "Não foi possível enviar a imagem para o Cloudinary. Verifique as configurações ou use a URL manual.",
  });
}

export async function uploadOwnerPhoto({
  file,
  ownerName,
}: UploadOwnerPhotoInput): Promise<UploadProductImageResult> {
  return uploadCloudinaryImage({
    connectionErrorMessage: "Não foi possível conectar ao Cloudinary. Tente novamente.",
    errorClass: OwnerPhotoUploadError,
    file,
    folderSegment: "proprietaria",
    invalidResponseMessage: "O Cloudinary não retornou uma URL válida. Tente novamente.",
    missingConfigMessage:
      "Upload da foto não configurado. Configure as variáveis CLOUDINARY_* antes de enviar a foto.",
    publicIdBase: createOwnerPhotoPublicIdBase(ownerName),
    uploadErrorMessage:
      "Não foi possível enviar a foto para o Cloudinary. Verifique as configurações.",
  });
}

async function uploadCloudinaryImage({
  connectionErrorMessage,
  errorClass,
  file,
  folderSegment,
  invalidResponseMessage,
  missingConfigMessage,
  publicIdBase,
  uploadErrorMessage,
}: UploadCloudinaryImageInput): Promise<UploadProductImageResult> {
  const config = getCloudinaryConfig();

  if (!config) {
    throw new errorClass(missingConfigMessage);
  }

  const { buffer, imageType } = await validateImageFile(file, errorClass);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const publicId = createPublicId(publicIdBase);
  const signedParams: Record<string, string> = {
    public_id: publicId,
    timestamp,
  };

  const folder = createCloudinaryFolder(config.folder, folderSegment);

  if (folder) {
    signedParams.folder = folder;
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
    throw new errorClass(connectionErrorMessage);
  }

  const responseBody = await readJsonResponse(response);

  if (!response.ok) {
    throw new errorClass(uploadErrorMessage);
  }

  if (!isCloudinaryUploadResponse(responseBody)) {
    throw new errorClass(invalidResponseMessage);
  }

  return {
    url: responseBody.secure_url,
  };
}

async function validateImageFile(
  file: File,
  errorClass: ImageUploadErrorClass,
): Promise<{
  buffer: Buffer;
  imageType: DetectedImageType;
}> {
  if (file.size > MAX_IMAGE_UPLOAD_SIZE_BYTES) {
    throw new errorClass("A imagem deve ter no máximo 5 MB.");
  }

  const extension = getAllowedExtension(file.name);

  if (!extension) {
    throw new errorClass("Envie uma imagem nos formatos JPG, PNG ou WebP.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (buffer.byteLength === 0) {
    throw new errorClass("Escolha um arquivo de imagem para enviar.");
  }

  if (buffer.byteLength > MAX_IMAGE_UPLOAD_SIZE_BYTES) {
    throw new errorClass("A imagem deve ter no máximo 5 MB.");
  }

  if (isSvgFile(file, buffer)) {
    throw new errorClass("SVG não é permitido. Envie uma imagem JPG, PNG ou WebP.");
  }

  const imageType = detectImageType(buffer);

  if (!imageType) {
    throw new errorClass("O arquivo não parece ser uma imagem JPG, PNG ou WebP válida.");
  }

  if (!isExtensionCompatible(extension, imageType.extension)) {
    throw new errorClass("A extensão do arquivo não corresponde ao conteúdo da imagem.");
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

function createCloudinaryFolder(baseFolder: string | null, folderSegment: string | undefined) {
  const sanitizedSegment = sanitizeCloudinaryFolder(folderSegment);

  return [baseFolder, sanitizedSegment].filter(Boolean).join("/") || null;
}

function createProductPublicIdBase(productName: string, productSlug: string): string {
  const baseName = slugify(productName) || productSlug || "produto";

  return baseName;
}

function createOwnerPhotoPublicIdBase(ownerName: string | null): string {
  const baseName = ownerName ? slugify(ownerName) : "";

  return `proprietaria-${baseName || "perfil"}`;
}

function createPublicId(publicIdBase: string): string {
  const baseName = slugify(publicIdBase) || "imagem";

  return `${baseName}-${Date.now()}`;
}

function signCloudinaryParams(params: Record<string, string>, apiSecret: string): string {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

function getAllowedExtension(fileName: string): ImageExtension | null {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension || !isAllowedExtension(extension)) {
    return null;
  }

  return extension;
}

function isAllowedExtension(extension: string): extension is ImageExtension {
  return allowedExtensions.includes(extension as ImageExtension);
}

function isExtensionCompatible(
  extension: ImageExtension,
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
