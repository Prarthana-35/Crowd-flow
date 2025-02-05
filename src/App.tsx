/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import { Upload } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Heatmap from './components/Heatmap';
import AlertSystem from './components/AlertSystem';
import VideoUpload from './components/VideoUpload';
// import { supabase } from './lib/supabaseClient';
import { supabase } from './utils/supabase.ts'

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const handleVideoProcessed = (data) => {
    setAnalysisData(data);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Upload className="h-8 w-8 text-blue-700" />
              <span className="ml-2 text-xl font-bold text-gray-900">CrowdFlow Analytics</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          <VideoUpload 
            onProcessingStart={() => setIsProcessing(true)}
            onProcessingComplete={handleVideoProcessed}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Dashboard data={analysisData} isLoading={isProcessing} />
            <AlertSystem alerts={analysisData?.alerts} isLoading={isProcessing} />
          </div>
          
          <Heatmap data={analysisData?.heatmap} isLoading={isProcessing} />
        </div>
      </main>
    </div>
  );
}

export default App;










function Page() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    function getTodos() {
      const { data: todos } = await supabase.from('todos').select()

      if (todos.length > 1) {
        setTodos(todos)
      }
    }

    getTodos()
  }, [])

  return (
    <div>
      {todos.map((todo) => (
        <li key={todo}>{todo}</li>
      ))}
    </div>
  )
}
export default Page
