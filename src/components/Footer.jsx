import React from 'react';
import { ExternalLink, Mail, Phone, MapPin, Instagram } from 'lucide-react';

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
              {/* Instagram */}
              <a
                href="https://www.instagram.com/bartender_brothers_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold/20 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="text-white" size={25} />
              </a>
            
              <a
                href={`https://wa.me/919521157683`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold/20 transition-colors"
                aria-label="Chat with us on WhatsApp"
              >
                {/* WhatsApp SVG icon styled like Instagram icon */}
                <svg className="text-white" width="25" height="25" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.372.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path fill="currentColor" fillRule="evenodd" d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.463 3.484 1.34 4.997L2.003 22l5.145-1.347a9.96 9.96 0 0 0 4.856 1.24h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.662-1.037-5.164-2.921-7.047A9.96 9.96 0 0 0 12.004 2.003zm0 17.994a8.01 8.01 0 0 1-4.073-1.12l-.292-.173-3.053.8.814-2.98-.19-.306A7.963 7.963 0 0 1 4.01 12c0-4.418 3.58-7.997 7.997-7.997 2.137 0 4.146.832 5.656 2.344A7.963 7.963 0 0 1 20 12c0 4.418-3.58 7.997-7.997 7.997z" clipRule="evenodd"/>
                </svg>
              </a>
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
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=bartenderbrothers87@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
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
