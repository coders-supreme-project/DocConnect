import React from 'react';
// import { Patient } from '../types';




 interface Patient {
    id: string;
    initials: string;
    name: string;
    visitType: string;
    time: string;
    status?: string;
  }
interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

const PatientList: React.FC<PatientListProps> = ({ patients, onSelectPatient }) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Patient List</h2>
        <select className="bg-white border border-gray-200 rounded-lg px-4 py-2">
          <option>Today</option>
          <option>Tomorrow</option>
          <option>This Week</option>
        </select>
      </div>
      
      <div className="space-y-3">
        {patients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => onSelectPatient(patient)}
            className="flex items-center bg-white rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white
              ${patient.initials.startsWith('S') ? 'bg-pink-400' : 
                patient.initials.startsWith('A') ? 'bg-purple-400' :
                'bg-teal-400'}`}
            >
              {patient.initials}
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-medium">{patient.name}</h3>
              <p className="text-sm text-gray-500">{patient.visitType}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{patient.time}</div>
              {patient.status && (
                <span className="text-xs text-teal-600">{patient.status}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientList;