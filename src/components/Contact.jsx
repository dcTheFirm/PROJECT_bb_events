
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully!", {
      description: "We'll get back to you soon."
    });
    e.target.reset();
  };

  return (
    <section id="contact" className="contact py-24 bg-gradient-to-b from-black to-dark relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair text-white">
            <span className="txt-gradient">Contact Us</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber to-purple mx-auto mb-6"></div>
          <p className="text-white/80 text-lg">Have questions? We're here to help!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-playfair font-bold mb-6 text-white">Get in Touch</h3>
            <p className="text-white/70 mb-8">
              Whether you're planning a special event or have questions about our services,
              we'd love to hear from you. Contact us using any of the methods below.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="contact-icon w-12 h-12 rounded-full bg-gradient-to-br from-purple to-gold flex items-center justify-center mr-4 flex-shrink-0">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Phone</h4>
                  <p className="text-white/70">
                    <a href="tel:+919521157683" className="hover:text-gold transition-colors">+91 9521-157-683</a>
                    <br />
                    <a href="tel:+917887655745" className="hover:text-gold transition-colors">+91 7887-655-745</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="contact-icon w-12 h-12 rounded-full bg-gradient-to-br from-purple to-gold flex items-center justify-center mr-4 flex-shrink-0">
                  <Mail className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Email</h4>
                  <p className="text-white/70">
                    <a href="mailto:bartenderbrothers87@gmail.com" className="hover:text-gold transition-colors">
                      bartenderbrothers87@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="contact-icon w-12 h-12 rounded-full bg-gradient-to-br from-purple to-gold flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Location</h4>
                  <p className="text-white/70">
                    Savina, Gordhan Vilas Rural<br />
                    Udaipur 313001, Rajasthan, India
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass-effect rounded-xl p-8"
          >
            <h3 className="text-2xl font-playfair font-bold mb-6 text-white">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input 
                  placeholder="Your Name"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Input 
                  type="email"
                  placeholder="Your Email"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Input 
                  placeholder="Subject"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <textarea 
                  placeholder="Your Message"
                  rows={4}
                  required
                  className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-gold to-amber hover:from-amber hover:to-gold text-black w-full"
              >
                <Send size={16} className="mr-2" /> Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
