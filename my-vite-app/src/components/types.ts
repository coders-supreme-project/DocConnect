export interface Patient {
  id: string;
  name: string;
  initials: string;
  visitType: string;
  time: string;
  status?: string;
}

export interface ConsultationDetails {
  patientName: string;
  initials: string;
  gender: string;
  age: string;
  symptoms: {
    id: string;
    name: string;
    value: number;
    icon: string;
  }[];
  lastChecked: {
    doctor: string;
    date: string;
    prescriptionId: string;
  };
  observation: string;
  prescriptions: string[];
} 