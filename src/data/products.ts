import { Product } from '../types';
import { ASSET_IMAGES, OFFICIAL_LOGO_URL } from '../assets/images';

export const STORE_INFO = {
  name: "BECCA SHOP",
  tagline: "Qualité • Élégance • Votre style, notre priorité.",
  logoUrl: OFFICIAL_LOGO_URL,
  city: "Comé",
  country: "Bénin",
  fullAddress: "Quartier Central, Route Principale, Comé, Bénin",
  phone1: "+22995441602",
  phone1Display: "+229 95 44 16 02",
  phone2: "+22941465506",
  phone2Display: "+229 41 46 55 06",
  email: "contact@beccashop.bj",
  hours: "Lun - Sam : 08h30 - 20h00 | Dimanche sur RDV",
  whatsappUrl1: "https://wa.me/22995441602",
  whatsappUrl2: "https://wa.me/22941465506",
};

export const PRODUCTS: Product[] = [
  {
    id: "bs-pag-001",
    name: "Super Wax Royal Or & Émeraude (6 Yards)",
    description: "Véritable wax de qualité supérieure orné de dorures fines métalliques. Motifs géométriques royaux traditionnels et modernes, tissage 100% coton peigné doux et soyeux. Idéal pour les grandes réceptions, mariages et tenues de prestige.",
    price: 38500,
    originalPrice: 45000,
    images: [
      ASSET_IMAGES.pagneSuperWax,
      ASSET_IMAGES.pagneNanaBenz
    ],
    category: "pagnes",
    subCategory: "Wax Hollandais Haut de Gamme",
    reference: "BS-PAG-001",
    stock: 14,
    status: "available",
    isBestSeller: true,
    isPromo: true,
    sizes: ["6 Yards (Morceau complet)", "3 Yards (Demi-pièce)"],
    colors: [
      { name: "Vert Émeraude & Doré", hex: "#065f46" },
      { name: "Bleu Nuit & Or", hex: "#1e3a8a" },
    ],
    material: "100% Coton peigné fin avec incrustations dorées",
    origin: "Authentique Wax Hollando-Africain certifié",
    details: [
      "Largeur standard : 120 cm (48 pouces)",
      "Couleurs grand teint résistantes aux lavages répétés",
      "Toucher soyeux et tombé impeccable pour robes de cocktail ou tailleurs",
      "Livré dans sa pochette protectrice BECCA SHOP"
    ]
  },
  {
    id: "bs-cha-001",
    name: "Escarpins Stiletto Dorés Prestige 'Aurelia'",
    description: "Magnifiques escarpins à lanières croisées en cuir verni doré métallique. Talon aiguille de 9 cm raffiné et stable avec semelle intérieure rembourrée grand confort pour briller toute la soirée sans douleur.",
    price: 29500,
    originalPrice: 35000,
    images: [
      ASSET_IMAGES.shoesHeelsGold,
      ASSET_IMAGES.shoesMulesChic
    ],
    category: "chaussures",
    subCategory: "Escarpins de Soirée",
    reference: "BS-CHA-001",
    stock: 9,
    status: "available",
    isBestSeller: true,
    isPromo: true,
    sizes: ["37", "38", "39", "40", "41"],
    colors: [
      { name: "Or Métallique Brillant", hex: "#d4af37" },
      { name: "Argent Miroir", hex: "#cbd5e1" }
    ],
    material: "Cuir verni doré de qualité supérieure avec semelle antidérapante",
    origin: "Design italien, finitions artisanales haute précision",
    details: [
      "Hauteur du talon : 9 cm avec renfort amortissant",
      "Lanières réglables avec boucle dorée hypoallergénique",
      "Convient parfaitement aux cérémonies, dots et réceptions",
      "Nettoyage facile avec chiffon doux"
    ]
  },
  {
    id: "bs-pag-002",
    name: "Pagne Soie Wax Saphir & Or Impérial",
    description: "Une pièce d'exception alliant la noblesse de la soie et la splendeur des motifs wax africains. Tissu ultra fluide, éclat scintillant sous la lumière du jour ou les projecteurs de soirée.",
    price: 48000,
    images: [
      ASSET_IMAGES.pagneSoieWax,
      ASSET_IMAGES.pagneSuperWax
    ],
    category: "pagnes",
    subCategory: "Soie Wax & Crêpe de Chine",
    reference: "BS-PAG-002",
    stock: 7,
    status: "available",
    isNew: true,
    sizes: ["6 Yards (Morceau complet)"],
    colors: [
      { name: "Bleu Saphir & Or", hex: "#1d4ed8" },
      { name: "Bordeaux Majestueux", hex: "#831843" }
    ],
    material: "Mélange Soie et Coton égyptien haute densité",
    origin: "Édition Limitée BECCA Privilège",
    details: [
      "Drapé d'une extrême élégance pour caftans, boubous et robes sirènes",
      "Reflets changeants et dorures raffinées non abrasives",
      "Pièce rare très demandée pour les grandes occasions béninoises",
      "Lavage à la main recommandé ou pressing doux"
    ]
  },
  {
    id: "bs-cha-002",
    name: "Mules Chic Cuir Noir & Boucle Dorée 'Comé Chic'",
    description: "Mules plates élégantes en cuir noir pleine fleur avec boucle cavalière dorée polie. L'alliance parfaite entre le chic décontracté et le raffinement urbain quotidien pour la femme active et élégante.",
    price: 22000,
    originalPrice: 26000,
    images: [
      ASSET_IMAGES.shoesMulesChic,
      ASSET_IMAGES.shoesHeelsGold
    ],
    category: "chaussures",
    subCategory: "Mules & Sandales Plates",
    reference: "BS-CHA-002",
    stock: 12,
    status: "available",
    isBestSeller: true,
    isNew: true,
    sizes: ["36", "37", "38", "39", "40", "41", "42"],
    colors: [
      { name: "Noir Ébène", hex: "#18181b" },
      { name: "Camel Havane", hex: "#92400e" }
    ],
    material: "Cuir véritable pleine fleur avec doublure respirante",
    origin: "Confection artisanale soignée",
    details: [
      "Semelle plate avec micro-talonnette de 1.5 cm",
      "Semelle intérieure en mousse mémoire de forme",
      "Facile à enfiler, idéale pour le bureau ou les sorties décontractées",
      "Boucle dorée inoxydable anti-ternissement"
    ]
  },
  {
    id: "bs-pag-003",
    name: "Bazin Riche Getzner Brodé Doré 'Reine d'Afrique'",
    description: "Bazin riche 100% pur coton damassé teinté avec des reflets chatoyants et broderies ajourées en fil d'or. Un tombé rigide et majestueux qui fait la réputation des tenues de grand apparat en Afrique de l'Ouest.",
    price: 65000,
    originalPrice: 75000,
    images: [
      ASSET_IMAGES.pagneBazinRiche,
      ASSET_IMAGES.heroBeninFashion
    ],
    category: "pagnes",
    subCategory: "Bazin Riche & Dentelle",
    reference: "BS-PAG-003",
    stock: 5,
    status: "available",
    isPromo: true,
    sizes: ["5 Mètres (Complet boubou)", "4 Mètres"],
    colors: [
      { name: "Blanc Neige & Or", hex: "#f8fafc" },
      { name: "Vert Impérial", hex: "#064e3b" },
      { name: "Jaune Ocre Solaire", hex: "#b45309" }
    ],
    material: "100% Coton Damassé supérieur avec apprêt brillant d'origine",
    origin: "Getzner Autriche façonné et brodé",
    details: [
      "Bruit de froissement caractéristique du véritable bazin riche",
      "Brillance durable même après repassage traditionnel",
      "Broderies dorées délicates sur la lisière et les motifs centraux",
      "Le choix numéro 1 pour la Tabaski, Pâques et mariages coutumiers"
    ]
  },
  {
    id: "bs-cha-003",
    name: "Sandales à Talons Carrés 'Élégance Bénin'",
    description: "Sandales ouvertes à deux brides fines avec talon bloc carré de 6 cm. Stabilité absolue pour marcher avec assurance sur tous types de sols. Finitions dorées et semelle moelleuse.",
    price: 24500,
    images: [
      ASSET_IMAGES.shoesMulesChic,
      ASSET_IMAGES.shoesHeelsGold
    ],
    category: "chaussures",
    subCategory: "Talons Carrés Confort",
    reference: "BS-CHA-003",
    stock: 8,
    status: "available",
    isNew: true,
    sizes: ["37", "38", "39", "40", "41"],
    colors: [
      { name: "Or Rosé Champagne", hex: "#e2b89c" },
      { name: "Noir Mat & Or", hex: "#27272a" }
    ],
    material: "Similicuir haute résistance & patins antidérapants",
    origin: "Collection Printemps-Été BECCA",
    details: [
      "Talon carré de 6 cm : équilibre parfait entre féminité et confort",
      "Attache cheville réglable avec élastique d'aisance",
      "S'accorde à merveille avec un ensemble pagne moderne ou une robe fluide",
      "Disponible immédiatement à la boutique de Comé"
    ]
  },
  {
    id: "bs-pag-004",
    name: "Wax Hollandais Motif Fleur de Mariage 'Comé Prestige'",
    description: "Le grand classique indémodable de la mode féminine africaine réinventé avec des teintes chaudes et des contours dorés subtils. Ce pagne symbolise l'abondance, la beauté et la bénédiction maritale.",
    price: 32000,
    images: [
      ASSET_IMAGES.pagneNanaBenz,
      ASSET_IMAGES.pagneSoieWax
    ],
    category: "pagnes",
    subCategory: "Wax Hollandais Haut de Gamme",
    reference: "BS-PAG-004",
    stock: 3,
    status: "low_stock",
    isBestSeller: true,
    sizes: ["6 Yards (Morceau complet)"],
    colors: [
      { name: "Multicolore & Or", hex: "#d97706" }
    ],
    material: "100% Coton Wax Hollandais double face",
    origin: "Wax de collection traditionnelle",
    details: [
      "Double impression recto-verso avec une netteté parfaite des couleurs",
      "Ne rétrécit pas au premier lavage",
      "Très recherché pour les dots et cadeaux de fiançailles",
      "Quantité très limitée en boutique"
    ]
  },
  {
    id: "bs-cha-004",
    name: "Escarpins Bout Pointu Vernis Noir & Liseré Doré",
    description: "Le soulier incontournable de la garde-robe d'affaires et de cérémonie. Silhouette fuselée, bout pointu moderne et liseré doré sur la cambrure qui sublime la cheville féminine.",
    price: 27000,
    images: [
      ASSET_IMAGES.shoesHeelsGold,
      ASSET_IMAGES.shoesMulesChic
    ],
    category: "chaussures",
    subCategory: "Escarpins de Soirée",
    reference: "BS-CHA-004",
    stock: 6,
    status: "available",
    sizes: ["38", "39", "40", "41"],
    colors: [
      { name: "Noir Profond Vernis", hex: "#09090b" }
    ],
    material: "Cuir verni brillant avec semelle rouge anti-usure",
    origin: "Import Prestige BECCA",
    details: [
      "Hauteur de talon : 8.5 cm",
      "Embout métallique doré anti-choc",
      "Élégance absolue portée avec un tailleur en wax ou une robe de soirée",
      "Boîte rigide de transport offerte"
    ]
  }
];

