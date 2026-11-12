import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ZoomIn,
  Sparkles,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Eye,
  Sliders,
  CheckCircle,
  HelpCircle,
  X,
} from 'lucide-react';

interface FabricZoomMagnifierProps {
  imageSrc: string;
  altText: string;
  fabricName?: string;
  isWaxOrBazin?: boolean;
}

interface Hotspot {
  id: string;
  label: string;
  description: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
}

export const FabricZoomMagnifier: React.FC<FabricZoomMagnifierProps> = ({
  imageSrc,
  altText,
  fabricName = 'Tissu Wax Africain',
  isWaxOrBazin = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom states
  const [isHovered, setIsHovered] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(2.5); // 2x, 3x, 4x
  const [goldShimmerActive, setGoldShimmerActive] = useState<boolean>(true); // Surbrillance dorures
  const [shimmerIntensity, setShimmerIntensity] = useState<number>(80);
  const [lensPos, setLensPos] = useState<{ x: number; y: number; xPercent: number; yPercent: number }>({
    x: 0,
    y: 0,
    xPercent: 50,
    yPercent: 50,
  });

  // Fullscreen modal inspection
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  // Authenticity Hotspots for Beninese & Togolese wax/bazin
  const hotspots: Hotspot[] = [
    {
      id: 'selvedge',
      label: 'Lisière & Sceau Garanti',
      description: 'Lisière texturée avec inscription certifiée et macaron doré d\'origine (Nana Benz / Vlisco).',
      xPercent: 78,
      yPercent: 72,
    },
    {
      id: 'gold_foil',
      label: 'Incrustations Dorées',
      description: 'Fines dorures métalliques thermocollées haute résistance, scintillantes sous la lumière.',
      xPercent: 48,
      yPercent: 36,
    },
    {
      id: 'weave_crack',
      label: 'Trame Coton & Craquelé',
      description: 'Fil de coton peigné serré et craquelures de cire végétale uniques au batik artisanal.',
      xPercent: 28,
      yPercent: 58,
    },
  ];

  // Mouse / Touch Move calculation
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setLensPos({ x, y, xPercent, yPercent });
  }, []);

  const handleHotspotClick = (spot: Hotspot) => {
    setActiveHotspot(spot);
    setLensPos({
      x: 0,
      y: 0,
      xPercent: spot.xPercent,
      yPercent: spot.yPercent,
    });
    setIsHovered(true);
  };

  return (
    <div className="space-y-3">
      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#121218] border border-[#262635] text-xs">
        {/* Surbrillance des Dorures Toggle */}
        <button
          type="button"
          onClick={() => setGoldShimmerActive(!goldShimmerActive)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
            goldShimmerActive
              ? 'bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black shadow-lg shadow-[#d4af37]/20'
              : 'bg-[#1b1b24] text-[#a1a1aa] hover:text-white border border-[#2e2e40]'
          }`}
          title="Activer la surbrillance spéculaire des dorures et motifs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Surbrillance Dorures {goldShimmerActive ? 'Active' : 'Off'}</span>
        </button>

        {/* Magnification Levels */}
        <div className="flex items-center gap-1 bg-[#181822] p-1 rounded-xl border border-[#2a2a3b]">
          <span className="text-[10px] text-[#71717a] font-semibold px-1.5 uppercase hidden sm:inline">
            Zoom :
          </span>
          {[2, 2.5, 3.5].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setZoomLevel(lvl)}
              className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-all ${
                zoomLevel === lvl
                  ? 'bg-[#d4af37] text-black'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              {lvl}x
            </button>
          ))}
        </div>

        {/* Fullscreen Modal trigger */}
        <button
          type="button"
          onClick={() => setIsFullScreen(true)}
          className="p-1.5 rounded-xl bg-[#1b1b24] hover:bg-[#252536] text-[#d4d4d8] border border-[#2e2e40] transition-colors"
          title="Inspection haute définition plein écran"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Image Container with Lens & Specular Highlight */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsHovered(true)}
        onTouchMove={handleMouseMove}
        className="relative rounded-3xl overflow-hidden border border-[#2e2e42] bg-[#0d0d12] aspect-[4/3] sm:aspect-square select-none cursor-crosshair group shadow-xl"
      >
        {/* Base Image */}
        <img
          src={imageSrc}
          alt={altText}
          className="w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Specular Light Reflection / Surbrillance Beam tracking cursor */}
        {goldShimmerActive && isHovered && (
          <div
            className="absolute pointer-events-none transition-opacity duration-150 rounded-full blur-2xl"
            style={{
              left: `${lensPos.xPercent}%`,
              top: `${lensPos.yPercent}%`,
              width: '160px',
              height: '160px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(229,193,88,0.45) 0%, rgba(212,175,55,0.2) 50%, transparent 80%)',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Circular Magnifier Loupe following cursor on the image */}
        {isHovered && (
          <div
            className="absolute rounded-full border-2 border-[#d4af37] shadow-2xl pointer-events-none overflow-hidden z-20"
            style={{
              left: `${lensPos.xPercent}%`,
              top: `${lensPos.yPercent}%`,
              width: '150px',
              height: '150px',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 25px rgba(212,175,55,0.5), inset 0 0 15px rgba(255,255,255,0.3)',
            }}
          >
            {/* Zoomed portion inside the circular lens */}
            <div
              className="w-full h-full relative"
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundPosition: `${lensPos.xPercent}% ${lensPos.yPercent}%`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Gold Glint inside lens */}
              {goldShimmerActive && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#d4af37]/25 to-transparent pointer-events-none" />
              )}
            </div>
            {/* Crosshair indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2.5 h-2.5 border border-[#d4af37]/70 rounded-full" />
            </div>
          </div>
        )}

        {/* Interactive Hotspot Indicators on the fabric */}
        {hotspots.map((spot) => (
          <button
            key={spot.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleHotspotClick(spot);
            }}
            className="absolute w-6 h-6 rounded-full bg-[#121218]/90 border border-[#d4af37] text-[#e5c158] text-[10px] font-bold flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
            style={{
              left: `${spot.xPercent}%`,
              top: `${spot.yPercent}%`,
              transform: 'translate(-50%, -50%)',
            }}
            title={spot.label}
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37]/30 opacity-75" />
            <Sparkles className="w-3 h-3 text-[#e5c158]" />
          </button>
        ))}

        {/* Bottom Helper Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-[#d4af37]/30 text-[10px] text-[#e5c158] font-semibold flex items-center gap-1.5 shadow-md">
            <ZoomIn className="w-3 h-3" />
            <span>Survolez pour inspecter la trame & les dorures</span>
          </div>

          <div className="px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[9px] text-[#a1a1aa] font-mono">
            {zoomLevel}x
          </div>
        </div>
      </div>

      {/* Hotspots Info Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {hotspots.map((spot) => {
          const isSelected = activeHotspot?.id === spot.id;
          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => handleHotspotClick(spot)}
              className={`p-2.5 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-[#1e1b12] border-[#d4af37] text-white shadow-md'
                  : 'bg-[#121218] border-[#222230] text-[#a1a1aa] hover:border-[#38384d]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-[#e5c158]' : 'text-[#71717a]'}`} />
                <span className="text-xs font-bold text-white">{spot.label}</span>
              </div>
              <p className="text-[10px] leading-relaxed line-clamp-2">{spot.description}</p>
            </button>
          );
        })}
      </div>

      {/* Fullscreen Inspection Modal */}
      <AnimatePresence>
        {isFullScreen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#101017] border border-[#d4af37]/40 rounded-3xl max-w-4xl w-full p-6 shadow-2xl flex flex-col max-h-[95vh] space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#242436]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#e5c158]" />
                  <h3 className="font-luxury text-lg font-bold text-white">
                    Inspection Macro & Authenticité des Motifs — {fabricName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFullScreen(false)}
                  className="p-2 rounded-xl text-[#a1a1aa] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fullscreen Canvas View with Pan & Zoom */}
              <div
                className="relative flex-1 w-full min-h-[380px] sm:min-h-[460px] rounded-2xl overflow-hidden border border-[#2a2a3e] bg-black select-none cursor-crosshair"
                onMouseMove={handleMouseMove}
              >
                <div
                  className="w-full h-full relative"
                  style={{
                    backgroundImage: `url(${imageSrc})`,
                    backgroundPosition: `${lensPos.xPercent}% ${lensPos.yPercent}%`,
                    backgroundSize: `${zoomLevel * 140}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {goldShimmerActive && (
                    <div
                      className="absolute pointer-events-none rounded-full blur-3xl"
                      style={{
                        left: `${lensPos.xPercent}%`,
                        top: `${lensPos.yPercent}%`,
                        width: '280px',
                        height: '280px',
                        transform: 'translate(-50%, -50%)',
                        background: 'radial-gradient(circle, rgba(229,193,88,0.5) 0%, rgba(212,175,55,0.2) 50%, transparent 80%)',
                        mixBlendMode: 'screen',
                      }}
                    />
                  )}
                </div>

                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-[#d4af37]/40 text-xs text-[#e5c158] font-bold">
                  Grossissement Ultra-HD {zoomLevel * 1.4}x
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-[#a1a1aa]">
                  Bougez le curseur pour explorer la trame peignée et les dorures métalliques.
                </span>
                <button
                  type="button"
                  onClick={() => setIsFullScreen(false)}
                  className="px-5 py-2 rounded-xl bg-[#d4af37] text-black font-extrabold uppercase tracking-wider text-xs"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
