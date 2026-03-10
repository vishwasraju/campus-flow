import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MarqueeBanner } from './MarqueeBanner';

export function HeroSection() {
  return (
    <section className="relative min-h-screen text-white flex flex-col">
      {/* Marquee Banner at top */}
      <div className="relative z-20 shrink-0 bg-black/20 backdrop-blur-[2px]">
        <MarqueeBanner />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 lg:p-8 h-full">
        <motion.div
          className="w-full max-w-4xl mx-auto flex flex-col items-center pt-10"
        >
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-center leading-[1.1] tracking-tight mb-8"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            The platform for
            <br />
            what's next in academics
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm md:text-base text-white/60 text-center max-w-2xl mx-auto mb-12 tracking-[0.1em] uppercase leading-relaxed"
          >
            CPS Portal is a faculty management platform that simplifies academic
            processes for both faculty and administrators based on proof of performance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              asChild
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white hover:text-black font-medium px-8 py-6 text-sm rounded-full tracking-wider transition-all duration-300 pointer-events-auto"
            >
              <Link to="/signup" className="flex items-center gap-3">
                START TRACKING NOW
                <span className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs">S</span>
              </Link>
            </Button>
            <Button
              asChild
              className="bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black font-medium px-8 py-6 text-sm rounded-full tracking-wider transition-all duration-300 pointer-events-auto"
            >
              <Link to="/login" className="flex items-center gap-3">
                ACCESS PORTAL
                <span className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs">H</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Cards at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 md:mt-24 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full pointer-events-auto"
        >
          {[
            {
              icon: '🔍',
              title: 'DISCOVER OPPORTUNITIES',
              description: 'Access curated academic resources and manage your CPS credits with ease.',
            },
            {
              icon: '📄',
              title: 'STREAMLINED SUBMISSIONS',
              description: 'Skip the paperwork. Submit evidence and get approvals with verified work portfolio.',
            },
            {
              icon: '📊',
              title: 'SMART PROFILE MANAGEMENT',
              description: 'Build once, track everywhere. Your achievements automatically populate records.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg">{feature.icon}</span>
                <h3 className="text-sm font-medium text-amber-400 tracking-wider">{feature.title}</h3>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