export const TESTIMONIALS = [
  {
    id: "t-1",
    name: "Mme Clarisse Agbodjan",
    role: "Cliente fidèle",
    city: "Comé, Bénin",
    comment: "BECCA SHOP est la meilleure boutique de Comé pour les pagnes d'exception ! J'ai commandé le Super Wax doré pour le mariage de ma sœur, la qualité du tissu et la rapidité du service WhatsApp m'ont totalement conquise.",
    rating: 5,
    productPurchased: "Super Wax Royal Or (6 Yards)"
  },
  {
    id: "t-2",
    name: "Dr. Nadine Sossa",
    role: "Pharmacienne",
    city: "Cotonou, Bénin",
    comment: "J'habite Cotonou et je me fais livrer par BECCA SHOP. Les escarpins dorés 'Aurelia' sont d'un confort rare pour des talons de 9cm. Colis reçu en moins de 24h via le bus de ligne.",
    rating: 5,
    productPurchased: "Escarpins Stiletto Dorés 'Aurelia'"
  },
  {
    id: "t-3",
    name: "Mme Félicité Houndété",
    role: "Entrepreneure",
    city: "Lokossa, Mono",
    comment: "L'accueil chaleureux à la boutique de Comé et la beauté des soies wax sont sans égales. Enfin une boutique sérieuse qui respecte les femmes avec des produits authentiques et des prix clairs !",
    rating: 5,
    productPurchased: "Pagne Soie Wax Saphir"
  }
];

export const CATEGORIES = [
  {
    id: "pagnes",
    name: "Pagnes Africains",
    subtitle: "Super Wax, Soie Wax, Bazin Riche & Dentelles",
    count: "Plus de 25 modèles",
    image: ASSET_IMAGES.pagneSuperWax
  },
  {
    id: "chaussures",
    name: "Chaussures Pour Femmes",
    subtitle: "Escarpins de soirée, Mules chic & Talons carrés",
    count: "Pointures 36 à 42",
    image: ASSET_IMAGES.shoesHeelsGold
  }
];
