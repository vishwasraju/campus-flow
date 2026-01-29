import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden flex items-center justify-center">
      {/* Animated stars/particles background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Purple glowing orb - central focus */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Dotted grid lines */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full border-t border-dashed border-gray-600"
            style={{ top: `${i * 5}%` }}
          />
        ))}
        {[...Array(20)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full border-l border-dashed border-gray-600"
            style={{ left: `${i * 5}%` }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-medium">
              New
            </span>
            <span className="text-gray-400 text-sm">Streamlined Academic Management</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          >
            Intelligent Automation for{' '}
            <span className="block">Modern Academics.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            CPS Portal brings academic automation to your fingertips & streamlines faculty management.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              asChild
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
            >
              <Link to="/signup" className="flex items-center gap-2">
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gray-700 bg-transparent text-white hover:bg-white/5 hover:border-gray-600 px-8 py-6 text-base rounded-xl"
            >
              <Link to="#features">View services</Link>
            </Button>
          </motion.div>

          {/* Trust indicator */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 text-gray-500 text-sm"
          >
            Over 500+ institutions trust us
          </motion.p>
        </div>
      </div>
    </section>
  );
}
