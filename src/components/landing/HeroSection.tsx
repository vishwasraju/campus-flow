import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative bg-[hsl(220,60%,20%)] text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[hsl(217,91%,60%)]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[hsl(217,91%,60%)]/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Streamline Your
              <span className="text-[hsl(45,93%,55%)]"> Academic </span>
              Excellence
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-lg">
              A comprehensive platform for faculty to track CPS credits, manage timetables, 
              apply for leave, and collaborate seamlessly across departments.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                asChild
                className="bg-[hsl(45,93%,55%)] hover:bg-[hsl(45,93%,45%)] text-[hsl(220,60%,15%)] font-semibold px-8 py-6 text-lg rounded-lg"
              >
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
          
          {/* Right illustration */}
          <div className="relative">
            <div className="bg-[hsl(217,91%,60%)]/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="bg-white rounded-xl p-4 shadow-2xl">
                {/* Mock dashboard preview */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="flex-1 h-4 bg-gray-100 rounded ml-4" />
                </div>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="w-1/4 h-24 bg-blue-100 rounded-lg" />
                    <div className="w-1/4 h-24 bg-green-100 rounded-lg" />
                    <div className="w-1/4 h-24 bg-purple-100 rounded-lg" />
                    <div className="w-1/4 h-24 bg-orange-100 rounded-lg" />
                  </div>
                  <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg" />
                  <div className="flex gap-4">
                    <div className="flex-1 h-20 bg-gray-50 rounded-lg" />
                    <div className="flex-1 h-20 bg-gray-50 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-[hsl(45,93%,55%)] text-[hsl(220,60%,15%)] font-bold px-4 py-2 rounded-lg shadow-lg">
              150+ CPS Credits
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white text-[hsl(220,60%,20%)] font-medium px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              Approved by HOD
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
