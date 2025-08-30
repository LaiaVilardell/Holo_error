import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Pencil, User, Heart, Palette, Smile } from 'lucide-react';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#282c34]">
      {/* Header */}
      <header className="bg-[#20232a] border-b border-[#282c34] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#8ecae6] to-[#c084fc] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Holo</h1>
              <p className="text-sm text-gray-400">Your safe space</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-[#8ecae6] text-[#282c34]">
                  {user?.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">Patient</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-[#8ecae6] border-[#8ecae6] hover:text-white hover:bg-[#8ecae6] transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Hi, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-lg text-gray-300">
            How are you feeling today? Explore the activities we have for you.
          </p>
        </div>

        {/* Activity Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Drawing Activity */}
          <Card className="gentle-shadow hover:shadow-lg transition-all duration-300 border-0 bg-[#20232a]">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#f9a8d4] to-[#c084fc] rounded-full flex items-center justify-center mb-4">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Create Your Art
              </CardTitle>
              <CardDescription className="text-gray-300">
                Express your emotions through drawing. A fun and therapeutic way to communicate.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/drawing')}
                className="w-full bg-[#8ecae6] text-[#282c34] font-medium py-3 hover:bg-[#5390d9] hover:text-white transition-all duration-200"
              >
                <Pencil className="w-5 h-5 mr-2" />
                Start Drawing
              </Button>
            </CardContent>
          </Card>

          {/* Avatar Customization */}
          <Card className="gentle-shadow hover:shadow-lg transition-all duration-300 border-0 bg-[#20232a]">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#8ecae6] to-[#5390d9] rounded-full flex items-center justify-center mb-4">
                <Smile className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Your Avatar
              </CardTitle>
              <CardDescription className="text-gray-300">
                Personalize your virtual face. Change your hair, eyes, eyebrows, and more to create your unique avatar.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/avatar')}
                className="w-full bg-[#f9a8d4] text-[#282c34] font-medium py-3 hover:bg-[#c084fc] hover:text-white transition-all duration-200"
              >
                <User className="w-5 h-5 mr-2" />
                Customize Avatar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="gentle-shadow border-0 bg-[#20232a]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Your Progress</CardTitle>
            <CardDescription className="text-gray-300">A summary of your recent activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-[#f9a8d4] rounded-lg">
                <div className="text-2xl font-bold text-[#c084fc] mb-1">5</div>
                <p className="text-sm text-[#c084fc]">Drawings Created</p>
              </div>
              <div className="text-center p-4 bg-[#8ecae6] rounded-lg">
                <div className="text-2xl font-bold text-[#282c34] mb-1">3</div>
                <p className="text-sm text-[#282c34]">Avatars Customized</p>
              </div>
              <div className="text-center p-4 bg-[#c084fc] rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">12</div>
                <p className="text-sm text-white">Active Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PatientDashboard;
