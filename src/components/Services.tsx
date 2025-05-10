
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChefHat, Award, Calendar, GlassWater, Coffee } from 'lucide-react';

const services = [
  {
    title: "Private Events",
    description: "Full-service bar setup for private parties, birthdays, and intimate gatherings.",
    icon: GlassWater,
    color: "from-cocktail-gold to-cocktail-amber"
  },
  {
    title: "Corporate Events",
    description: "Professional bartending services for corporate functions and business gatherings.",
    icon: Coffee,
    color: "from-cocktail-purple to-cocktail-deep-purple"
  },
  {
    title: "Weddings",
    description: "Customized bar services to match your special day, including signature cocktails.",
    icon: Calendar,
    color: "from-cocktail-burgundy to-cocktail-purple"
  },
  {
    title: "Cocktail Workshops",
    description: "Interactive mixology classes and cocktail-making workshops for groups.",
    icon: ChefHat,
    color: "from-cocktail-amber to-cocktail-whiskey"
  },
  {
    title: "Menu Development",
    description: "Custom cocktail menu creation for restaurants, bars, and special events.",
    icon: Award,
    color: "from-cocktail-deep-purple to-cocktail-purple"
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-[#0D0D14] relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] text-white">
            <span className="text-gradient">Our Services</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cocktail-amber to-cocktail-purple mx-auto mb-6"></div>
          <p className="text-white/80 text-lg">Exceptional mixology services tailored to your needs</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-effect rounded-2xl p-8 group hover:shadow-[0_0_20px_rgba(155,89,182,0.3)] transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 mb-6 rounded-full flex items-center justify-center bg-gradient-to-br ${service.color}`}>
                <service.icon size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-['Playfair_Display']">{service.title}</h3>
              <p className="text-white/70 mb-6">{service.description}</p>
              <ul className="space-y-2">
                <li className="flex items-center text-white/60">
                  <Check size={18} className="text-cocktail-gold mr-2" />
                  <span>Professional staff</span>
                </li>
                <li className="flex items-center text-white/60">
                  <Check size={18} className="text-cocktail-gold mr-2" />
                  <span>Quality ingredients</span>
                </li>
                <li className="flex items-center text-white/60">
                  <Check size={18} className="text-cocktail-gold mr-2" />
                  <span>Custom menus</span>
                </li>
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Feature callout */}
        <div className="mt-16 glass-effect rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-cocktail-gold/10 blur-3xl"></div>
          <div className="absolute left-1/2 top-0 w-32 h-32 rounded-full bg-cocktail-purple/10 blur-3xl"></div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-['Playfair_Display']">Complete Event Experience</h3>
              <p className="text-white/70 mb-6">
                Beyond bartending, we provide a complete solution for your event's beverage needs. 
                From initial consultation to final service, we handle every aspect with professional care.
              </p>
              <ul className="grid grid-cols-2 gap-4">
                {[
                  "Bar Setup & Breakdown",
                  "Custom Drink Menus",
                  "Professional Bartenders",
                  "Premium Glassware",
                  "Specialty Ice",
                  "Garnishes & Ingredients"
                ].map((item) => (
                  <li key={item} className="flex items-center text-white/60">
                    <Check size={18} className="text-cocktail-gold mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Full bar setup" 
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
