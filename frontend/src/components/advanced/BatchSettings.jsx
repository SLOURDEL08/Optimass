// components/advanced/BatchSettings.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save } from 'lucide-react';

const DEFAULT_PRESETS = [
  {
    id: 'web',
    name: 'Web',
    settings: {
      quality: 80,
      format: 'webp',
      maxWidth: 1200,
      keepExif: false
    }
  },
  {
    id: 'social',
    name: 'Réseaux sociaux',
    settings: {
      quality: 90,
      format: 'jpeg',
      maxWidth: 1080,
      keepExif: true
    }
  },
  {
    id: 'hq',
    name: 'Haute qualité',
    settings: {
      quality: 100,
      format: 'png',
      maxWidth: 2400,
      keepExif: true
    }
  }
];

const BatchSettings = () => {
  const [presets, setPresets] = useState(DEFAULT_PRESETS);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [namePattern, setNamePattern] = useState('[name]-[dimensions]');
  const [metadata, setMetadata] = useState({
    keepExif: false,
    keepIcc: false,
  });
  const [showNewPresetModal, setShowNewPresetModal] = useState(false);

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.id);
  };

  const handleMetadataChange = (key) => {
    setMetadata(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Optimisation par lots</h3>
      
      {/* Préréglages */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Préréglages</label>
          <button 
            onClick={() => setShowNewPresetModal(true)}
            className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouveau préréglage
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {presets.map(preset => (
            <motion.button
              key={preset.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePresetSelect(preset)}
              className={`
                p-4 rounded-lg text-sm transition-colors
                ${selectedPreset === preset.id 
                  ? 'bg-blue-500 text-white' 
                  : 'border hover:border-blue-500 hover:bg-blue-50'
                }
              `}
            >
              <div className="font-medium">{preset.name}</div>
              <div className="mt-2 text-xs opacity-80">
                {preset.settings.format.toUpperCase()} • {preset.settings.quality}% • {preset.settings.maxWidth}px
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Règles de nommage */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Règles de nommage</label>
        <div className="space-y-2">
          <input
            type="text"
            value={namePattern}
            onChange={(e) => setNamePattern(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="[name]-[dimensions]-[date]"
          />
          <div className="text-xs text-gray-500 space-x-2">
            {['[name]', '[dimensions]', '[date]', '[quality]'].map(variable => (
              <span
                key={variable}
                className="inline-block px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                onClick={() => setNamePattern(prev => prev + variable)}
              >
                {variable}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Métadonnées</label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={metadata.keepExif}
              onChange={() => handleMetadataChange('keepExif')}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <div>
              <div className="font-medium">Conserver les données EXIF</div>
              <div className="text-sm text-gray-500">Inclut les métadonnées de l'appareil photo et les paramètres de prise de vue</div>
            </div>
          </label>
          
          <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={metadata.keepIcc}
              onChange={() => handleMetadataChange('keepIcc')}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <div>
              <div className="font-medium">Conserver les profils ICC</div>
              <div className="text-sm text-gray-500">Maintient la cohérence des couleurs entre les appareils</div>
            </div>
          </label>
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="pt-4">
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Sauvegarder les paramètres
        </button>
      </div>
    </div>
  );
};

export default BatchSettings;