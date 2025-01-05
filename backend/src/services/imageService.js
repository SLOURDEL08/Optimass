const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');
const config = require('../config/default');

class ImageService {
 constructor() {
   this.sessions = new Map(); // Pour stocker les résultats par session
 }

 // Ajouter une méthode pour créer une nouvelle session
 createSession() {
   const sessionId = Date.now().toString();
   this.sessions.set(sessionId, []);
   return sessionId;
 }

 // Ajouter une méthode pour stocker les résultats d'une session
 addToSession(sessionId, results) {
   if (this.sessions.has(sessionId)) {
     this.sessions.get(sessionId).push(...results);
   }
 }

 // Ajouter une méthode pour récupérer les résultats d'une session
 getSessionResults(sessionId) {
   return this.sessions.get(sessionId) || [];
 }

 // Ajouter une méthode pour nettoyer une session
 async cleanSession(sessionId) {
   if (this.sessions.has(sessionId)) {
     const results = this.sessions.get(sessionId);
     // Supprimer les fichiers
     for (const result of results) {
       try {
         await fs.remove(result.path);
       } catch (error) {
         console.error(`Erreur lors de la suppression de ${result.path}:`, error);
       }
     }
     this.sessions.delete(sessionId);
   }
 }

 async optimizeImage(inputPath, outputPath, options) {
   const { format, quality, scale, maxWidth } = options;
   
   try {
     const image = sharp(inputPath);
     const metadata = await image.metadata();
     
     let newWidth = Math.round(metadata.width * (scale / 100));
     let newHeight = Math.round(metadata.height * (scale / 100));

     // Ajuster la largeur si elle dépasse maxWidth
     if (newWidth > maxWidth) {
       const aspectRatio = metadata.width / metadata.height;
       newWidth = maxWidth;
       newHeight = Math.round(maxWidth / aspectRatio);
     }

     let outputOptions = {};
     if (format === 'webp') {
       outputOptions = { quality: parseInt(quality), lossless: quality === 100 };
     } else if (format === 'png') {
       outputOptions = { quality: parseInt(quality), compressionLevel: 9 };
     } else {
       outputOptions = { quality: parseInt(quality) };
     }

     // Assurer que le dossier de sortie existe
     await fs.ensureDir(path.dirname(outputPath));

     // Optimiser l'image
     await image
       .resize({
         width: newWidth,
         height: newHeight,
         fit: 'inside',
         withoutEnlargement: true
       })
       .withMetadata()
       [format](outputOptions)
       .toFile(outputPath);

     // Obtenir la taille du fichier optimisé
     const optimizedStats = await fs.stat(outputPath);
     const originalStats = await fs.stat(inputPath);

     return {
       success: true,
       path: outputPath,
       fileName: path.basename(outputPath),
       originalSize: originalStats.size,
       optimizedSize: optimizedStats.size,
       compressionRatio: ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(2),
       dimensions: {
         original: {
           width: metadata.width,
           height: metadata.height
         },
         optimized: {
           width: newWidth,
           height: newHeight
         }
       },
       format: format
     };
   } catch (error) {
     throw new Error(`Erreur d'optimisation: ${error.message}`);
   }
 }

 async processDirectory(inputDir, outputDir, options) {
   try {
     const { format, quality, scale, maxWidth } = options;
     const results = [];
     
     // Lire tous les fichiers du dossier
     const files = await fs.readdir(inputDir);
     
     for (const file of files) {
       const inputPath = path.join(inputDir, file);
       const stats = await fs.stat(inputPath);
       
       // Calculer le chemin relatif
       const relativePath = path.relative(inputDir, inputPath);
       
       // Construire le chemin de sortie
       const outputPath = path.join(outputDir, relativePath);

       if (stats.isDirectory()) {
         // Récursivement traiter les sous-dossiers
         await fs.ensureDir(outputPath);
         const subResults = await this.processDirectory(
           inputPath,
           outputPath,
           options
         );
         results.push(...subResults);
       } else if (stats.isFile()) {
         const ext = path.extname(file).toLowerCase();
         
         if (config.formatInput.includes(ext)) {
           // Construire le nouveau chemin avec l'extension du format de sortie
           const newOutputPath = path.join(
             path.dirname(outputPath),
             `${path.parse(file).name}.${format}`
           );
           
           try {
             const result = await this.optimizeImage(inputPath, newOutputPath, {
               format,
               quality,
               scale,
               maxWidth
             });
             results.push(result);
           } catch (error) {
             results.push({
               success: false,
               path: inputPath,
               error: error.message
             });
           }
         } else {
           // Copier les fichiers non traités
           await fs.ensureDir(path.dirname(outputPath));
           await fs.copy(inputPath, outputPath);
           results.push({
             success: true,
             path: outputPath,
             copied: true,
             fileName: file
           });
         }
       }
     }
     
     return results;
   } catch (error) {
     throw new Error(`Erreur de traitement du dossier: ${error.message}`);
   }
 }

 // Méthode utilitaire pour vérifier si un fichier est une image valide
 isValidImageFile(filename) {
   const ext = path.extname(filename).toLowerCase();
   return config.formatInput.includes(ext);
 }

 // Méthode pour nettoyer les fichiers temporaires
 async cleanupTemp(filePath) {
   try {
     await fs.remove(filePath);
   } catch (error) {
     console.error(`Erreur lors du nettoyage du fichier temporaire ${filePath}:`, error);
   }
 }
}

module.exports = new ImageService();