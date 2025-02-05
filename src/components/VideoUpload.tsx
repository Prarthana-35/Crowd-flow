import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

interface VideoUploadProps {
  onProcessingStart: () => void;
  onProcessingComplete: (data: any) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onProcessingStart, onProcessingComplete }) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const toastId = toast.loading('Uploading video...');

    try {
      onProcessingStart();

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('crowd-videos')
        .upload(`videos/${Date.now()}-${file.name}`, file);

      if (error) throw error;

      // Get the public URL for the uploaded video
      const { data: { publicUrl } } = supabase.storage
        .from('crowd-videos')
        .getPublicUrl(data.path);

      // Mock processing result for demo
      // In production, this would be replaced with actual API call to ML backend
      const mockResult = {
        totalPeople: Math.floor(Math.random() * 1000),
        peakDensity: (Math.random() * 0.8 + 0.2).toFixed(2),
        criticalAreas: Math.floor(Math.random() * 5),
        peopleChange: '+15%',
        densityChange: '+8%',
        areasChange: '+2',
        hotspots: [
          { x: 35, y: 45, intensity: 0.8 },
          { x: 65, y: 25, intensity: 0.6 }
        ],
        alerts: [
          {
            id: 1,
            severity: 'high',
            message: 'High density detected in Zone A',
            time: new Date().toLocaleTimeString(),
            count: 150
          },
          {
            id: 2,
            severity: 'medium',
            message: 'Increasing crowd in Zone B',
            time: new Date().toLocaleTimeString(),
            count: 75
          }
        ]
      };

      toast.success('Video processed successfully!', { id: toastId });
      onProcessingComplete(mockResult);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error processing video', { id: toastId });
      onProcessingComplete(null);
    }
  }, [onProcessingStart, onProcessingComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxFiles: 1
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
        transition-colors duration-200 ease-in-out
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? "Drop the video here..."
          : "Drag 'n' drop a video, or click to select"}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supports MP4, MOV, and AVI formats
      </p>
    </div>
  );
};

export default VideoUpload;