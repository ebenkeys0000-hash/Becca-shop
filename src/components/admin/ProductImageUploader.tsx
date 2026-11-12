import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Plus,
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
  Smartphone,
  FolderOpen,
} from 'lucide-react';
import { validateImageFile, compressImageFile, persistImageInDB } from '../../services/imageStorageService';

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  productId?: string;
}

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  images,
  onChange,
  productId = 'new_product',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatusText, setUploadStatusText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Trigger device gallery file picker
  const handleOpenGalleryPicker = () => {
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Trigger replacement for a specific image
  const handleOpenReplacePicker = (index: number) => {
    setErrorMessage('');
    setReplacingIndex(index);
    if (replaceInputRef.current) {
      replaceInputRef.current.value = '';
      replaceInputRef.current.click();
    }
  };

  // Process files from input
  const processFiles = async (fileList: FileList | File[], isReplace = false, replaceIdx = 0) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStatusText(`Préparation de ${files.length} fichier(s)...`);

    try {
      const processedDataUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadStatusText(`Compression et optimisation de "${file.name}"...`);

        // Validate
        const validation = validateImageFile(file);
        if (!validation.valid) {
          setErrorMessage(validation.error || 'Fichier invalide');
          setIsUploading(false);
          return;
        }

        // Compress to high-fidelity WebP/JPEG
        const progressStep = Math.round(15 + ((i + 1) / files.length) * 75);
        setUploadProgress(progressStep);

        const processed = await compressImageFile(file, 1280, 1280, 0.85);
        processedDataUrls.push(processed.dataUrl);

        // Store into IndexedDB cache for long-term permanence
        const imageKey = `prod_${productId}_${Date.now()}_${i}`;
        await persistImageInDB(imageKey, processed.dataUrl);
      }

      setUploadProgress(100);
      setUploadStatusText('Images prêtes et sécurisées !');

      if (isReplace && replacingIndex !== null) {
        // Replace the single image
        const updated = [...images];
        updated[replacingIndex] = processedDataUrls[0];
        onChange(updated);
        setReplacingIndex(null);
      } else {
        // Append new images
        onChange([...images, ...processedDataUrls]);
      }

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatusText('');
      }, 600);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Erreur lors du traitement de l'image.");
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleReplaceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && replacingIndex !== null) {
      processFiles(e.target.files, true, replacingIndex);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Reorder: Set as Primary Image (move to index 0)
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([target, ...rest]);
  };

  // Reorder: Move Left
  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  // Reorder: Move Right
  const handleMoveRight = (index: number) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  // Delete image
  const handleDeleteImage = (index: number) => {
    if (images.length === 1) {
      if (
        !confirm(
          'Attention : vous allez supprimer la seule photo de ce modèle. Voulez-vous continuer ?'
        )
      ) {
        return;
      }
    }
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Add via direct URL (optional fallback)
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onChange([...images, customUrl.trim()]);
    setCustomUrl('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleReplaceInputChange}
      />

      {/* Main Upload Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#e5c158] mb-0.5">
            Photographies du Produit ({images.length})
          </label>
          <p className="text-[11px] text-[#a1a1aa]">
            Importez directement depuis la galerie de votre smartphone, tablette ou ordinateur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Primary Button requested by user */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleOpenGalleryPicker}
            disabled={isUploading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-60"
          >
            <FolderOpen className="w-4 h-4 text-black" />
            <span>Importer depuis ma galerie</span>
          </motion.button>

          {/* Toggle URL input */}
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="p-2.5 rounded-xl bg-[#1c1c28] hover:bg-[#252536] border border-[#2e2e42] text-[#d4d4d8] text-xs transition-colors"
            title="Ajouter via une URL web"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Optional URL addition */}
      {showUrlInput && (
        <div className="p-3 bg-[#151520] border border-[#2e2e42] rounded-xl flex gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://... (Lien direct vers l'image)"
            className="flex-1 px-3 py-1.5 bg-[#1a1924] border border-[#333346] rounded-lg text-white text-xs outline-none focus:border-[#e5c158]"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 rounded-lg bg-[#e5c158] text-black font-bold text-xs uppercase"
          >
            Ajouter
          </button>
        </div>
      )}

      {/* Error notification */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="p-4 rounded-2xl bg-[#161622] border border-[#d4af37]/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-[#e5c158] animate-spin" />
              <span>{uploadStatusText}</span>
            </span>
            <span className="font-mono text-[#e5c158] font-bold">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-[#20202e] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#d4af37] to-[#f3cf65]"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </div>
        </div>
      )}

      {/* Drag & Drop Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleOpenGalleryPicker}
        className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-[#e5c158] bg-[#1e1b12]/80'
            : 'border-[#2a2a3c] hover:border-[#d4af37]/60 bg-[#121219]/60'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#1b1a26] border border-[#2d2d3e] text-[#e5c158] flex items-center justify-center mx-auto mb-2 shadow-inner">
          <Smartphone className="w-6 h-6" />
        </div>
        <p className="text-xs font-bold text-white mb-0.5">
          Glissez-déposez ou cliquez pour choisir des photos
        </p>
        <p className="text-[11px] text-[#71717a]">
          Compatible galerie smartphone (Android, iPhone), tablette et dossiers PC. Formats : JPG, PNG, WebP.
        </p>
      </div>

      {/* Current Images Management Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] text-[#a1a1aa] uppercase tracking-wider font-semibold block">
            Ordre d'affichage des photos (La 1ère est la photo de couverture) :
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((imgUrl, index) => {
              const isPrimary = index === 0;

              return (
                <div
                  key={index}
                  className={`relative group rounded-2xl overflow-hidden border-2 bg-black flex flex-col aspect-[3/4] transition-all shadow-md ${
                    isPrimary ? 'border-[#e5c158] shadow-[#e5c158]/20' : 'border-[#262638]'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Primary Badge */}
                  {isPrimary && (
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-[#d4af37] text-black font-extrabold text-[10px] tracking-wider uppercase shadow-lg flex items-center gap-1 z-10">
                      <Star className="w-3 h-3 fill-black text-black" />
                      <span>Principale</span>
                    </div>
                  )}

                  {/* Hover Overlay with Action Controls */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                    {/* Top Row: Delete & Set Primary */}
                    <div className="flex items-center justify-between">
                      {!isPrimary ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetPrimary(index);
                          }}
                          className="px-2 py-1 rounded-lg bg-[#e5c158] text-black font-bold text-[10px] flex items-center gap-1 shadow-md"
                          title="Définir comme photo principale"
                        >
                          <Star className="w-3 h-3" />
                          <span>Mettre en 1ère</span>
                        </button>
                      ) : (
                        <div />
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(index);
                        }}
                        className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                        title="Supprimer cette image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Middle Row: Replace */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenReplacePicker(index);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#222232] hover:bg-[#2c2c40] border border-[#3e3e56] text-white text-[11px] font-semibold inline-flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3 text-[#e5c158]" />
                        <span>Remplacer</span>
                      </button>
                    </div>

                    {/* Bottom Row: Move Left / Move Right */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLeft(index);
                        }}
                        className="p-1.5 rounded-lg bg-[#181824] hover:bg-[#242436] text-white disabled:opacity-30 disabled:hover:bg-[#181824] transition-colors"
                        title="Déplacer vers la gauche"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-[10px] text-[#a1a1aa] font-mono">
                        {index + 1}/{images.length}
                      </span>

                      <button
                        type="button"
                        disabled={index === images.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveRight(index);
                        }}
                        className="p-1.5 rounded-lg bg-[#181824] hover:bg-[#242436] text-white disabled:opacity-30 disabled:hover:bg-[#181824] transition-colors"
                        title="Déplacer vers la droite"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
