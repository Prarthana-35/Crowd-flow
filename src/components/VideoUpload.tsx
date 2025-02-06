// import React, { useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { Upload, Loader } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { supabase } from '../lib/supabaseClient';

// interface VideoUploadProps {
//   onProcessingStart: () => void;
//   onProcessingComplete: (data: any) => void;
// }

// const VideoUpload: React.FC<VideoUploadProps> = ({ onProcessingStart, onProcessingComplete }) => {
//   const onDrop = useCallback(async (acceptedFiles: File[]) => {
//     const file = acceptedFiles[0];
//     if (!file) return;

//     const toastId = toast.loading('Uploading video...');

//     try {
//       onProcessingStart();

//       // Upload to Supabase Storage
//       const { data, error } = await supabase.storage
//         .from('crowd-videos')
//         .upload(`videos/${Date.now()}-${file.name}`, file);

//       if (error) throw error;

//       const { data: { publicUrl } } = supabase.storage
//         .from('crowd-videos')
//         .getPublicUrl(data.path);

//       const mockResult = {
//         totalPeople: Math.floor(Math.random() * 1000),
//         peakDensity: (Math.random() * 0.8 + 0.2).toFixed(2),
//         criticalAreas: Math.floor(Math.random() * 5),
//         peopleChange: '+15%',
//         densityChange: '+8%',
//         areasChange: '+2',
//         hotspots: [
//           { x: 35, y: 45, intensity: 0.8 },
//           { x: 65, y: 25, intensity: 0.6 }
//         ],
//         alerts: [
//           {
//             id: 1,
//             severity: 'high',
//             message: 'High density detected in Zone A',
//             time: new Date().toLocaleTimeString(),
//             count: 150
//           },
//           {
//             id: 2,
//             severity: 'medium',
//             message: 'Increasing crowd in Zone B',
//             time: new Date().toLocaleTimeString(),
//             count: 75
//           }
//         ]
//       };

//       toast.success('Video processed successfully!', { id: toastId });
//       onProcessingComplete(mockResult);
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Error processing video', { id: toastId });
//       onProcessingComplete(null);
//     }
//   }, [onProcessingStart, onProcessingComplete]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'video/*': ['.mp4', '.mov', '.avi']
//     },
//     maxFiles: 1
//   });

//   return (
//     <div 
//       {...getRootProps()} 
//       className={`
//         p-8 rounded-lg text-center cursor-pointer transition-all duration-200 ease-in-out
//         bg-gray-700 shadow-[0px_4px_10px_rgba(255,255,255,0.1)] 
//     hover:shadow-[0px_6px_14px_rgba(255,255,255,0.15)] transform hover:-translate-y-1
//       `}
//     >
//       <input {...getInputProps()} />
//       <Upload className="mx-auto h-12 w-12 text-gray-300" />
//       <p className="mt-2 text-sm text-gray-300">
//         {isDragActive
//           ? "Drop the video here..."
//           : "Drag 'n' drop a video, or click to select"}
//       </p>
//       <p className="text-xs text-gray-400 mt-1">
//         Supports MP4, MOV, and AVI formats
//       </p>
//     </div>
//   );
// };


// export default VideoUpload;



import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
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

      // Upload video to Supabase Storage
      const { data, error } = await supabase.storage
        .from('crowd-videos')
        .upload(`videos/${Date.now()}-${file.name}`, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('crowd-videos')
        .getPublicUrl(data.path);

      // Send video URL to backend for processing with YOLO
      const response = await fetch('http://localhost:3001/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: publicUrl, // URL to the uploaded video
        }),
      });

      if (!response.ok) throw new Error('Error processing video');

      const result = await response.json(); // Receive analytics data from backend

      toast.success('Video processed successfully!', { id: toastId });
      onProcessingComplete(result); // Send analytics data to parent component
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error processing video', { id: toastId });
      onProcessingComplete(null);
    }
  }, [onProcessingStart, onProcessingComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="p-8 rounded-lg text-center cursor-pointer transition-all duration-200 ease-in-out bg-gray-700 shadow-[0px_4px_10px_rgba(255,255,255,0.1)] hover:shadow-[0px_6px_14px_rgba(255,255,255,0.15)] transform hover:-translate-y-1"
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-300" />
      <p className="mt-2 text-sm text-gray-300">
        {isDragActive ? 'Drop the video here...' : "Drag 'n' drop a video, or click to select"}
      </p>
      <p className="text-xs text-gray-400 mt-1">Supports MP4, MOV, and AVI formats</p>
    </div>
  );
};

export default VideoUpload;
