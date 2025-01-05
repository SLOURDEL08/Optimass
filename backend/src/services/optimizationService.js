const sharp = require('sharp');
const textToSvg = require('text-to-svg').loadSync();
const path = require('path');
const fs = require('fs-extra');

class OptimizationService {
  async optimizeImage(inputPath, outputPath, options) {
    try {
      const image = sharp(inputPath);
      
      // Application des paramètres de redimensionnement
      if (options.resize) {
        await this.applyResize(image, options.resize);
      }

      // Application de la compression
      if (options.compression) {
        await this.applyCompression(image, options.compression);
      }

      // Application du filigrane
      if (options.watermark) {
        await this.applyWatermark(image, options.watermark);
      }

      // Sauvegarde de l'image finale
      await image.toFile(outputPath);

      return {
        success: true,
        path: outputPath,
        fileName: path.basename(outputPath)
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'optimisation: ${error.message}`);
    }
  }

  async applyResize(image, settings) {
    const { width, height, mode } = settings;
    return image.resize({
      width,
      height,
      fit: mode,
      withoutEnlargement: true
    });
  }

  async applyCompression(image, settings) {
    const { quality, format } = settings;
    if (format === 'webp') {
      return image.webp({ quality });
    } else if (format === 'jpeg') {
      return image.jpeg({ quality });
    } else if (format === 'png') {
      return image.png({ quality });
    }
  }

  async applyWatermark(image, settings) {
    if (settings.type === 'text') {
      // Créer le filigrane texte
      const svg = textToSvg.getSVG(settings.text, {
        fontSize: settings.fontSize,
        anchor: 'left top',
        attributes: { fill: settings.color }
      });

      // Appliquer le filigrane
      return image.composite([{
        input: Buffer.from(svg),
        gravity: settings.position,
        blend: 'over',
        opacity: settings.opacity / 100
      }]);
    } else {
      // Appliquer le filigrane image
      return image.composite([{
        input: settings.image,
        gravity: settings.position,
        blend: 'over',
        opacity: settings.opacity / 100
      }]);
    }
  }

  async processDirectory(inputDir, outputDir, options) {
    try {
      const results = [];
      const files = await fs.readdir(inputDir);

      for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const stats = await fs.stat(inputPath);

        if (stats.isFile()) {
          const ext = path.extname(file).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
            const outputPath = path.join(outputDir, `${path.parse(file).name}.${options.format || 'webp'}`);
            const result = await this.optimizeImage(inputPath, outputPath, options);
            results.push(result);
          }
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Erreur lors du traitement du dossier: ${error.message}`);
    }
  }
}

module.exports = new OptimizationService();