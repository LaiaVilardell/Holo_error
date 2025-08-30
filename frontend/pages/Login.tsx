import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { LogIn, Heart } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const success = await login(email, password);
    if (success) {
      toast({
        title: "Welcome!",
        description: "You have successfully logged in",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Authentication Error",
        description: "Incorrect email or password",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#282c34] p-4">
      <Card className="w-full max-w-md gentle-shadow bg-[#20232a] border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-[#282c34] rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-[#8ecae6]" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#8ecae6] to-[#5390d9] bg-clip-text text-transparent">
            Holo
          </CardTitle>
          <CardDescription className="text-gray-300">
            Access your personalized therapeutic space
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-[#8ecae6] bg-[#282c34] text-white border-[#8ecae6] placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-[#8ecae6] bg-[#282c34] text-white border-[#8ecae6] placeholder-gray-400"
              />
            </div>
            
            <div className="bg-[#23263a] p-3 rounded-lg text-sm text-[#8ecae6] space-y-1">
              <p><strong>Test accounts:</strong></p>
              <p>Patient: patient@test.com / 123456</p>
              <p>Psychologist: psyco@test.com / 123456</p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#8ecae6] text-[#282c34] font-medium py-2 hover:bg-[#5390d9] hover:text-white transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#f9a8d4] hover:text-[#c084fc] font-medium">
                Register here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
