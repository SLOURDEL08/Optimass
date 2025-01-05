import React from 'react';
import { motion } from 'framer-motion';

const Container = ({ children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden"
    >
      {children}
    </motion.div>
  );
};

export default Container;