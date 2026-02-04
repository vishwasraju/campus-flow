import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does CPS Portal address the challenges in faculty management?',
    answer:
      'CPS Portal tackles the chaos of faculty evaluation by streamlining the process. We eliminate the noise of paperwork and focus on faculty who can demonstrate their contributions through real work. This way, institutions can evaluate performance without the usual hassle.',
  },
  {
    question: 'What advantages does CPS Portal offer to institutions?',
    answer:
      'CPS Portal provides institutions with a comprehensive view of faculty contributions who have proven their abilities. This means less time spent on manual tracking and more time on making informed decisions. Institutions can confidently evaluate faculty that fits their standards.',
  },
  {
    question: 'What sets CPS Portal apart from other management platforms?',
    answer:
      'What makes CPS Portal stand out is our commitment to proof of work. We go beyond traditional paperwork by assessing faculty based on their actual contributions and achievements. This approach ensures that administrators get a clear picture of faculty capabilities.',
  },
  {
    question: 'How does the approval workflow function?',
    answer:
      'Our two-tier approval system ensures thorough verification. Faculty submit their CPS entries with evidence, which first goes to the HOD for review. Once approved, it moves to the Principal for final verification. You can track the status at every stage.',
  },
];

export function FAQSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-amber-400/80 text-xs font-medium mb-6 block tracking-[0.3em] uppercase">
              [ FAQ ]
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal text-white leading-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Frequently asked questions
            </h2>
            <p className="text-white/50 text-base mt-6">
              Everything you need to know about CPS Portal and how we're changing faculty management.
            </p>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-white/10 rounded-xl px-6 bg-white/[0.01] hover:bg-white/[0.02] transition-colors data-[state=open]:bg-white/[0.03]"
              >
                <AccordionTrigger className="text-white hover:no-underline py-6 text-left text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/50 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
