
import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-16">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] bg-gradient-to-r from-[#4a90e2] via-purple-500 to-[#ff6b6b] bg-clip-text text-transparent"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <div className="w-24 h-1 bg-gradient-to-r from-[#4a90e2] to-[#ff6b6b] mx-auto mb-6"></div>
      )}
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-white/80 text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
