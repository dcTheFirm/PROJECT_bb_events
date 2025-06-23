import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

function Team() {
  const [teamMembers, setTeamMembers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const visibleCount = 4;
  const totalMembers = teamMembers.length;

  React.useEffect(() => {
    async function fetchTeam() {
      setLoading(true);
      // Query the view instead of the table
      const { data, error } = await supabase
        .from('team_members_ordered')
        .select('*');
      if (!error) setTeamMembers(data || []);
      setLoading(false);
    }
    fetchTeam();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };
  const handleNext = () => {
    if (currentIndex + visibleCount < totalMembers) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const visibleMembers = teamMembers.slice(currentIndex, currentIndex + visibleCount);

  return (
    <section id="team" className="team py-24 bg-gradient-to-b from-black to-dark relative">
      <div className="container mx-auto">
        <SectionHeading 
          title="Meet Our Team" 
          subtitle="The talented mixologists behind our exceptional service" 
        />
        <div className="relative min-h-[350px]">
          {loading ? (
            <div className="text-center text-white py-12 text-lg">Loading team members...</div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center text-white py-12 text-lg">No team members found.</div>
          ) : (
            <>
              <button
                className="absolute left-[-56px] top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 shadow-lg transition-colors"
                onClick={handlePrev}
                aria-label="Previous team members"
                style={{ display: currentIndex > 0 ? 'block' : 'none' }}
              >
                <ChevronLeft size={28} />
              </button>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-15 gap-y-15 justify-center">
                {visibleMembers.map((member, index) => (
                  <motion.div
                    key={member.id || member.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="team-card group relative"
                  >
                    <div className="relative w-64 h-72 md:w-72 md:h-80 mx-auto overflow-hidden rounded-xl glass-effect">
                      <img 
                        src={member.photo_url || member.image || '/default-profile.png'} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        style={{ filter: 'brightness(0.7)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                      <div className="absolute bottom-0 left-0 w-full p-4">
                        <h3 className="text-xl font-bold text-white mb-1 font-playfair">{member.name}</h3>
                        <p
                          className="font-medium mb-2"
                          style={{ color: 'rgb(212, 215, 109)' }}
                        >
                          {member.role}
                        </p>
                        {member.experience !== undefined && member.experience !== null && member.experience !== '' && (
                          <p className="text-sm text-white-300 mb-1">{member.experience} years of experience</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                className="absolute right-[-56px] top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 shadow-lg transition-colors"
                onClick={handleNext}
                aria-label="Next team members"
                style={{ display: currentIndex + visibleCount < totalMembers ? 'block' : 'none' }}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-dark to-transparent"></div>
    </section>
  );
}

export default Team;
