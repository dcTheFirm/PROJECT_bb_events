import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    title: "Classic Martini",
    category: "Cocktails"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1587223962930-cb7f31384c19?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    title: "Mixology Workshop",
    category: "Events"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    title: "Custom Bar Setup",
    category: "Services"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    title: "Signature Old Fashioned",
    category: "Cocktails"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1560963689-b5682b6440f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    title: "Corporate Event",
    category: "Events"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1530034424920-f7e0c9027397?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    title: "Ingredient Selection",
    category: "Services"
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');

  const filteredImages = filter === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  return (
    <section id="gallery" className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] text-white drop-shadow-lg">
            <span className="text-gradient">Our Gallery</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cocktail-amber to-cocktail-purple mx-auto mb-6"></div>
          <p className="text-white/80 text-lg drop-shadow-md">
            A showcase of our artistry and craft in mixology
          </p>
          <div className="flex justify-center mt-8 mb-12 space-x-4 flex-wrap">
            {['Cocktails', 'Events', 'Services'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full transition-all ${
                  filter === category 
                    ? 'bg-cocktail-gold text-black shadow-lg' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              layoutId={`image-${image.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-xl group shadow-lg"
              onClick={() => setSelectedImage(image.id)}
            >
              <img 
                src={image.src} 
                alt={image.title} 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-1 font-['Playfair_Display'] drop-shadow-md">{image.title}</h3>
                <p className="text-cocktail-gold drop-shadow-md">{image.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal for enlarged image */}
      {selectedImage !== null && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white p-2 rounded-full bg-black/50 z-10 hover:bg-black/80 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>
          <motion.div 
            layoutId={`image-${selectedImage}`}
            className="relative w-full max-w-4xl max-h-[80vh] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {galleryImages.find(img => img.id === selectedImage) && (
              <img 
                src={galleryImages.find(img => img.id === selectedImage)?.src} 
                alt={galleryImages.find(img => img.id === selectedImage)?.title} 
                className="w-full h-full object-contain"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Gallery;