
import React from 'react';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: "A",
    role: "Head Mixologist",
    image: "/Media/teams/t2.webp",
    description: "With over 10 years of experience, Alex specializes in craft whiskey cocktails and molecular mixology."
  },
  {
    name: "B",
    role: "Bar Manager",
    image: "/Media/teams/t4.webp",
    description: "Sophia brings creativity and precision to every event, with expertise in gin-based concoctions and tropical flavors."
  },
  {
    name: "C",
    role: "Senior Bartender",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Known for his showmanship and technical precision, Marcus creates stunning, Instagram-worthy drinks."
  },
  {
    name: "",
    role: "Events Coordinator",
    image: "/Media/teams/t3.webp",
    description: "jfklasjidjflkads."
  },
  {
    name: "",
    role: "Events Coordinator",
    image: "/Media/teams/t3.webp",
    description: "jfklasjidjflkads."
  },
  {
    name: "",
    role: "Events Coordinator",
    image: "/Media/teams/t3.webp",
    description: "jfklasjidjflkads."
  }
];

const Team = () => {
  return (
    <section id="team" className="py-24 bg-gradient-to-b from-black to-[#0D0D14] relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] text-white">
            <span className="text-gradient">Meet Our Team</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cocktail-amber to-cocktail-purple mx-auto mb-6"></div>
          <p className="text-white/80 text-lg">The talented mixologists behind our exceptional service</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl glass-effect">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="text-xl font-bold text-white mb-1 font-['Playfair_Display']">{member.name}</h3>
                  <p className="text-cocktail-gold font-medium mb-3">{member.role}</p>
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{member.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0D0D14] to-transparent"></div>
    </section>
  );
};

export default Team;
