
import React, { useState } from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";

type FormData = {
  name: string;
  contact: string;
  email: string;
  eventType: string;
  eventDate: Date | undefined;
  guestCount: string;
  venue: string;
  budgetRange: string;
  preferences: string;
};

const BookingForm = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contact: '',
    email: '',
    eventType: '',
    eventDate: undefined,
    guestCount: '',
    venue: '',
    budgetRange: '',
    preferences: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, eventDate: date }));
  };
  
  const nextStep = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    setStep(2);
  };
  
  const prevStep = () => {
    setStep(1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.eventDate) {
      toast({
        title: "Missing Information",
        description: "Please select an event date.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would normally send the form data to your server
    console.log('Form submitted:', formData);
    
    // Show success message
    toast({
      title: "Booking Request Received",
      description: "We'll contact you shortly to confirm your event details.",
    });
    
    // Reset form
    setFormData({
      name: '',
      contact: '',
      email: '',
      eventType: '',
      eventDate: undefined,
      guestCount: '',
      venue: '',
      budgetRange: '',
      preferences: ''
    });
    setStep(1);
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <section id="booking" className="py-24 bg-black relative">
      <div className="container mx-auto px-4">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Book An Event
          </h2>
        </motion.div>
        
        <motion.div
          variants={formVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto border border-gray-800 rounded-3xl p-8 md:p-12 bg-black"
        >
          <form onSubmit={step === 2 ? handleSubmit : undefined}>
            {step === 1 ? (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="name" className="block text-blue-400 mb-3 text-lg">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact" className="block text-blue-400 mb-3 text-lg">Contact</label>
                    <input
                      type="tel"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="email" className="block text-blue-400 mb-3 text-lg">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="eventType" className="block text-blue-400 mb-3 text-lg">Type of event</label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">Select event type</option>
                      <option value="wedding">Wedding</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="birthday">Birthday Party</option>
                      <option value="private">Private Party</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-between mt-10">
                  <button 
                    type="button" 
                    className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-10 rounded-full transition-colors"
                    disabled
                  >
                    Previous
                  </button>
                  <button 
                    type="button" 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-10 rounded-full transition-colors"
                    onClick={nextStep}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="eventDate" className="block text-blue-400 mb-3 text-lg">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500",
                            !formData.eventDate && "text-gray-400"
                          )}
                        >
                          <div className="flex items-center">
                            {formData.eventDate ? format(formData.eventDate, "PPP") : <span>Select a date</span>}
                            <CalendarIcon className="ml-auto h-5 w-5 text-gray-400" />
                          </div>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.eventDate}
                          onSelect={handleDateChange}
                          initialFocus
                          className="bg-black border border-gray-800 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label htmlFor="guestCount" className="block text-blue-400 mb-3 text-lg">Approximate number of guests</label>
                    <input
                      type="text"
                      id="guestCount"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="venue" className="block text-blue-400 mb-3 text-lg">Desired venue (if known)</label>
                    <input
                      type="text"
                      id="venue"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="budgetRange" className="block text-blue-400 mb-3 text-lg">Budget range</label>
                    <select
                      id="budgetRange"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">Select a budget range</option>
                      <option value="under-1000">Under $1,000</option>
                      <option value="1000-3000">$1,000 - $3,000</option>
                      <option value="3000-5000">$3,000 - $5,000</option>
                      <option value="5000-10000">$5,000 - $10,000</option>
                      <option value="10000-plus">$10,000+</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="preferences" className="block text-blue-400 mb-3 text-lg">Catering and drink preferences</label>
                  <textarea
                    id="preferences"
                    name="preferences"
                    value={formData.preferences}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us what you want from us (drinks, decor, staff)"
                  ></textarea>
                </div>
                
                <div className="flex justify-between mt-10">
                  <button 
                    type="button" 
                    className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-10 rounded-full transition-colors"
                    onClick={prevStep}
                  >
                    Previous
                  </button>
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white py-3 px-10 rounded-full transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingForm;
