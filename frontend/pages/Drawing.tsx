import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Palette, Eraser, Download, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Drawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#3B82F6');
  const [brushSize, setBrushSize] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const navigate = useNavigate();

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#6366F1', '#84CC16',
    '#F97316', '#06B6D4', '#64748B', '#000000'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isErasing) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast({
      title: "Drawing saved!",
      description: "Your creation has been successfully downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="text-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Create Your Art</h1>
              <p className="text-sm text-gray-500">Express your emotions through drawing</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={saveDrawing} className="bg-[#8ecae6] text-[#282c34] hover:bg-[#5390d9] hover:text-white transition-all duration-200">
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <Card className="lg:col-span-1 gentle-shadow border-0 bg-[#20232a]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Palette className="w-5 h-5" />
                <span>Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Colors */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">Colors</label>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setCurrentColor(color);
                        setIsErasing(false);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        currentColor === color && !isErasing 
                          ? 'border-[#8ecae6] scale-110' 
                          : 'border-gray-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Brush Size */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Brush size: {brushSize}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full accent-[#8ecae6]"
                />
              </div>

              {/* Tools */}
              <div className="space-y-2">
                <Button
                  onClick={() => setIsErasing(!isErasing)}
                  variant={isErasing ? "default" : "outline"}
                  className="w-full"
                >
                  <Eraser className="w-4 h-4 mr-2" />
                  {isErasing ? 'Disable Eraser' : 'Eraser'}
                </Button>
                
                <Button
                  onClick={clearCanvas}
                  variant="outline"
                  className="w-full text-red-400 hover:text-red-600"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>

              {/* Motivational Messages */}
              <div className="bg-gradient-to-r from-[#f9a8d4] to-[#c084fc] p-4 rounded-lg">
                <p className="text-sm text-[#282c34] font-medium">💡 Tip</p>
                <p className="text-xs text-[#282c34] mt-1">
                  There are no good or bad drawings, only unique expressions. Have fun creating!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Canvas */}
          <Card className="lg:col-span-3 gentle-shadow border-0 bg-[#20232a]">
            <CardContent className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-96 cursor-crosshair"
                  style={{ touchAction: 'none' }}
                />
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-300">
                  Click and drag to draw. Use the tools on the left to customize your creation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Drawing;
