
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Emily Johnson",
    role: "Event Planner",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    quote: "Mixology Masters transformed our corporate event with their exceptional service. The custom cocktails were a hit with our clients, and the bartenders were professional, knowledgeable, and engaging."
  },
  {
    id: 2,
    name: "Michael Garcia",
    role: "Wedding Client",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    quote: "Hiring Mixology Masters was the best decision we made for our wedding. Their signature cocktails were stunning, and they accommodated all our guests' preferences. Everyone is still talking about the drinks!"
  },
  {
    id: 3,
    name: "Sarah Williams",
    role: "Restaurant Owner",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    quote: "We brought in the team to help develop our seasonal cocktail menu, and the results exceeded our expectations. Their creativity and expertise significantly boosted our beverage program."
  },
  {
    id: 4,
    name: "David Chen",
    role: "Birthday Celebration",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    quote: "The mixology workshop was the highlight of my birthday celebration. Everyone had a blast learning to make cocktails, and the bartenders made it fun and accessible for all skill levels."
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setIsAutoplay(false);
  };
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setIsAutoplay(false);
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoplay(false);
  };
  
  useEffect(() => {
    if (!isAutoplay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoplay]);

  return (
    <section id="reviews" className="py-24 bg-gradient-to-b from-[#0D0D14] to-black relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] text-white">
            <span className="text-gradient">Client Reviews</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cocktail-amber to-cocktail-purple mx-auto mb-6"></div>
          <p className="text-white/80 text-lg">What our clients say about our services</p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-6 lg:-ml-12 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-6 lg:-mr-12 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Testimonials slider */}
          <div 
            ref={sliderRef} 
            className="overflow-hidden rounded-2xl glass-effect p-8 md:p-12"
          >
            <div 
              className="transition-transform duration-500 ease-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              <div className="flex">
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="w-full flex-shrink-0"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 mb-6 rounded-full overflow-hidden border-2 border-cocktail-gold">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={18} 
                            className="text-cocktail-gold" 
                            fill="#FFA500"
                          />
                        ))}
                      </div>
                      <blockquote className="text-white/80 text-lg italic mb-6">
                        "{testimonial.quote}"
                      </blockquote>
                      <cite className="not-italic">
                        <div className="font-bold text-white text-lg">{testimonial.name}</div>
                        <div className="text-cocktail-gold">{testimonial.role}</div>
                      </cite>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Dots navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-cocktail-gold' : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
