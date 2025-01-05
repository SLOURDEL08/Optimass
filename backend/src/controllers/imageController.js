const imageService = require('../services/imageService');
const path = require('path');
const config = require('../config/default');
const fs = require('fs-extra');

class ImageController {
 async optimizeImages(req) {  // Retrait du paramètre res
   console.log('Début optimizeImages');
   console.log('Files reçus:', req.files);
   
   if (!req.files || req.files.length === 0) {
     throw new Error('Aucun fichier n\'a été uploadé');
   }

   // Récupérer les options depuis la requête ou utiliser les valeurs par défaut
   const options = {
     format: req.body.format || config.formatOutput,
     quality: parseInt(req.body.quality) || config.quality,
     scale: parseFloat(req.body.scale) || config.scale,
     maxWidth: parseInt(req.body.maxWidth) || config.maxWidth
   };

   console.log('Options:', options);

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
         `${path.parse(file.originalname).name}.${options.format}`
       );

       console.log('Traitement de:', file.originalname);
       console.log('Chemin de sortie:', outputPath);

       // Optimiser l'image
       const result = await imageService.optimizeImage(
         file.path,
         outputPath,
         options
       );

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

   console.log('Résultats:', results);

   // Retourner les résultats au lieu de les envoyer directement
   return results;
 }

 // Méthode pour nettoyer le dossier output
 async cleanOutput() {
   const outputDir = path.join(__dirname, '../../output');
   
   // Supprimer toutes les images sauf le dossier optimized-list.json
   const files = await fs.readdir(outputDir);
   for (const file of files) {
     const filePath = path.join(outputDir, file);
     if (fs.statSync(filePath).isFile() && file !== 'optimized-list.json') {
       await fs.unlink(filePath);
     }
   }

   // Réinitialiser la liste des images optimisées
   await fs.writeJSON(path.join(outputDir, 'optimized-list.json'), []);
 }

 // Méthode pour récupérer les résultats
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
}

module.exports = new ImageController();