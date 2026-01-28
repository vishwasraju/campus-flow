import { Users, FileCheck, Building2, TrendingUp } from 'lucide-react';

export function StatsSection() {
  const stats = [
    { value: '500+', label: 'Faculty Members', icon: Users, gradient: 'from-blue-400 to-cyan-400' },
    { value: '10K+', label: 'CPS Entries', icon: FileCheck, gradient: 'from-emerald-400 to-teal-400' },
    { value: '6', label: 'Departments', icon: Building2, gradient: 'from-purple-400 to-pink-400' },
    { value: '98%', label: 'Approval Rate', icon: TrendingUp, gradient: 'from-amber-400 to-orange-400' },
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-transparent to-slate-100" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="relative group p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 text-center"
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="text-slate-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}