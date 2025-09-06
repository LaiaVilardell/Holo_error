import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Dices } from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import { adventurer, bigEars, lorelei, notionists, funEmoji } from '@dicebear/collection';

const avatarStyles = [
  { name: 'Adventurer', style: adventurer },
  { name: 'Big Ears', style: bigEars },
  { name: 'Lorelei', style: lorelei },
  { name: 'Notionists', style: notionists },
  { name: 'Fun Emoji', style: funEmoji },
];

const ConversationSetup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activity = searchParams.get('activity');

  const [step, setStep] = useState(activity === 'drawing' || activity === 'avatar' ? 2 : 1);

  // Step 1: Avatar State
  const [avatarStyle, setAvatarStyle] = useState(avatarStyles[0].style);
  const [avatarSeed, setAvatarSeed] = useState('default-seed');

  // Step 2: Session State
  const [tcaType, setTcaType] = useState('general');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string | undefined>();

  const avatar = useMemo(() => {
    return createAvatar(avatarStyle, {
      seed: avatarSeed,
      radius: 50,
      backgroundColor: ['transparent'], // Use transparent background
    }).toDataUri();
  }, [avatarStyle, avatarSeed]);

  useEffect(() => {
    if (step === 2) {
      const handleVoicesChanged = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0) {
          const defaultVoice = availableVoices.find(v => v.lang.includes('es')) || availableVoices[0];
          if (defaultVoice) setSelectedVoiceUri(defaultVoice.voiceURI);
        }
      };
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      handleVoicesChanged();
      return () => { window.speechSynthesis.onvoiceschanged = null; };
    }
  }, [step]);

  const handleNextStep = () => setStep(2);
  const randomizeAvatar = () => setAvatarSeed(Math.random().toString(36).substring(7));

  const handleSubmit = () => {
    const avatarUrl = encodeURIComponent(avatar);
    navigate(`/conversation?activity=${activity}&tca=${tcaType}&voice=${encodeURIComponent(selectedVoiceUri || '')}&avatar=${avatarUrl}`);
  };

  const renderStep1 = () => (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Step 1: Create your Avatar</CardTitle>
        <p className="text-gray-400">Customize your companion for the conversation.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center bg-gray-700 rounded-full p-4">
          <img src={avatar} alt="Avatar" className="w-40 h-40" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar-style" className="text-white">Avatar Style</Label>
          <Select onValueChange={(value) => setAvatarStyle(avatarStyles.find(s => s.name === value)?.style || avatarStyles[0].style)}>
            <SelectTrigger id="avatar-style" className="w-full bg-[#282c34] text-white border-gray-600">
              <SelectValue placeholder="Select a style..." />
            </SelectTrigger>
            <SelectContent className="bg-[#282c34] text-white">
              {avatarStyles.map((s) => (
                <SelectItem key={s.name} value={s.name} className="focus:bg-[#8ecae6]">{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={randomizeAvatar} className="w-full bg-gray-600 text-white font-medium py-3 hover:bg-gray-500">
          <Dices className="w-5 h-5 mr-2" />
          Randomize
        </Button>

        <Button onClick={handleNextStep} className="w-full bg-[#c084fc] text-white font-medium py-3 hover:bg-[#a064d9]">
          Continue to Step 2
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </>
  );

  const renderStep2 = () => (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Step 2: Configure Session</CardTitle>
        <p className="text-gray-400">Set up the voice and the topic for your conversation.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tca-type" className="text-white">What do you want to talk about?</Label>
          <Select value={tcaType} onValueChange={setTcaType}>
            <SelectTrigger id="tca-type" className="w-full bg-[#282c34] text-white border-gray-600">
              <SelectValue placeholder="Select a topic..." />
            </SelectTrigger>
            <SelectContent className="bg-[#282c34] text-white">
              <SelectItem value="general">General Body Image</SelectItem>
              <SelectItem value="anorexia">Thoughts about Restriction (Anorexia)</SelectItem>
              <SelectItem value="bulimia">Thoughts about Binging (Bulimia)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="voice-select" className="text-white">Voice Tone</Label>
          <Select value={selectedVoiceUri} onValueChange={setSelectedVoiceUri}>
            <SelectTrigger id="voice-select" className="w-full bg-[#282c34] text-white border-gray-600">
              <SelectValue placeholder="Select a voice..." />
            </SelectTrigger>
            <SelectContent className="bg-[#282c34] text-white">
              {voices.map((voice) => (
                <SelectItem key={voice.voiceURI} value={voice.voiceURI} className="focus:bg-[#8ecae6]">
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSubmit} className="w-full bg-[#c084fc] text-white font-medium py-3 hover:bg-[#a064d9]">
          Start Conversation
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </>
  );

  return (
    <div className="min-h-screen bg-[#282c34] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg gentle-shadow border-0 bg-[#20232a]">
        {step === 1 ? renderStep1() : renderStep2()}
      </Card>
    </div>
  );
};

export default ConversationSetup;