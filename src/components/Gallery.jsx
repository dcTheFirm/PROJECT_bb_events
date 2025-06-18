import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import SectionHeading from './SectionHeading';



//connecting with the supabase. 
 import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sivcpdjtgysnryvfbcvw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdmNwZGp0Z3lzbnJ5dmZiY3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTEyOTQsImV4cCI6MjA2NDA4NzI5NH0.P30L2h9NnsnSccm5NXWeIEMldZ6Tb54uA4zxoaSES1s';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


const showcaseSubcategories = [
  {
    id: "signature-cocktails",
    label: "Signature Cocktails",
    images: [
      {
        src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
        caption: "Signature Cocktail Creation"
      },
      {
        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        caption: "Professional Mixology"
      },
      {
        src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80",
        caption: "Event Showmanship"
      },
      {
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        caption: "Cocktail Masterclass"
      },
      {
        src: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
        caption: "Elegant Garnish"
      }
    ]
  },
  {
    id: "live-performance",
    label: "Live Performance",
    images: [
      {
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
        caption: "Live Performance"
      },
      {
        src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        caption: "Interactive Mixology"
      },
      {
        src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
        caption: "Entertainment"
      },
      {
        src: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
        caption: "Showmanship"
      },
      {
        src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
        caption: "Crowd Cheers"
      }
    ]
  }
];

const decoreSubcategories = [
  {
    id: "bar-setup",
    label: "Bar Setup",
    images: [
      {
        src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80",
        caption: "Premium Bar Setup"
      },
      {
        src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        caption: "Luxury Bar Design"
      },
      {
        src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
        caption: "Modern Bar Layout"
      },
      {
        src: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
        caption: "Elegant Bar Display"
      },
      {
        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        caption: "Classic Bar Ambience"
      }
    ]
  },
  {
    id: "de-tox-bar",
    label: "De-Tox Bar",
    images: [
      {
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        caption: "Healthy Refreshments"
      },
      {
        src: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
        caption: "Fresh Juice Station"
      },
      {
        src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        caption: "Wellness Bar"
      },
      {
        src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
        caption: "Healthy Mixology"
      },
      {
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
        caption: "Detox Delight"
      }
    ]
  },
  {
    id: "champagne-tower",
    label: "Champagne Tower",
    images: [
      {
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
        caption: "Grand Champagne Display"
      },
      {
        src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        caption: "Elegant Tower Setup"
      },
      {
        src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
        caption: "Celebration Tower"
      },
      {
        src: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
        caption: "Luxury Champagne Service"
      },
      {
        src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80",
        caption: "Sparkling Toast"
      }
    ]
  },
  {
    id: "custom-themes",
    label: "Custom Themes",
    images: [
      {
        src: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80",
        caption: "Tropical Paradise"
      },
      {
        src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        caption: "Vintage Elegance"
      },
      {
        src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
        caption: "Modern Minimalist"
      },
      {
        src: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
        caption: "Luxury Gold Theme"
      },
      {
        src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
        caption: "Theme Night"
      }
    ]
  }
];

const customizationsSubcategories = [
  {
    id: "signature-cocktails-custom",
    label: "Signature Cocktails",
    images: [
      {
        src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
        caption: "Custom Signature Drinks"
      },
      {
        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        caption: "Unique Creations"
      },
      {
        src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80",
        caption: "Personalized Mixology"
      },
      {
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        caption: "Custom Recipes"
      },
      {
        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        caption: "Signature Twist"
      }
    ]
  },
  {
    id: "personalized-menus",
    label: "Personalized Drink Menus",
    images: [
      {
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
        caption: "Custom Menu Design"
      },
      {
        src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        caption: "Branded Menus"
      },
      {
        src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
        caption: "Event-Specific Menus"
      },
      {
        src: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
        caption: "Custom Listings"
      },
      {
        src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80",
        caption: "Menu Artistry"
      }
    ]
  },
  {
    id: "fruits-customs",
    label: "Fruits & Customs",
    images: [
      {
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        caption: "Fresh Fruit Garnishes"
      },
      {
        src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        caption: "Custom Decorations"
      },
      {
        src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
        caption: "Seasonal Fruits"
      },
      {
        src: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
        caption: "Artistic Arrangements"
      },
      {
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
        caption: "Fruit Fusion"
      }
    ]
  },
  {
    id: "sober-sips",
    label: "Sober Sips",
    images: [
      {
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        caption: "Mocktail Creations"
      },
      {
        src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        caption: "Non-Alcoholic Options"
      },
      {
        src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
        caption: "Healthy Alternatives"
      },
      {
        src: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
        caption: "Zero-Proof Mixology"
      },
      {
        src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        caption: "Sober Sparkle"
      }
    ]
  }
];

