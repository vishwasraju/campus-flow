import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowLeft, Phone, User, Mail, Send, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BookCall = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Consultation request sent successfully!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Request Received!</h1>
          <p className="text-zinc-400">
            Thank you, <span className="text-white font-medium">{formData.name}</span>. Our team will contact you at <span className="text-white font-medium">{formData.phone}</span> or via email soon.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-white text-black hover:bg-zinc-200 w-full rounded-xl h-12 font-semibold"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/10">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-10 px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">CampusFlow</span>
        </Link>
        <Link 
          to="/" 
          className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-12 md:py-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl w-full"
        >
          <div className="text-center mb-10 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Book a Strategy Call
            </h1>
            <p className="text-zinc-400 text-lg">
              Unlock the full potential of your institution with a personalized walkthrough.
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 pt-4">
              <div className="text-[120px] font-bold text-white/[0.02] leading-none select-none">
                CALL
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-400 ml-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-zinc-800/50 border-white/10 focus:border-white/20 h-12 pl-12 rounded-xl text-white placeholder:text-zinc-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-zinc-400 ml-1">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-zinc-800/50 border-white/10 focus:border-white/20 h-12 pl-12 rounded-xl text-white placeholder:text-zinc-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-400 ml-1">Gmail / Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@gmail.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-zinc-800/50 border-white/10 focus:border-white/20 h-12 pl-12 rounded-xl text-white placeholder:text-zinc-600 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-zinc-200 h-14 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Confirm Request
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </>
                )}
              </Button>
              
              <p className="text-[10px] text-center text-zinc-500 uppercase tracking-widest font-medium">
                By clicking confirm, you agree to our contact terms.
              </p>
            </form>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Secure', icon: '🔒' },
              { label: 'Fast Response', icon: '⚡' },
              { label: 'Expert Advice', icon: '🎓' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium text-zinc-400">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BookCall;
