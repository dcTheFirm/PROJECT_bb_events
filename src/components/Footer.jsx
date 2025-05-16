
import React from 'react';
import { ExternalLink, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="contact" className="bg-black relative">
      {/* Top wave decoration */}
      <div className="w-full h-12 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDE1MCIgZmlsbD0iIzBEMEQxNCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMEwxMDAgNjBDMjAwIDEyMCA0MDAgMTIwIDUwMCA2MEM2MDAgMCA3MDAgMCA4MDAgNjBDOTAwIDEyMCAxMTAwIDEyMCAxMjAwIDYwTDEyMDAgMTUwTDAgMTUwWiIgLz48L3N2Zz4=')]"></div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <a href="#home" className="text-white text-2xl font-bold font-playfair mb-4 inline-block">
              <span className="text-gold">Bartender</span> Brothers
            </a>
            <p className="text-white/70 mb-6">
              Elevating events through exceptional bartending services and unforgettable mixology experiences.
            </p>
            <div className="socials flex space-x-4">
              {[
                { icon: Instagram, name: "instagram" }, 
                { icon: Facebook, name: "facebook" }, 
                { icon: Twitter, name: "twitter" }
              ].map((social) => (
                <a 
                  key={social.name}
                  href={`https://${social.name}.com`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-btn w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold/20 transition-colors"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="text-white" size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">Navigation</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Team', 'Services', 'Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`} 
                    className="text-white/70 hover:text-gold transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">Services</h4>
            <ul className="space-y-2">
              {[
                'Private Events', 
                'Corporate Functions', 
                'Weddings', 
                'Mixology Workshops', 
                'Menu Development', 
                'Bar Consulting'
              ].map((service) => (
                <li key={service}>
                  <a 
                    href="#services" 
                    className="text-white/70 hover:text-gold transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">Contact Information</h4>
            <address className="text-white/70 not-italic space-y-3">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3629.1767793093413!2d73.70784317457426!3d24.54855245766902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967efbd97c26fbf%3A0xd4e66f29519efeaa!2sBARTENDER%20BROTHERS%20%7C%20BARTENDING%20SERVICE%20%7C%20BAR%20SERVICE%20%7C%20WEDDING%20BARTENDER%20%7C%20INDIA!5e0!3m2!1sen!2sin!4v1744435834026!5m2!1sen!2sin" 
                width="250" 
                height="150" 
                style={{ border: 0 }} 
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Bartender Brothers Location"
                className="mb-3"
              />
              
              <div className="contact-item flex items-center gap-2">
                <MapPin size={16} className="text-gold flex-shrink-0" />
                <div>
                  <div>BARTENDER BROTHERS</div>
                  <div>Savina, Gordhan Vilas Rural</div>
                  <div>Udaipur 313001, Rajasthan, India</div>
                </div>
              </div>
              
              <div className="contact-item flex items-center gap-2">
                <Phone size={16} className="text-gold flex-shrink-0" />
                <div>
                  <a href="tel:+919521157683" className="hover:text-gold transition-colors">
                    +91 9521-157-683
                  </a>
                  {" | "}
                  <a href="tel:+917887655745" className="hover:text-gold transition-colors">
                    +91 7887-655-745
                  </a>
                </div>
              </div>
              
              <div className="contact-item flex items-center gap-2">
                <Mail size={16} className="text-gold flex-shrink-0" />
                <a href="mailto:bartenderbrothers87@gmail.com" className="hover:text-gold transition-colors">
                  bartenderbrothers87@gmail.com
                </a>
              </div>
            </address>
          </div>
        </div>
        
        <hr className="border-white/10 my-12" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center text-white/50 text-sm">
          <div>© {currentYear} Bartender Brothers. All rights reserved.</div>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
