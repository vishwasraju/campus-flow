import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Globe, Users } from 'lucide-react';

export function CollaborationSection() {
  const benefits = [
    { icon: Zap, text: 'Real-time approval notifications' },
    { icon: Shield, text: 'Department-wise dashboards' },
    { icon: Globe, text: 'Cross-functional CPS activities' },
    { icon: Users, text: 'Centralized document management' },
  ];

  return (
    <section className="py-28 lg:py-40 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]" />
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Illustration */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Central hub */}
              <div className="relative w-72 h-72 mx-auto">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-slate-700/50" />
                <div className="absolute inset-4 rounded-full border border-slate-700/30" />
                <div className="absolute inset-8 rounded-full border border-slate-700/20" />
                
                {/* Center icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl flex items-center justify-center border border-slate-700">
                  <Users className="w-12 h-12 text-blue-400" />
                </div>
                
                {/* Orbiting avatars */}
                {[
                  { color: 'from-blue-400 to-blue-600', position: 'top-0 left-1/2 -translate-x-1/2 -translate-y-2', label: 'CSE' },
                  { color: 'from-emerald-400 to-emerald-600', position: 'top-1/4 right-0 translate-x-2', label: 'AIML' },
                  { color: 'from-purple-400 to-purple-600', position: 'bottom-1/4 right-0 translate-x-2', label: 'ECE' },
                  { color: 'from-orange-400 to-orange-600', position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-2', label: 'EEE' },
                  { color: 'from-pink-400 to-pink-600', position: 'bottom-1/4 left-0 -translate-x-2', label: 'MECH' },
                  { color: 'from-cyan-400 to-cyan-600', position: 'top-1/4 left-0 -translate-x-2', label: 'AIDS' },
                ].map((item, i) => (
                  <div key={i} className={`absolute ${item.position}`}>
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl shadow-lg flex items-center justify-center text-white text-xs font-bold border-2 border-slate-900`}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold border border-blue-500/20">
              Collaboration
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Work Together Across
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Departments
              </span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Connect faculty members from CSE, AIML, AIDS, ECE, EEE, and MECH departments. 
              Share resources, collaborate on interdisciplinary projects, and maintain 
              seamless communication with role-based access control.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {benefits.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-slate-300 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
            
            <Button 
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-bold px-8 py-7 text-lg rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105 mt-4"
            >
              Try It Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}