import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

interface Doctor {
    id: number;
    User: {
        FirstName: string;
        LastName: string;
        Email: string;
        Role: string;
    };
    LocationLatitude: number;
    LocationLongitude: number;
    distance: number;
}

const DoctorMap: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [userLat, setUserLat] = useState<number | null>(null);
    const [userLng, setUserLng] = useState<number | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLat(latitude);
                setUserLng(longitude);

                axios.post('http://127.0.0.1:5000/api/doctor/location', { lat: latitude, lng: longitude })
                    .then((response) => {
                        setDoctors(response.data);
                        console.log(response.data,"doctoors")
                    })
                    .catch((error) => console.error("Error fetching doctors:", error));
            },
            (error) => console.error("Error getting user location:", error)
        );
    }, []);

    if (userLat === null || userLng === null) {
        return <div>Loading...</div>;
    }

    const customIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41],
    });

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer center={[userLat, userLng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[userLat, userLng]} icon={customIcon}>
                    <Popup>Your Location</Popup>
                </Marker>
                {doctors.map((doctor) => (
                    <Marker
                        key={doctor.id}
                        position={[doctor.LocationLatitude, doctor.LocationLongitude]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div>
                                <h3>{`${doctor.User.FirstName} ${doctor.User.LastName}`}</h3>
                                <p>{doctor.User.Email}</p>
                                <p>{doctor.User.Role}</p>
                                <p>{`Distance: ${doctor.distance.toFixed(2)} km`}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default DoctorMap;
