import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[150px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 py-32 lg:py-40 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left content */}
          <div className="space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">Trusted by 500+ Institutions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Streamline Your
              <span className="block mt-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                Academic Excellence
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
              A comprehensive platform for faculty to track CPS credits, manage timetables, 
              apply for leave, and collaborate seamlessly across departments.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                asChild
                className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-bold px-8 py-7 text-lg rounded-2xl shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105"
              >
                <Link to="/signup" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-800 hover:border-slate-600 px-8 py-7 text-lg rounded-2xl backdrop-blur-sm"
              >
                <Play className="mr-2 h-5 w-5 text-amber-400" />
                Watch Demo
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              {['No credit card required', 'Free forever plan', '24/7 Support'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          {/* Right illustration */}
          <div className="relative lg:pl-8">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
            
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-2 border border-slate-700/50 shadow-2xl">
              <div className="bg-slate-900 rounded-2xl p-6">
                {/* Browser chrome */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 h-8 bg-slate-800 rounded-lg ml-4 flex items-center px-4">
                    <span className="text-xs text-slate-500">cps-portal.edu/dashboard</span>
                  </div>
                </div>
                
                {/* Mock dashboard */}
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl border border-blue-500/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-400">150</span>
                    </div>
                    <div className="h-20 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl border border-emerald-500/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-emerald-400">45</span>
                    </div>
                    <div className="h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl border border-purple-500/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-purple-400">28</span>
                    </div>
                    <div className="h-20 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl border border-amber-500/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-amber-400">12</span>
                    </div>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-xl border border-slate-700/50" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-slate-800/50 rounded-xl border border-slate-700/50" />
                    <div className="h-16 bg-slate-800/50 rounded-xl border border-slate-700/50" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 font-bold px-5 py-3 rounded-2xl shadow-2xl shadow-amber-500/30 animate-bounce" style={{ animationDuration: '3s' }}>
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                150+ CPS Credits
              </span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-slate-800 border border-slate-700 text-white font-medium px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span>Approved by HOD</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}