import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "The CPS tracking system has made it incredibly easy to document my research activities. The approval workflow is seamless and transparent.",
    author: "Dr. Priya Sharma",
    role: "HOD, Computer Science",
    avatar: "PS",
    color: "bg-blue-500",
  },
  {
    quote: "Managing faculty leave and timetables across departments is now effortless. The dashboard gives me complete visibility into all activities.",
    author: "Dr. Suresh Reddy",
    role: "Principal",
    avatar: "SR",
    color: "bg-green-500",
  },
  {
    quote: "I love how I can track all my CPS credits in one place. The evidence upload feature and real-time status updates are game-changers.",
    author: "Dr. Rajesh Kumar",
    role: "Associate Professor, CSE",
    avatar: "RK",
    color: "bg-purple-500",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[hsl(220,60%,20%)] mb-4">
            What Our <span className="text-[hsl(217,91%,60%)]">Faculty</span> Says
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from the educators who use our platform every day.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="relative p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow duration-300"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-8 w-10 h-10 bg-[hsl(45,93%,55%)] rounded-lg flex items-center justify-center">
                <Quote className="w-5 h-5 text-[hsl(220,60%,15%)]" />
              </div>
              
              <p className="text-foreground leading-relaxed mt-4 mb-6">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
