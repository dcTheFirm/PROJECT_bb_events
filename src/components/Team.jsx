import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const teamMembers = [
  {
    name: "Anil Choudhary",
    role: "Founder & Hospitality Lead",
    image: "",
    description: "9+ years of experience in high-end bar services."
  },
  {
    name: "Ajay Choudhary",
    role: "Founder & Beverage Director",
    image: "",
    description: "8+ years of experience the hospitality & Bar industry."
  },
  {
    name: "Jagdish Dama",
    role: "Bar Manager",
    image: "",
    description: "+ years of experience the hospitality & Bar industry."
  },
  {
    name: "Ankit Singh",
    role: "Head Mixologist",
    image: "",
    description: "8+ years of experience the hospitality & Bar industry."
  },
   {
    name: "Rahul Lohar",
    role: "Senior Mixologist",
    image: "",
    description: "8+ years of experience the hospitality & Bar industry."
  },
  {
    name: "Vijay Singh",
    role: "Craft Cocktail Specialist",
    image: "",
    description: "8+ years of experience the hospitality & Bar industry."
  },

 
  {
    name: "Deependra Singh",
    role: "Mixologist",
    image: "",
    description: "8+ years of experience the hospitality & Bar industry."
  },
  
 
  
  
];

function Team() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const visibleCount = 4;
  const totalMembers = teamMembers.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalMembers) % totalMembers);
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalMembers);
  };

  // Show 4 members at a time, wrap around
  const visibleMembers = Array.from({ length: visibleCount }, (_, i) => teamMembers[(currentIndex + i) % totalMembers]);

  return (
    <section id="team" className="team py-24 bg-gradient-to-b from-black to-dark relative">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Meet Our Team" 
          subtitle="The talented mixologists behind our exceptional service" 
        />
        <div className="relative">
          <button
            className="absolute left-[-48px] top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 shadow-lg transition-colors"
            onClick={handlePrev}
            aria-label="Previous team members"
            style={{ display: totalMembers > visibleCount ? 'block' : 'none' }}
          >
            <ChevronLeft size={28} />
          </button>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
            {visibleMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="team-card group relative"
              >
                <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto overflow-hidden rounded-xl glass-effect">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-xl font-bold text-white mb-1 font-playfair">{member.name}</h3>
                    <p className="text-gold font-medium mb-3">{member.role}</p>
                    <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{member.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button
            className="absolute right-[-48px] top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 shadow-lg transition-colors"
            onClick={handleNext}
            aria-label="Next team members"
            style={{ display: totalMembers > visibleCount ? 'block' : 'none' }}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-dark to-transparent"></div>
    </section>
  );
}

export default Team;
