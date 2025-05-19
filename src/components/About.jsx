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
              
              <img src="/Media/decores/IMG_4609.webp" alt="Bartender crafting a cocktail" className="w-full h-full object-cover object-center" loading="lazy" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden rotate-12 glass-effect border border-white/20">
             
              <img src="/Media/Ourworks/DSC06172.webp" alt="Cocktail close-up" className="w-full h-full object-cover object-center" loading="lazy" />
            </div>
            
            <div className="absolute -top-6 -left-6 w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-cocktail-gold/20 glass-effect">
              
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold mb-6 text-white">
              Crafting Memorable Experiences Since <span className="text-cocktail-gold">2020</span>
            </h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Welcome to Bartender Brothers—where craft meets charisma, and every pour is a masterpiece! Founded in 2020 by two bartending visionaries, " Ajay and Anil " ,in the heart of Udaipur. 
            </p>
            <p className="text-white/70 mb-6 leading-relaxed">
             we turned our obsession with mixology into an experience that ignites taste buds and sets the vibe for unforgettable moments. We're not just bartenders—we're creators, storytellers, and the secret ingredient to every epic celebration.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="text-center">
                <div className="text-4xl font-bold text-cocktail-gold mb-2">500+</div>
                <div className="text-white/60 text-sm uppercase tracking-wider">Events Catered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cocktail-gold mb-2">50+</div>
                <div className="text-white/60 text-sm uppercase tracking-wider">Signature Cocktails</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cocktail-gold mb-2">20+</div>
                <div className="text-white/60 text-sm uppercase tracking-wider">Expert Mixologists</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cocktail-gold mb-2">98%</div>
                <div className="text-white/60 text-sm uppercase tracking-wider">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default About;
