
import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black relative">
      {/* Top wave decoration */}
      <div className="w-full h-12 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDE1MCIgZmlsbD0iIzBEMEQxNCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMEwxMDAgNjBDMjAwIDEyMCA0MDAgMTIwIDUwMCA2MEM2MDAgMCA3MDAgMCA4MDAgNjBDOTAwIDEyMCAxMTAwIDEyMCAxMjAwIDYwTDEyMDAgMTUwTDAgMTUwWiIgLz48L3N2Zz4=')]"></div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <a href="#home" className="text-white text-2xl font-bold font-['Playfair_Display'] mb-4 inline-block">
              <span className="text-cocktail-gold">Mixology</span> Masters
            </a>
            <p className="text-white/70 mb-6">
              Elevating events through exceptional bartending services and unforgettable mixology experiences.
            </p>
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
                  <ExternalLink className="text-white" size={18} />
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
                    className="text-white/70 hover:text-cocktail-gold transition-colors"
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
                    className="text-white/70 hover:text-cocktail-gold transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">Contact Information</h4>
            <address className="text-white/70 not-italic space-y-2">
              <div>123 Cocktail Avenue</div>
              <div>Mixology District</div>
              <div>New York, NY 10001</div>
              <div className="pt-2">
                <a href="tel:+15551234567" className="text-white/70 hover:text-cocktail-gold transition-colors">
                  (555) 123-4567
                </a>
              </div>
              <div>
                <a href="mailto:info@mixologymasters.com" className="text-white/70 hover:text-cocktail-gold transition-colors">
                  info@mixologymasters.com
                </a>
              </div>
            </address>
          </div>
        </div>
        
        <hr className="border-white/10 my-12" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center text-white/50 text-sm">
          <div>© {currentYear} Mixology Masters. All rights reserved.</div>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-cocktail-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cocktail-gold transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cocktail-gold transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
