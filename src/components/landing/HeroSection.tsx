import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MarqueeBanner } from './MarqueeBanner';

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Marquee Banner at top */}
      <MarqueeBanner />

      {/* Background architectural image */}
      <div className="absolute inset-0 mt-[41px]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 0h1v1H0zM10 0h1v1H10zM20 0h1v1H20zM30 0h1v1H30zM40 0h1v1H40zM50 0h1v1H50zM60 0h1v1H60zM70 0h1v1H70zM80 0h1v1H80zM90 0h1v1H90z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Dotted architectural pattern */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-full max-w-4xl h-[500px] opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 2 }}
          >
            <svg viewBox="0 0 800 400" className="w-full h-full">
              {/* Architectural columns pattern */}
              {[...Array(12)].map((_, i) => (
                <g key={i}>
                  <line
                    x1={100 + i * 50}
                    y1={100}
                    x2={100 + i * 50}
                    y2={350}
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="2 4"
                  />
                  <rect
                    x={95 + i * 50}
                    y={90}
                    width="10"
                    height="10"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </g>
              ))}
              {/* Horizontal lines */}
              <line x1="100" y1="100" x2="700" y2="100" stroke="white" strokeWidth="2" strokeDasharray="2 4" />
              <line x1="100" y1="350" x2="700" y2="350" stroke="white" strokeWidth="2" strokeDasharray="2 4" />
              {/* Steps */}
              {[...Array(5)].map((_, i) => (
                <line
                  key={`step-${i}`}
                  x1={50 + i * 20}
                  y1={350 + i * 10}
                  x2={750 - i * 20}
                  y2={350 + i * 10}
                  stroke="white"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
              ))}
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading - Serif typography like RightFit */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal leading-[1.1] tracking-tight mb-8"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            The platform for
            <br />
            what's next in academics
          </motion.h1>

          {/* Subtitle - Spaced uppercase */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm md:text-base text-white/60 max-w-2xl mx-auto mb-12 tracking-[0.1em] uppercase leading-relaxed"
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
              className="border-white/30 bg-transparent text-white hover:bg-white hover:text-black font-medium px-8 py-6 text-sm rounded-full tracking-wider transition-all duration-300"
            >
              <Link to="/signup" className="flex items-center gap-3">
                START TRACKING NOW
                <span className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs">S</span>
              </Link>
            </Button>
            <Button
              asChild
              className="bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black font-medium px-8 py-6 text-sm rounded-full tracking-wider transition-all duration-300"
            >
              <Link to="/login" className="flex items-center gap-3">
                ACCESS PORTAL
                <span className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs">H</span>
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Feature Cards at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-32 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
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
              className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
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
