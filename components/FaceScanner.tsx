import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, XCircle, Search, User } from 'lucide-react';
import { analyzeFace } from '../services/geminiService';
import { VisitorLog } from '../types';

interface FaceScannerProps {
  onLogEntry: (log: VisitorLog) => void;
}

const FaceScanner: React.FC<FaceScannerProps> = ({ onLogEntry }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
        setError(null);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreamActive(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleCapture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setScanning(true);
    setResult(null);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);

      try {
        const analysis = await analyzeFace(imageBase64);
        
        // Mock matching logic - random chance for demonstration
        const isKnown = Math.random() > 0.3; // 70% chance to be "known"
        const names = ["Rahul Sharma", "Priya Patel", "Amit Singh", "Sneha Gupta", "Vikram Malhotra"];
        const name = isKnown ? names[Math.floor(Math.random() * names.length)] : "Unknown Visitor";
        
        const newLog: VisitorLog = {
          id: Date.now().toString(),
          name: name,
          timestamp: new Date().toISOString(),
          confidence: analysis.simulated_match_confidence,
          entryType: isKnown ? 'Check-In' : 'Denied',
          imageUrl: imageBase64,
          attributes: {
            ageRange: analysis.age_range,
            gender: analysis.gender,
            emotion: analysis.emotion,
            glasses: analysis.wearing_glasses
          }
        };

        setResult(newLog);
        onLogEntry(newLog);

      } catch (err) {
        console.error(err);
        setError("Failed to process image. Please try again.");
      } finally {
        setScanning(false);
      }
    }
  }, [onLogEntry]);

  const resetScanner = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-6rem)]">
      {/* Camera Feed Section */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col">
        <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white flex items-center gap-2 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          LIVE FEED
        </div>

        <div className="flex-1 relative bg-black flex items-center justify-center">
            {!isStreamActive && !error && (
                <div className="text-slate-500 flex flex-col items-center">
                    <RefreshCw className="animate-spin mb-2" />
                    Initializing Camera...
                </div>
            )}
            {error && (
                <div className="text-red-400 p-4 text-center">
                    <p>{error}</p>
                    <button onClick={startCamera} className="mt-4 px-4 py-2 bg-slate-800 rounded hover:bg-slate-700">Retry</button>
                </div>
            )}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover ${isStreamActive ? 'opacity-100' : 'opacity-0'}`}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Overlay Grid */}
          <div className="absolute inset-0 border-[1px] border-white/5 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-indigo-400/50 rounded-lg">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-500"></div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-800 border-t border-slate-700 flex justify-center gap-4">
          {!result ? (
            <button
              onClick={handleCapture}
              disabled={scanning || !isStreamActive}
              className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all ${
                scanning 
                  ? 'bg-slate-600 cursor-wait text-slate-300' 
                  : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105 shadow-lg shadow-indigo-900/50 text-white'
              }`}
            >
              {scanning ? (
                <>
                  <RefreshCw className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Camera /> SCAN VISITOR
                </>
              )}
            </button>
          ) : (
            <button
              onClick={resetScanner}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg bg-slate-700 hover:bg-slate-600 text-white transition-all"
            >
              <RefreshCw size={20} /> SCAN NEXT
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Search size={20} className="text-indigo-600" />
            Analysis Results
          </h2>

          {result ? (
            <div className="flex-1 animate-fadeIn">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-inner shrink-0">
                  <img src={result.imageUrl} alt="Captured" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-slate-900">{result.name}</h3>
                    {result.entryType === 'Check-In' ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">
                        Access Granted
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded uppercase">
                        Access Denied
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm mb-4">ID: {result.id.slice(-8)}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg inline-flex">
                    <span className="font-semibold text-slate-900">Match Confidence:</span>
                    <span className={`${result.confidence > 0.9 ? 'text-green-600' : 'text-amber-600'} font-bold`}>
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Age Range</p>
                  <p className="font-semibold text-slate-900">{result.attributes.ageRange}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Gender</p>
                  <p className="font-semibold text-slate-900">{result.attributes.gender}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Emotion</p>
                  <p className="font-semibold text-slate-900">{result.attributes.emotion}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Glasses</p>
                  <p className="font-semibold text-slate-900">{result.attributes.glasses ? "Yes" : "No"}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                 <p className="text-xs text-blue-500 uppercase tracking-wider mb-1 font-bold">System Note</p>
                 <p className="text-blue-800 text-sm">
                   Visitor has been logged automatically. {result.entryType === 'Check-In' ? "Welcome message sent to host." : "Security alert triggered for unknown visitor."}
                 </p>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <User size={48} className="mb-4 opacity-50" />
              <p className="font-medium">Ready to scan</p>
              <p className="text-sm">Position visitor in the frame</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceScanner;