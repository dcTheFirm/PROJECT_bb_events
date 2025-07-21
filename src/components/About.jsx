import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const About = () => {
  const [aboutImages, setAboutImages] = useState({});

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase
        .from('home-images') 
        .select('url,position')
        .eq('section', 'about')
        .in('position', [1, 2, 3]);
      if (error) {
        console.error('Supabase fetch error:', error.message);
      }
      // use direct link to the image
      const imgMap = {};
      (data || []).forEach(img => {
        imgMap[img.position] = img.url || '';
      });
      setAboutImages(imgMap);
      console.log('About images by position:', imgMap);
    }
    fetchImages();
  }, []);

  return <motion.section 
    id="about" 
    className="py-24 bg-black relative overflow-hidden"
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    viewport={{ once: true }}
  >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4 font-['Playfair_Display'] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 tracking-tight drop-shadow-lg">
            <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text font-extrabold">
              Abo
            </span>
            <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 text-transparent bg-clip-text font-bold">
              ut Us
            </span>
          </h3>
          <p className="text-gray-400 text-lg">Our story of passion for mixology and exceptional service</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center"> 
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden glass-effect">
              {/* position 1 */}
              <img src={aboutImages[1] || ""} alt="Bartender crafting a cocktail" className="w-full h-full object-cover object-center" loading="lazy" />
            </div>




            <div className="absolute -top-6 -left-6 w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-cocktail-gold/10 glass-effect">
              {/* position 3 */}
              <img src={aboutImages[3] || ""} alt="" />
            </div>
          </motion.div>
          

          
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700">
              Crafting Memorable Experiences Since <span className="text-gray-200">2019</span>
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Bartender Brothers is a premium bartending service founded by two passionate and skilled brothers, Ajay Choudhary and Anil Kalal. With a combined experience of over 17 years in leading bars and luxury hospitality venues, the duo launched Bartender Brothers in 2019 to bring creativity, professionalism, and flair to event bartending.
            </p>
            <p className="text-gray-400 mb-6 leading-relaxed">
            From intimate gatherings to grand weddings, Bartender Brothers has become known for curated cocktail experiences, thematic bar setups, signature drinks, and a team that ensures every guest has a memorable sip. The company blends world-class mixology with Indian hospitality, offering both alcoholic and non-alcoholic bar solutions tailored to the occasion.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-10">
              {[{label:'Events Catered',value:'200+'},{label:'Signature Cocktails',value:'25+'},{label:'Expert Mixologists',value:'10+'},{label:'Client Satisfaction',value:'98%'}].map((stat,i)=>(
                <motion.div 
                  key={stat.label} 
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 + i*0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl font-bold text-gray-400 mb-2">{stat.value}</div>
                  <div className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>;
};

export default About;
