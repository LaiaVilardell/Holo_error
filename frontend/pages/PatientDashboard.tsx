import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Pencil, User, Palette, Smile } from 'lucide-react';
import api from '@/lib/api';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawingsCount, setDrawingsCount] = useState(0);
  const [avatarsCount, setAvatarsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const drawingsResponse = await api.get(`/drawings/users/${user.id}/drawings/`);
          setDrawingsCount(drawingsResponse.data.length);
        } catch (error) { console.error("Error fetching drawings:", error); }

        try {
          const avatarsResponse = await api.get(`/avatars/users/${user.id}/avatars/`);
          setAvatarsCount(avatarsResponse.data.length);
        } catch (error) { console.error("Error fetching avatars:", error); }
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleActivitySelection = (activity: 'drawing' | 'avatar') => {
    navigate(`/conversation-setup?activity=${activity}`);
  };

  return (
    <div className="min-h-screen bg-[#282c34]">
      <header className="bg-[#20232a] border-b border-[#282c34] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <img src="/HOLO.png" alt="Holo Logo" className="w-12 h-12" />
            <div>
              <h1 className="text-xl font-bold text-white">Holo</h1>
              <p className="text-sm text-gray-400">Your safe space</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-[#8ecae6] text-[#282c34]">{user?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">Patient (ID: {user?.id})</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="bg-[#5390d9] text-white hover:bg-[#8ecae6]">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Hi, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-lg text-gray-300">Let's start a new session.</p>
        </div>

        <Card className="gentle-shadow border-0 bg-[#20232a] mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Your Progress</CardTitle>
            <CardDescription className="text-gray-300">A summary of your recent activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-[#20232a] rounded-lg border border-pink-500/50"><p className="text-sm text-gray-400">Drawings Created</p><p className="text-3xl font-bold text-white mt-1">{drawingsCount}</p></div>
              <div className="p-4 bg-[#20232a] rounded-lg border border-blue-500/50"><p className="text-sm text-gray-400">Avatars Customized</p><p className="text-3xl font-bold text-white mt-1">{avatarsCount}</p></div>
              <div className="p-4 bg-[#20232a] rounded-lg border border-purple-500/50"><p className="text-sm text-gray-400">Active Days</p><p className="text-3xl font-bold text-white mt-1">0</p></div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Step 1: Choose an activity</h2>
          <p className="text-md text-gray-300">Select how you want to represent your thoughts today.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="gentle-shadow hover:shadow-lg transition-all duration-300 border-0 bg-[#20232a]">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#f9a8d4] to-[#c084fc] rounded-full flex items-center justify-center mb-4"><Palette className="w-8 h-8 text-white" /></div>
              <CardTitle className="text-2xl font-bold text-white">Create Your Art</CardTitle>
              <CardDescription className="text-gray-300">Express your emotions through drawing from scratch.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => navigate('/patient/drawing')} className="w-full bg-[#c084fc] text-white font-medium py-3 hover:bg-[#a064d9]">
                <Pencil className="w-5 h-5 mr-2" />
                Start Drawing
              </Button>
            </CardContent>
          </Card>

          <Card className="gentle-shadow hover:shadow-lg transition-all duration-300 border-0 bg-[#20232a]">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#8ecae6] to-[#5390d9] rounded-full flex items-center justify-center mb-4"><Smile className="w-8 h-8 text-white" /></div>
              <CardTitle className="text-2xl font-bold text-white">Your Avatar</CardTitle>
              <CardDescription className="text-gray-300">Personalize a pre-made avatar to represent your feelings.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => navigate('/avatar-creator')} className="w-full bg-[#c084fc] text-white font-medium py-3 hover:bg-[#a064d9]">
                <User className="w-5 h-5 mr-2" />
                Customize Avatar
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;