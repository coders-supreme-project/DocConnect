import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import {
  setFirstName,
  setEmailOrUsername,
  setPassword,
  setConfirmPassword,
  setUserType,
  setLocation,
  resetForm,
} from "../store/formSlice";
import axios from "axios";
import LocationSearch, { SearchResult } from "./LocationSearch";

const Register: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.form);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [meetingPrice, setMeetingPrice] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formState.password !== formState.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/register", {
        FirstName: formState.firstName,
        Username: formState.Username,
        Password: formState.password,
        Email: formState.Username,
        Role: formState.userType === "Doctor" ? "Doctor" : "Patient",
        Specialty: formState.userType === "Doctor" ? specialty : "",
        Bio: formState.userType === "Doctor" ? bio : "",
        MeetingPrice: formState.userType === "Doctor" ? meetingPrice : "",
        Latitude: selectedLocation ? Number(selectedLocation.lat) : null,
        Longitude: selectedLocation ? Number(selectedLocation.lon) : null,
      });

      if (response.status === 201) {
        console.log("Registration successful");
        navigate("/login");
        dispatch(resetForm());
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "An error occurred during registration");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Registration error:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ width: "300px" }}>
        <input
          type="text"
          placeholder="First Name"
          value={formState.firstName}
          onChange={(e) => dispatch(setFirstName(e.target.value))}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formState.Username}
          onChange={(e) => dispatch(setEmailOrUsername(e.target.value))}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formState.password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formState.confirmPassword}
          onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          required
        />
        <select
          value={formState.userType}
          onChange={(e) => dispatch(setUserType(e.target.value as "Doctor" | "Patient"))}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          required
        >
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
        </select>
        {formState.userType === "Doctor" && (
          <>
            <input
              type="text"
              placeholder="Specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              style={{ width: "100%", padding: "10px", margin: "10px 0" }}
              required
            />
            <input
              type="text"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ width: "100%", padding: "10px", margin: "10px 0" }}
            />
            <input
              type="number"
              placeholder="Meeting Price"
              value={meetingPrice}
              onChange={(e) => setMeetingPrice(e.target.value)}
              style={{ width: "100%", padding: "10px", margin: "10px 0" }}
            />
          </>
        )}
        <LocationSearch onSelectLocation={(result) => {
          setSelectedLocation(result);
          dispatch(setLocation({ latitude: Number(result.lat), longitude: Number(result.lon) }));
        }} />
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: "10px" }}>
        Already have an account? <span onClick={() => navigate("/login")} style={{ color: "blue", cursor: "pointer" }}>Login here</span>
      </p>
    </div>
  );
};

export default Register;
