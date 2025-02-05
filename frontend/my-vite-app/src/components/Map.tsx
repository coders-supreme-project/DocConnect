export interface User {
    FirstName: string;
    LastName: string;
    Email: string;
    Role: string;
}

export interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    LocationLatitude: number;
    LocationLongitude: number;
    distance: number;
    User: User;
}
import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Doctor } from "../types/Doctor";

const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

const center = {
    lat: 37.7749,
    lng: -122.4194,
};

interface MapProps {
    userLocation: { lat: number; lng: number } | null;
    nearestDoctors: Doctor[];
}

const Map: React.FC<MapProps> = ({ userLocation, nearestDoctors }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "", // Add your Google Maps API key in .env
    });

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={12}
            center={userLocation || center}
        >
            {/* Marker for the current user */}
            {userLocation && <Marker position={userLocation} label="You" />}

            {/* Markers for nearest doctors */}
            {nearestDoctors.map((doctor) => (
                <Marker
                    key={doctor.id}
                    position={{ lat: doctor.LocationLatitude, lng: doctor.LocationLongitude }}
                    label={`${doctor.User.FirstName} ${doctor.User.LastName}`}
                />
            ))}
        </GoogleMap>
    );
};

export default Map;