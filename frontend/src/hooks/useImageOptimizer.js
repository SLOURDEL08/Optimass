import { useState, useEffect } from 'react';
import { optimizeImages, downloadAll, downloadSingle, deleteSingle, cleanAll } from '../services/api';
import { downloadBlob } from '../utils/fileHelpers';

const DEFAULT_SETTINGS = {
  quality: 80,
  scale: 100,
  format: 'webp',
  maxWidth: 1200
};

export const useImageOptimizer = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(() => {
    const savedResults = localStorage.getItem('optimizedImages');
    return savedResults ? JSON.parse(savedResults) : null;
  });

  useEffect(() => {
    if (results) {
      localStorage.setItem('optimizedImages', JSON.stringify(results));
    }
  }, [results]);

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (selectedFiles) => {
    setFiles(selectedFiles);
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const newResults = await optimizeImages(files, settings);
      setResults(prev => prev ? [...prev, ...newResults] : newResults);
      setFiles([]);
    } catch (error) {
      console.error('Erreur:', error);
      // Ici vous pourriez ajouter une gestion des erreurs avec un toast
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadAll();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadBlob(blob, `images-optimisees-${timestamp}.zip`);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const handleSingleDownload = async (result) => {
    try {
      const blob = await downloadSingle(result.fileName);
      downloadBlob(blob, result.fileName);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const handleSingleDelete = async (result) => {
    try {
      await deleteSingle(result.fileName);
      setResults(prev => prev.filter(item => item.fileName !== result.fileName));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleClean = async () => {
    try {
      await cleanAll();
      setFiles([]);
      setResults(null);
      localStorage.removeItem('optimizedImages');
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  };

  return {
    settings,
    files,
    results,
    isProcessing,
    handleSettingsChange,
    handleFileSelect,
    handleSubmit,
    handleDownload,
    handleSingleDownload,
    handleSingleDelete,
    handleClean,
  };
};