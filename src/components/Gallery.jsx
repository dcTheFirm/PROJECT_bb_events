import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import SectionHeading from './SectionHeading';
import { supabase } from '../lib/supabaseClient';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]); // fetched from supabase
  const [activeCategory, setActiveCategory] = useState(null);
  const [sections, setSections] = useState([]); // fetched from supabase
  const [images, setImages] = useState({}); // { section_id: [images] }

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      let { data } = await supabase
        .from('gallery_categories')
        .select('*')
        .order('position', { ascending: true });
      setCategories(data || []);
      if (data && data.length > 0 && !activeCategory) {
        setActiveCategory(data[0].key);
      }
    }
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  // Fetch sections for the active category
  useEffect(() => {
    if (!activeCategory) {
      setSections([]);
      return;
    }
    async function fetchSections() {
      let { data } = await supabase
        .from('gallery_sections')
        .select('*')
        .eq('category', activeCategory)
        .order('position', { ascending: true });
      setSections(data || []);
    }
    fetchSections();
  }, [activeCategory]);

  // Fetch images for all sections
  useEffect(() => {
    if (!sections.length) {
      setImages({});
      return;
    }
    async function fetchImages() {
      let sectionIds = sections.map(s => s.id);
      let { data } = await supabase
        .from('gallery_images')
        .select('*')
        .in('section_id', sectionIds)
        .order('position', { ascending: true });
      const grouped = {};
      (data || []).forEach(img => {
        if (!grouped[img.section_id]) grouped[img.section_id] = [];
        grouped[img.section_id].push(img);
      });
      setImages(grouped);
    }
    fetchImages();
  }, [sections]);

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
          
        </span>
      </h3>
    );
  };

  return (
    <section id="gallery" className="py-24 bg-black relative">
      <div className="container mx-auto px-4">
        {/* <SectionHeading title="Gallery" subtitle="Our Work & Memories" /> */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold font-['Playfair_Display'] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 drop-shadow-lg">
            <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text font-extrabold">
               Our Ga
            </span>
            <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 text-transparent bg-clip-text font-bold">
              llery
            </span>
          </h2>
          <p className="text-gray-400 text-lg mt-2">Our Work & Memories</p>
        </div>
        {/* Navigation Buttons */}
        {categories.length > 0 ? (
          <div className="flex justify-center gap-4 mb-12">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md focus:outline-none ${
                  activeCategory === cat.key
                    ? 'bg-white text-black font-bold scale-105'
                    : 'bg-black/30 text-white hover:bg-black/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12 text-xl">No categories found. Please add a category in the admin panel.</div>
        )}
        {/* Dynamic Sections */}
        <div className="space-y-16">
          {sections.length > 0 ? (
            sections.map(section => (
              <div key={section.id} className="mb-12">
                <AnimatedSubHeading>{section.title}</AnimatedSubHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                  {(images[section.id] || []).length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-8 text-lg">No images found for this section.</div>
                  )}
                  {(images[section.id] || []).map((img, idx) => (
                    <div
                      key={img.id}
                      className="aspect-square overflow-hidden rounded-lg bg-black/40 border border-white/10 shadow-lg cursor-pointer group relative transition-shadow duration-300 flex items-center justify-center"
                      onClick={() => setSelectedImage(img)}
                      style={{ width: '100%' }}
                    >
                      <img
                        src={img.image_url}
                        alt="Gallery image"
                        className="w-full h-full object-cover object-center rounded-lg transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            categories.length > 0 && <div className="text-center text-gray-400 py-12 text-xl">No sections found for this category.</div>
          )}
        </div>
        {/* Image modal only */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="modal-img sm:max-w-4xl bg-black/90 border-gray-800 relative">
            <div className="relative">
              <AspectRatio ratio={16/9} className="overflow-hidden rounded">
                {selectedImage && (
                  <img
                    src={selectedImage.image_url}
                    alt="Gallery image"
                    className="h-full w-full object-cover object-center"
                  />
                )}
              </AspectRatio>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
