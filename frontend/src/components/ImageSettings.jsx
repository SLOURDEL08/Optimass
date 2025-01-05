import React from 'react';
import RangeInput from './ui/RangeInput';
import Select from './ui/Select';
import Input from './ui/Input';

const ImageSettings = ({ settings, onChange }) => {
  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-lg font-semibold">Paramètres</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <RangeInput
          label="Qualité (%)"
          name="quality"
          min="1"
          max="100"
          value={settings.quality}
          onChange={onChange}
        />

        <RangeInput
          label="Échelle (%)"
          name="scale"
          min="1"
          max="100"
          value={settings.scale}
          onChange={onChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Format de sortie"
          name="format"
          value={settings.format}
          onChange={onChange}
          options={[
            { value: 'webp', label: 'WebP' },
            { value: 'jpeg', label: 'JPEG' },
            { value: 'png', label: 'PNG' },
          ]}
        />

        <Input
          type="number"
          label="Largeur max (px)"
          name="maxWidth"
          value={settings.maxWidth}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default ImageSettings;