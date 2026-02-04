import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Menu, X, ChevronDown, ArrowRight, Book, Users, School } from 'lucide-react';
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
    <motion.div
      className="fixed left-0 right-0 z-40 flex justify-center px-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        top: isScrolled ? 24 : 56, // 24px = top-6, 56px = space for top bar
      }}
      transition={{
        y: { duration: 0.8, ease: "easeOut" },
        top: { duration: 0.3, type: "spring", stiffness: 260, damping: 20 },
        opacity: { duration: 0.5 }
      }}
    >
      <motion.nav
        className={`transition-all duration-300 bg-black border border-white/10 shadow-lg overflow-hidden ${isScrolled ? 'backdrop-blur-xl' : ''}`}
        initial={{ width: 58, height: 58, borderRadius: 50 }}
        animate={{
          width: "100%",
          height: "auto",
          borderRadius: 9999,
        }}
        transition={{
          width: { delay: 1.0, duration: 0.8, ease: "easeInOut" },
          height: { delay: 1.0, duration: 0.8, ease: "easeInOut" },
          borderRadius: { delay: 1.0, duration: 0.4 }
        }}
        style={{ maxWidth: "56rem" }} // max-w-4xl equivalent
      >
        {/* Animated Slide Logo */}
        <motion.div
          className="absolute top-3 z-20"
          initial={{ left: "50%", x: "-50%" }}
          animate={{ left: "1.5rem", x: "0%" }}
          transition={{
            delay: 1.0,
            duration: 0.8,
            ease: "easeInOut"
          }}
        >
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </Link>
        </motion.div>

        {/* Full Navbar Content */}
        <motion.div
          className="px-6 py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            {/* Logo Spacer (Invisible) to maintain layout */}
            <div className="w-8 h-8 flex items-center justify-center opacity-0 pointer-events-none">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>

            {/* Desktop Nav - Right Aligned Items */}
            <div className="hidden md:flex items-center gap-8">
              {/* Company Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-[11px] font-medium uppercase tracking-widest">
                  COMPANY
                  <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                </button>

                {/* Dropdown Content */}
                <div className="absolute right-0 top-full pt-4 w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl overflow-hidden p-1">
                    <Link to="/blog" className="flex items-start gap-3 p-2 rounded-md hover:bg-neutral-800 transition-colors">
                      <Book className="w-4 h-4 text-white/50 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-white">Blog</div>
                        <div className="text-[10px] text-white/50">Latest updates</div>
                      </div>
                    </Link>
                    <Link to="/community" className="flex items-start gap-3 p-2 rounded-md hover:bg-neutral-800 transition-colors">
                      <Users className="w-4 h-4 text-white/50 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-white">Community</div>
                        <div className="text-[10px] text-white/50">Join the discussion</div>
                      </div>
                    </Link>
                    <Link to="/school" className="flex items-start gap-3 p-2 rounded-md hover:bg-neutral-800 transition-colors">
                      <School className="w-4 h-4 text-white/50 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-white">School</div>
                        <div className="text-[10px] text-white/50">Learn with us</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="bg-zinc-900/50 border-white/10 text-white hover:bg-white/5 hover:border-white/20 h-8 px-4 text-[10px] font-medium tracking-widest uppercase rounded-md"
                >
                  <Link to="/login">BOOK A CALL</Link>
                </Button>
                <Button
                  asChild
                  className="bg-white text-black hover:bg-white/90 h-8 px-4 text-[10px] font-bold tracking-widest uppercase rounded-md"
                >
                  <Link to="/login" className="flex items-center gap-1">
                    LOGIN
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu - Opens below the pill */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="md:hidden overflow-hidden mt-4"
              >
                <div className="bg-neutral-900/90 backdrop-blur-md rounded-xl border border-white/10 p-4 space-y-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="block text-white/70 hover:text-white hover:bg-white/5 transition-colors font-medium py-2 px-3 rounded-lg text-sm text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  ))}
                  <div className="pt-2 flex flex-col gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-center border-white/20 bg-transparent text-white hover:bg-white/5 h-9 text-xs tracking-wider uppercase"
                    >
                      <Link to="/login">BOOK A CALL</Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full justify-center bg-white text-black hover:bg-white/90 h-9 text-xs tracking-wider uppercase"
                    >
                      <Link to="/login">LOGIN</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.nav>
    </motion.div>
  );
}
