// components/advanced/WatermarkSettings.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Type, Upload, Save, Sliders, Move } from 'lucide-react';

const POSITIONS = [
  { id: 'top-left', label: 'Haut Gauche' },
  { id: 'top-center', label: 'Haut Centre' },
  { id: 'top-right', label: 'Haut Droite' },
  { id: 'middle-left', label: 'Milieu Gauche' },
  { id: 'middle-center', label: 'Centre' },
  { id: 'middle-right', label: 'Milieu Droite' },
  { id: 'bottom-left', label: 'Bas Gauche' },
  { id: 'bottom-center', label: 'Bas Centre' },
  { id: 'bottom-right', label: 'Bas Droite' }
];

const WatermarkSettings = () => {
  const [watermarkType, setWatermarkType] = useState('text');
  const [settings, setSettings] = useState({
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
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSettingChange('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Filigrane</h3>

      {/* Type de filigrane */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Type de filigrane</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setWatermarkType('text')}
            className={`
              p-4 rounded-lg flex items-center justify-center gap-3 transition-colors
              ${watermarkType === 'text' 
                ? 'bg-blue-500 text-white' 
                : 'border hover:border-blue-500 hover:bg-blue-50'
              }
            `}
          >
            <Type className="w-5 h-5" />
            <span>Texte</span>
          </button>
          <button
            onClick={() => setWatermarkType('image')}
            className={`
              p-4 rounded-lg flex items-center justify-center gap-3 transition-colors
              ${watermarkType === 'image' 
                ? 'bg-blue-500 text-white' 
                : 'border hover:border-blue-500 hover:bg-blue-50'
              }
            `}
          >
            <Image className="w-5 h-5" />
            <span>Image</span>
          </button>
        </div>
      </div>

      {/* Paramètres spécifiques au type */}
      {watermarkType === 'text' ? (
        <div className="space-y-4">
          {/* Texte */}
          <div>
            <label className="block text-sm font-medium mb-2">Texte</label>
            <input
              type="text"
              value={settings.text}
              onChange={(e) => handleSettingChange('text', e.target.value)}
              placeholder="Votre texte ici"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Police et taille */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Police</label>
              <select
                value={settings.font}
                onChange={(e) => handleSettingChange('font', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Taille</label>
              <input
                type="number"
                value={settings.fontSize}
                onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Couleur */}
          <div>
            <label className="block text-sm font-medium mb-2">Couleur</label>
            <input
              type="color"
              value={settings.color}
              onChange={(e) => handleSettingChange('color', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Upload d'image */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center
              ${settings.image ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'}
            `}
          >
            {settings.image ? (
              <div className="space-y-4">
                <img
                  src={settings.image}
                  alt="Filigrane"
                  className="max-h-32 mx-auto rounded"
                />
                <button
                  onClick={() => handleSettingChange('image', null)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Supprimer l'image
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500">
                  Cliquez ou déposez une image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Échelle */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Échelle</label>
              <span className="text-sm text-gray-500">{settings.scale}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={settings.scale}
              onChange={(e) => handleSettingChange('scale', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      )}

      {/* Paramètres communs */}
      <div className="space-y-4">
        {/* Position */}
        <div>
          <label className="block text-sm font-medium mb-2">Position</label>
          <div className="grid grid-cols-3 gap-2">
            {POSITIONS.map((pos) => (
              <motion.button
                key={pos.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSettingChange('position', pos.id)}
                className={`
                  p-3 rounded-lg border text-sm transition-colors
                  ${settings.position === pos.id 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'hover:border-blue-500 hover:bg-blue-50'
                  }
                `}
              >
                {pos.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Opacité et marge */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Opacité</label>
              <span className="text-sm text-gray-500">{settings.opacity}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={settings.opacity}
              onChange={(e) => handleSettingChange('opacity', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Marge</label>
              <span className="text-sm text-gray-500">{settings.margin}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.margin}
              onChange={(e) => handleSettingChange('margin', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        {/* Rotation */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Rotation</label>
            <span className="text-sm text-gray-500">{settings.rotation}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={settings.rotation}
            onChange={(e) => handleSettingChange('rotation', parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="pt-4">
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          Appliquer le filigrane
        </button>
      </div>
    </div>
  );
};

export default WatermarkSettings;