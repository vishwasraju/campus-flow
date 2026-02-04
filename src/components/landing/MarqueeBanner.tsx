import { motion } from 'framer-motion';

const marqueeItems = [
  { icon: '✦', text: 'STREAMLINED WORKFLOWS' },
  { icon: '📞', text: 'BOOK CALL: SCHEDULE A 30M CONSULTATION', highlight: true },
  { icon: '✉', text: 'EMAIL: SUPPORT@CPSPORTAL.IN' },
  { icon: '⚡', text: 'FAST: MANAGE BETTER, WORK SMARTER' },
  { icon: '💎', text: 'QUALITY: CURATED, PRE-VETTED FEATURES' },
];

export function MarqueeBanner() {
  return (
    <div className="bg-black border-b border-white/10 py-2.5 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1920] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...Array(4)].map((_, setIndex) => (
          <div key={setIndex} className="flex items-center">
            {marqueeItems.map((item, index) => (
              <div key={`${setIndex}-${index}`} className="flex items-center mx-8">
                <span className="text-white/60 mr-2 text-xs">{item.icon}</span>
                <span
                  className={`text-[11px] tracking-[0.2em] font-medium ${
                    item.highlight
                      ? 'text-white bg-white/10 px-2 py-0.5 rounded'
                      : 'text-white/60'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
