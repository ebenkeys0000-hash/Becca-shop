import React, { useState, useEffect, useRef } from 'react';
import { ImageOff } from 'lucide-react';
import { OFFICIAL_LOGO_URL, resolveImageUrl } from '../assets/images';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
  compactFallback?: boolean;
  fallbackClassName?: string;
}

/**
 * Production-resilient image component with:
 * - Vite/Vercel asset path normalization
 * - Asynchronous decoding & configurable priority loading
 * - Subtle loading shimmer until paint
 * - Branded BECCA SHOP fallback when an asset is missing or fails to load
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc,
  priority = false,
  compactFallback = false,
  fallbackClassName,
  className = '',
  loading,
  decoding = 'async',
  referrerPolicy = 'no-referrer',
  onLoad,
  onError,
  ...rest
}) => {
  const resolvedPrimary = resolveImageUrl(src);
  const resolvedFallback = fallbackSrc ? resolveImageUrl(fallbackSrc) : '';

  const [currentSrc, setCurrentSrc] = useState<string>(resolvedPrimary || resolvedFallback);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(!resolvedPrimary && !resolvedFallback);
  const triedFallbackRef = useRef<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const nextPrimary = resolveImageUrl(src);
    const nextFallback = fallbackSrc ? resolveImageUrl(fallbackSrc) : '';
    const initial = nextPrimary || nextFallback;
    triedFallbackRef.current = !nextPrimary && Boolean(nextFallback);
    setCurrentSrc(initial);
    setHasError(!initial);
    setIsLoaded(false);
  }, [src, fallbackSrc]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [currentSrc]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!triedFallbackRef.current && resolvedFallback && currentSrc !== resolvedFallback) {
      triedFallbackRef.current = true;
      setCurrentSrc(resolvedFallback);
      setIsLoaded(false);
      return;
    }
    setHasError(true);
    setIsLoaded(true);
    onError?.(e);
  };

  if (hasError || !currentSrc) {
    const isLogoContext =
      alt.toLowerCase().includes('logo') ||
      alt.toLowerCase().includes('emblème') ||
      currentSrc === OFFICIAL_LOGO_URL;

    return (
      <div
        role="img"
        aria-label={alt || 'BECCA SHOP'}
        className={
          fallbackClassName ||
          `${className} bg-gradient-to-br from-[#16161f] via-[#101016] to-[#0a0a0d] flex flex-col items-center justify-center text-center select-none border border-[#d4af37]/20`
        }
      >
        {isLogoContext ? (
          <span className="font-luxury font-bold text-[#e5c158] text-xs tracking-widest">
            BS
          </span>
        ) : compactFallback ? (
          <ImageOff className="w-4 h-4 text-[#d4af37]/60" />
        ) : (
          <div className="p-4 flex flex-col items-center justify-center gap-2 max-w-[200px]">
            <div className="w-10 h-10 rounded-full bg-[#1e1b12] border border-[#d4af37]/30 flex items-center justify-center text-[#e5c158]">
              <ImageOff className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#e5c158] font-semibold">
              BECCA SHOP
            </span>
            {alt && (
              <span className="text-[11px] text-[#71717a] line-clamp-2 leading-snug">
                {alt}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      loading={priority ? 'eager' : loading || 'lazy'}
      decoding={decoding}
      fetchPriority={priority ? 'high' : undefined}
      referrerPolicy={referrerPolicy}
      onLoad={handleLoad}
      onError={handleError}
      className={`${className} ${
        !isLoaded ? 'bg-[#16161f] animate-pulse' : ''
      }`}
      {...rest}
    />
  );
};
