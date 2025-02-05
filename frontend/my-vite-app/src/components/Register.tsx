import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { RegisterFormData } from "../store/formSlice";
import { AuthResponse } from "../store/authSlice";
import LocationSearch, { SearchResult } from "../components/LocationSearch";

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);
  const navigate = useNavigate();
  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      
      const requestData = {
        FirstName: data.firstName,
        LastName: data.lastName,
        Username: data.username,
        Password: data.password,
        Email: data.email,
        Role: data.role,
        Speciality: data.role === "Doctor" ? data.speciality : undefined,
        Bio: data.role === "Doctor" ? data.bio : undefined,
        MeetingPrice: data.role === "Doctor" ? data.meetingPrice : undefined,
        LocationLatitude: selectedLocation?.lat,
        LocationLongitude: selectedLocation?.lon,
      };
      
      const response = await axios.post<AuthResponse>("http://localhost:5000/api/users/register", requestData);

      if (response.data.user) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("firstName", { required: "First name is required" })} placeholder="First Name" />
        <input {...register("lastName", { required: "Last name is required" })} placeholder="Last Name" />
        <input {...register("username", { required: "Username is required" })} placeholder="Username" />
        <input {...register("email", { required: "Email is required" })} placeholder="Email" type="email" />
        <input {...register("password", { required: "Password is required" })} placeholder="Password" type="password" />
        
        <select {...register("role", { required: "Role is required" })}>
          <option value="">Select Role</option>
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
        </select>
        
        {selectedRole === "Doctor" && (
          <>
            <input {...register("speciality", { required: "Speciality is required" })} placeholder="Speciality" />
            <textarea {...register("bio")} placeholder="Bio" />
            <input {...register("meetingPrice", { valueAsNumber: true })} placeholder="Meeting Price" type="number" />
          </>
        )}

        <LocationSearch onSelectLocation={setSelectedLocation} />
        
        <button type="submit" disabled={isLoading}>{isLoading ? "Registering..." : "Register"}</button>
      </form>
    </div>
  );
}