import React, { useState, useEffect } from 'react';
import { Upload, Download, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const ImageOptimizer = () => {
  const [settings, setSettings] = useState({
    quality: 80,
    scale: 100,
    format: 'webp',
    maxWidth: 1200
  });
  
  // Récupérer les résultats du localStorage au chargement
  const [results, setResults] = useState(() => {
    const savedResults = localStorage.getItem('optimizedImages');
    return savedResults ? JSON.parse(savedResults) : null;
  });

  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mise à jour du localStorage quand les résultats changent
  useEffect(() => {
    if (results) {
      localStorage.setItem('optimizedImages', JSON.stringify(results));
    }
  }, [results]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsProcessing(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    // Ajouter les paramètres
    Object.keys(settings).forEach(key => {
      formData.append(key, settings[key]);
    });

    try {
      const response = await axios.post(`${API_URL}/optimize`, formData);
      const newResults = response.data.results;
      // Ajouter les nouveaux résultats aux résultats existants
      setResults(prev => prev ? [...prev, ...newResults] : newResults);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsProcessing(false);
      setFiles([]); // Vider la sélection de fichiers
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/download-results`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.setAttribute('download', `images-optimisees-${timestamp}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const handleSingleDownload = async (result) => {
    try {
      const response = await axios.get(
        `${API_URL}/download-single/${result.fileName}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', result.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const handleSingleDelete = async (result) => {
    try {
      await axios.delete(`${API_URL}/delete-single/${result.fileName}`);
      // Mettre à jour la liste des résultats
      setResults(prev => prev.filter(item => item.fileName !== result.fileName));
      // Le localStorage est automatiquement mis à jour grâce au useEffect
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleClean = async () => {
    try {
      await axios.post(`${API_URL}/clean`);
      setFiles([]);
      setResults(null);
      localStorage.removeItem('optimizedImages');
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Image Optimizer</h1>

        {/* Zone de dépôt */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">
            Glissez-déposez vos images ici ou{' '}
            <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
              parcourez vos fichiers
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>
          </p>
          {files.length > 0 && (
            <p className="text-sm text-gray-500">
              {files.length} fichier(s) sélectionné(s)
            </p>
          )}
        </div>

        {/* Paramètres */}
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">Paramètres</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualité (%)
              </label>
              <input
                type="range"
                name="quality"
                min="1"
                max="100"
                value={settings.quality}
                onChange={handleSettingsChange}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{settings.quality}%</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Échelle (%)
              </label>
              <input
                type="range"
                name="scale"
                min="1"
                max="100"
                value={settings.scale}
                onChange={handleSettingsChange}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{settings.scale}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format de sortie
              </label>
              <select
                name="format"
                value={settings.format}
                onChange={handleSettingsChange}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="webp">WebP</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Largeur max (px)
              </label>
              <input
                type="number"
                name="maxWidth"
                value={settings.maxWidth}
                onChange={handleSettingsChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* Bouton de conversion */}
        <button
          onClick={handleSubmit}
          disabled={files.length === 0 || isProcessing}
          className={`mt-6 w-full py-2 px-4 rounded-md transition-colors ${
            files.length === 0 || isProcessing
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isProcessing ? 'Optimisation en cours...' : 'Optimiser les images'}
        </button>

        {/* Résultats */}
        {results && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Résultats</h3>
              <div className="space-x-4">
                <button
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Télécharger toutes les images
                </button>
                <button
                  onClick={handleClean}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Tout nettoyer
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">{result.fileName}</p>
                    <p className="text-sm text-gray-600">
                      Taille finale : {Math.round(result.optimizedSize / 1024)} KB
                    </p>
                    <p className="text-sm text-gray-600">
                      Dimensions : {result.dimensions.optimized.width} x {result.dimensions.optimized.height}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSingleDownload(result)}
                      className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                      title="Télécharger cette image"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleSingleDelete(result)}
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
                      title="Supprimer cette image"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageOptimizer;