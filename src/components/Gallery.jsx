import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import SectionHeading from './SectionHeading';

// Example images for Showcases and Decores (replace with your real images)
const showcaseImages = [
  {
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    caption: "With Celebrity A"
  },
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    caption: "Working Style"
  },
  // ...add more showcase images as needed
];

const decoreSubcategories = [
  {
    id: "bar-setup",
    label: "Bar Setup",
    images: [
      {
        src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80",
        caption: "Bar Setup"
      }
    ]
  },
  {
    id: "de-tox-bar",
    label: "De-Tox Bar",
    images: [
      {
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        caption: "De-Tox Bar"
      }
    ]
  },
  {
    id: "champagne-tower",
    label: "Champagne Tower",
    images: [
      {
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
        caption: "Champagne Tower"
      }
    ]
  },
  {
    id: "custom-themes",
    label: "Custom Themes",
    images: [
      {
        src: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80",
        caption: "Custom Theme"
      }
    ]
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="gallery" className="py-24 bg-black relative">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Our Gallery" 
          subtitle="See our mixology artistry in action" 
        />

        {/* Showcases Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Showcases</h2>
          <div className="flex overflow-x-auto gap-4 pb-2">
            {showcaseImages.slice(0, 5).map((img, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 aspect-square overflow-hidden rounded-xl glass-effect cursor-pointer border border-white/10"
                onClick={() => setSelectedImage(img)}
                style={{ width: '180px', height: '180px', maxWidth: '90vw' }}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                />
                <div className="bg-black/60 text-white text-center py-1 text-xs">{img.caption}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Decores Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Decores</h2>
          <div className="space-y-12">
            {decoreSubcategories.map(subcat => (
              <div key={subcat.id}>
                <h3 className="text-white text-xl font-medium mb-4">{subcat.label}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {subcat.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square overflow-hidden rounded-xl glass-effect cursor-pointer border border-white/10"
                      onClick={() => setSelectedImage(img)}
                      style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}
                    >
                      <img
                        src={img.src}
                        alt={img.caption}
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                      />
                      <div className="bg-black/60 text-white text-center py-2">{img.caption}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image modal */}
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
