
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 glass-effect shadow-lg' : 'py-6 bg-transparent'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#home" className="text-white text-2xl md:text-3xl font-bold font-playfair">
            <span className="text-[#4a90e2]">Bartender</span> Brothers
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {['Home', 'About', 'Team', 'Services', 'Gallery', 'Reviews'].map(item => <a key={item} href={`#${item.toLowerCase()}`} className="nav-link text-white text-sm uppercase tracking-wider hover:text-[#4a90e2] transition-colors font-medium">
              {item}
            </a>)}
          <Button className="btn-book bg-gradient-to-r from-[#4a90e2] to-[#ff6b6b] hover:from-[#ff6b6b] hover:to-[#4a90e2] text-white font-medium" onClick={() => document.getElementById('booking')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            Book Now
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white p-2" onClick={toggleMenu} aria-label="Toggle mobile menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {menuOpen && <div className="mob-menu md:hidden absolute top-full left-0 w-full glass-effect border-t border-white/10 shadow-lg animate-fade-in-up">
          <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
            {['Home', 'About', 'Team', 'Services', 'Gallery', 'Reviews'].map(item => <a key={item} href={`#${item.toLowerCase()}`} className="text-white py-2 hover:text-[#4a90e2] transition-colors text-center" onClick={toggleMenu}>
                {item}
              </a>)}
            <Button className="bg-gradient-to-r from-[#4a90e2] to-[#ff6b6b] hover:from-[#ff6b6b] hover:to-[#4a90e2] text-white w-full" onClick={() => {
          document.getElementById('booking')?.scrollIntoView({
            behavior: 'smooth'
          });
          toggleMenu();
        }}>
              Book Now
            </Button>
          </div>
        </div>}
    </header>;
}
export default Navbar;
