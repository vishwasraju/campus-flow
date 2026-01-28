import { FileText, Calendar, Clock, Users, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: FileText,
    title: 'CPS Credit Tracking',
    description: 'Track research, academics, industry collaboration, and placement activities. Submit evidence and get approvals seamlessly.',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    icon: Calendar,
    title: 'Smart Timetable',
    description: 'Create, manage, and print department timetables. Assign faculty, subjects, and lab sessions with ease.',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-500/10 to-teal-500/10',
  },
  {
    icon: Clock,
    title: 'Leave Management',
    description: 'Apply for casual, medical, or academic leave. Track approval status and maintain leave history.',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
  },
  {
    icon: Users,
    title: 'Multi-Role Access',
    description: 'Faculty, HOD, and Principal roles with appropriate permissions and approval workflows.',
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-500/10 to-amber-500/10',
  },
  {
    icon: CheckCircle,
    title: 'Approval Workflow',
    description: 'Two-tier approval system with HOD and Principal levels. Track status at every stage.',
    gradient: 'from-cyan-500 to-blue-500',
    bgGradient: 'from-cyan-500/10 to-blue-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Analytics & Reports',
    description: 'Comprehensive dashboards showing CPS credits, pending approvals, and performance metrics.',
    gradient: 'from-pink-500 to-rose-500',
    bgGradient: 'from-pink-500/10 to-rose-500/10',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-28 lg:py-40 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-[150px] opacity-60" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-[150px] opacity-60" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
            Powerful Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Everything You Need to Manage
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Academic Excellence
            </span>
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            A complete platform designed for educational institutions to streamline faculty management and performance tracking.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Hover gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button 
            className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-bold px-10 py-7 text-lg rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105"
          >
            Explore All Features
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}