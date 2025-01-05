import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, ImageDown, Crop, Image } from 'lucide-react';

const AdvancedSettings = () => {
  const [activeSection, setActiveSection] = useState('batch');

  const sections = [
    {
      id: 'batch',
      label: 'Optimisation par lots',
      icon: Settings,
      Component: BatchSettings
    },
    {
      id: 'compression',
      label: 'Compression avancée',
      icon: ImageDown,
      Component: CompressionSettings
    },
    {
      id: 'resize',
      label: 'Redimensionnement',
      icon: Crop,
      Component: ResizeSettings
    },
    {
      id: 'watermark',
      label: 'Filigrane',
      icon: Image,
      Component: WatermarkSettings
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      {/* Sidebar */}
      <div className="col-span-1 space-y-2">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`
              w-full p-3 rounded-lg flex items-center gap-3 transition-colors
              ${activeSection === id 
                ? 'bg-blue-50 text-blue-600' 
                : 'hover:bg-gray-50 text-gray-600'
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="col-span-3 bg-white rounded-xl p-6">
        {sections.map(({ id, Component }) => (
          activeSection === id && <Component key={id} />
        ))}
      </div>
    </div>
  );
};

// Composant pour l'optimisation par lots
const BatchSettings = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Optimisation par lots</h3>
      
      {/* Préréglages */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Préréglages</label>
        <div className="grid grid-cols-3 gap-3">
          {['Web', 'Réseaux sociaux', 'Haute qualité'].map(preset => (
            <button
              key={preset}
              className="p-3 border rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50"
            >
              {preset}
            </button>
          ))}
          <button className="p-3 border rounded-lg text-sm text-blue-500 hover:border-blue-500 hover:bg-blue-50">
            + Créer un préréglage
          </button>
        </div>
      </div>

      {/* Règles de nommage */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Règles de nommage</label>
        <input
          type="text"
          placeholder="[nom]-[dimensions]-[date]"
          className="w-full p-2 border rounded-lg"
        />
        <div className="text-xs text-gray-500">
          Variables disponibles: [nom], [dimensions], [date], [qualite]
        </div>
      </div>

      {/* Métadonnées */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Métadonnées</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span>Conserver les données EXIF</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span>Conserver les profils ICC</span>
          </label>
        </div>
      </div>
    </div>
  );
};

// Composant pour la compression avancée
const CompressionSettings = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Compression avancée</h3>
      
      {/* Niveau de compression */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Niveau de compression</label>
        <input 
          type="range" 
          min="1" 
          max="9" 
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Rapide</span>
          <span>Optimal</span>
        </div>
      </div>

      {/* Algorithme de compression */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Algorithme</label>
        <select className="w-full p-2 border rounded-lg">
          <option value="mozjpeg">MozJPEG (Recommandé)</option>
          <option value="webp">WebP</option>
          <option value="avif">AVIF</option>
        </select>
      </div>

      {/* Options avancées */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Options avancées</label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Sous-échantillonnage chroma 4:2:0</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Dithering</span>
        </label>
      </div>
    </div>
  );
};

// Composant pour le redimensionnement
const ResizeSettings = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Redimensionnement</h3>
      
      {/* Mode d'ajustement */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Mode d'ajustement</label>
        <div className="grid grid-cols-3 gap-3">
          {['Contain', 'Cover', 'Fill', 'Inside', 'Outside'].map(mode => (
            <button
              key={mode}
              className="p-3 border rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50"
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Tailles prédéfinies */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Tailles prédéfinies</label>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-3 border rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50">
            Instagram (1080×1080)
          </button>
          <button className="p-3 border rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50">
            Facebook Cover (851×315)
          </button>
          <button className="p-3 border rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50">
            Twitter Post (1200×675)
          </button>
          <button className="p-3 border rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50">
            + Ajouter une taille
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant pour le filigrane
const WatermarkSettings = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Filigrane</h3>
      
      {/* Type de filigrane */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Type de filigrane</label>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-3 border rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50">
            Texte
          </button>
          <button className="p-3 border rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50">
            Image
          </button>
        </div>
      </div>

      {/* Position */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Position</label>
        <div className="grid grid-cols-3 gap-2">
          {['Top-Left', 'Top', 'Top-Right', 'Left', 'Center', 'Right', 'Bottom-Left', 'Bottom', 'Bottom-Right'].map(pos => (
            <button
              key={pos}
              className="p-2 border rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50"
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Opacité */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Opacité</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          defaultValue="50"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default AdvancedSettings;