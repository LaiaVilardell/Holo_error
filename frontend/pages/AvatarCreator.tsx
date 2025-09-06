import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Dices, Save, ArrowRight } from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import { openPeeps, bottts, croodles, lorelei } from '@dicebear/collection';
import { toast } from '@/components/ui/use-toast';

// --- Data for Open Peeps Customization ---
// TODO: Future enhancement: Add visual previews for each option.
const headOptions = ['afro', 'bangs', 'bangs2', 'bantuKnots', 'bear', 'bun', 'bun2', 'buns', 'burly', 'buzzcut', 'cap', 'capBeanie', 'capHipHop', 'cornrows', 'cornrows2', 'dreads1', 'dreads2', 'flatTop', 'flatTopLong', 'grayBun', 'grayMedium', 'grayShort', 'hatBeanie', 'hatHip', 'hijab', 'long', 'longAfro', 'longBangs', 'longCurly', 'medium1', 'medium2', 'medium3', 'mediumBangs', 'mediumBangs2', 'mediumBangs3', 'mediumStraight', 'mohawk', 'mohawk2', 'noHair1', 'noHair2', 'noHair3', 'pomp', 'shaved1', 'shaved2', 'shaved3', 'short1', 'short2', 'short3', 'short4', 'short5', 'turban', 'twists', 'twists2'];
const faceOptions = ['angryWithFang', 'awe', 'blank', 'calm', 'calmWithTeeth', 'cheeky', 'concerned', 'concernedFear', 'contempt', 'cute', 'cyclops', 'driven', 'eatingHappy', 'explaining', 'fear', 'hectic', 'lovingGrin1', 'lovingGrin2', 'monster', 'old', 'rage', 'serious', 'smile', 'smileBig', 'smileLOL', 'smileTeeth', 'solemn', 'suspicious', 'tired', 'veryAngry'];
const facialHairOptions = ['beard', 'beardAndStache', 'goatee', 'pyramid', 'shadow', 'soulPatch', 'stache'];
const accessoriesOptions = ['eyepatch', 'glasses', 'glasses2', 'glasses3', 'glasses4', 'glasses5', 'sunglasses', 'sunglasses2'];

const fantasyStyles = [
    { name: 'Bottts', style: bottts },
    { name: 'Croodles', style: croodles },
    { name: 'Lorelei', style: lorelei },
];

const skinColorOptions = [
  { name: 'Light', hex: '#FDEFE5' },
  { name: 'Medium', hex: '#E0AC69' },
  { name: 'Dark', hex: '#8D5524' },
];

const hairColorOptions = [
  { name: 'Black', hex: '#000000' },
  { name: 'Brown', hex: '#6F4E37' },
  { name: 'Blonde', hex: '#F5DEB3' },
  { name: 'Red', hex: '#B22222' },
  { name: 'Gray', hex: '#808080' },
];

