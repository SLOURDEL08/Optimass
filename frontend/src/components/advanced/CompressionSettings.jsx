// components/advanced/CompressionSettings.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Info } from 'lucide-react';

const COMPRESSION_ALGORITHMS = [
  {
    id: 'mozjpeg',
    name: 'MozJPEG',
    description: 'Meilleur rapport qualité/taille pour les photos',
    recommended: true
  },
  {
    id: 'webp',
    name: 'WebP',
    description: 'Format moderne, excellent pour le web',
    recommended: false
  },
  {
    id: 'avif',
    name: 'AVIF',
    description: 'Dernière génération, compression maximale',
    recommended: false
  }
];

const CompressionSettings = () => {
  const [settings, setSettings] = useState({
    compressionLevel: 6,
    algorithm: 'mozjpeg',
    chroma: '420',
    dithering: false,
    interlace: false,
    stripMetadata: true,
    progressive: true
  });

  const [showTooltip, setShowTooltip] = useState(null);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Compression avancée</h3>

      {/* Niveau de compression */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Niveau de compression</label>
          <span className="text-sm text-gray-500">Niveau {settings.compressionLevel}</span>
        </div>
        <input
          type="range"
          min="1"
          max="9"
          value={settings.compressionLevel}
          onChange={(e) => handleSettingChange('compressionLevel', parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Rapide (moins compressé)</span>
          <span>Lent (plus compressé)</span>
        </div>
      </div>

      {/* Algorithme de compression */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Algorithme</label>
        <div className="grid gap-3">
          {COMPRESSION_ALGORITHMS.map(algo => (
            <label
              key={algo.id}
              className={`
                relative p-4 border rounded-lg cursor-pointer transition-all
                ${settings.algorithm === algo.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                name="algorithm"
                value={algo.id}
                checked={settings.algorithm === algo.id}
                onChange={(e) => handleSettingChange('algorithm', e.target.value)}
                className="hidden"
              />
              <div className="flex items-start gap-3">
                <div className="flex-grow">
                  <div className="font-medium flex items-center gap-2">
                    {algo.name}
                    {algo.recommended && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Recommandé
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{algo.description}</div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center">
                  {settings.algorithm === algo.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 bg-blue-500 rounded-full"
                    />
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Options avancées */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Options avancées</label>
        
        {/* Sous-échantillonnage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm">Sous-échantillonnage chroma</label>
            <select
              value={settings.chroma}
              onChange={(e) => handleSettingChange('chroma', e.target.value)}
              className="text-sm border rounded-lg p-1.5"
            >
              <option value="444">4:4:4 (Qualité maximale)</option>
              <option value="422">4:2:2 (Équilibré)</option>
              <option value="420">4:2:0 (Compression maximale)</option>
            </select>
          </div>

          {/* Options avec toggles */}
          {[
            {
              id: 'dithering',
              label: 'Dithering',
              description: 'Améliore les dégradés de couleurs'
            },
            {
              id: 'interlace',
              label: 'Interlacement progressif',
              description: 'Chargement progressif de limage'
            },
            {
              id: 'stripMetadata',
              label: 'Supprimer les métadonnées',
              description: 'Réduit la taille du fichier'
            }
          ].map(option => (
            <label
              key={option.id}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={settings[option.id]}
                onChange={() => handleSettingChange(option.id, !settings[option.id])}
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium flex items-center gap-2">
                  {option.label}
                  <button
                    onMouseEnter={() => setShowTooltip(option.id)}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                {showTooltip === option.id && (
                  <div className="text-sm text-gray-500">{option.description}</div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="pt-4">
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          Appliquer les paramètres
        </button>
      </div>
    </div>
  );
};

export default CompressionSettings;