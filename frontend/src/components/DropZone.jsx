import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

const DropZone = ({ onFileSelect, filesCount, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);

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
    onFileSelect(droppedFiles);
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center transition-colors
        ${isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50/50'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-4"
      >
        <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
          <Upload className="w-6 h-6 text-blue-500" />
        </div>
      </motion.div>
      <h3 className="text-gray-800 font-medium mb-2">
        {isDragging ? 'Déposez vos images' : 'Glissez-déposez vos images ici'}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        ou{' '}
        <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
          parcourez vos fichiers
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={(e) => onFileSelect(Array.from(e.target.files))}
          />
        </label>
      </p>
      <p className="text-xs text-gray-400">PNG, JPG ou WEBP jusqu'à 10MB</p>
    </motion.div>
  );
};

export default DropZone;