
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const moveX = (clientX - centerX) / 50;
      const moveY = (clientY - centerY) / 50;
      
      const elements = heroRef.current.querySelectorAll('.parallax');
      
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const speed = parseFloat(htmlEl.getAttribute('data-speed') || '1');
        htmlEl.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black to-[#0D0D14] py-24"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="parallax absolute right-[20%] top-[30%] w-16 h-16 rounded-full bg-cocktail-amber/50 blur-xl" data-speed="2"></div>
        <div className="parallax absolute left-[25%] bottom-[40%] w-20 h-20 rounded-full bg-cocktail-purple/30 blur-xl" data-speed="1.5"></div>
        <div className="parallax absolute left-[60%] top-[20%] w-24 h-24 rounded-full bg-cocktail-gold/20 blur-xl" data-speed="3"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-['Playfair_Display'] tracking-tight text-white">
          <span className="block transform transition-all hover:scale-105 duration-300">Craft Cocktails</span>
          <span className="block text-gradient mt-2">&amp; Mixology Excellence</span>
        </h1>
        
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/80 mb-8 font-['Montserrat'] leading-relaxed">
          Elevate your events with our exceptional bartending services. 
          We craft unforgettable experiences through the art of mixology.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-cocktail-gold hover:bg-cocktail-gold/80 text-black px-8 py-6 rounded-full font-semibold text-lg transition-all hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] hover:scale-105"
            onClick={() => document.getElementById('booking')?.scrollIntoView()}
          >
            Book Our Service
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white/20 hover:border-white/40 bg-transparent hover:bg-white/5 text-white px-8 py-6 rounded-full font-semibold text-lg"
            onClick={() => document.getElementById('services')?.scrollIntoView()}
          >
            Explore Services
          </Button>
        </div>
        
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          onClick={() => document.getElementById('about')?.scrollIntoView()}
        >
          <ArrowDown className="text-white/70 hover:text-white transition-colors" />
        </div>
      </div>
      
      {/* Hero glasses decoration */}
      <div className="absolute -bottom-16 md:-bottom-24 w-full h-48 opacity-30 bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.2)_0%,_rgba(0,0,0,0)_70%)]"></div>
    </section>
  );
};

export default Hero;
