import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResultCard from './ResultCard';
import Button from './ui/Button';

const ResultsList = ({ results, onDownloadAll, onDownloadSingle, onDeleteSingle, onCleanAll }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Résultats</h3>
        <div className="flex gap-3">
          <Button onClick={onDownloadAll} variant="primary">
            Télécharger tout
          </Button>
          <Button onClick={onCleanAll} variant="danger">
            Tout nettoyer
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {results.map((result, index) => (
          <ResultCard
            key={result.fileName}
            result={result}
            index={index}
            onDownload={() => onDownloadSingle(result)}
            onDelete={() => onDeleteSingle(result)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultsList;