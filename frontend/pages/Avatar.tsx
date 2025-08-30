import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Save, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AvatarFeatures {
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  eyebrowStyle: string;
  skinTone: string;
  faceShape: string;
}

const Avatar = () => {
  const navigate = useNavigate();
  const [features, setFeatures] = useState<AvatarFeatures>({
    hairStyle: 'short',
    hairColor: '#8B4513',
    eyeColor: '#4A5568',
    eyebrowStyle: 'normal',
    skinTone: '#F7E6D3',
    faceShape: 'oval'
  });

  const hairStyles = [
    { id: 'short', name: 'Short', emoji: '👦' },
    { id: 'long', name: 'Long', emoji: '👧' },
    { id: 'curly', name: 'Curly', emoji: '👨‍🦱' },
    { id: 'braids', name: 'Braids', emoji: '👩‍🦱' },
    { id: 'bald', name: 'Bald', emoji: '👨‍🦲' },
    { id: 'ponytail', name: 'Ponytail', emoji: '👱‍♀️' }
  ];

  const hairColors = [
    '#8B4513', '#000000', '#654321', '#DAA520', 
    '#FF6347', '#9932CC', '#4169E1', '#32CD32'
  ];

  const eyeColors = [
    '#4A5568', '#8B4513', '#228B22', '#4169E1', 
    '#9932CC', '#FF6347', '#000000', '#808080'
  ];

  const eyebrowStyles = [
    { id: 'normal', name: 'Normal' },
    { id: 'thick', name: 'Thick' },
    { id: 'thin', name: 'Thin' },
    { id: 'arched', name: 'Arched' }
  ];

  const skinTones = [
    '#F7E6D3', '#E8B887', '#D2956F', '#C07951', 
    '#A0522D', '#8B4513', '#654321', '#4A2C2A'
  ];

  const faceShapes = [
    { id: 'oval', name: 'Oval' },
    { id: 'round', name: 'Round' },
    { id: 'square', name: 'Square' },
    { id: 'heart', name: 'Heart' }
  ];

  const updateFeature = (feature: keyof AvatarFeatures, value: string) => {
    setFeatures(prev => ({ ...prev, [feature]: value }));
  };

  const resetAvatar = () => {
    setFeatures({
      hairStyle: 'short',
      hairColor: '#8B4513',
      eyeColor: '#4A5568',
      eyebrowStyle: 'normal',
      skinTone: '#F7E6D3',
      faceShape: 'oval'
    });
    toast({
      title: "Avatar reset",
      description: "Default features have been restored",
    });
  };

  const saveAvatar = () => {
    // Here you would save the avatar to the database
    toast({
      title: "Avatar saved!",
      description: "Your personalized avatar has been saved successfully",
    });
  };

  const AvatarPreview = () => (
    <div className="relative w-48 h-48 mx-auto bg-gradient-to-b from-[#e0f2fe] to-[#f3e8ff] rounded-full border-4 border-white shadow-lg overflow-hidden">
      {/* Face */}
      <div 
        className="absolute inset-4 rounded-full"
        style={{ backgroundColor: features.skinTone }}
      >
        {/* Hair */}
        <div 
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-16 rounded-t-full ${
            features.hairStyle === 'bald' ? 'hidden' : ''
          }`}
          style={{ backgroundColor: features.hairColor }}
        />
        
        {/* Eyes */}
        <div className="absolute top-12 left-8 w-4 h-4 rounded-full bg-white">
          <div 
            className="w-3 h-3 rounded-full absolute top-0.5 left-0.5"
            style={{ backgroundColor: features.eyeColor }}
          />
        </div>
        <div className="absolute top-12 right-8 w-4 h-4 rounded-full bg-white">
          <div 
            className="w-3 h-3 rounded-full absolute top-0.5 left-0.5"
            style={{ backgroundColor: features.eyeColor }}
          />
        </div>
        
        {/* Eyebrows */}
        <div 
          className={`absolute top-10 left-7 w-6 h-1 rounded ${
            features.eyebrowStyle === 'thick' ? 'h-2' : 
            features.eyebrowStyle === 'thin' ? 'h-0.5' : 'h-1'
          }`}
          style={{ backgroundColor: features.hairColor }}
        />
        <div 
          className={`absolute top-10 right-7 w-6 h-1 rounded ${
            features.eyebrowStyle === 'thick' ? 'h-2' : 
            features.eyebrowStyle === 'thin' ? 'h-0.5' : 'h-1'
          }`}
          style={{ backgroundColor: features.hairColor }}
        />
        
        {/* Nose */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-black opacity-10 rounded"></div>
        
        {/* Mouth */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-red-400 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-white to-[#f3e8ff]">
      {/* Header */}
      <header className="bg-[#20232a] border-b border-[#282c34] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="text-[#8ecae6] border-[#8ecae6] hover:text-white hover:bg-[#8ecae6] transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Customize your Avatar</h1>
              <p className="text-sm text-gray-300">Create your unique virtual face</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={resetAvatar} variant="outline" className="text-[#f9a8d4] border-[#f9a8d4] hover:text-white hover:bg-[#f9a8d4] transition-all duration-200">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={saveAvatar} className="bg-[#8ecae6] text-[#282c34] hover:bg-[#5390d9] hover:text-white transition-all duration-200">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Preview */}
          <Card className="lg:col-span-1 gentle-shadow border-0 bg-[#20232a]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-center text-white">
                <User className="w-5 h-5" />
                <span>Your Avatar</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AvatarPreview />
              
              <div className="bg-gradient-to-r from-[#e0f2fe] to-[#f3e8ff] p-4 rounded-lg text-center">
                <p className="text-sm text-[#5390d9] font-medium">✨ Looking great!</p>
                <p className="text-xs text-gray-500 mt-1">
                  Keep customizing to make your avatar unique
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customization Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hair Style */}
            <Card className="gentle-shadow border-0 bg-[#20232a]">
              <CardHeader>
                <CardTitle className="text-white">Hair Style</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {hairStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => updateFeature('hairStyle', style.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                        features.hairStyle === style.id
                          ? 'border-[#8ecae6] bg-[#e0f2fe]'
                          : 'border-gray-700 hover:border-[#8ecae6] hover:bg-[#23263a]'
                      }`}
                    >
                      <div className="text-2xl mb-2">{style.emoji}</div>
                      <p className="text-sm font-medium text-white">{style.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hair Color */}
            <Card className="gentle-shadow border-0 bg-[#20232a]">
              <CardHeader>
                <CardTitle className="text-white">Hair Color</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2">
                  {hairColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateFeature('hairColor', color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        features.hairColor === color
                          ? 'border-[#8ecae6] scale-110'
                          : 'border-gray-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Eye Color */}
            <Card className="gentle-shadow border-0 bg-[#20232a]">
              <CardHeader>
                <CardTitle className="text-white">Eye Color</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2">
                  {eyeColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateFeature('eyeColor', color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        features.eyeColor === color
                          ? 'border-[#8ecae6] scale-110'
                          : 'border-gray-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Eyebrows */}
            <Card className="gentle-shadow border-0 bg-[#20232a]">
              <CardHeader>
                <CardTitle className="text-white">Eyebrow Style</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {eyebrowStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => updateFeature('eyebrowStyle', style.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                        features.eyebrowStyle === style.id
                          ? 'border-[#8ecae6] bg-[#e0f2fe]'
                          : 'border-gray-700 hover:border-[#8ecae6] hover:bg-[#23263a]'
                      }`}
                    >
                      <p className="text-sm font-medium text-white">{style.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skin Tone */}
            <Card className="gentle-shadow border-0 bg-[#20232a]">
              <CardHeader>
                <CardTitle className="text-white">Skin Tone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2">
                  {skinTones.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => updateFeature('skinTone', tone)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        features.skinTone === tone
                          ? 'border-[#8ecae6] scale-110'
                          : 'border-gray-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: tone }}
                    />
                  ))}
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
