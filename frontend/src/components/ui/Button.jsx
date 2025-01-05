import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white'
};

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        px-4 py-2 rounded-lg transition-colors
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;