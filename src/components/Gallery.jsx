
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Custom Signature Cocktails",
    category: "drinks"
  },
  {
    src: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Corporate Event Bar Setup",
    category: "events"
  },
  {
    src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Expert Mixology in Action",
    category: "bartenders"
  },
  {
    src: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Wedding Reception Service",
    category: "events"
  },
  {
    src: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Specialty Craft Cocktail",
    category: "drinks"
  },
  {
    src: "https://images.unsplash.com/photo-1574096079513-d8259312b785?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Interactive Cocktail Workshop",
    category: "workshops"
  },
  {
    src: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Premium Mobile Bar",
    category: "setups"
  },
  {
    src: "https://images.unsplash.com/photo-1560963689-b5682b6440f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Artisanal Mixology Tools",
    category: "tools"
  }
];

const filterCategories = [
  { id: "all", label: "All" },
  { id: "drinks", label: "Drinks" },
  { id: "events", label: "Events" },
  { id: "bartenders", label: "Bartenders" },
  { id: "workshops", label: "Workshops" },
  { id: "setups", label: "Setups" }
];

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("all");
  
  const filteredImages = filter === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);
  
  return (
    <section id="gallery" className="gallery py-24 bg-black relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair text-white">
            <span className="txt-gradient">Our Gallery</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber to-purple mx-auto mb-6"></div>
          <p className="text-white/80 text-lg mb-8">See our mixology artistry in action</p>
          
          {/* Filter buttons */}
          <div className="filters flex flex-wrap justify-center gap-2 mb-8">
            {filterCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  filter === category.id 
                    ? 'bg-gold text-black font-medium' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Gallery grid */}
        <div className="img-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="img-item aspect-square overflow-hidden rounded-xl glass-effect cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative h-full w-full overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.caption} 
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="caption absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <p className="p-4 text-white font-medium">{image.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Image modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="modal-img sm:max-w-4xl bg-black/90 border-gray-800">
            <div className="relative">
              <AspectRatio ratio={16/9} className="overflow-hidden rounded">
                {selectedImage && (
                  <img 
                    src={selectedImage.src} 
                    alt={selectedImage.caption} 
                    className="h-full w-full object-cover object-center"
                  />
                )}
              </AspectRatio>
              {selectedImage && (
                <p className="text-white mt-4 text-center">{selectedImage.caption}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

export default Gallery;
