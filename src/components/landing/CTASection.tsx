import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-[#0a0a0f] relative overflow-hidden">
      {/* Purple glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 mb-8">
            <Mail className="w-8 h-8 text-violet-400" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your Institution?
          </h2>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join 500+ institutions already using CPS Portal to streamline their academic management and boost faculty performance.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
            >
              <Link to="/signup" className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gray-700 bg-transparent text-white hover:bg-white/5 hover:border-gray-600 px-8 py-6 text-base rounded-xl"
            >
              <Link to="/login">Schedule a Demo</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
