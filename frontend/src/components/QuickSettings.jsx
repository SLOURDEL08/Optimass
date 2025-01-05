import React from 'react';
import { motion } from 'framer-motion';
import RangeSlider from './ui/RangeSlider';
import Select from './ui/Select';

const QuickSettings = ({ settings, onChange }) => {
  const formatOptions = [
    { value: 'webp', label: 'WebP' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <motion.div whileHover={{ y: -2 }} className="p-4 bg-gray-50 rounded-lg">
        <RangeSlider
          label="Qualité"
          name="quality"
          value={settings.quality}
          onChange={onChange}
          min={1}
          max={100}
          showValue
          suffix="%"
        />
      </motion.div>

      <motion.div whileHover={{ y: -2 }} className="p-4 bg-gray-50 rounded-lg">
        <Select
          label="Format"
          name="format"
          value={settings.format}
          onChange={onChange}
          options={formatOptions}
        />
      </motion.div>

      <motion.div whileHover={{ y: -2 }} className="p-4 bg-gray-50 rounded-lg">
        <RangeSlider
          label="Échelle"
          name="scale"
          value={settings.scale}
          onChange={onChange}
          min={1}
          max={100}
          showValue
          suffix="%"
        />
      </motion.div>

      <motion.div whileHover={{ y: -2 }} className="p-4 bg-gray-50 rounded-lg">
        <div className="font-medium text-gray-700 mb-2">Largeur max</div>
        <input
          type="number"
          name="maxWidth"
          value={settings.maxWidth}
          onChange={onChange}
          className="w-full bg-white border border-gray-200 rounded px-2 py-1"
        />
      </motion.div>
    </div>
  );
};

export default QuickSettings;