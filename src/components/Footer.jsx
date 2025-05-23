import React from 'react';
import { ExternalLink, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="contact" className="bg-black pt-8 pb-4 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="flex-1 mb-6 md:mb-0">
            <a href="#home" className="text-white text-2xl font-bold font-playfair mb-2 inline-block">
              <span className="bg-gradient-to-r from-[#4a90e2] to-[#ff6b6b] bg-clip-text text-transparent">Bartender</span> Brothers
            </a>
            <p className="text-white/70 text-sm mb-4 max-w-xs">Elevating events through exceptional bartending services and unforgettable mixology experiences.</p>
            <div className="flex space-x-3 mt-2">
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
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold/20 transition-colors"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="text-white" size={16} />
                </a>
              ))}
            </div>
          </div>
          <div className="flex-1 mb-6 md:mb-0 flex flex-col items-center md:items-start">
            <h4 className="text-2xl md:text-2xl font-bold mb-4 font-['Playfair_Display'] text-[#b497bd] text-center md:text-left">
              Navigation
            </h4>
            <ul className="space-y-1">
              {["Home", "About", "Team", "Services", "Gallery", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-white/70 hover:text-gold transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 mb-6 md:mb-0 flex flex-col items-center md:items-start">
            <h4 className="text-3xl md:text-2xl font-bold mb-4 font-['Playfair_Display'] text-[#b497bd] text-center md:text-left">
              Contact
            </h4>
            <div className="space-y-2 text-sm text-white/70 mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gold flex-shrink-0" />
                <span>BARTENDER BROTHERS, Udaipur, Rajasthan, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gold flex-shrink-0" />
                <a href="tel:+919521157683" className="hover:text-gold transition-colors">
                  +91 9521-157-683
                </a>
                <a href="tel:+91 788-765-5745" className="hover:text-gold transition-colors">
                  +91 788-765-5745
                </a>

              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gold flex-shrink-0" />
                <a href="mailto:bartenderbrothers87@gmail.com" className="hover:text-gold transition-colors">
                  bartenderbrothers87@gmail.com
                </a>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border border-white/10 shadow-md w-full max-w-xs mx-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3629.1767793093413!2d73.70784317457426!3d24.54855245766902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967efbd97c26fbf%3A0xd4e66f29519efeaa!2sBARTENDER%20BROTHERS%20%7C%20BARTENDING%20SERVICE%20%7C%20BAR%20SERVICE%20%7C%20WEDDING%20BARTENDER%20%7C%20INDIA!5e0!3m2!1sen!2sin!4v1744435834026!5m2!1sen!2sin"
                width="100%"
                height="120"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bartender Brothers Location"
              />
            </div>
          </div>
        </div>
        <hr className="border-white/10 my-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center text-white/50 text-xs gap-2">
          <div>© {currentYear} Bartender Brothers. All rights reserved.</div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