const AvatarCreator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState('human');

  // --- Human (Open Peeps) State ---
  const [head, setHead] = useState('long');
  const [face, setFace] = useState('smile');
  const [facialHair, setFacialHair] = useState('stache');
  const [accessories, setAccessories] = useState('glasses');
  const [skinColor, setSkinColor] = useState(skinColorOptions[1].hex);
  const [hairColor, setHairColor] = useState(hairColorOptions[0].hex);

  // --- Fantasy & Animal State ---
  const [fantasyStyle, setFantasyStyle] = useState(fantasyStyles[0]);
  const [fantasySeed, setFantasySeed] = useState('default-seed');

  const avatar = useMemo(() => {
    if (tab === 'human') {
      return createAvatar(openPeeps, {
        head: [head],
        face: [face],
        facialHair: [facialHair],
        accessories: [accessories],
        skinColor: [skinColor],
        hairColor: [hairColor],
        accessoriesProbability: 100,
        facialHairProbability: 100,
      }).toDataUri();
    } else {
        return createAvatar(fantasyStyle.style, {
            seed: fantasySeed,
        }).toDataUri();
    }
  }, [tab, head, face, facialHair, accessories, skinColor, hairColor, fantasyStyle, fantasySeed]);

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save an avatar.", variant: "destructive" });
      return;
    }
    try {
      await api.put(`/users/${user.id}/avatar`, { avatar: avatar });
      toast({ title: "Avatar Saved!", description: "Your new avatar has been saved to your profile." });
      navigate('/conversation-setup?activity=avatar');
    } catch (error) {
      console.error("Failed to save avatar:", error);
      toast({ title: "Error", description: "Could not save your avatar.", variant: "destructive" });
    }
  };

  const randomizeFantasy = () => {
    setFantasySeed(Math.random().toString(36).substring(7));
  }

  return (
    <div className="min-h-screen bg-[#282c34] text-white p-4">
      <header className="bg-[#20232a] border-b border-[#282c34] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/patient/dashboard')} className="bg-[#5390d9] text-white hover:bg-[#8ecae6]"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
            <div><h1 className="text-xl font-bold text-white">Step 1: Customize Your Avatar</h1><p className="text-sm text-gray-300">Be as realistic as you want</p></div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleSave} className="bg-[#f9a8d4] text-[#282c34] hover:bg-[#c084fc] hover:text-white">
              Save & Continue to Step 2
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8">
        <Card className="gentle-shadow border-0 bg-[#20232a]">
            <CardContent className="p-6 grid md:grid-cols-2 gap-8 items-start">
                <div className="bg-[#20232a] rounded-lg p-4 flex justify-center items-center h-96">
                    <img src={avatar} alt="Avatar" className="w-80 h-80" />
                </div>
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="human">Human</TabsTrigger>
                        <TabsTrigger value="fantasy">Fantasy & Animal</TabsTrigger>
                    </TabsList>
                    <TabsContent value="human" className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-300">Head</Label>
                                <Select value={head} onValueChange={setHead}>
                                    <SelectTrigger className="bg-[#282c34] text-white border-gray-600"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-[#282c34] text-white">{headOptions.map(o => <SelectItem key={o} value={o} className="focus:bg-[#8ecae6]">{o}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-300">Face</Label>
                                <Select value={face} onValueChange={setFace}>
                                    <SelectTrigger className="bg-[#282c34] text-white border-gray-600"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-[#282c34] text-white">{faceOptions.map(o => <SelectItem key={o} value={o} className="focus:bg-[#8ecae6]">{o}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-300">Facial Hair</Label>
                                <Select value={facialHair} onValueChange={setFacialHair}>
                                    <SelectTrigger className="bg-[#282c34] text-white border-gray-600"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-[#282c34] text-white">{facialHairOptions.map(o => <SelectItem key={o} value={o} className="focus:bg-[#8ecae6]">{o}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-300">Accessories</Label>
                                <Select value={accessories} onValueChange={setAccessories}>
                                    <SelectTrigger className="bg-[#282c34] text-white border-gray-600"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-[#282c34] text-white">{accessoriesOptions.map(o => <SelectItem key={o} value={o} className="focus:bg-[#8ecae6]">{o}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-300">Skin Color</Label>
                                <Select value={skinColor} onValueChange={setSkinColor}>
                                    <SelectTrigger className="bg-[#282c34] text-white border-gray-600"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-[#282c34] text-white">
                                        {skinColorOptions.map(o => <SelectItem key={o.name} value={o.hex} className="focus:bg-[#8ecae6]">{o.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-300">Hair Color</Label>
                                <Select value={hairColor} onValueChange={setHairColor}>
                                    <SelectTrigger className="bg-[#282c34] text-white border-gray-600"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-[#282c34] text-white">
                                        {hairColorOptions.map(o => <SelectItem key={o.name} value={o.hex} className="focus:bg-[#8ecae6]">{o.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="fantasy" className="space-y-4 py-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-300">Style</Label>
                            <Select value={fantasyStyle.name} onValueChange={(name) => setFantasyStyle(fantasyStyles.find(s => s.name === name) || fantasyStyle)}>
                                <SelectTrigger className="bg-[#282c34] text-white border-gray-600"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-[#282c34] text-white">{fantasyStyles.map(s => <SelectItem key={s.name} value={s.name} className="focus:bg-[#8ecae6]">{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <Button onClick={randomizeFantasy} className="w-full bg-[#c084fc] text-white font-medium py-3 hover:bg-[#a064d9]">
                            <Dices className="w-5 h-5 mr-2" />
                            Randomize
                        </Button>
                    </TabsContent>
                </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AvatarCreator;
