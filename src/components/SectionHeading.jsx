import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({ title, subtitle }) => {
  const words = title.split(' ');
  return (
    <div className="text-center mb-16">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.13,
            },
          },
        }}
        className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700"
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring' } },
            }}
            className="inline-block mr-2"
          >
            {word}
          </motion.span>
        ))}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, type: 'spring' }}
          viewport={{ once: true }}
          className="text-gray-400 text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
