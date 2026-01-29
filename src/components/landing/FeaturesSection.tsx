import { FileText, Calendar, Clock, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: FileText,
    title: 'CPS Credit Tracking',
    description:
      'Track research, academics, industry collaboration, and placement activities. Submit evidence and get approvals seamlessly.',
  },
  {
    icon: Calendar,
    title: 'Smart Timetable',
    description:
      'Create, manage, and print department timetables. Assign faculty, subjects, and lab sessions with ease.',
  },
  {
    icon: Clock,
    title: 'Leave Management',
    description:
      'Apply for casual, medical, or academic leave. Track approval status and maintain leave history.',
  },
  {
    icon: Users,
    title: 'Multi-Role Access',
    description:
      'Faculty, HOD, and Principal roles with appropriate permissions and approval workflows.',
  },
  {
    icon: CheckCircle,
    title: 'Approval Workflow',
    description:
      'Two-tier approval system with HOD and Principal levels. Track status at every stage.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics & Reports',
    description:
      'Comprehensive dashboards showing CPS credits, pending approvals, and performance metrics.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-[#0a0a0f] relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full border-t border-dashed border-gray-600"
            style={{ top: `${i * 10}%` }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-violet-400 text-sm font-medium mb-4 block">Our Services</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            AI Solutions That Take Your Institution to the Next Level
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            We design, develop, and implement automation tools that help you work smarter, not harder
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-violet-500/50 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-6 group-hover:bg-violet-600/30 transition-colors">
                <feature.icon className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
