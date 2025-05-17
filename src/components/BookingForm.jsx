
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Users, MessageSquare, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

function BookingForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    eventType: 'Wedding',
    message: '',
    agreed: false,
    isSubmitting: false,
    submitted: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    // Simulate form submission
    setTimeout(() => {
      setFormState(prev => ({ 
        ...prev, 
        isSubmitting: false,
        submitted: true 
      }));
      toast.success("Booking request sent successfully!", {
        description: "We'll contact you shortly to confirm details."
      });
      
      // Reset form after delay
      setTimeout(() => {
        setFormState({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: '',
          eventType: 'Wedding',
          message: '',
          agreed: false,
          isSubmitting: false,
          submitted: false
        });
      }, 3000);
    }, 1500);
  };

  return (
    <section id="booking" className="booking py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair text-white">
            <span className="txt-gradient">Book Our Services</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber to-purple mx-auto mb-6"></div>
          <p className="text-white/80 text-lg">Ready to elevate your event? Let's discuss how we can create a memorable experience</p>
        </div>
        
        <div className="glass-effect rounded-2xl p-8 md:p-12 relative overflow-hidden max-w-4xl mx-auto">
          {/* Decorative elements */}
          <div className="absolute -left-20 bottom-0 w-64 h-64 rounded-full bg-purple/10 blur-3xl"></div>
          <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-gold/10 blur-3xl"></div>
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input 
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formState.phone}
                  onChange={handleChange}
                  required
                  placeholder="Your phone number"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">Event Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input 
                    id="date"
                    name="date"
                    type="date"
                    value={formState.date}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 text-white pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time" className="text-white">Event Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input 
                    id="time"
                    name="time"
                    type="time"
                    value={formState.time}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 text-white pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-white">Number of Guests</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input 
                    id="guests"
                    name="guests"
                    type="number"
                    min="1"
                    value={formState.guests}
                    onChange={handleChange}
                    required
                    placeholder="Expected guests"
                    className="bg-white/5 border-white/10 text-white pl-10 placeholder:text-white/30"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-white">Event Type</Label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formState.eventType}
                  onChange={handleChange}
                  required
                  className="w-full h-10 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-base text-white ring-offset-background file:border-0 file:bg-transparent file:text-white file:font-medium placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate">Corporate Event</option>
                  <option value="Birthday">Birthday Party</option>
                  <option value="Workshop">Cocktail Workshop</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">Additional Details</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your event and requirements..."
                  rows={4}
                  className="w-full rounded-md border border-white/10 bg-white/5 p-3 pl-10 text-base text-white ring-offset-background placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreed"
                  name="agreed"
                  type="checkbox"
                  checked={formState.agreed}
                  onChange={handleChange}
                  required
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-gold focus:ring-gold"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreed" className="text-white/70">
                  I agree to the terms and privacy policy.
                </label>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  type="submit"
                  disabled={formState.isSubmitting || formState.submitted}
                  className={`bg-gradient-to-r from-gold to-amber hover:from-amber hover:to-gold text-black px-10 py-6 text-lg rounded-xl font-medium transition-all ${formState.submitted ? 'bg-green-500' : ''}`}
                >
                  {formState.isSubmitting ? "Submitting..." : formState.submitted ? <><Check className="mr-2" /> Request Sent!</> : "Book Now"}
                </Button>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default BookingForm;
