import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChefHat, Award, Calendar, GlassWater, Coffee } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { createClient } from '@supabase/supabase-js';

const services = [
  {
    title: "Private Events",
    description: "Full-service bar setup for private parties, birthdays, and intimate gatherings.",
    icon: GlassWater,
    color: "from-gold to-amber"
  },
  {
    title: "Corporate Events",
    description: "Professional bartending services for corporate functions and business gatherings.",
    icon: Coffee,
    color: "from-purple to-deep-purple"
  },
  {
    title: "Weddings",
    description: "Customized bar services to match your special day, including signature cocktails.",
    icon: Calendar,
    color: "from-burgundy to-purple"
  },
  {
    title: "Cocktail Workshops",
    description: "Interactive mixology classes and cocktail-making workshops for groups.",
    icon: ChefHat,
    color: "from-amber to-whiskey"
  },
  {
    title: "Brightwood Institute",
    description: "We also offers coaching and training services through our partnership with Brightwood Institute.",
    icon: Award,
    color: "from-deep-purple to-purple"
  }
];

const supabaseUrl = 'https://sivcpdjtgysnryvfbcvw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdmNwZGp0Z3lzbnJ5dmZiY3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTEyOTQsImV4cCI6MjA2NDA4NzI5NH0.P30L2h9NnsnSccm5NXWeIEMldZ6Tb54uA4zxoaSES1s';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function Services() {
  const [servicesImage, setServicesImage] = useState({});

  useEffect(() => {
    async function fetchImage() {
      const { data, error } = await supabase
          .from('home-images') // <-- FIXED table name
        .select('url,position')
        .eq('section', 'services')
        .eq('position', 1)
        .limit(1);
      if (error) {
        console.error('Supabase fetch error:', error.message);
      }
      const imgMap = {};
      (data || []).forEach(img => {
        imgMap[img.position] = img.url;
      });
      setServicesImage(imgMap);
      console.log('Services image by position:', imgMap);
    }
    fetchImage();
  }, []);

  return (
    <section id="services" className="services py-24 bg-dark relative">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Our Services" 
          subtitle="Exceptional mixology services tailored to your needs" 
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            // For the last two items, center them in a row
            if (services.length === 5 && index === 3) {
              return (
                <div key="last-row" className="col-span-3 flex justify-center gap-8">
                  {[services[3], services[4]].map((srv, i) => (
                    <motion.div
                      key={srv.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: (index + i) * 0.1 }}
                      viewport={{ once: true }}
                      className="serv-card glass-effect rounded-2xl p-8 group hover:shadow-glow transition-all duration-300 hover:-translate-y-2 w-full max-w-md"
                    >
                      <div className={`icon-box w-16 h-16 mb-6 rounded-full flex items-center justify-center bg-gradient-to-br ${srv.color}`}>
                        <srv.icon size={32} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4 font-playfair">{srv.title}</h3>
                      <p className="text-white/70 mb-6">{srv.description}</p>
                      <ul className="feature-list space-y-2">
                        <li className="flex items-center text-white/60">
                          <Check size={18} className="text-gold mr-2" />
                          <span>Professional staff</span>
                        </li>
                        <li className="flex items-center text-white/60">
                          <Check size={18} className="text-gold mr-2" />
                          <span>Quality ingredients</span>
                        </li>
                        <li className="flex items-center text-white/60">
                          <Check size={18} className="text-gold mr-2" />
                          <span>Custom menus</span>
                        </li>
                      </ul>
                    </motion.div>
                  ))}
                </div>
              );
            }
            if (index > 3) return null;
            // For the first three items, render normally
            
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="serv-card glass-effect rounded-2xl p-8 group hover:shadow-glow transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`icon-box w-16 h-16 mb-6 rounded-full flex items-center justify-center bg-gradient-to-br ${service.color}`}>
                  <service.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-playfair">{service.title}</h3>
                <p className="text-white/70 mb-6">{service.description}</p>
                <ul className="feature-list space-y-2">
                  <li className="flex items-center text-white/60">
                    <Check size={18} className="text-gold mr-2" />
                    <span>Professional staff</span>
                  </li>
                  <li className="flex items-center text-white/60">
                    <Check size={18} className="text-gold mr-2" />
                    <span>Quality ingredients</span>
                  </li>
                  <li className="flex items-center text-white/60">
                    <Check size={18} className="text-gold mr-2" />
                    <span>Custom menus</span>
                  </li>
                </ul>
              </motion.div>
            );
          })}
        </div>
        
        {/* Feature callout */}
        <motion.div 
          className="callout mt-16 glass-effect rounded-2xl p-8 md:p-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl"></div>
          <div className="absolute left-1/2 top-0 w-32 h-32 rounded-full bg-purple/10 blur-3xl"></div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] text-[#b497bd]">
                Complete Event Experience
              </h2>
              <p className="text-white/70 mb-6">
                Beyond bartending, we provide a complete solution for your event's beverage needs. 
                From initial consultation to final service, we handle every aspect with professional care.
              </p>
              <ul className="feature-grid grid grid-cols-2 gap-4">
                {[
                  "Bar Setup & Breakdown",
                  "Custom Drink Menus",
                  "Professional Bartenders",
                  "Premium Glassware",
                  "Specialty Ice",
                  "Garnishes & Ingredients"
                ].map((item) => (
                  <li key={item} className="flex items-center text-white/60">
                    <Check size={18} className="text-gold mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-xl">
              {/* position 1 */}
              <img 
                src={servicesImage[1] || ""}
                alt="Full bar setup" 
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Services;
