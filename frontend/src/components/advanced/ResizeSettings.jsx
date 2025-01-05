// components/advanced/ResizeSettings.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Lock, Unlock, Trash2 } from 'lucide-react';

const DEFAULT_PRESETS = [
  {
    id: 'instagram-square',
    name: 'Instagram Carré',
    width: 1080,
    height: 1080,
    mode: 'cover'
  },
  {
    id: 'facebook-cover',
    name: 'Facebook Cover',
    width: 851,
    height: 315,
    mode: 'cover'
  },
  {
    id: 'twitter-post',
    name: 'Twitter Post',
    width: 1200,
    height: 675,
    mode: 'cover'
  }
];

const RESIZE_MODES = [
  {
    id: 'contain',
    name: 'Contain',
    description: 'Garde l\'image entière, peut ajouter des bordures'
  },
  {
    id: 'cover',
    name: 'Cover',
    description: 'Remplit le cadre, peut recadrer l\'image'
  },
  {
    id: 'fill',
    name: 'Fill',
    description: 'Étire l\'image pour remplir le cadre'
  },
  {
    id: 'inside',
    name: 'Inside',
    description: 'Redimensionne sans dépasser les dimensions'
  },
  {
    id: 'outside',
    name: 'Outside',
    description: 'Redimensionne pour couvrir au minimum'
  }
];

const ResizeSettings = () => {
  const [customSizes, setCustomSizes] = useState(DEFAULT_PRESETS);
  const [selectedMode, setSelectedMode] = useState('cover');
  const [aspectLocked, setAspectLocked] = useState(true);
  const [newSize, setNewSize] = useState({
    name: '',
    width: 1920,
    height: 1080,
    mode: 'cover'
  });
  const [showNewSizeForm, setShowNewSizeForm] = useState(false);

  const handleAddSize = () => {
    if (newSize.name && newSize.width && newSize.height) {
      setCustomSizes(prev => [...prev, { ...newSize, id: Date.now().toString() }]);
      setNewSize({ name: '', width: 1920, height: 1080, mode: 'cover' });
      setShowNewSizeForm(false);
    }
  };

  const handleDeleteSize = (id) => {
    setCustomSizes(prev => prev.filter(size => size.id !== id));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Redimensionnement</h3>

      {/* Mode de redimensionnement */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">Mode d'ajustement</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RESIZE_MODES.map(mode => (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMode(mode.id)}
              className={`
                p-4 rounded-lg text-left transition-colors
                ${selectedMode === mode.id 
                  ? 'bg-blue-500 text-white' 
                  : 'border hover:border-blue-500 hover:bg-blue-50'
                }
              `}
            >
              <div className="font-medium">{mode.name}</div>
              <div className={`text-sm mt-1 ${selectedMode === mode.id ? 'text-blue-100' : 'text-gray-500'}`}>
                {mode.description}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tailles prédéfinies */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Tailles prédéfinies</label>
          <button
            onClick={() => setShowNewSizeForm(true)}
            className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une taille
          </button>
        </div>

        <div className="grid gap-3">
          {customSizes.map(size => (
            <motion.div
              key={size.id}
              className="p-4 border rounded-lg flex items-center justify-between group"
            >
              <div>
                <div className="font-medium">{size.name}</div>
                <div className="text-sm text-gray-500">
                  {size.width}×{size.height} • {size.mode}
                </div>
              </div>
              <button
                onClick={() => handleDeleteSize(size.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Formulaire d'ajout */}
        {showNewSizeForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border rounded-lg bg-gray-50"
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom de la taille"
                value={newSize.name}
                onChange={(e) => setNewSize(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded-lg"
              />
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Largeur"
                    value={newSize.width}
                    onChange={(e) => setNewSize(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <button
                  onClick={() => setAspectLocked(!aspectLocked)}
                  className="p-2 text-gray-500"
                >
                  {aspectLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
                
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Hauteur"
                    value={newSize.height}
                    onChange={(e) => setNewSize(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewSizeForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddSize}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </motion.div>
        )}
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

export default ResizeSettings;