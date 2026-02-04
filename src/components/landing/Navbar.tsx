import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav
      className={`fixed top-[41px] left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-black" />
            </div>
          </Link>

          {/* Desktop Nav - Center */}
          <div className="hidden md:flex items-center gap-1">
            <button className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm font-medium px-4 py-2">
              PORTAL
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* CTA Buttons - Right */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/5 hover:border-white/40 text-xs tracking-wider font-medium rounded-full px-5 h-9"
            >
              <Link to="/login">BOOK A CALL</Link>
            </Button>
            <Button
              asChild
              className="bg-white text-black hover:bg-white/90 font-medium rounded-full px-5 h-9 text-xs tracking-wider"
            >
              <Link to="/login" className="flex items-center gap-2">
                LOGIN
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-black/95"
            >
              <div className="py-4 border-t border-white/10">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-white/70 hover:text-white hover:bg-white/5 transition-colors font-medium py-3 px-4 rounded-lg text-sm tracking-wider"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  ))}
                  <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2 px-4">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-white/20 bg-transparent text-white hover:bg-white/5 rounded-full text-xs tracking-wider"
                    >
                      <Link to="/login">BOOK A CALL</Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-white text-black hover:bg-white/90 rounded-full text-xs tracking-wider"
                    >
                      <Link to="/login">LOGIN</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
