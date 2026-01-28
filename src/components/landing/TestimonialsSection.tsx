import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "The CPS tracking system has made it incredibly easy to document my research activities. The approval workflow is seamless and transparent.",
    author: "Dr. Priya Sharma",
    role: "HOD, Computer Science",
    avatar: "PS",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    quote: "Managing faculty leave and timetables across departments is now effortless. The dashboard gives me complete visibility into all activities.",
    author: "Dr. Suresh Reddy",
    role: "Principal",
    avatar: "SR",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    quote: "I love how I can track all my CPS credits in one place. The evidence upload feature and real-time status updates are game-changers.",
    author: "Dr. Rajesh Kumar",
    role: "Associate Professor, CSE",
    avatar: "RK",
    gradient: "from-purple-500 to-pink-500",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-28 lg:py-40 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-100 rounded-full blur-[150px] opacity-40" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-100 rounded-full blur-[150px] opacity-40" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            What Our
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Faculty </span>
            Says
          </h2>
          <p className="text-xl text-slate-600">
            Hear from the educators who use our platform every day.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="relative group p-8 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Quote icon */}
              <div className={`absolute -top-5 left-8 w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                <Quote className="w-6 h-6 text-white" />
              </div>
              
              {/* Stars */}
              <div className="flex gap-1 mb-4 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-8 text-lg">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.gradient} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{testimonial.author}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}