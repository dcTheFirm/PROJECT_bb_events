import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import SectionHeading from './SectionHeading';

import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://sivcpdjtgysnryvfbcvw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdmNwZGp0Z3lzbnJ5dmZiY3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTEyOTQsImV4cCI6MjA2NDA4NzI5NH0.P30L2h9NnsnSccm5NXWeIEMldZ6Tb54uA4zxoaSES1s';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeSection, setActiveSection] = useState('showcases');
  const [sections, setSections] = useState([]); // fetched from supabase
  const [images, setImages] = useState({}); // { section_id: [images] }

  // Fetch sections
  useEffect(() => {
    async function fetchSections() {
      let { data } = await supabase
        .from('gallery_sections')
        .select('*')
        .order('position', { ascending: true });
      setSections(data || []);
    }
    fetchSections();
  }, []);

  // Fetch images for all sections
  useEffect(() => {
    async function fetchImages() {
      let { data } = await supabase
        .from('gallery_images')
        .select('*')
        .order('position', { ascending: true });
      // Group by section_id
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
          <span
            className="absolute left-0 -bottom-1 rounded transition-all duration-300"
            style={{
              backgroundColor: 'rgba(236, 72, 153, 0.4)',
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

  // Section mapping for navigation
  const sectionTabs = [
    { key: 'showcases', label: 'Showcases' },
    { key: 'decores', label: 'Decores' },
    { key: 'customizations', label: 'Customizations' },
    { key: 'videos', label: 'Videos' },
  ];

  // Map section names to DB titles
  const sectionTitleMap = {
    showcases: ["Signature Cocktails", "Live Performance"],
    decores: ["Bar Setup", "De-Tox Bar", "Champagne Tower", "Custom Themes"],
    customizations: ["Signature Cocktails", "Personalized Drink Menus", "Fruits & Customs", "Sober Sips"],
  };

  return (
    <section id="gallery" className="py-24 bg-black relative">
      <div className="container mx-auto px-4">
        <SectionHeading title="Gallery" subtitle="Our Work & Memories" />
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          {sectionTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                activeSection === tab.key
                  ? 'bg-white text-black font-bold scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Dynamic Sections */}
        {activeSection !== 'videos' && (
          <div className="space-y-16">
            {sections
              .filter(sec => sectionTitleMap[activeSection]?.includes(sec.title))
              .map(section => (
                <div key={section.id} className="mb-12">
                  <AnimatedSubHeading>{section.title}</AnimatedSubHeading>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {(images[section.id] || []).length === 0 && (
                      <div className="col-span-full text-center text-gray-400 py-8 text-lg">No images found for this section.</div>
                    )}
                    {(images[section.id] || []).map((img, idx) => (
                      <div
                        key={img.id}
                        className="aspect-square overflow-hidden rounded-xl bg-gray-900 border border-white/10 shadow-lg cursor-pointer group relative hover:scale-105 transition-transform duration-300"
                        onClick={() => setSelectedImage(img)}
                        style={{ width: '100%', maxWidth: '300px', height: '250px' }}
                      >
                        <img
                          src={img.image_url}
                          alt={img.subheading}
                          className="h-full w-full object-cover object-center"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center py-2 text-base font-medium">
                          {img.subheading}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            {sections.filter(sec => sectionTitleMap[activeSection]?.includes(sec.title)).length === 0 && (
              <div className="text-center text-gray-400 py-12 text-xl">No sections found for this category.</div>
            )}
          </div>
        )}
        {/* Videos Section (static for now) */}
        {activeSection === 'videos' && (
          <div>
            <div className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* You can fetch videos from Supabase if you add a table for them */}
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
                    src={selectedImage.image_url}
                    alt={selectedImage.subheading}
                    className="h-full w-full object-cover object-center"
                  />
                )}
              </AspectRatio>
              {selectedImage && (
                <p className="text-white mt-4 text-center text-lg font-medium">{selectedImage.subheading}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
