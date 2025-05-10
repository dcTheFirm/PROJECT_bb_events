
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const packages = [
  {
    id: 'basic',
    name: 'Essential',
    price: '$350',
    description: 'Perfect for small gatherings',
    features: [
      '1 Professional Bartender',
      'Up to 3 Hours of Service',
      'Standard Cocktail Menu',
      'Basic Bar Setup',
      'Glassware Included'
    ],
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$650',
    description: 'Ideal for medium-sized events',
    features: [
      '2 Professional Bartenders',
      'Up to 4 Hours of Service',
      'Custom Cocktail Menu',
      'Full Bar Setup',
      'Premium Glassware',
      'Specialty Ice',
      'Signature Drink Creation'
    ],
    popular: true
  },
  {
    id: 'luxury',
    name: 'Luxury',
    price: '$1200',
    description: 'The ultimate experience',
    features: [
      '3 Professional Bartenders',
      'Up to 6 Hours of Service',
      'Fully Customized Menu',
      'Deluxe Bar Setup',
      'Top-Shelf Glassware',
      'Artisanal Ice Program',
      'Multiple Signature Drinks',
      'Flair Bartending',
      'Mixology Demonstration'
    ],
    popular: false
  }
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  guestCount: string;
  package: string;
  message: string;
};

const Booking = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: '',
    guestCount: '',
    package: 'premium',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePackageSelect = (packageId: string) => {
    setFormData(prev => ({ ...prev, package: packageId }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.eventDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
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
    
    // Reset form (in a real app you might redirect or show a thank you message)
    setFormData({
      name: '',
      email: '',
      phone: '',
      eventDate: '',
      eventType: '',
      guestCount: '',
      package: 'premium',
      message: ''
    });
  };

  return (
    <section id="booking" className="py-24 bg-gradient-to-b from-black to-[#0D0D14] relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] text-white">
            <span className="text-gradient">Book Your Event</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cocktail-amber to-cocktail-purple mx-auto mb-6"></div>
          <p className="text-white/80 text-lg">Reserve our mixology services for your upcoming event</p>
        </div>
        
        {/* Packages */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                formData.package === pkg.id 
                  ? 'ring-2 ring-cocktail-gold transform scale-105 z-10' 
                  : 'glass-effect hover:scale-[1.02]'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-cocktail-gold text-black font-medium py-1 px-4 text-sm">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-cocktail-gold mb-2">{pkg.price}</div>
                <p className="text-white/60 mb-6">{pkg.description}</p>
                <ul className="mb-8 space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="text-cocktail-gold mr-2 mt-1 flex-shrink-0" size={16} />
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={formData.package === pkg.id ? "default" : "outline"}
                  className={`w-full ${
                    formData.package === pkg.id 
                      ? 'bg-cocktail-gold hover:bg-cocktail-gold/80 text-black' 
                      : 'border-white/20 text-white hover:bg-white/10'
                  }`}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  {formData.package === pkg.id ? 'Selected' : 'Select Package'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-effect rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6 text-center">Request a Quote</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-white mb-2">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold/50"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-white mb-2">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold/50"
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-white mb-2">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold/50"
                />
              </div>
              <div>
                <label htmlFor="eventDate" className="block text-white mb-2">Event Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold/50"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="eventType" className="block text-white mb-2">Event Type</label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold/50"
                >
                  <option value="">Select Event Type</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="private">Private Party</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="guestCount" className="block text-white mb-2">Number of Guests</label>
                <select
                  id="guestCount"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold/50"
                >
                  <option value="">Select Guest Count</option>
                  <option value="1-25">1-25 guests</option>
                  <option value="26-50">26-50 guests</option>
                  <option value="51-100">51-100 guests</option>
                  <option value="101-200">101-200 guests</option>
                  <option value="201+">201+ guests</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-white mb-2">Additional Details</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold/50"
                placeholder="Tell us more about your event, any specific requirements, or questions..."
              ></textarea>
            </div>
            
            <div className="text-center">
              <Button
                type="submit"
                className="bg-cocktail-gold hover:bg-cocktail-gold/80 text-black px-8 py-6 rounded-lg font-medium text-lg transition-all hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
              >
                Submit Request
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Booking;
