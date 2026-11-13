import heroBeninFashion from './hero_benin_fashion_1794478206307.jpg';
import pagneSuperWax from './pagne_super_wax_1794478205336.jpg';
import pagneBazinRiche from './pagne_bazin_riche_1794478206645.jpg';
import pagneSoieWax from './pagne_soie_wax_1794478209223.jpg';
import pagneNanaBenz from './pagne_nana_benz_1794478209388.jpg';
import shoesHeelsGold from './shoes_heels_gold_1794478209254.jpg';
import shoesMulesChic from './shoes_mules_chic_1794478227221.jpg';
import stagingCotonouMarina from './staging_cotonou_marina_1794478709951.jpg';
import stagingLomePalais from './staging_lome_palais_1794478710819.jpg';
import stagingOuidahOcean from './staging_ouidah_ocean_1794478711873.jpg';
import stagingComeMono from './staging_come_mono_1794478712868.jpg';

export const OFFICIAL_LOGO_URL = '/assets/aistudio/Becca_Shop_Luxury_Fashion_Emblem_4d9ef32f.png';

export const ASSET_IMAGES = {
  heroBeninFashion,
  pagneSuperWax,
  pagneBazinRiche,
  pagneSoieWax,
  pagneNanaBenz,
  shoesHeelsGold,
  shoesMulesChic,
  stagingCotonouMarina,
  stagingLomePalais,
  stagingOuidahOcean,
  stagingComeMono,
} as const;

const LEGACY_AND_SOURCE_PATH_MAP: Record<string, string> = {
  // Current filenames in src/assets/images
  'hero_benin_fashion_1794478206307.jpg': heroBeninFashion,
  'pagne_super_wax_1794478205336.jpg': pagneSuperWax,
  'pagne_bazin_riche_1794478206645.jpg': pagneBazinRiche,
  'pagne_soie_wax_1794478209223.jpg': pagneSoieWax,
  'pagne_nana_benz_1794478209388.jpg': pagneNanaBenz,
  'shoes_heels_gold_1794478209254.jpg': shoesHeelsGold,
  'shoes_mules_chic_1794478227221.jpg': shoesMulesChic,
  'staging_cotonou_marina_1794478709951.jpg': stagingCotonouMarina,
  'staging_lome_palais_1794478710819.jpg': stagingLomePalais,
  'staging_ouidah_ocean_1794478711873.jpg': stagingOuidahOcean,
  'staging_come_mono_1794478712868.jpg': stagingComeMono,

  // Legacy filenames that may still exist in cached localStorage
  'hero_african_fashion_1793347972827.jpg': heroBeninFashion,
  'pagne_vlisco_gold_1793347972896.jpg': pagneSuperWax,
  'pagne_soie_royal_1793347974893.jpg': pagneSoieWax,
  'shoes_heels_gold_1793347973746.jpg': shoesHeelsGold,
  'shoes_sandals_chic_1793347974722.jpg': shoesMulesChic,

  // Logo alias
  'Becca_Shop_Luxury_Fashion_Emblem_4d9ef32f.png': OFFICIAL_LOGO_URL,
};

/**
 * Resolves any image reference (ES-imported Vite asset, public/ absolute path,
 * legacy /src/assets/images/ path stored in localStorage, relative path, data URL, or HTTPS URL)
 * into a production-safe URL that works reliably on Vercel.
 */
export function resolveImageUrl(url?: string | null, fallback: string = ''): string {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return fallback;
  }

  // Already a data URL or blob URL (e.g. uploaded from device gallery)
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Check if the path ends with a known bundled asset filename (handles legacy /src/assets/images/... in localStorage)
  const cleanWithoutQuery = trimmed.split('?')[0].split('#')[0];
  const fileName = cleanWithoutQuery.split('/').pop() || '';
  if (fileName && LEGACY_AND_SOURCE_PATH_MAP[fileName]) {
    return LEGACY_AND_SOURCE_PATH_MAP[fileName];
  }

  // Normalize public folder references to root-absolute paths so nested routes (/shop/pagnes, /product/:id) work
  if (trimmed.startsWith('public/')) {
    return `/${trimmed.slice('public/'.length)}`;
  }
  if (trimmed.startsWith('./assets/')) {
    return `/${trimmed.slice(2)}`;
  }
  if (trimmed.startsWith('assets/')) {
    return `/${trimmed}`;
  }

  // Valid root-absolute path or external HTTPS/HTTP URL
  return trimmed;
}
