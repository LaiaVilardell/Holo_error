import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { UserPlus, User, Users } from 'lucide-react'; // Heart quitado

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' as 'patient' | 'psychologist'
  });
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    if (formData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    const response = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });

    if (response.success) {
      toast({ title: "Account created!", description: "You have registered successfully" });
      navigate('/dashboard'); 
    } else {
      toast({ title: "Registration Error", description: response.message || "Could not create account", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#282c34] p-4">
      <Card className="w-full max-w-md gentle-shadow bg-[#20232a] border-0">
        <CardHeader className="text-center space-y-4">
          <img src="/logo_2.png" alt="Holo Logo" className="w-24 h-24 mx-auto" />
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#8ecae6] to-[#5390d9] bg-clip-text text-transparent">
            Join Holo
          </CardTitle>
          <CardDescription className="text-gray-300">
            Create your account and start your therapeutic journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input id="name" type="text" placeholder="Your full name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="transition-all duration-200 focus:ring-2 focus:ring-[#8ecae6] bg-[#282c34] text-white border-[#8ecae6] placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="transition-all duration-200 focus:ring-2 focus:ring-[#8ecae6] bg-[#282c34] text-white border-[#8ecae6] placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input id="password" type="password" placeholder="At least 6 characters" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="transition-all duration-200 focus:ring-2 focus:ring-[#8ecae6] bg-[#282c34] text-white border-[#8ecae6] placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Repeat your password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="transition-all duration-200 focus:ring-2 focus:ring-[#8ecae6] bg-[#282c34] text-white border-[#8ecae6] placeholder-gray-400" />
            </div>
            <div className="space-y-3">
              <Label className="text-white">Account Type</Label>
              <RadioGroup value={formData.role} onValueChange={(value) => setFormData({...formData, role: value as 'patient' | 'psychologist'})}>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-[#f9a8d4] hover:bg-[#f9a8d4]/20 transition-colors">
                  <RadioGroupItem value="patient" id="patient" />
                  <User className="w-5 h-5 text-[#f9a8d4]" />
                  <div>
                    <Label htmlFor="patient" className="font-medium cursor-pointer text-white">Patient</Label>
                    <p className="text-sm text-gray-400">Access therapeutic tools</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-[#8ecae6] hover:bg-[#8ecae6]/20 transition-colors">
                  <RadioGroupItem value="psychologist" id="psychologist" />
                  <Users className="w-5 h-5 text-[#8ecae6]" />
                  <div>
                    <Label htmlFor="psychologist" className="font-medium cursor-pointer text-white">Psychologist</Label>
                    <p className="text-sm text-gray-400">Manage patients and track progress</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full bg-[#8ecae6] text-[#282c34] font-medium py-2 hover:bg-[#5390d9] hover:text-white transition-all duration-200" disabled={isLoading}>
              {isLoading ? (<div className="flex items-center space-x-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Creating account...</span></div>) : (<div className="flex items-center space-x-2"><UserPlus className="w-4 h-4" /><span>Create Account</span></div>)}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[#f9a8d4] hover:text-[#c084fc] font-medium">
                Log in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;