import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    User: {
        email: string;
        role: string;
    };
    LocationLatitude: string;
    LocationLongitude: string;
    distance: number;
    specialty:string
}

const mapContainerStyle = {
    height: '100vh',
    width: '100%',
};

const center = {
    lat: 37.7749, // Default center (San Francisco)
    lng: -122.4194,
};

const DoctorMap: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [userLat, setUserLat] = useState<number | null>(null);
    const [userLng, setUserLng] = useState<number | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyB5gnUWjb84t6klt5vcPjMOQylhQRFB5Wc', // Replace with your Google Maps API key
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLat(latitude);
                setUserLng(longitude);
            console.log(latitude," ",longitude,"possitiiion");
            
                axios.post('http://127.0.0.1:5000/api/doctor/location', { lat: latitude, lng: longitude })
                    .then((response) => {
                        setDoctors(response.data);
                        console.log(response.data, "doctors");
                    })
                    .catch((error) => console.error("Error fetching doctors:", error));
            },
            (error) => console.error("Error getting user location:", error)
        );
    }, []);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;
    if (userLat === null || userLng === null) return <div>Loading...</div>;

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={13}
                center={{ lat: userLat, lng: userLng }}
            >
                <Marker
                    position={{ lat: userLat, lng: userLng }}
                    icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    }}
                />

                {doctors?.map((doctor) => (
                    <Marker
                        key={doctor.id}
                        position={{ lat: parseFloat(doctor.LocationLongitude), lng: parseFloat(doctor.LocationLatitude) }}
                        onClick={() =>{ setSelectedDoctor(doctor)

                            console.log(selectedDoctor,"doctoor");

                        }}
                        icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        }}
                    />
                ))}

                {selectedDoctor && (
                    <InfoWindow
                        position={{ lat:parseFloat( selectedDoctor.LocationLatitude), lng:parseFloat( selectedDoctor.LocationLongitude) }}
                        onCloseClick={() =>{ 
                            console.log(selectedDoctor,"doctoor");
                            
                            setSelectedDoctor(null)}}
                    >
                        <div>
                            <h3>{`${selectedDoctor.firstName} ${selectedDoctor.lastName}`}</h3>
                            <p>{selectedDoctor.specialty}</p>
                            <p>{`Distance: ${selectedDoctor.distance.toFixed(2)} km`}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
};

export default DoctorMap;