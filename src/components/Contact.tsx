
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-[#0D0D14] relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display'] text-white">
            <span className="text-gradient">Contact Us</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cocktail-amber to-cocktail-purple mx-auto mb-6"></div>
          <p className="text-white/80 text-lg">Have questions? Get in touch with our team</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="glass-effect rounded-2xl p-8 h-full">
              <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-cocktail-gold/10 p-3 rounded-lg mr-4">
                    <Phone className="text-cocktail-gold" size={20} />
                  </div>
                  <div>
                    <div className="text-white font-medium">Phone</div>
                    <a href="tel:+15551234567" className="text-white/70 hover:text-white transition-colors">
                      (555) 123-4567
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cocktail-gold/10 p-3 rounded-lg mr-4">
                    <Mail className="text-cocktail-gold" size={20} />
                  </div>
                  <div>
                    <div className="text-white font-medium">Email</div>
                    <a href="mailto:info@mixologymasters.com" className="text-white/70 hover:text-white transition-colors">
                      info@mixologymasters.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cocktail-gold/10 p-3 rounded-lg mr-4">
                    <MapPin className="text-cocktail-gold" size={20} />
                  </div>
                  <div>
                    <div className="text-white font-medium">Office</div>
                    <address className="text-white/70 not-italic">
                      123 Cocktail Avenue<br />
                      Mixology District<br />
                      New York, NY 10001
                    </address>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cocktail-gold/10 p-3 rounded-lg mr-4">
                    <Clock className="text-cocktail-gold" size={20} />
                  </div>
                  <div>
                    <div className="text-white font-medium">Office Hours</div>
                    <div className="text-white/70">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-white font-medium mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                    <a 
                      key={social}
                      href={`https://${social}.com`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cocktail-gold/20 transition-colors"
                      aria-label={`Follow us on ${social}`}
                    >
                      <Instagram className="text-white" size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="glass-effect rounded-2xl p-8 h-full">
              <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">Send a Message</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-white mb-2">Name</label>
                    <input
                      type="text"
                      id="contact-name"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-white mb-2">Email</label>
                    <input
                      type="email"
                      id="contact-email"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold/50"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="contact-subject" className="block text-white mb-2">Subject</label>
                  <input
                    type="text"
                    id="contact-subject"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold/50"
                  />
                </div>
                
                <div>
                  <label htmlFor="contact-message" className="block text-white mb-2">Message</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold/50"
                  ></textarea>
                </div>
                
                <div>
                  <Button
                    type="submit"
                    className="bg-cocktail-gold hover:bg-cocktail-gold/80 text-black px-6 py-3 rounded-lg font-medium transition-all hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
        
        {/* Map */}
        <div className="mt-16 rounded-2xl overflow-hidden h-80 glass-effect">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1652012206000!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Mixology Masters location"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;
