import React from 'react';

const RangeInput = ({ label, name, value, onChange, min, max }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full"
      />
      <span className="text-sm text-gray-500">{value}%</span>
    </div>
  );
};

export default RangeInput;