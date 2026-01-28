import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Laptop, Smartphone, Tablet } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="py-28 lg:py-40 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Device icons */}
          <div className="flex justify-center gap-6 mb-10">
            {[Laptop, Tablet, Smartphone].map((Icon, i) => (
              <div key={i} className="w-14 h-14 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Icon className="w-6 h-6 text-slate-400" />
              </div>
            ))}
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Your Academic Data,
            <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Everywhere You Are
            </span>
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Access your CPS records, check approval status, and manage your schedule 
            from any device. Everything synced and secure.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              asChild
              className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-bold px-10 py-7 text-lg rounded-2xl shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105"
            >
              <Link to="/signup" className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Get Started Today
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-800 hover:border-slate-600 px-10 py-7 text-lg rounded-2xl backdrop-blur-sm"
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