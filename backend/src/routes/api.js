const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const upload = require('../middleware/upload');
const AdmZip = require('adm-zip');
const fs = require('fs-extra');
const path = require('path');

// Route de test
router.get('/status', (req, res) => {
 res.json({ status: 'Le serveur fonctionne correctement' });
});

// Route d'optimisation des images
router.post('/optimize', upload.array('images'), async (req, res) => {
 try {
   const results = await imageController.optimizeImages(req);
   
   // Sauvegarder la liste des images optimisées
   const outputDir = path.join(__dirname, '../../output');
   const listPath = path.join(outputDir, 'optimized-list.json');
   
   let optimizedList = [];
   try {
     optimizedList = await fs.readJSON(listPath);
   } catch (error) {
     // Si le fichier n'existe pas, on commence avec une liste vide
   }
   
   // Ajouter les nouveaux résultats
   optimizedList = optimizedList.concat(results);
   
   // Sauvegarder la liste mise à jour
   await fs.writeJSON(listPath, optimizedList);

   res.json({
     success: true,
     results: results
   });
 } catch (error) {
   console.error('Erreur dans la route optimize:', error);
   res.status(500).json({
     success: false,
     error: error.message
   });
 }
});

// Route pour télécharger une image individuelle
router.get('/download-single/:filename', async (req, res) => {
 try {
   const { filename } = req.params;
   const filePath = path.join(__dirname, '../../output', filename);
   
   if (!await fs.exists(filePath)) {
     return res.status(404).json({ error: 'Fichier non trouvé' });
   }

   res.download(filePath);
 } catch (error) {
   console.error('Erreur:', error);
   res.status(500).json({ error: 'Erreur lors du téléchargement' });
 }
});

// Route pour supprimer une image individuelle
router.delete('/delete-single/:filename', async (req, res) => {
 try {
   const { filename } = req.params;
   const filePath = path.join(__dirname, '../../output', filename);
   const listPath = path.join(__dirname, '../../output', 'optimized-list.json');
   
   // Supprimer le fichier
   if (await fs.exists(filePath)) {
     await fs.unlink(filePath);
   }

   // Mettre à jour la liste des images optimisées
   let optimizedList = [];
   try {
     optimizedList = await fs.readJSON(listPath);
     optimizedList = optimizedList.filter(item => item.fileName !== filename);
     await fs.writeJSON(listPath, optimizedList);
   } catch (error) {
     console.error('Erreur lors de la mise à jour de la liste:', error);
   }

   res.json({ success: true });
 } catch (error) {
   console.error('Erreur:', error);
   res.status(500).json({ error: 'Erreur lors de la suppression' });
 }
});

// Route pour télécharger toutes les images optimisées
router.get('/download-results', async (req, res) => {
 try {
   const zip = new AdmZip();
   const outputDir = path.join(__dirname, '../../output');
   const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
   const zipName = `images-optimisees-${timestamp}.zip`;
   const zipPath = path.join(outputDir, zipName);

   // Récupérer uniquement les images optimisées récemment
   const listPath = path.join(outputDir, 'optimized-list.json');
   let optimizedImages = [];
   try {
     optimizedImages = await fs.readJSON(listPath);
   } catch (error) {
     // Si le fichier n'existe pas, la liste reste vide
   }

   // Ajouter uniquement les images optimisées dans la session actuelle
   for (const image of optimizedImages) {
     const filePath = path.join(outputDir, image.fileName);
     if (await fs.exists(filePath)) {
       zip.addLocalFile(filePath);
     }
   }

   zip.writeZip(zipPath);

   res.download(zipPath, zipName, (err) => {
     if (err) {
       console.error('Erreur lors du téléchargement:', err);
     }
     fs.unlink(zipPath).catch(console.error);
   });
 } catch (error) {
   console.error('Erreur:', error);
   res.status(500).json({ error: 'Erreur lors de la création du zip' });
 }
});

// Route pour nettoyer le dossier output
router.post('/clean', async (req, res) => {
 try {
   const outputDir = path.join(__dirname, '../../output');
   
   // Supprimer toutes les images
   await fs.emptyDir(outputDir);
   
   // Réinitialiser la liste des images optimisées
   await fs.writeJSON(path.join(outputDir, 'optimized-list.json'), []);

   res.json({ success: true });
 } catch (error) {
   console.error('Erreur:', error);
   res.status(500).json({ error: 'Erreur lors du nettoyage' });
 }
});

router.post('/optimize/advanced', async (req, res) => {
  const {
    batchSettings,
    compressionSettings,
    resizeSettings,
    watermarkSettings,
    files
  } = req.body;

  try {
    // 1. Appliquer les paramètres de lot
    const batchResults = await optimizationService.applyBatchSettings(files, batchSettings);

    // 2. Appliquer la compression
    const compressedResults = await optimizationService.applyCompression(
      batchResults,
      compressionSettings
    );

    // 3. Appliquer le redimensionnement
    const resizedResults = await optimizationService.applyResize(
      compressedResults,
      resizeSettings
    );

    // 4. Appliquer le filigrane si nécessaire
    const finalResults = watermarkSettings
      ? await optimizationService.applyWatermark(resizedResults, watermarkSettings)
      : resizedResults;

    res.json({
      success: true,
      results: finalResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoints pour sauvegarder/charger les préréglages
router.post('/presets', async (req, res) => {
  // Sauvegarder un nouveau préréglage
});

router.get('/presets', async (req, res) => {
  // Récupérer tous les préréglages
});

router.delete('/presets/:id', async (req, res) => {
  // Supprimer un préréglage
});

module.exports = router;