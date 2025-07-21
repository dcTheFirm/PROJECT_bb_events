import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionHeading from './SectionHeading';
import { toast } from '@/components/ui/sonner';
import { supabase } from '../lib/supabaseClient';

function BookingForm() {
  const [guests, setGuests] = useState('');
  const [location, setLocation] = useState('');
  const [locationWarning, setLocationWarning] = useState('');
  const [dateWarning, setDateWarning] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [bookingImages, setBookingImages] = useState({});

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
    async function fetchImages() {
      const { data, error } = await supabase
        .from('home-images') // <-- FIXED table name
        .select('url,position')
        .eq('section', 'booking')
        .in('position', [1, 2]);
      if (error) {
        console.error('Supabase fetch error:', error.message);
      }
      const imgMap = {};
      (data || []).forEach(img => {
        imgMap[img.position] = img.url;
      });
      setBookingImages(imgMap);
      console.log('Booking images by position:', imgMap);
    }
    fetchImages();
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
    const minDate = new Date(today);
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 18); // 1.5 years ahead

    if (selected < minDate) {
      toast.error('Please select a valid future date. Past dates are not allowed.');
      return;
    } else if (selected > maxDate) {
      toast.error('Event date cannot be more than 1.5 years ahead.');
      return;
    }

    // Check for max 4 bookings on the same date
    let { data: sameDateBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('event_date', eventDate);

    if (sameDateBookings && sameDateBookings.length >= 4) {
      toast.error("Sorry, we can only accept 4 bookings for the same date. Please select another date.");
      return;
    }

    // Collect form data
    const form = e.target;
    const email = form[1].value;
    const phone = form[2].value;

    // Check for duplicate email
    let { data: emailExists } = await supabase
      .from('bookings')
      .select('id')
      .eq('email', email)
      .limit(1);
    if (emailExists && emailExists.length > 0) {
      toast.error("This email has already been used for a booking. Please use a different email.");
      return;
    }

    // Check for duplicate phone
    let { data: phoneExists } = await supabase
      .from('bookings')
      .select('id')
      .eq('phone', phone)
      .limit(1);
    if (phoneExists && phoneExists.length > 0) {
      toast.error("This contact number has already been used for a booking. Please use a different number.");
      return;
    }

    const bookingData = {
      client_name: form[0].value,
      email,
      phone,
      event_type: form[3].value,
      event_date: form[4].value,
      guests: Number(form[5].value),
      location: form[6].value,
      details: form[7].value,
      status: 'pending'
    };

    // Insert booking into Supabase
    const { error } = await supabase.from('bookings').insert([bookingData]);
    if (error) {
      toast.error(error.message || "Failed to submit booking.");
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

  return (
    <section id="booking" className="booking py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold font-['Playfair_Display'] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 drop-shadow-lg">
            <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text font-extrabold">
              Book
            </span>
            <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 text-transparent bg-clip-text font-bold">
              &nbsp;Our Services
            </span>
          </h2>
          <p className="text-gray-400 text-lg mt-2">Let us make your next event extraordinary</p>
        </div>
        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-playfair font-bold mb-6 text-[#4a90e2]/80">Request a Quote</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input placeholder="Your Name" required className="bg-black/20 border-white/5 text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2" />
              </div>
              <div>
                <Input type="email" placeholder="Your Email" required className="bg-black/20 border-white/5 text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2" />
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
                  className="bg-black/20 border-white/5 text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2" 
                />
              </div>
              <div>
                <select defaultValue="" required className="bg-black/20 border-white/5 text-white placeholder:text-white/30 w-full rounded-md p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2 appearance-none">
                  <option value="" disabled>Select Event Type</option>
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
                      const maxDate = new Date(today);
                      maxDate.setMonth(maxDate.getMonth() + 18);
                      return maxDate.toISOString().split('T')[0];
                    })()}
                    value={eventDate}
                    onChange={e => {
                      setEventDate(e.target.value);
                      const selected = new Date(e.target.value);
                      const today = new Date();
                      today.setHours(0,0,0,0);
                      const maxDate = new Date(today);
                      maxDate.setMonth(maxDate.getMonth() + 18);
                      selected.setHours(0,0,0,0);
                      if (selected < today) {
                        setDateWarning('Please select a valid future date. Past dates are not allowed.');
                      } else if (selected > maxDate) {
                        setDateWarning('Event date cannot be more than 1.5 years ahead.');
                      } else {
                        setDateWarning('');
                      }
                    }}
                    className="bg-black/20 border-white/5 text-white placeholder:text-white/30 pl-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2"
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
                      const val = e.target.value;
                      if (val === '' || (Number(val) <= 2000 && Number(val) >= 1)) {
                        setGuests(val);
                      }
                    }}
                    min={1}
                    max={2000}
                    className="bg-black/20 border-white/5 text-white placeholder:text-white/30 pl-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
                  <Input
                    type="text"
                    placeholder="Event Location"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className={`bg-black/20 border-white/5 text-white placeholder:text-white/30 w-full rounded-md p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2 appearance-none ${locationWarning ? 'border-2 border-white border-solid focus-visible:ring-blue-500' : ''}`}
                  />
                </div>
                {locationWarning && (
                  <p className="text-red-500 text-sm mt-1 border border-white border-solid rounded p-2" style={{ borderColor: '#4a90e2', color: 'red' }}>{locationWarning}</p>
                )}
              </div>
              <div>
                <textarea placeholder="Additional Details" rows={4} className="w-full rounded-md border border-white/5 bg-black/20 p-3 text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a90e2]/80 focus-visible:ring-offset-2" />
              </div>
              <Button type="submit" className="bg-[#4a90e2]/80 hover:bg-[#4a90e2] w-full font-normal text-white">
                Request a Quote
              </Button>
            </form>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden glass-effect">
              {/* position 1 */}
              <img src={bookingImages[1] || ""} alt="Bartender preparing a drink" className="w-full h-full object-cover object-center" loading="lazy" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full overflow-hidden border-4 border-gold/20 glass-effect">
              {/* position 2 */}
              <img src={bookingImages[2] || ""} alt="Cocktail glasses" className="w-full h-full object-cover object-center" loading="lazy" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default BookingForm;

