import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return <section id="about" className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] text-transparent bg-clip-text bg-gradient-to-r from-[#4a90e2] to-[#ff6b6b]">
            About Us
          </h2>
          <p className="text-white/80 text-lg">Our story of passion for mixology and exceptional service</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center"> 
          <div className="relative">
            <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden glass-effect">
              
              <img src="D\Media\home_imgaes\home_image.webp" alt="Bartender crafting a cocktail" className="w-full h-full object-cover object-center" loading="lazy" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden rotate-12 glass-effect border border-white/20">
             
              <img src="" alt="Cocktail close-up" className="w-full h-full object-cover object-center" loading="lazy" />
            </div>
            
            <div className="absolute -top-6 -left-6 w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-cocktail-gold/20 glass-effect">
              
            </div>
          </div>
          
          <div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] text-[#b497bd]">
              Crafting Memorable Experiences Since <span className="text-white">2019</span>
            </h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              
Bartender Brothers is a premium bartending service founded by two passionate and skilled brothers, Ajay Choudhary and Anil Kalal. With a combined experience of over 17 years in leading bars and luxury hospitality venues, the duo launched Bartender Brothers in 2019 to bring creativity, professionalism, and flair to event bartending.


            </p>
            <p className="text-white/70 mb-6 leading-relaxed">
            From intimate gatherings to grand weddings, Bartender Brothers has become known for curated cocktail experiences, thematic bar setups, signature drinks, and a team that ensures every guest has a memorable sip. The company blends world-class mixology with Indian hospitality, offering both alcoholic and non-alcoholic bar solutions tailored to the occasion.

            </p>
            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#4a90e2]/80 mb-2">500+</div>
                <div className="text-white/100 text-sm uppercase tracking-wider">Events Catered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#4a90e2]/80 mb-2">50+</div>
                <div className="text-white/100 text-sm uppercase tracking-wider">Signature Cocktails</div>
              </div>
              <div className="text-center">
               <div className="text-4xl font-bold text-[#4a90e2]/80 mb-2">20+</div>
                <div className="text-white/100 text-sm uppercase tracking-wider">Expert Mixologists</div>
              </div>
              <div className="text-center">
               <div className="text-4xl font-bold text-[#4a90e2]/80 mb-2">98%</div>
                <div className="text-white/100 text-sm uppercase tracking-wider">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default About;
