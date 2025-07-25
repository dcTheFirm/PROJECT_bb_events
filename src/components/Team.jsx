import React from 'react';
import { motion } from 'framer-motion';
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
    <section id="team" className="team py-24 bg-black relative">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold font-['Playfair_Display'] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 drop-shadow-lg">
            <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text font-extrabold">
              Mee
            </span>
            <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 text-transparent bg-clip-text font-bold">
              t Our Team
            </span>
          </h2>
          <p className="text-gray-400 text-lg mt-2">The talented mixologists behind our exceptional service</p>
        </div>
        <div className="relative min-h-[350px]">
          {loading ? (
            <div className="text-center text-white py-12 text-lg">Loading team members...</div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center text-white py-12 text-lg">No team members found.</div>
          ) : (
            <>
              <button
                className="absolute left-[-56px] top-1/2 -translate-y-1/2 z-10 bg-black/90 hover:bg-black text-white rounded-full p-2 shadow-lg transition-colors border border-gray-800"
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
                    <div className="relative w-64 h-72 md:w-72 md:h-80 mx-auto overflow-hidden rounded-xl glass-effect border border-gray-800 shadow-xl">
                      <img 
                        src={member.photo_url || member.image || '/default-profile.png'} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        style={{ filter: 'brightness(0.9)' }} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                      <div className="absolute bottom-0 left-0 w-full p-4">
                        <h3 className="text-xl font-bold text-white mb-1 font-playfair">{member.name}</h3>
                        <p
                          className="font-medium mb-2 text-[#b497bd]"
                        >
                          {member.role}
                        </p>
                        {member.experience !== undefined && member.experience !== null && member.experience !== '' && (
                          <p className="text-sm text-gray-300 mb-1">{member.experience} years of experience</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                className="absolute right-[-56px] top-1/2 -translate-y-1/2 z-10 bg-black/90 hover:bg-black text-white rounded-full p-2 shadow-lg transition-colors border border-gray-800"
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
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
}

export default Team;
