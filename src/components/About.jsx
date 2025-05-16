import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

function About() {
  return (
    <section id="about" className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="About Us" 
          subtitle="Our story of passion for mixology and exceptional service" 
        />
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="img-container relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden glass-effect">
              <img 
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Bartender crafting a cocktail" 
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <div className="img-accent absolute -bottom-8 -right-8 w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden rotate-12 glass-effect border border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1125&q=80" 
                alt="Cocktail close-up" 
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            
            <div className="img-accent absolute -top-6 -left-6 w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-gold/20 glass-effect">
              <img 
                src="https://images.unsplash.com/photo-1560963689-b5682b6440f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=986&q=80" 
                alt="Bartending tools" 
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold mb-6 bg-gradient-to-r from-[#4a90e2] to-[#ff6b6b] bg-clip-text text-transparent">
              Crafting Memorable Experiences Since <span className="text-[#4a90e2]">2020</span>
            </h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Welcome to Bartender Brothers—where craft meets charisma, and every pour is a masterpiece! Founded by two bartending visionaries, "Ajay and Anil", in the heart of Udaipur.
            </p>
            <p className="text-white/70 mb-6 leading-relaxed">
              We're not just bartenders—we're creators, storytellers, and the secret ingredient to every epic celebration. Our team combines technical expertise with flair and personality to deliver drinks that aren't just served—they're performed.
            </p>
            <div className="stats grid grid-cols-2 gap-6 mt-10">
              <div className="text-center">
                <div className="text-4xl font-bold text-gold mb-2">500+</div>
                <div className="text-white/60 text-sm uppercase tracking-wider">Events Catered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold mb-2">50+</div>
                <div className="text-white/60 text-sm uppercase tracking-wider">Signature Cocktails</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold mb-2">20+</div>
                <div className="text-white/60 text-sm uppercase tracking-wider">Expert Mixologists</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold mb-2">98%</div>
                <div className="text-white/60 text-sm uppercase tracking-wider">Client Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
