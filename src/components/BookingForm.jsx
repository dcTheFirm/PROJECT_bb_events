import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionHeading from './SectionHeading';
import { toast } from '@/components/ui/sonner';

function BookingForm() {
  const handleSubmit = e => {
    e.preventDefault();
    toast.success("Booking request sent!", {
      description: "We'll get back to you soon to confirm your booking."
    });
    e.target.reset();
  };

  return <section id="booking" className="booking py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeading title="Book Our Services" subtitle="Let us make your next event extraordinary" />
        
        <motion.div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto" initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7
      }} viewport={{
        once: true
      }}>
          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-playfair font-bold mb-6 text-[#4a90e2]/80">Request a Quote</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input placeholder="Your Name" required className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2" />
              </div>
              <div>
                <Input type="email" placeholder="Your Email" required className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2" />
              </div>
              <div>
                <Input 
                  type="tel" 
                  placeholder="Contact Number" 
                  required 
                  pattern="[0-9]{10}"
                  maxLength={10}
                  minLength={10}
                  inputMode="numeric"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2" 
                />
              </div>
              <div>
                <select required className="bg-white/5 border-white/10 text-white placeholder:text-black/40 w-full rounded-md p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2 appearance-none">
                  
                  <option value="" disabled selected>Select Event Type</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Wedding & Anniversary">Wedding & Anniversary</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Private Party">Private Party</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
              <div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <Input 
                    type="date" 
                    placeholder="Event Date" 
                    required 
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2" 
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
                  <Input type="number" placeholder="Number of Guests" required className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2" />
                </div>
              </div>
             
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
                  <Input placeholder="Event Location" required className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2" />
                </div>
              </div>
              <div>
                <textarea placeholder="Additional Details" rows={4} className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2" />
              </div>
              <Button type="submit" className="bg-[#4a90e2]/80 hover:bg-[#4a90e2] w-full font-normal text-white">
                Request a Quote
              </Button>
            </form>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden glass-effect">
              <img src="https://images.unsplash.com/photo-1543007318-45f84c490207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80" alt="Bartender preparing a drink" className="w-full h-full object-cover object-center" loading="lazy" />
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full overflow-hidden border-4 border-gold/20 glass-effect">
              <img src="https://images.unsplash.com/photo-1556703752-83ca8401bc87?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80" alt="Cocktail glasses" className="w-full h-full object-cover object-center" loading="lazy" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>;
}
export default BookingForm;
