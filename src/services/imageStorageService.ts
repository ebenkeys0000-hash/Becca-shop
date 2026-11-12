/**
 * Image Storage & Processing Service
 * Provides client-side compression, validation, and persistent storage
 * for product images uploaded from mobile galleries or desktop folders.
 */

export interface ProcessedImage {
  dataUrl: string;
  name: string;
  originalSize: number;
  compressedSize: number;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB limit before compression

/**
 * Validates file type and size
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type.toLowerCase()) && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
    return {
      valid: false,
      error: `Format non supporté pour "${file.name}". Utilisez JPG, JPEG, PNG ou WebP.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Le fichier "${file.name}" est trop volumineux (max 20 Mo).`,
    };
  }

  return { valid: true };
}

/**
 * Compresses an image file client-side to ensure fast loading and permanent storage
 * Scales large camera/gallery photos down to max 1280px maintaining aspect ratio
 */
export function compressImageFile(
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.85
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio scaling
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original data URL if canvas context fails
          const originalDataUrl = event.target?.result as string;
          resolve({
            dataUrl: originalDataUrl,
            name: file.name,
            originalSize: file.size,
            compressedSize: file.size,
          });
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer webp with fallback to jpeg
        let format = 'image/webp';
        let compressedDataUrl = canvas.toDataURL(format, quality);

        // If webp isn't supported or returned png, fallback to jpeg
        if (!compressedDataUrl.startsWith('data:image/webp')) {
          format = 'image/jpeg';
          compressedDataUrl = canvas.toDataURL(format, quality);
        }

        // Approximate size
        const compressedSize = Math.round((compressedDataUrl.length * 3) / 4);

        resolve({
          dataUrl: compressedDataUrl,
          name: file.name,
          originalSize: file.size,
          compressedSize,
        });
      };

      img.onerror = () => {
        reject(new Error(`Impossible de charger l'image ${file.name}`));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error(`Erreur lors de la lecture du fichier ${file.name}`));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * IndexedDB database configuration for storing large product image datasets
 * ensuring images remain available even after clearing localStorage or on refresh
 */
const DB_NAME = 'BeccaShopImagesDB';
const STORE_NAME = 'product_images';
const DB_VERSION = 1;

function openImagesDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Persists an image permanently in IndexedDB
 */
export async function persistImageInDB(id: string, dataUrl: string): Promise<void> {
  try {
    const db = await openImagesDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ id, dataUrl, updatedAt: Date.now() });
  } catch (err) {
    // Non-fatal, dataUrl is still held in memory / product record
    console.warn('IndexedDB write warning:', err);
  }
}

/**
 * Retrieves a persisted image by ID
 */
export async function getImageFromDB(id: string): Promise<string | null> {
  try {
    const db = await openImagesDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result ? req.result.dataUrl : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}
