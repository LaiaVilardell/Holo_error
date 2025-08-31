import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';

const ConversationSetup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activity = searchParams.get('activity');

  const [tcaType, setTcaType] = useState('general');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string | undefined>();

  useEffect(() => {
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
  }, []);

  const handleSubmit = () => {
    // Navegar al paso 3, pasando los parámetros
    navigate(`/conversation?activity=${activity}&tca=${tcaType}&voice=${encodeURIComponent(selectedVoiceUri || '')}`);
  };

  return (
    <div className="min-h-screen bg-[#282c34] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg gentle-shadow border-0 bg-[#20232a]">
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

          <Button onClick={handleSubmit} className="w-full bg-[#8ecae6] text-[#282c34] font-medium py-3 hover:bg-[#5390d9] hover:text-white">
            Continue to Step 3
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationSetup;
