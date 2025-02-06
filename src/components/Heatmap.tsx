import React, { useState } from 'react';
import { Map, ZoomIn, ZoomOut, Loader, Bell, AlertTriangle, Users } from 'lucide-react';

interface Alert {
  id: number;
  severity: 'high' | 'medium' | 'low';
  message: string;
  time: string;
  count: number;
}

interface HeatmapProps {
  data: any;
  isLoading: boolean;
}

const Heatmap: React.FC<HeatmapProps> = ({ data, isLoading }) => {
  const [alerts, setAlerts] = useState<Alert[]>(data?.alerts || []);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
          <p className="mt-2 text-gray-400">Generating heatmap...</p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-800 text-red-300';
      case 'medium':
        return 'bg-yellow-700 text-yellow-300';
      case 'low':
        return 'bg-green-700 text-green-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-[0px_4px_10px_rgba(255,255,255,0.1)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Map className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-200">Crowd Density Heatmap</h2>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-700 rounded-lg">
            <ZoomIn className="h-5 w-5 text-gray-300" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg">
            <ZoomOut className="h-5 w-5 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="relative">
        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=1200&q=80" 
            alt="Venue Layout"
            className="w-full h-full object-cover opacity-40"
          />
          {data?.heatmap?.hotspots && data?.heatmap?.hotspots.map((hotspot, index) => (
            <div
              key={index}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${hotspot.x}% ${hotspot.y}%, rgba(239, 68, 68, 0.4), transparent 50%)`
              }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-800 p-3 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Density Legend</h4>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded"></div>
            <div className="flex justify-between w-full text-xs text-gray-400">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert System */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-200 mb-4">Alert System</h3>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700 shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-5 w-5 ${alert.severity === 'high' ? 'text-red-400' : alert.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'}`} />
                  <div>
                    <p className="font-medium text-gray-200">{alert.message}</p>
                    <p className="text-sm text-gray-400">{alert.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className={`px-2 py-1 rounded-full text-sm ${getSeverityColor(alert.severity)}`}>
                    {alert.count}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-600" />
              <p>No active alerts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
