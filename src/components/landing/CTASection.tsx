import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-[hsl(220,60%,20%)] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(217,91%,60%)]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[hsl(45,93%,55%)]/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Your Academic Data,
            <span className="text-[hsl(45,93%,55%)]"> Everywhere You Are</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10">
            Access your CPS records, check approval status, and manage your schedule 
            from any device. Everything synced and secure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              asChild
              className="bg-[hsl(45,93%,55%)] hover:bg-[hsl(45,93%,45%)] text-[hsl(220,60%,15%)] font-semibold px-8 py-6 text-lg rounded-lg"
            >
              <Link to="/signup">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-lg"
            >
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
