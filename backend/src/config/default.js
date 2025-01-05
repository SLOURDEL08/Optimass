const DEFAULT_CONFIG = {
  inputDir: 'uploads',
  outputDir: 'output',
  formatInput: ['.jpg', '.jpeg', '.png', '.webp'],
  formatOutput: 'webp',
  quality: 100,
  scale: 100,
  maxWidth: 1200,
  maxFileSize: 10 * 1024 * 1024, // 10MB
};

module.exports = DEFAULT_CONFIG;