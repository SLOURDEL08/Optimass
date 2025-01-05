import React from 'react';

const RangeSlider = ({ 
  label, 
  name, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  showValue = false,
  suffix = '' 
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="font-medium text-gray-700">{label}</label>
        {showValue && (
          <span className="text-sm text-gray-500">
            {value}{suffix}
          </span>
        )}
      </div>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );
};

export default RangeSlider;