import React from 'react';
import { Bell, AlertTriangle, Users, Loader } from 'lucide-react';

interface Alert {
  id: number;
  severity: 'high' | 'medium' | 'low';
  message: string;
  time: string;
  count: number;
}

interface AlertSystemProps {
  alerts?: Alert[];
  isLoading: boolean;
}

const AlertSystem: React.FC<AlertSystemProps> = ({ alerts = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
          <p className="mt-2 text-gray-300">Analyzing crowd patterns...</p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Alert System</h2>
        </div>
        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
          {alerts.length} Active
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 bg-gray-600 rounded-lg border border-gray-400"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`h-5 w-5 ${
                  alert.severity === 'high' ? 'text-red-500' : 
                  alert.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                }`} />
                <div>
                  <p className="font-medium text-white">{alert.message}</p>
                  <p className="text-sm text-gray-300">{alert.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className={`px-2 py-1 rounded-full text-sm ${getSeverityColor(alert.severity)}`}>
                  {alert.count}
                </span>
              </div>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-500" />
            <p>No active alerts</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default AlertSystem;