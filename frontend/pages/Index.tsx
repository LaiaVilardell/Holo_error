import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Palette, Smile, ArrowRight, Sparkles } from 'lucide-react'; // Heart quitado, Sparkles añadido

const Index = () => {
  return (
    <div className="min-h-screen bg-[#282c34] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            {/* Logo */}
            <img src="/HOLO.png" alt="Holo Logo" className="w-40 h-40 mx-auto" />
            
            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#8ecae6] to-[#5390d9] bg-clip-text text-transparent">
              Holo
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Quiet the voice. Hear yourself again.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="bg-[#8ecae6] text-[#282c34] px-8 py-3 text-lg hover:bg-[#5390d9] hover:text-white transition-all duration-200">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" 
                className="px-8 py-3 text-lg border-2 border-[#f9a8d4] text-[#282c34] bg-[#f9a8d4] hover:bg-[#c084fc] hover:border-[#c084fc] hover:text-white transition-all duration-200">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-0">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Designed for Wellbeing
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Specialized tools for every type of user, 
            creating a safe and effective therapeutic environment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Patient Features */}
          <Card className="gentle-shadow border-0 bg-[#20232a] hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#282c34] rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-[#8ecae6]" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">For Patients</CardTitle>
              <CardDescription className="text-gray-300">Friendly interface and innovative therapeutic tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3"><Palette className="w-5 h-5 text-[#f9a8d4]" /><span className="text-gray-200">Therapeutic drawing tool</span></div>
              <div className="flex items-center space-x-3"><Smile className="w-5 h-5 text-[#8ecae6]" /><span className="text-gray-200">Avatar customization</span></div>
              <div className="flex items-center space-x-3"><Sparkles className="w-5 h-5 text-[#f9a8d4]" /><span className="text-gray-200">Emotional progress tracking</span></div>
            </CardContent>
          </Card>

          {/* Therapist Features */}
          <Card className="gentle-shadow border-0 bg-[#20232a] hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#282c34] rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[#5390d9]" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">For Therapists</CardTitle>
              <CardDescription className="text-gray-300">Professional management and tracking dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3"><Users className="w-5 h-5 text-[#8ecae6]" /><span className="text-gray-200">Patient list management</span></div>
              <div className="flex items-center space-x-3"><Palette className="w-5 h-5 text-[#c084fc]" /><span className="text-gray-200">Patient drawing visualization</span></div>
              <div className="flex items-center space-x-3"><Sparkles className="w-5 h-5 text-[#5390d9]" /><span className="text-gray-200">Progress tracking and notes</span></div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#8ecae6] to-[#5390d9] py-16 mt-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#282c34] mb-4">Ready to start your journey?</h2>
          <p className="text-xl text-[#20232a] mb-8">Join Holo and discover a new way to approach mental wellbeing</p>
          <Link to="/register"><Button className="bg-[#282c34] text-[#8ecae6] px-8 py-3 text-lg hover:bg-[#20232a] hover:text-white font-semibold">Create Free Account</Button></Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#20232a] border-t border-[#282c34] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/HOLO.png" alt="Holo Logo" className="w-8 h-8" />
            <span className="font-bold text-white">Holo</span>
          </div>
          <p className="text-gray-400">© 2025 Holo. Designed with care for mental wellbeing.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;