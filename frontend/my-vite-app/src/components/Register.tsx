import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../store/authSlice";
import LocationSearch, { SearchResult } from "../components/LocationSearch";
import "./register.css";
import { RootState } from "../store/store";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: "Patient" | "Doctor";
  specialty?: string;
  experience?: number;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  medicalHistory?: string;
};

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedRole = watch("role");

  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);
  const { loading, error, registerSuccess } = useSelector((state: RootState) => state.auth);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (!selectedLocation) {
      toast.error("Please select a location.");
      return;
    }

    const requestData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role,
      phone: data.phone,
      LocationLatitude: selectedLocation.lat,
      LocationLongitude: selectedLocation.lon,
      ...(data.role === "Doctor" && {
        specialty: data.specialty,
        experience: data.experience,
        bio: data.bio,
      }),
      ...(data.role === "Patient" && {
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address: data.address,
        medicalHistory: data.medicalHistory,
      }),
    };

    dispatch(registerUser(requestData) as any)
      .unwrap()
      .then(() => {
        toast.success("Registration successful! Redirecting to login...");
        navigate("/login");
      })
      .catch((err) => {
        console.error("Registration error:", err);
        toast.error(err.message || "Registration failed. Please try again.");
      });
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("firstName", { required: "First name is required" })} placeholder="First Name" />
        {errors.firstName && <p className="error">{errors.firstName.message}</p>}

        <input {...register("lastName", { required: "Last name is required" })} placeholder="Last Name" />
        {errors.lastName && <p className="error">{errors.lastName.message}</p>}

        <input {...register("email", { required: "Email is required" })} placeholder="Email" type="email" />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input {...register("password", { required: "Password is required" })} placeholder="Password" type="password" />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <input {...register("phone", { required: "Phone number is required" })} placeholder="Phone Number" />

        <select {...register("role", { required: "Role is required" })}>
          <option value="">Select Role</option>
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
        </select>

        {selectedRole === "Doctor" && (
          <>
            <input {...register("specialty", { required: "Specialty is required" })} placeholder="Specialty" />
            <input {...register("experience", { required: "Experience is required" })} placeholder="Experience (Years)" type="number" />
            <textarea {...register("bio")} placeholder="Bio" />
          </>
        )}

        {selectedRole === "Patient" && (
          <>
            <input {...register("dateOfBirth", { required: "Date of birth is required" })} placeholder="Date of Birth" type="date" />
            <select {...register("gender", { required: "Gender is required" })}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input {...register("address")} placeholder="Address" />
            <textarea {...register("medicalHistory")} placeholder="Medical History" />
          </>
        )}

        <LocationSearch onSelectLocation={setSelectedLocation} />

        <button className="register-button" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
