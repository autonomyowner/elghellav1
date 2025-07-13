'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, X, Check, RotateCcw, Zap, ZapOff, 
  Image, Upload, Download, Trash2, Edit3,
  SwitchCamera, Focus, Aperture, Settings,
  Grid, Maximize, Minimize, Sun, Moon
} from 'lucide-react';

interface CameraIntegrationProps {
  onPhotoCapture: (photos: File[]) => void;
  onClose: () => void;
  maxPhotos?: number;
  quality?: number;
  allowMultiple?: boolean;
  showPreview?: boolean;
}

interface CapturedPhoto {
  file: File;
  url: string;
  timestamp: number;
  id: string;
}

export default function CameraIntegration({
  onPhotoCapture,
  onClose,
  maxPhotos = 5,
  quality = 0.8,
  allowMultiple = true,
  showPreview = true
}: CameraIntegrationProps) {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [isFlashSupported, setIsFlashSupported] = useState(false);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [brightness, setBrightness] = useState(50);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      setError(null);
      
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: { ideal: 16/9 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      // Check for flash support
      const track = mediaStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;
      setIsFlashSupported(!!capabilities.torch);
      
      setIsActive(true);
    } catch (err) {
      console.error('Camera initialization error:', err);
      setError('فشل في تشغيل الكاميرا. تأكد من السماح بالوصول للكاميرا.');
    }
  }, [facingMode, stream]);

  // Capture photo
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    setIsCapturing(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;

      // Set canvas dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Apply brightness filter
      context.filter = `brightness(${brightness}%)`;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `photo_${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });

        const photo: CapturedPhoto = {
          file,
          url: URL.createObjectURL(blob),
          timestamp: Date.now(),
          id: Math.random().toString(36).substr(2, 9)
        };

        setCapturedPhotos(prev => {
          const newPhotos = [...prev, photo];
          return newPhotos.slice(-maxPhotos); // Keep only last maxPhotos
        });

        // Flash effect
        if (videoRef.current) {
          videoRef.current.style.filter = 'brightness(2)';
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.style.filter = 'none';
            }
          }, 100);
        }
      }, 'image/jpeg', quality);
    } catch (err) {
      console.error('Capture error:', err);
      setError('فشل في التقاط الصورة');
    } finally {
      setIsCapturing(false);
    }
  }, [brightness, quality, maxPhotos, isCapturing]);

  // Switch camera
  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  // Toggle flash
  const toggleFlash = useCallback(async () => {
    if (!isFlashSupported || !stream) return;

    const track = stream.getVideoTracks()[0];
    const nextMode = flashMode === 'off' ? 'on' : 'off';
    
    try {
      await track.applyConstraints({
        advanced: [{ torch: nextMode === 'on' } as any]
      });
      setFlashMode(nextMode);
    } catch (err) {
      console.error('Flash toggle error:', err);
    }
  }, [isFlashSupported, stream, flashMode]);

  // Delete photo
  const deletePhoto = useCallback((id: string) => {
    setCapturedPhotos(prev => {
      const updated = prev.filter(photo => photo.id !== id);
      // Cleanup URL
      const photoToDelete = prev.find(p => p.id === id);
      if (photoToDelete) {
        URL.revokeObjectURL(photoToDelete.url);
      }
      return updated;
    });
  }, []);

  // Handle file input
  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const photo: CapturedPhoto = {
          file,
          url: URL.createObjectURL(file),
          timestamp: Date.now(),
          id: Math.random().toString(36).substr(2, 9)
        };
        
        setCapturedPhotos(prev => [...prev, photo].slice(-maxPhotos));
      }
    });
  }, [maxPhotos]);

  // Submit photos
  const submitPhotos = useCallback(() => {
    if (capturedPhotos.length === 0) return;
    
    const files = capturedPhotos.map(photo => photo.file);
    onPhotoCapture(files);
    onClose();
  }, [capturedPhotos, onPhotoCapture, onClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      capturedPhotos.forEach(photo => {
        URL.revokeObjectURL(photo.url);
      });
    };
  }, [stream, capturedPhotos]);

  // Initialize camera on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      initializeCamera();
    } else {
      setError('الكاميرا غير مدعومة في هذا المتصفح');
    }
  }, [initializeCamera]);

  // Re-initialize when facing mode changes
  useEffect(() => {
    if (isActive) {
      initializeCamera();
    }
  }, [facingMode, initializeCamera, isActive]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <button
          onClick={onClose}
          className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">الكاميرا</span>
          {capturedPhotos.length > 0 && (
            <span className="px-2 py-1 bg-green-500 text-white text-sm rounded-full">
              {capturedPhotos.length}
            </span>
          )}
        </div>
        
        <button
          onClick={submitPhotos}
          disabled={capturedPhotos.length === 0}
          className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          تأكيد
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-4">{error}</p>
              <button
                onClick={initializeCamera}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Video Stream */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            
            {/* Canvas for capture */}
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            
            {/* Grid Overlay */}
            {gridEnabled && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white/30" />
                  ))}
                </div>
              </div>
            )}
            
            {/* Controls Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
                <div className="flex gap-2">
                  {/* Flash Toggle */}
                  {isFlashSupported && (
                    <button
                      onClick={toggleFlash}
                      className={`p-2 rounded-full transition-colors ${
                        flashMode === 'on' 
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                    >
                      {flashMode === 'on' ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
                    </button>
                  )}
                  
                  {/* Grid Toggle */}
                  <button
                    onClick={() => setGridEnabled(!gridEnabled)}
                    className={`p-2 rounded-full transition-colors ${
                      gridEnabled 
                        ? 'bg-green-500 text-white' 
                        : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex gap-2">
                  {/* Switch Camera */}
                  <button
                    onClick={switchCamera}
                    className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <SwitchCamera className="w-5 h-5" />
                  </button>
                  
                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                                 </div>
               </div>
               
               {/* Bottom Controls */}
               <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
                 {/* Brightness Control */}
                 <div className="mb-4 flex items-center gap-3">
                   <Sun className="w-5 h-5 text-white" />
                   <input
                     type="range"
                     min="50"
                     max="150"
                     value={brightness}
                     onChange={(e) => setBrightness(Number(e.target.value))}
                     className="flex-1"
                   />
                   <Moon className="w-5 h-5 text-white" />
                 </div>
                 
                 {/* Capture Controls */}
                 <div className="flex items-center justify-center gap-4">
                   {/* Gallery Button */}
                   <button
                     onClick={() => fileInputRef.current?.click()}
                     className="p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                   >
                     <Image className="w-6 h-6" />
                   </button>
                   
                   {/* Capture Button */}
                   <button
                     onClick={capturePhoto}
                     disabled={isCapturing}
                     className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                   >
                     {isCapturing ? (
                       <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                     ) : (
                       <Camera className="w-8 h-8 text-gray-800" />
                     )}
                   </button>
                   
                   {/* Photos Count */}
                   <div className="p-3 bg-black/50 text-white rounded-full">
                     <span className="text-sm font-medium">
                       {capturedPhotos.length}/{maxPhotos}
                     </span>
                   </div>
                 </div>
               </div>
             </div>
           </>
         )}
       </div>

      {/* Photo Preview */}
      {showPreview && capturedPhotos.length > 0 && (
        <div className="bg-black/90 p-4">
          <div className="flex gap-2 overflow-x-auto">
            {capturedPhotos.map((photo) => (
              <div key={photo.id} className="relative flex-shrink-0">
                <img
                  src={photo.url}
                  alt="Captured"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <button
                  onClick={() => deletePhoto(photo.id)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={allowMultiple}
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}

// Camera Button Component
export function CameraButton({ 
  onPhotosSelected, 
  maxPhotos = 5,
  className = "",
  children 
}: {
  onPhotosSelected: (files: File[]) => void;
  maxPhotos?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const [showCamera, setShowCamera] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowCamera(true)}
        className={`flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ${className}`}
      >
        <Camera className="w-5 h-5" />
        {children || 'التقاط صورة'}
      </button>

      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CameraIntegration
              onPhotoCapture={onPhotosSelected}
              onClose={() => setShowCamera(false)}
              maxPhotos={maxPhotos}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}