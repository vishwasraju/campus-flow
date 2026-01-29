import { motion } from 'framer-motion';
import { Zap, Bot, MessageSquare } from 'lucide-react';

const services = [
  {
    icon: Zap,
    title: 'Workflow Automation',
    subtitle: 'Automate repetitive tasks',
    description:
      'We help you streamline internal operations by automating manual workflows like data entry, reporting, and approval chains—saving time and cutting down errors.',
    tags: ['Internal Task Bots', '100+ Automations'],
  },
  {
    icon: Bot,
    title: 'AI Assistant',
    subtitle: 'Delegate Daily Tasks',
    description:
      'From managing calendars to drafting emails and summarizing meetings, our AI assistants work around the clock to keep your institution running smarter and faster.',
    tags: ['Summaries', 'Scheduling', 'Many more'],
  },
];

export function CollaborationSection() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-[#0a0a0f] relative overflow-hidden">
      {/* Subtle purple glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-violet-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <service.icon className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <p className="text-violet-400 text-sm font-medium">{service.title}</p>
                  <h3 className="text-2xl font-bold text-white">{service.subtitle}</h3>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Chat Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 p-8 rounded-2xl bg-white/[0.02] border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold">What can I help with?</h4>
              <p className="text-gray-500 text-sm">
                Whether you need help with approvals or making changes to your schedule, just give me a command
              </p>
            </div>
          </div>

          {/* Mock input */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Generate a CPS report</span>
              <motion.span
                className="w-0.5 h-5 bg-violet-400"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            {['Add document', 'Analyze', 'Generate Report', 'Schedule', 'E-mail Sending'].map((action) => (
              <span
                key={action}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                {action}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
