import React, { useState } from 'react';
import axios from 'axios';

const PatientVideoCall: React.FC = () => {
    const [doctorEmail, setDoctorEmail] = useState<string>('');
    const [patientEmail, setPatientEmail] = useState<string>('');
    const [meetingLink, setMeetingLink] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleStartConsultation = async () => {
        setLoading(true);
        try {
            const response = await axios.post<{ meetingLink: string }>('http://127.0.0.1:5000/api/vedio/create-meeting', {
                doctorEmail,
                patientEmail,
                topic: 'Consultation',
                startTime: new Date().toISOString(),
            });

            setMeetingLink(response.data.meetingLink);
        } catch (error) {
            console.error('Error creating meeting', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Start Your Consultation</h2>
            <input 
                type="email" 
                placeholder="Doctor Email" 
                value={doctorEmail} 
                onChange={(e) => setDoctorEmail(e.target.value)} 
                className="w-full p-2 border rounded mb-2" 
            />
            <input 
                type="email" 
                placeholder="Your Email" 
                value={patientEmail} 
                onChange={(e) => setPatientEmail(e.target.value)} 
                className="w-full p-2 border rounded mb-2" 
            />
            <button 
                onClick={handleStartConsultation} 
                className="w-full bg-blue-500 text-white py-2 rounded" 
                disabled={loading}
            >
                {loading ? 'Starting...' : 'Start Consultation'}
            </button>
            {meetingLink && (
                <p className="mt-4 text-blue-600">
                    <a href={meetingLink} target="_blank" rel="noopener noreferrer">Join Meeting</a>
                </p>
            )}
        </div>
    );
};

export default PatientVideoCall;
