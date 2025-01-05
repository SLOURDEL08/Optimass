import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, ImageDown, Crop, Image } from 'lucide-react';
import BatchSettings from './BatchSettings';
import CompressionSettings from './CompressionSettings';
import ResizeSettings from './ResizeSettings';
import WatermarkSettings from './WatermarkSettings';

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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {sections.find(s => s.id === activeSection)?.Component()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdvancedSettings;