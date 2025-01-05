import React from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, ImageIcon } from 'lucide-react';

const ResultCard = ({ result, onDownload, onDelete, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <div className="font-medium text-gray-800">{result.fileName}</div>
          <div className="text-sm text-gray-500">
            {Math.round(result.optimizedSize / 1024)} KB
          </div>
          {result.dimensions && (
            <div className="text-xs text-gray-400">
              {result.dimensions.optimized.width} x {result.dimensions.optimized.height}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDownload(result)}
          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          title="Télécharger"
        >
          <Download className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(result)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Supprimer"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResultCard;