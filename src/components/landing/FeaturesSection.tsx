import { FileText, Calendar, Clock, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'CPS Credit Tracking',
    description: 'Track research, academics, industry collaboration, and placement activities. Submit evidence and get approvals seamlessly.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Calendar,
    title: 'Smart Timetable',
    description: 'Create, manage, and print department timetables. Assign faculty, subjects, and lab sessions with ease.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Clock,
    title: 'Leave Management',
    description: 'Apply for casual, medical, or academic leave. Track approval status and maintain leave history.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Users,
    title: 'Multi-Role Access',
    description: 'Faculty, HOD, and Principal roles with appropriate permissions and approval workflows.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: CheckCircle,
    title: 'Approval Workflow',
    description: 'Two-tier approval system with HOD and Principal levels. Track status at every stage.',
    color: 'bg-cyan-100 text-cyan-600',
  },
  {
    icon: TrendingUp,
    title: 'Analytics & Reports',
    description: 'Comprehensive dashboards showing CPS credits, pending approvals, and performance metrics.',
    color: 'bg-pink-100 text-pink-600',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[hsl(220,60%,20%)] mb-4">
            Everything You Need to Manage
            <span className="text-[hsl(217,91%,60%)]"> Academic Excellence</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete platform designed for educational institutions to streamline faculty management and performance tracking.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl border border-border hover:border-[hsl(217,91%,60%)]/30 hover:shadow-lg transition-all duration-300 bg-card"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            className="bg-[hsl(45,93%,55%)] hover:bg-[hsl(45,93%,45%)] text-[hsl(220,60%,15%)] font-semibold px-8 py-6 text-lg rounded-lg"
          >
            Explore All Features
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
