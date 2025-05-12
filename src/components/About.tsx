import React from 'react';
import { motion } from 'framer-motion';
const About = () => {
  return <section id="about" className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] text-white">
            <span className="text-gradient">About Us</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cocktail-amber to-cocktail-purple mx-auto mb-6"></div>
          <p className="text-white/80 text-lg">Our story of passion for mixology and exceptional service</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden glass-effect">
              <img src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" alt="Bartender crafting a cocktail" className="w-full h-full object-cover object-center" loading="lazy" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden rotate-12 glass-effect border border-white/20">
              <img src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Cocktail close-up" className="w-full h-full object-cover object-center" loading="lazy" />
            </div>
            <div className="absolute -top-6 -left-6 w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-cocktail-gold/20 glass-effect">
              <img alt="Ingredients" loading="lazy" className="w-full h-full object-center object-cover" src="/lovable-uploads/f9d50935-b0c7-46b4-80b4-5d421ceb7c21.jpg" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold mb-6 text-white">
              Crafting Memorable Experiences Since <span className="text-cocktail-gold">2020</span>
            </h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Mixology Masters began with a simple idea – to elevate events through exceptional 
              bartending. What started as a small team of passionate bartenders has grown into 
              a premier service trusted by clients across the country.
            </p>
            <p className="text-white/70 mb-6 leading-relaxed">
              Our approach combines technical expertise with artistic flair, creating signature 
              cocktails that delight the senses and become the highlight of any event. From 
              intimate gatherings to grand celebrations, we bring sophistication and style to 
              your occasion.
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