import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionHeading from './SectionHeading';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/lib/supabaseClient';

function BookingForm() {
  const [guests, setGuests] = useState('');
  const [location, setLocation] = useState('');
  const [locationWarning, setLocationWarning] = useState('');
  const [dateWarning, setDateWarning] = useState('');
  const [locationsList, setLocationsList] = useState([]);
  const [eventDate, setEventDate] = useState('');

  useEffect(() => {
    supabase
      .from('bookings')
      .select('*')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.error('Supabase connection error:', error.message);
        } else {
          console.log('Supabase connection successful:', data);
        }
      });
  }, []);

  useEffect(() => {
    async function fetchLocations() {
      const { data, error } = await supabase.from('locations').select('id, name').eq('is_active', true);
      if (data) setLocationsList(data);
    }
    fetchLocations();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    // Validate guests field
    if (!guests || Number(guests) < 1 || Number(guests) > 2000) {
      toast.error("Please enter a valid number of guests (1-2000). Only up to 2000 guests are allowed.");
      return;
    }
    // Validate event date
    if (!eventDate) {
      toast.error("Please select an event date.");
      return;
    }
    const today = new Date();
    today.setHours(0,0,0,0);
    const selected = new Date(eventDate);
    selected.setHours(0,0,0,0);
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    if (selected < today) {
      toast.error('Please select a valid future date.');
      return;
    } else if (selected > nextYear) {
      toast.error('Event date cannot be more than 1 year ahead.');
      return;
    }

    // Collect form data
    const form = e.target;
    const bookingData = {
      client_name: form[0].value,
      email: form[1].value,
      phone: form[2].value,
      event_type: form[3].value,
      event_date: eventDate,
      guests: Number(guests),
      location_text: location,
      details: form[8].value,
      status: 'pending'
    };

    // Insert booking into Supabase
    const { error } = await supabase.from('bookings').insert([bookingData]);
    if (error) {
      let msg = '';
      if (error.message) {
        const lowerMsg = error.message.toLowerCase();
        const emailDup = lowerMsg.includes('email') && (lowerMsg.includes('duplicate') || lowerMsg.includes('already exists') || lowerMsg.includes('unique'));
        const phoneDup = lowerMsg.includes('phone') && (lowerMsg.includes('duplicate') || lowerMsg.includes('already exists') || lowerMsg.includes('unique'));
        if (emailDup && phoneDup) {
          msg = 'A booking with this email and contact number already exists. Please use a different email and phone number.';
        } else if (emailDup) {
          msg = 'A booking with this email already exists. Please use a different email.';
        } else if (phoneDup) {
          msg = 'A booking with this contact number already exists. Please use a different phone number.';
        } else {
          msg = error.message || "Failed to submit booking.";
        }
      } else {
        msg = "Failed to submit booking.";
      }
      toast.error(msg);
      return;
    }

    toast.success("Booking request sent!", {
      description: "We'll get back to you soon to confirm your booking."
    });

    setGuests('');
    setLocation('');
    setLocationWarning('');
    setDateWarning('');
    setEventDate('');
    form.reset();
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
                    max={(() => {
                      const today = new Date();
                      const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
                      return nextYear.toISOString().split('T')[0];
                    })()}
                    value={eventDate}
                    onChange={e => {
                      setEventDate(e.target.value);
                      const selected = new Date(e.target.value);
                      const today = new Date();
                      today.setHours(0,0,0,0);
                      const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
                      selected.setHours(0,0,0,0);
                      if (selected < today) {
                        setDateWarning('Please select a valid future date.');
                      } else if (selected > nextYear) {
                        setDateWarning('Event date cannot be more than 1 year ahead.');
                      } else {
                        setDateWarning('');
                      }
                    }}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2"
                  />
                </div>
                {dateWarning && <p className="text-red-500 text-sm mt-1">{dateWarning}</p>}
              </div>
              <div>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
                  <Input
                    type="number"
                    placeholder="Number of Guests"
                    required
                    value={guests}
                    onChange={e => {
                      // Prevent entering more than 2000
                      const val = e.target.value;
                      if (val === '' || (Number(val) <= 2000 && Number(val) >= 1)) {
                        setGuests(val);
                      }
                    }}
                    min={1}
                    max={2000}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2"
                  />
                </div>
              </div>
             
              <div>
                {/* Event Location as a text field instead of dropdown */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
                  <Input
                    type="text"
                    placeholder="Event Location"
                    required
                    value={location}
                    onChange={e => {
                      setLocation(e.target.value);
                      // Show warning if location is not Udaipur
                      if (e.target.value.trim().toLowerCase() !== 'udaipur') {
                        setLocationWarning('Charges may vary outside the location Udaipur');
                      } else {
                        setLocationWarning('');
                      }
                    }}
                    className={`bg-white/5 border-white/10 text-white placeholder:text-black/40 w-full rounded-md p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2 appearance-none ${locationWarning ? 'border-2 border-white border-solid focus-visible:ring-blue-500' : ''}`}
                  />
                </div>
                {locationWarning && (
                  <p className="text-red-500 text-sm mt-1 border border-white border-solid rounded p-2" style={{ borderColor: '#4a90e2', color: 'red' }}>{locationWarning}</p>
                )}
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

