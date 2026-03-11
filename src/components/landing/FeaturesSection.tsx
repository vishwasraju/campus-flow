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
    <section id="features" className="py-24 lg:py-32 bg-transparent relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-amber-400/80 text-xs font-medium mb-6 block tracking-[0.3em] uppercase">
            [ OUR SERVICES ]
          </span>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-serif font-normal text-white mb-6 leading-tight"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Solutions That Take Your Institution to the Next Level
          </h2>
          <p className="text-base text-white/50 leading-relaxed tracking-wide">
            We design, develop, and implement automation tools that help you work smarter, not harder
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-8 bg-black/40 backdrop-blur-md hover:bg-white/[0.05] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-amber-400/10 group-hover:border-amber-400/30 transition-all duration-300">
                <feature.icon className="w-5 h-5 text-white/60 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="text-lg font-medium text-white mb-3 tracking-wide">{feature.title}</h3>
              <p className="text-white/40 leading-relaxed text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
