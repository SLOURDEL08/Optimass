const imageService = require('../services/imageService');
const optimizationService = require('../services/optimizationService');
const path = require('path');
const config = require('../config/default');
const fs = require('fs-extra');

class ImageController {
 async optimizeImages(req) {
   console.log('Début optimizeImages');
   console.log('Files reçus:', req.files);
   
   if (!req.files || req.files.length === 0) {
     throw new Error('Aucun fichier n\'a été uploadé');
   }

   // Récupérer les options de base
   const baseOptions = {
     format: req.body.format || config.formatOutput,
     quality: parseInt(req.body.quality) || config.quality,
     scale: parseFloat(req.body.scale) || config.scale,
     maxWidth: parseInt(req.body.maxWidth) || config.maxWidth
   };

   // Récupérer les options avancées si présentes
   const advancedOptions = {
     resize: req.body.resizeSettings ? {
       mode: req.body.resizeSettings.mode || 'cover',
       width: parseInt(req.body.resizeSettings.width) || baseOptions.maxWidth,
       height: parseInt(req.body.resizeSettings.height),
     } : null,
     
     compression: {
       quality: baseOptions.quality,
       format: baseOptions.format,
       algorithm: req.body.compressionSettings?.algorithm || 'mozjpeg',
       chroma: req.body.compressionSettings?.chroma || '420',
       dithering: req.body.compressionSettings?.dithering || false
     },
     
     watermark: req.body.watermarkSettings || null
   };

   console.log('Options de base:', baseOptions);
   console.log('Options avancées:', advancedOptions);

   const results = [];
   
   // Traiter chaque fichier
   for (const file of req.files) {
     try {
       // Vérifier si c'est une image valide
       if (!imageService.isValidImageFile(file.originalname)) {
         results.push({
           success: false,
           fileName: file.originalname,
           error: 'Format de fichier non supporté'
         });
         continue;
       }

       // Créer le chemin de sortie
       const outputPath = path.join(
         config.outputDir,
         `${path.parse(file.originalname).name}.${baseOptions.format}`
       );

       console.log('Traitement de:', file.originalname);
       console.log('Chemin de sortie:', outputPath);

       // Optimiser l'image avec les options avancées si présentes
       let result;
       if (Object.values(advancedOptions).some(opt => opt !== null)) {
         result = await optimizationService.optimizeImage(file.path, outputPath, {
           ...baseOptions,
           ...advancedOptions
         });
       } else {
         result = await imageService.optimizeImage(file.path, outputPath, baseOptions);
       }

       results.push(result);

       // Nettoyer le fichier temporaire
       await imageService.cleanupTemp(file.path);

     } catch (error) {
       console.error('Erreur pendant le traitement:', error);
       results.push({
         success: false,
         fileName: file.originalname,
         error: error.message
       });
     }
   }

   // Sauvegarder les résultats dans la liste
   try {
     const outputDir = path.join(__dirname, '../../output');
     const listPath = path.join(outputDir, 'optimized-list.json');
     let existingResults = [];
     
     try {
       existingResults = await fs.readJSON(listPath);
     } catch (error) {
       // Si le fichier n'existe pas, on commence avec une liste vide
     }
     
     const updatedResults = [...existingResults, ...results];
     await fs.writeJSON(listPath, updatedResults);
   } catch (error) {
     console.error('Erreur lors de la sauvegarde des résultats:', error);
   }

   console.log('Résultats:', results);
   return results;
 }

 async cleanOutput() {
   const outputDir = path.join(__dirname, '../../output');
   
   try {
     // Supprimer toutes les images
     await fs.emptyDir(outputDir);
     
     // Réinitialiser la liste des images optimisées
     await fs.writeJSON(path.join(outputDir, 'optimized-list.json'), []);
   } catch (error) {
     throw new Error(`Erreur lors du nettoyage: ${error.message}`);
   }
 }

 async getResults() {
   try {
     const outputDir = path.join(__dirname, '../../output');
     const listPath = path.join(outputDir, 'optimized-list.json');
     if (await fs.exists(listPath)) {
       return await fs.readJSON(listPath);
     }
     return [];
   } catch (error) {
     console.error('Erreur lors de la récupération des résultats:', error);
     return [];
   }
 }

 // Nouvelle méthode pour sauvegarder un préréglage
 async savePreset(preset) {
   try {
     const presetsPath = path.join(__dirname, '../../config/presets.json');
     let presets = [];
     
     try {
       presets = await fs.readJSON(presetsPath);
     } catch (error) {
       // Si le fichier n'existe pas, on commence avec une liste vide
     }
     
     presets.push({
       id: Date.now().toString(),
       ...preset
     });
     
     await fs.writeJSON(presetsPath, presets);
     return presets;
   } catch (error) {
     throw new Error(`Erreur lors de la sauvegarde du préréglage: ${error.message}`);
   }
 }

 // Nouvelle méthode pour récupérer les préréglages
 async getPresets() {
   try {
     const presetsPath = path.join(__dirname, '../../config/presets.json');
     if (await fs.exists(presetsPath)) {
       return await fs.readJSON(presetsPath);
     }
     return [];
   } catch (error) {
     console.error('Erreur lors de la récupération des préréglages:', error);
     return [];
   }
 }
}

module.exports = new ImageController();