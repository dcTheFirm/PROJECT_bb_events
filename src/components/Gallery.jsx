import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import SectionHeading from './SectionHeading';

const filterCategories = [
  { id: "elite-evenings", label: "Elite Evenings" },
  { id: "bar-elegance", label: "Bar Elegance" },
  { id: "crafted-space", label: "Crafted Space" },
  { id: "mix-in-motion", label: "Mix in Motion" }
];

const galleryImages = [
  // Elite Evenings
  {
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Custom Signature Cocktails",
    category: "elite-evenings"
  },
  // Bar Elegance
  {
    src: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Corporate Event Bar Setup",
    category: "bar-elegance"
  },
  // Crafted Space
  {
    src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Expert Mixology in Action",
    category: "crafted-space"
  },
  // Mix in Motion
  {
    src: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Wedding Reception Service",
    category: "mix-in-motion"
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("all");
  
  const filteredImages = filter
    ? galleryImages.filter(img => img.category === filter)
    : galleryImages;
  
  return (
    <section id="gallery" className="py-24 bg-black relative">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Our Gallery" 
          subtitle="See our mixology artistry in action" 
        />
        
        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filterCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all font-medium ${
                filter === category.id 
                  ? 'bg-gradient-to-r from-[#4a90e2] to-[#4a90e2]/80 text-white' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* Gallery grid */}
        <div className="img-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.src}
              className="img-item aspect-square overflow-hidden rounded-xl glass-effect cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative h-full w-full overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.caption} 
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                />
              </div>
            </div>
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
};

export default Gallery;
