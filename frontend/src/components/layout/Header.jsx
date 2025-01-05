import React from 'react';
import { motion } from 'framer-motion';
import { Settings2, ImageIcon, UserCircle2, UserCircle } from 'lucide-react';

const Header = () => {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="max-w-6xl mx-auto mb-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Optimass</h1>
        </div>
        <div className="flex gap-4">
          <button className="text-gray-600 hover:text-gray-800 transition-colors">
            <Settings2 className="w-6 h-6" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 transition-colors">
            <UserCircle className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;