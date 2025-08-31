import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Save, RotateCcw, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

import Face from '@/components/avatar_parts/Face';
import Eyes from '@/components/avatar_parts/Eyes';
import Mouth from '@/components/avatar_parts/Mouth';
import HairShort from '@/components/avatar_parts/HairShort';
import HairLong from '@/components/avatar_parts/HairLong';

interface AvatarFeatures {
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  skinTone: string;
}

const Avatar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [features, setFeatures] = useState<AvatarFeatures>({
    hairStyle: 'short',
    hairColor: '#8B4513',
    eyeColor: '#4A5568',
    skinTone: '#F7E6D3',
  });

  const hairStyles = [{ id: 'short', name: 'Short', emoji: '👦' }, { id: 'long', name: 'Long', emoji: '👧' }];
  const hairColors = ['#8B4513', '#000000', '#654321', '#DAA520', '#FF6347', '#9932CC', '#4169E1', '#32CD32'];
  const eyeColors = ['#4A5568', '#8B4513', '#228B22', '#4169E1', '#9932CC', '#FF6347', '#000000', '#808080'];
  const skinTones = ['#F7E6D3', '#E8B887', '#D2956F', '#C07951', '#A0522D', '#8B4513', '#654321', '#4A2C2A'];

  const updateFeature = (feature: keyof AvatarFeatures, value: string) => {
    setFeatures(prev => ({ ...prev, [feature]: value }));
  };

  const resetAvatar = () => {
    setFeatures({ hairStyle: 'short', hairColor: '#8B4513', eyeColor: '#4A5568', skinTone: '#F7E6D3' });
    toast({ title: "Avatar reset", description: "Default features have been restored" });
  };

  const saveAndContinue = async () => {
    if (!user) return;
    const payload = {
      hair_style: features.hairStyle,
      hair_color: features.hairColor,
      eye_color: features.eyeColor,
      eyebrow_style: 'default',
      skin_tone: features.skinTone,
      face_shape: 'default',
    };
    try {
      await api.post(`/avatars/users/${user.id}/avatars/`, payload);
      toast({ title: "Avatar Saved!", description: "Your avatar has been saved to your profile." });
      navigate('/conversation-setup?activity=avatar');
    } catch (error) {
      console.error("Failed to save avatar:", error);
      toast({ title: "Error", description: "Could not save avatar.", variant: "destructive" });
    }
  };

  const AvatarPreview = () => (
    <div className="w-48 h-48 mx-auto flex items-center justify-center">
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {features.hairStyle === 'short' && <HairShort hairColor={features.hairColor} />}
        {features.hairStyle === 'long' && <HairLong hairColor={features.hairColor} />}
        <Face skinTone={features.skinTone} />
        <Eyes eyeColor={features.eyeColor} />
        <Mouth />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-white to-[#f3e8ff]">
      <header className="bg-[#20232a] border-b border-[#282c34] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/patient/dashboard')} className="text-[#8ecae6] border-[#8ecae6] hover:text-white hover:bg-[#8ecae6]/20"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
            <div><h1 className="text-xl font-bold text-white">Step 1: Customize Your Avatar</h1><p className="text-sm text-gray-300">Create your unique virtual face</p></div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={resetAvatar} variant="outline" className="text-[#f9a8d4] border-[#f9a8d4] hover:text-white hover:bg-[#f9a8d4]/20"><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
            <Button onClick={saveAndContinue} className="bg-[#8ecae6] text-[#282c34] hover:bg-[#5390d9] hover:text-white">
              Save & Continue to Step 2
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 gentle-shadow border-0 bg-[#20232a]">
            <CardHeader><CardTitle className="flex items-center space-x-2 text-center text-white"><User className="w-5 h-5" /><span>Your Avatar</span></CardTitle></CardHeader>
            <CardContent className="space-y-6"><AvatarPreview /></CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="gentle-shadow border-0 bg-[#20232a]">
              <CardHeader><CardTitle className="text-white">Hair Style</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {hairStyles.map((style) => (<button key={style.id} onClick={() => updateFeature('hairStyle', style.id)} className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${features.hairStyle === style.id ? 'border-[#8ecae6] bg-[#e0f2fe]' : 'border-gray-700 hover:border-[#8ecae6] hover:bg-[#23263a]'}`}><div className="text-2xl mb-2">{style.emoji}</div><p className="text-sm font-medium text-white">{style.name}</p></button>))}
                </div>
              </CardContent>
            </Card>

            <Card className="gentle-shadow border-0 bg-[#20232a]">
              <CardHeader><CardTitle className="text-white">Hair Color</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2">
                  {hairColors.map((color) => (<button key={color} onClick={() => updateFeature('hairColor', color)} className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${features.hairColor === color ? 'border-[#8ecae6] scale-110' : 'border-gray-700 hover:scale-105'}`} style={{ backgroundColor: color }} />))}
                </div>
              </CardContent>
            </Card>

            <Card className="gentle-shadow border-0 bg-[#20232a]">
              <CardHeader><CardTitle className="text-white">Eye Color</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2">
                  {eyeColors.map((color) => (<button key={color} onClick={() => updateFeature('eyeColor', color)} className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${features.eyeColor === color ? 'border-[#8ecae6] scale-110' : 'border-gray-700 hover:scale-105'}`} style={{ backgroundColor: color }} />))}
                </div>
              </CardContent>
            </Card>

            <Card className="gentle-shadow border-0 bg-[#20232a]">
              <CardHeader><CardTitle className="text-white">Skin Tone</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2">
                  {skinTones.map((tone) => (<button key={tone} onClick={() => updateFeature('skinTone', tone)} className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${features.skinTone === tone ? 'border-[#8ecae6] scale-110' : 'border-gray-700 hover:scale-105'}`} style={{ backgroundColor: tone }} />))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;