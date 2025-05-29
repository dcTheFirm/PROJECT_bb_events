import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const galleryCategories = [
  {
    id: "Decores",
    label: "Decores",
    subcategories: [
      { id: "bar-setup", label: "Bar -setup", images: [ "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"] [ "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"]  },

      { id: "champagne-tower", label: "Champagne Tower", images: [ "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"] },
      { id: "de-tox-bar", label: "De-Tox Bar", images: [ "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"] },
      { id: "theme-bar-setup", label: "Theme bar -setup", images: [ "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"] }
    ]
  },
  {
    id: "Customizations",
    label: "Customizations",
    subcategories: [
      { id: "signature-cocktails", label: "Signature Cocktails", images: [ "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"] },
      { id: "personalized-drink-menus", label: "Personalized Drink Menus", images: [ "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"] },
      { id: "alcoholic-non-alcoholic", label: "Alcoholic & Non-Alcoholic Options", images: [ "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"] },
      { id: "fruits-customs", label: "Fruits & Customs", images: [ "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"] }
    ]
  },
  { id: "Videos", label: "Videos", subcategories: [] }
];

// Updated gallery images array with the provided image for all categories
const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Bar Setup",
    category: "bar-setup"
  },
  {
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Champagne Tower",
    category: "champagne-tower"
  },
  {
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "De-Tox Bar",
    category: "de-tox-bar"
  },
  {
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Theme Bar Setup",
    category: "theme-bar-setup"
  },
  {
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Signature Cocktails",
    category: "signature-cocktails"
  },
  {
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Personalized Drink Menus",
    category: "personalized-drink-menus"
  },
  {
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Alcoholic & Non-Alcoholic Options",
    category: "alcoholic-non-alcoholic"
  },
  {
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    caption: "Fruits & Customs",
    category: "fruits-customs"
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Decores");
  // Track current index for each subcategory
  const [subcategoryIndices, setSubcategoryIndices] = useState({});
  
  const getImagesForSubcategory = (subcategoryId) => {
    return galleryImages.filter(img => img.category === subcategoryId);
  };
  
  const activeGalleryCategory = galleryCategories.find(cat => cat.id === activeCategory) || galleryCategories[0];
  
  // Navigation for subcategory images
  const handlePrevSubcategory = (subcategoryId) => {
    setSubcategoryIndices(prev => ({
      ...prev,
      [subcategoryId]: prev[subcategoryId] ? (prev[subcategoryId] - 1 + 4) % 4 : 3
    }));
  };
  
  const handleNextSubcategory = (subcategoryId) => {
    setSubcategoryIndices(prev => ({
      ...prev,
      [subcategoryId]: prev[subcategoryId] ? (prev[subcategoryId] + 1) % 4 : 1
    }));
  };
  
  return (
    <section id="gallery" className="py-24 bg-black relative">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Our Gallery" 
          subtitle="See our mixology artistry in action" 
        />
        
        {/* Category buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {galleryCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all font-medium ${
                activeCategory === category.id 
                  ? 'bg-gradient-to-r from-[#4a90e2] to-[#4a90e2]/80 text-white' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* Subcategory sections */}
        <div className="space-y-12">
          {activeGalleryCategory.subcategories.map(subcategory => (
            <div key={subcategory.id} className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-xl font-medium">{subcategory.label}</h3>
                {/* Remove previous navigation buttons here */}
              </div>
              
              {/* Image grid for each subcategory */}
              <div className="relative flex items-center">
                {/* Left navigation button */}
                <button
                  onClick={() => handlePrevSubcategory(subcategory.id)}
                  className="absolute left-0 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 shadow-lg transition-colors"
                  aria-label={`Previous ${subcategory.label} images`}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronLeft size={20} />
                </button>
                {/* Images row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mx-12">
                  {[...Array(4)].map((_, index) => {
                    const subcategoryImages = getImagesForSubcategory(subcategory.id);
                    const image = subcategoryImages[index];
                    return (
                      <div 
                        key={index}
                        className="aspect-square overflow-hidden rounded-xl glass-effect cursor-pointer border border-white/10"
                        onClick={() => image && setSelectedImage(image)}
                        style={{ width: '300px', height: '300px', maxWidth: '100%' }}
                      >
                        {image ? (
                          <div className="relative h-full w-full overflow-hidden">
                            <img 
                              src={image.src} 
                              alt={image.caption} 
                              className="h-full w-full object-cover object-center"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            {/* Empty slot */}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Right navigation button */}
                <button
                  onClick={() => handleNextSubcategory(subcategory.id)}
                  className="absolute right-0 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 shadow-lg transition-colors"
                  aria-label={`Next ${subcategory.label} images`}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Image modal without navigation buttons */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="modal-img sm:max-w-4xl bg-black/90 border-gray-800 relative">
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
