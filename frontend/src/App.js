import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Container from './components/layout/Container';
import Tabs from './components/ui/Tabs';
import DropZone from './components/DropZone';
import QuickSettings from './components/QuickSettings';
import ResultsList from './components/ResultsList';
import { useImageOptimizer } from './hooks/useImageOptimizer';
import AdvancedSettings from './components/AdvancedSettings';

const TABS = [
  { id: 'upload', label: 'Optimisation' },
  { id: 'settings', label: 'Paramètres avancés' }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('upload');
  
  const {
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
  } = useImageOptimizer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Header />
      
      <Container>
        <Tabs 
          tabs={TABS} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        
        <AnimatePresence mode="wait">
          {activeTab === 'upload' ? (
            <div className="space-y-6 p-6">
              <DropZone 
                onFileSelect={handleFileSelect}
                filesCount={files.length}
                isProcessing={isProcessing}
              />

              <QuickSettings
                settings={settings}
                onChange={handleSettingsChange}
              />

              {results && (
                <ResultsList
                  results={results}
                  onDownloadAll={handleDownload}
                  onDownloadSingle={handleSingleDownload}
                  onDeleteSingle={handleSingleDelete}
                  onCleanAll={handleClean}
                />
              )}
            </div>
          ) : (
              <AdvancedSettings />

          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default App;