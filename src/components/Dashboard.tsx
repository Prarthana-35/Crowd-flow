import React from 'react';
import { Users, TrendingUp, AlertTriangle, Loader } from 'lucide-react';

interface DashboardProps {
  data: any;
  isLoading: boolean;
}
const Dashboard: React.FC<DashboardProps> = ({ data, isLoading }) => {
  const stats = [
    { 
      title: 'Total People', 
      value: data?.totalPeople || '0',
      change: data?.peopleChange || '+0%',
      icon: Users 
    },
    { 
      title: 'Peak Density', 
      value: data?.peakDensity || '0',
      change: data?.densityChange || '+0%',
      icon: TrendingUp 
    },
    { 
      title: 'Critical Areas', 
      value: data?.criticalAreas || '0',
      change: data?.areasChange || '0',
      icon: AlertTriangle 
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
          <p className="mt-2 text-gray-300">Processing video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 bg-gray-700 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                <p className={`text-sm mt-1 ${
                  stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>{stat.change}</p>
              </div>
              <stat.icon className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Time Distribution</h3>
          <div className="h-64 bg-gray-800 rounded-lg"></div>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Zone Analysis</h3>
          <div className="h-64 bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;