import React from 'react';

const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options,
  className = '' 
}) => {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full bg-white border border-gray-200 rounded-lg px-3 py-2
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${className}
        `}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;