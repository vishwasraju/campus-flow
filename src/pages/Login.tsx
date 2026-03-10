import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Eye, EyeOff, AlertCircle, User, KeyRound, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (userEmail: string, userPassword = 'password123') => {
    setEmail(userEmail);
    setPassword(userPassword);
    setIsLoading(true);

    const success = await login(userEmail, userPassword);
    if (success) {
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">College Platform System</h1>
          <p className="text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <Card className="border shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-10"
                  />
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pl-10 pr-10"
                  />
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Accounts Section */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-2 hover:bg-blue-50 hover:border-blue-200"
                  onClick={() => handleDemoLogin('rajesh.kumar@college.edu')}
                  disabled={isLoading}
                >
                  <div className="p-1.5 rounded-lg bg-blue-100 mr-2">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-xs">Faculty</div>
                    <div className="text-[10px] text-muted-foreground truncate w-24 text-nowrap">Rajesh Kumar</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-2 hover:bg-green-50 hover:border-green-200"
                  onClick={() => handleDemoLogin('priya.sharma@college.edu')}
                  disabled={isLoading}
                >
                  <div className="p-1.5 rounded-lg bg-green-100 mr-2">
                    <User className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-xs">HOD</div>
                    <div className="text-[10px] text-muted-foreground truncate w-24 text-nowrap">Priya Sharma</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-2 hover:bg-purple-50 hover:border-purple-200"
                  onClick={() => handleDemoLogin('suresh.reddy@college.edu')}
                  disabled={isLoading}
                >
                  <div className="p-1.5 rounded-lg bg-purple-100 mr-2">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-xs">Principal</div>
                    <div className="text-[10px] text-muted-foreground truncate w-24 text-nowrap">Suresh Reddy</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-2 hover:bg-red-50 hover:border-red-200 border-red-100/50"
                  onClick={() => handleDemoLogin('admin@college.edu', 'admin123')}
                  disabled={isLoading}
                >
                  <div className="p-1.5 rounded-lg bg-red-100 mr-2">
                    <Shield className="w-3.5 h-3.5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-xs">Admin</div>
                    <div className="text-[10px] text-muted-foreground">System Access</div>
                  </div>
                </Button>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2024 College Platform System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
