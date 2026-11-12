import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK on server-side with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Route: Curateur de Style IA BECCA SHOP
app.post('/api/curateur-style', async (req: Request, res: Response) => {
  try {
    const { fabricName, silhouette, location, occasion, clientPreferences } = req.body;

    const prompt = `Tu es le Premier Styliste & Curateur de Haute Couture Africaine de la prestigieuse maison BECCA SHOP, située à Comé au Bénin.
Une cliente d'exception souhaite créer une tenue haute couture personnalisée à partir d'un pagne africain d'excellence.

Détails de la demande :
- Pagne sélectionné : "${fabricName || 'Super Wax Royal Or & Indigo'}"
- Silhouette / Coupe désirée : "${silhouette || 'Robe Sirène Royale avec découpes dorées'}"
- Lieu / Décor culturel inspirant : "${location || 'Boulevard de la Marina & Palais des Congrès (Cotonou, Bénin)'}"
- Occasion : "${occasion || 'Mariage Coutumier / Réception de Gala'}"
- Préférences particulières de la cliente : "${clientPreferences || 'Élégance intemporelle, mise en valeur des dorures métalliques'}"

Rédige une fiche de curation stylistique haute couture, poétique, précise et prête pour le maître-tailleur / couturier(e).
Retourne ta réponse STRICTEMENT au format JSON avec les clés suivantes :
{
  "title": "Nom haute couture de la création (ex: 'Robe Sirène Marina Impériale')",
  "concept": "Présentation raffinée et poétique de l'allure (2-3 phrases)",
  "cutDetails": [
    "Détail technique 1 (ex: bustier cœur orné de liseré doré)",
    "Détail technique 2 (ex: basque péplum asymétrique)",
    "Détail technique 3 (ex: traîne en éventail respectant l'alignement des motifs)",
    "Détail technique 4 (ex: doublure en satin de soie anti-froissement)"
  ],
  "fabricYardage": "Métrage recommandé (ex: 6 Yards complets / 3 pièces)",
  "accessories": {
    "shoes": "Recommandation chaussures BECCA SHOP (ex: Escarpins Stiletto Dorés 'Aurelia' 9cm ou Mules Chic)",
    "jewelry": "Parure de bijoux (ex: Colliers filigrane en or pur ou perles traditionnelles béninoises)",
    "bag": "Pochette de soirée (ex: Minaudière en cuir métallisé ou pochette rigide dorée)"
  },
  "headwrapAdvice": "Conseil de coiffure & nouage de foulard Gélé (ex: Gélé 'Auto-Gélé' sculptural en éventail)",
  "culturalResonance": "Hommage poétique au lieu culturel choisi (Cotonou, Ouidah, Comé ou Lomé) et à l'héritage textile ouest-africain",
  "whatsappSummary": "Texte court et poli pour la commande WhatsApp"
}`;

    let parsedData = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction:
              'Tu es un expert reconnu en mode ouest-africaine, pagnes Wax Hollandais (Vlisco, Super Wax, Nana Benz), Bazin Riche Getzner et haute couture béninoise et togolaise. Rends toujours un JSON valide.',
          },
        });

        const responseText = response.text || '{}';
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleanJson);
      } catch (geminiError: any) {
        console.warn('Gemini API indisponible temporairement, utilisation de la curation experte maison:', geminiError.message);
      }
    }

    if (!parsedData) {
      // High-quality deterministic styling curation if no API key or during temporary service load
      parsedData = {
        title: `${silhouette} « ${fabricName} »`,
        concept: `Une création magistrale incarnant la quintessence de la féminité ouest-africaine, magnifiant les reflets solaires du tissu dans le cadre prestigieux de ${location}.`,
        cutDetails: [
          'Bustier sculpté épousant harmonieusement la silhouette avec armature invisible',
          'Basque asymétrique soulignée d\'un passepoil doré métallisé',
          'Alignement symétrique des motifs emblématiques du pagne sur le buste et la traîne',
          'Finitions lisière visible sur l\'ourlet certifiant l\'authenticité de la pièce'
        ],
        fabricYardage: '6 Yards complets (1 pièce entière BECCA SHOP)',
        accessories: {
          shoes: 'Escarpins Stiletto Dorés Prestige "Aurelia" (Talon 9 cm)',
          jewelry: 'Parure royale en or ciselé et manchettes en laiton doré poli',
          bag: 'Minaudière rigide en cuir noir verni et fermoir doré'
        },
        headwrapAdvice: 'Grand foulard Gélé noué en couronne royale asymétrique à trois plis étagés.',
        culturalResonance: `Inspirée par l'élégance légendaire des femmes d'influence et l'atmosphère lumineuse de ${location}, cette silhouette célèbre l'art de vivre et la fierté culturelle de notre terroir.`,
        whatsappSummary: `Bonjour BECCA SHOP, j'ai composé ma tenue "${silhouette}" avec le "${fabricName}" sur votre Curateur de Style. Je souhaite commander le tissu et être conseillée pour la confection.`
      };
    }

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Erreur Curateur de Style:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Impossible de générer la curation de style',
    });
  }
});

// Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur BECCA SHOP en écoute sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
