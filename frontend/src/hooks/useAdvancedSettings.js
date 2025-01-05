// hooks/useAdvancedSettings.js
import { create } from 'zustand';

const useAdvancedSettings = create((set) => ({
  batchSettings: {
    preset: 'web',
    namePattern: '[name]-[dimensions]',
    metadata: {
      keepExif: false,
      keepIcc: false
    }
  },
  compressionSettings: {
    level: 6,
    algorithm: 'mozjpeg',
    chroma: '420',
    dithering: false
  },
  resizeSettings: {
    mode: 'cover',
    customSizes: [],
    selectedSize: null
  },
  watermarkSettings: {
    type: 'text',
    text: '',
    font: 'Arial',
    fontSize: 24,
    color: '#ffffff',
    opacity: 70,
    position: 'bottom-right',
    margin: 20,
    rotation: 0,
    image: null,
    scale: 100
  },
  updateBatchSettings: (settings) => 
    set((state) => ({ batchSettings: { ...state.batchSettings, ...settings } })),
  updateCompressionSettings: (settings) => 
    set((state) => ({ compressionSettings: { ...state.compressionSettings, ...settings } })),
  updateResizeSettings: (settings) => 
    set((state) => ({ resizeSettings: { ...state.resizeSettings, ...settings } })),
  updateWatermarkSettings: (settings) => 
    set((state) => ({ watermarkSettings: { ...state.watermarkSettings, ...settings } })),
}));

export default useAdvancedSettings;