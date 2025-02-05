import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsProps {
  newPatients: number;
  oldPatients: number;
  newPatientGrowth: number;
  oldPatientChange: number;
}

export function DashboardStats({ newPatients, oldPatients, newPatientGrowth, oldPatientChange }: StatsProps) {
  return (
    <div className="bg-teal-50/50 rounded-3xl p-8 relative overflow-hidden">
      <h2 className="text-xl font-semibold mb-4">Visits for Today</h2>
      <div className="text-6xl font-bold mb-8">{newPatients + oldPatients}</div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">New Patients</span>
            <div className="flex items-center text-green-500 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              {newPatientGrowth}%
            </div>
          </div>
          <div className="text-3xl font-bold">{newPatients}</div>
        </div>
        
        <div className="bg-white/80 backdrop-blur rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Old Patients</span>
            <div className="flex items-center text-red-500 text-sm">
              <TrendingDown className="w-4 h-4 mr-1" />
              {oldPatientChange}%
            </div>
          </div>
          <div className="text-3xl font-bold">{oldPatients}</div>
        </div>
      </div>
    </div>
  );
}