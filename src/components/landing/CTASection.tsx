import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-transparent relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-400/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-serif font-normal text-white mb-6 leading-tight"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Academic Management Based on Proof of Work
          </h2>

          <p className="text-base text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Sign up to start tracking your academic contributions and get recognized by your institution. Join our community of forward-thinking faculty today!
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white hover:text-black font-medium px-8 py-6 text-sm rounded-full tracking-wider transition-all duration-300"
            >
              <Link to="/signup" className="flex items-center gap-3">
                GET STARTED FREE
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black font-medium px-8 py-6 text-sm rounded-full tracking-wider transition-all duration-300"
            >
              <Link to="/login">SCHEDULE A DEMO</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