// Add a new video section data
const videoGallery = [
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Mixology in Motion"
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    caption: "Cocktail Pouring Art"
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Event Highlights"
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    caption: "Bar Showreel"
  },
  {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Signature Serve"
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeSection, setActiveSection] = useState('showcases');

  // AnimatedSubHeading: light pink line, more space between sub-headings
  const AnimatedSubHeading = ({ children }) => {
    const [showLine, setShowLine] = React.useState(false);
    const [hideLine, setHideLine] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
      const node = ref.current;
      if (!node) return;
      if (hideLine) return;
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !showLine && !hideLine) {
            setShowLine(true);
            setTimeout(() => {
              setShowLine(false);
              setHideLine(true);
            }, 1200);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }, [showLine, hideLine]);

    return (
      <h3
        ref={ref}
        className="text-white text-xl font-medium mb-12 relative group inline-block transition-colors duration-300"
      >
        <span className="relative inline-block">
          {children}
          <span
            className="absolute left-0 -bottom-1 rounded transition-all duration-300"
            style={{
              backgroundColor: 'rgba(236, 72, 153, 0.4)', // light pink with opacity
              height: '3px',
              width: showLine ? '100%' : '0',
              opacity: hideLine ? 0 : 1,
              transitionProperty: 'width,opacity,background-color',
            }}
          />
        </span>
      </h3>
    );
  };

  return (
    <section id="gallery" className="py-24 bg-black relative">
      <div className="container mx-auto px-4">
        {/* <SectionHeading 
          title="Our Gallery" 
          subtitle="See our mixology artistry in action" 
        /> */}

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveSection('showcases')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              activeSection === 'showcases'
                ? 'bg-white text-black font-medium'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Showcases
          </button>
          <button
            onClick={() => setActiveSection('decores')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              activeSection === 'decores'
                ? 'bg-white text-black font-medium'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Decores
          </button>
          <button
            onClick={() => setActiveSection('customizations')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              activeSection === 'customizations'
                ? 'bg-white text-black font-medium'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Customizations
          </button>
          <button
            onClick={() => setActiveSection('videos')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              activeSection === 'videos'
                ? 'bg-white text-black font-medium'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Videos
          </button>
        </div>

        {/* Showcases Section */}
        {activeSection === 'showcases' && (
          <div>
            <div className="space-y-8">
              {showcaseSubcategories.map(subcat => (
                <div key={subcat.id}>
                  <AnimatedSubHeading>{subcat.label}</AnimatedSubHeading>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {subcat.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square overflow-hidden rounded-xl glass-effect cursor-pointer border border-white/10 transition-all duration-300 hover:scale-105 hover:border-white/30 group relative"
                        onClick={() => setSelectedImage(img)}
                        style={{ width: '100%', maxWidth: '300px', height: '250px' }}
                      >
                        <img
                          src={img.src}
                          alt={img.caption}
                          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="bg-black/60 text-white text-center py-2">
                          {img.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decores Section */}
        {activeSection === 'decores' && (
          <div>
            <div className="space-y-8">
              {decoreSubcategories.map(subcat => (
                <div key={subcat.id}>
                  <AnimatedSubHeading>{subcat.label}</AnimatedSubHeading>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {subcat.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square overflow-hidden rounded-xl glass-effect cursor-pointer border border-white/10 transition-all duration-300 hover:scale-105 hover:border-white/30 group relative"
                        onClick={() => setSelectedImage(img)}
                        style={{ width: '100%', maxWidth: '300px', height: '250px' }}
                      >
                        <img
                          src={img.src}
                          alt={img.caption}
                          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="bg-black/60 text-white text-center py-2">
                          {img.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customizations Section */}
        {activeSection === 'customizations' && (
          <div>
            <div className="space-y-8">
              {customizationsSubcategories.map(subcat => (
                <div key={subcat.id}>
                  <AnimatedSubHeading>{subcat.label}</AnimatedSubHeading>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {subcat.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square overflow-hidden rounded-xl glass-effect cursor-pointer border border-white/10 transition-all duration-300 hover:scale-105 hover:border-white/30 group relative"
                        onClick={() => setSelectedImage(img)}
                        style={{ width: '100%', maxWidth: '300px', height: '250px' }}
                      >
                        <img
                          src={img.src}
                          alt={img.caption}
                          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="bg-black/60 text-white text-center py-2">
                          {img.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {activeSection === 'videos' && (
          <div>
            <div className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videoGallery.map((vid, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-black/80 to-gray-900 border border-white/10 group transition-all duration-300 flex flex-col items-center hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-gradient-to-r hover:from-pink-500 hover:to-yellow-500"
                  >
                    <div className="relative w-full h-56 flex items-center justify-center bg-black">
                      <video
                        src={vid.src}
                        controls
                        className="w-full h-56 object-cover object-center group-hover:brightness-75 transition duration-300"
                        poster="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80"
                      />
                    </div>
                    <div className="w-full bg-gradient-to-r from-black/80 to-gray-900 text-white text-center py-3 text-base font-semibold tracking-wide border-t border-white/10">
                      {vid.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
                <p className="text-white mt-4 text-center text-lg font-medium">{selectedImage.caption}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
