import React from 'react';
import { Heart, Thermometer, Wind } from 'lucide-react';

interface Symptom {
  id: string;
  icon: string;
  value: string;
  name: string;
}

interface LastChecked {
  doctor: string;
  date: string;
}

interface ConsultationDetails {
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  notes: string;
  initials: string;
  gender: string;
  age: string;
  symptoms: Symptom[];
  lastChecked: LastChecked;
}

interface ConsultationViewProps {
  consultation: ConsultationDetails;
}

const ConsultationView: React.FC<ConsultationViewProps> = ({ consultation }) => {
  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-medium">
            {consultation.initials}
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-lg">{consultation.patientName}</h3>
            <p className="text-gray-500">
              {consultation.gender} - {consultation.age}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">•••</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {consultation.symptoms.map((symptom) => (
          <div key={symptom.id} className="bg-gray-50 rounded-xl p-4">
            {symptom.icon === 'temperature' && <Thermometer className="w-5 h-5 text-red-500 mb-2" />}
            {symptom.icon === 'cough' && <Wind className="w-5 h-5 text-blue-500 mb-2" />}
            {symptom.icon === 'heart' && <Heart className="w-5 h-5 text-pink-500 mb-2" />}
            <div className="font-medium">{symptom.value}</div>
            <div className="text-sm text-gray-500">{symptom.name}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm text-gray-500 mb-1">Last Checked</h4>
          <p>
            Dr {consultation.lastChecked.doctor} on {consultation.lastChecked.date}
          </p>
        </div>
        <div>
          <h4 className="text-sm text-gray-500 mb-1">Notes</h4>
          <p>{consultation.notes}</p>
        </div>
      </div>
    </div>
  );
};

export default ConsultationView;