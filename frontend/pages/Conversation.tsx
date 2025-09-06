import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

// Componentes de UI
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, RefreshCw, Mic, MicOff, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// --- Sub-componente para el Canvas de Dibujo ---
const DrawingCanvas = ({ initialImageData, getCanvasData }: { initialImageData?: string, getCanvasData: (data: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      canvas.width = 500;
      canvas.height = 500;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (initialImageData) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        img.src = initialImageData;
      }
    }
  }, [initialImageData]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) getCanvasData(canvas.toDataURL());
  };

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };

  return (
    <canvas 
      ref={canvasRef} 
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onMouseMove={draw}
      className="bg-white rounded-lg cursor-crosshair"
    />
  );
};

// --- Componente Principal de Conversación ---
const Conversation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const activity = searchParams.get('activity');
  const tcaType = searchParams.get('tca') || 'general';
  const selectedVoiceUri = decodeURIComponent(searchParams.get('voice') || '');
  const avatarUrl = decodeURIComponent(searchParams.get('avatar') || '');

  const [textToSpeak, setTextToSpeak] = useState('Loading thought...');
  const [patientResponse, setPatientResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [loadedDrawingData, setLoadedDrawingData] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const speak = (text: string) => {
    if (!text.trim() || !selectedVoiceUri || voices.length === 0) return;
    const voice = voices.find(v => v.voiceURI === selectedVoiceUri);
    if (!voice) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const getNewPhrase = async () => {
    try {
      const phraseResponse = await api.get(`/phrases/${tcaType}`);
      if (phraseResponse.data?.phrase) {
        const newPhrase = phraseResponse.data.phrase;
        setTextToSpeak(newPhrase);
        speak(newPhrase);
      }
    } catch (error) { console.error("Error fetching new phrase:", error); }
  };

  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'es-ES';
    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => {
      setIsListening(false);
      setTimeout(() => getNewPhrase(), 2000);
    };
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onresult = (event: any) => setPatientResponse(event.results[0][0].transcript);
    recognitionRef.current.start();
  };

  useEffect(() => {
    const handleVoicesChanged = () => setVoices(window.speechSynthesis.getVoices());
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    handleVoicesChanged();
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  useEffect(() => {
    if (voices.length > 0) {
      setTimeout(() => getNewPhrase(), 500);
    }
  }, [voices]);

  useEffect(() => {
    const fetchDrawing = async () => {
      if (activity === 'drawing' && user) {
        try {
          const response = await api.get(`/drawings/users/${user.id}/drawings/`);
          if (response.data && response.data.length > 0) {
            setLoadedDrawingData(response.data[0].image_data);
          }
        } catch (error) { console.error("Error fetching drawing:", error); }
      }
    };
    fetchDrawing();
  }, [activity, user]);

  const handleEndSession = async () => {
    if (!user) return;
    const transcript = `AI: ${textToSpeak}\nPatient: ${patientResponse}`;
    try {
      await api.post(`/users/${user.id}/conversations/`, { transcript });
      toast({ title: "Session Saved", description: "Your conversation has been saved." });
      navigate('/patient/dashboard');
    } catch (error) { console.error("Failed to save session:", error); toast({ title: "Error", description: "Could not save your session.", variant: "destructive" }); }
  };

  return (
    <div className="min-h-screen bg-[#282c34]">
      <header className="bg-[#20232a] border-b border-[#282c34] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button variant="outline" onClick={() => navigate('/patient/dashboard')} className="bg-[#5390d9] text-white hover:bg-[#8ecae6]">Back to Dashboard</Button>
          <h1 className="text-xl font-bold text-white">Step 3: Conversation</h1>
          <Button onClick={handleEndSession} className="bg-[#f9a8d4] text-[#282c34] hover:bg-[#c084fc] hover:text-white"><Save className="w-4 h-4 mr-2"/>End & Save Session</Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="gentle-shadow border-0 bg-[#20232a]">
            <CardHeader><CardTitle className="text-white">Your Creation</CardTitle></CardHeader>
            <CardContent className="h-[550px] flex items-center justify-center bg-gray-800 rounded-lg">
              {activity === 'drawing' ? (
                <DrawingCanvas getCanvasData={(data) => console.log(data)} initialImageData={loadedDrawingData || undefined} />
              ) : (
                <img src={avatarUrl} alt="Avatar" className="w-96 h-96" />
              )}
            </CardContent>
          </Card>
          <Card className="gentle-shadow border-0 bg-[#20232a]">
            <CardHeader><CardTitle className="text-white">Conversation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">The thought says:</Label>
                <Textarea value={textToSpeak} readOnly className="bg-[#282c34] text-white h-32 text-lg mt-1" />
              </div>
              <div>
                <Label className="text-gray-400">Your response:</Label>
                <Textarea value={patientResponse} readOnly placeholder="Your spoken response will appear here..." className="bg-[#23263a] text-white h-32 text-lg mt-1" />
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={handleListen} disabled={isListening} className={`w-full transition-colors ${isListening ? 'bg-red-600' : 'bg-green-700'}`}>
                  {isListening ? <><MicOff className="w-4 h-4 mr-2"/><span>Listening...</span></> : <><Mic className="w-4 h-4 mr-2"/><span>Respond by Speaking</span></>}</Button>
                <Button onClick={getNewPhrase} variant="secondary" className="w-full bg-[#c084fc] text-white font-medium py-3 hover:bg-[#a064d9]"><RefreshCw className="w-4 h-4 mr-2"/>Generate New Thought</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Conversation;
