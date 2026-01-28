import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CollaborationSection() {
  return (
    <section className="py-20 lg:py-32 bg-[hsl(220,14%,96%)]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Illustration */}
          <div className="relative">
            <div className="relative z-10">
              {/* Connected avatars visualization */}
              <div className="flex flex-wrap justify-center items-center gap-4 p-8">
                {/* Center icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <svg className="w-10 h-10 text-[hsl(217,91%,60%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                
                {/* Orbiting avatars */}
                <div className="relative w-64 h-64">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-500 rounded-full border-4 border-white shadow-lg" />
                  <div className="absolute top-1/4 right-0 w-12 h-12 bg-green-500 rounded-full border-4 border-white shadow-lg" />
                  <div className="absolute bottom-1/4 right-0 w-12 h-12 bg-purple-500 rounded-full border-4 border-white shadow-lg" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-500 rounded-full border-4 border-white shadow-lg" />
                  <div className="absolute bottom-1/4 left-0 w-12 h-12 bg-pink-500 rounded-full border-4 border-white shadow-lg" />
                  <div className="absolute top-1/4 left-0 w-12 h-12 bg-cyan-500 rounded-full border-4 border-white shadow-lg" />
                  
                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
                    <circle cx="128" cy="128" r="100" fill="none" stroke="hsl(217, 91%, 60%)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(220,60%,20%)]">
              Work Together Across Departments
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Connect faculty members from CSE, AIML, AIDS, ECE, EEE, and MECH departments. 
              Share resources, collaborate on interdisciplinary projects, and maintain 
              seamless communication with role-based access control.
            </p>
            <ul className="space-y-3">
              {[
                'Real-time approval notifications',
                'Department-wise dashboards',
                'Cross-functional CPS activities',
                'Centralized document management',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-foreground">
                  <div className="w-6 h-6 bg-[hsl(142,71%,45%)]/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[hsl(142,71%,45%)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button 
              className="bg-[hsl(45,93%,55%)] hover:bg-[hsl(45,93%,45%)] text-[hsl(220,60%,15%)] font-semibold px-8 py-6 text-lg rounded-lg mt-4"
            >
              Try It Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
