import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../store/authSlice";
import LocationSearch, { SearchResult } from "./Home/LocationSearch";
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
  const password = watch("password", "");
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);
  const { loading } = useSelector((state: RootState) => state.auth);
  const [specialties, setSpecialties] = useState<string[]>([]);
  interface NavItem {
    label: string;
    href: string;
}
const navItems: NavItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Service', href: '#' },
  { label: 'Contact Us', href: '#' },
  { label: 'Help', href: '#' },
  { label: 'Blogs', href: '#' },
];

  // ✅ Fetch Specialties from Backend
  useEffect(() => {
    const fetchSpecialties = async () => {
      
     
      try {
        const response = await axios.get("http://localhost:5000/api/speciality");
        setSpecialties(response.data.map((s: { name: string }) => s.name));
      } catch (error) {
        console.error("❌ Error fetching specialties:", error);
      }
    };
    
    if (selectedRole === "Doctor") {
      fetchSpecialties();
    }
  }, [selectedRole]);

  // ✅ Password validation rules
  const passwordRequirements = [
    { regex: /.{8,}/, label: "At least 8 characters" },
    { regex: /[A-Z]/, label: "At least one uppercase letter (A-Z)" },
    { regex: /[a-z]/, label: "At least one lowercase letter (a-z)" },
    { regex: /\d/, label: "At least one number (0-9)" },
    { regex: /[@$!%*?&]/, label: "At least one special character (@$!%*?&)" }
  ];
  
  const isPasswordValid = passwordRequirements.every(req => req.regex.test(password));

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (!selectedLocation) {
      toast.error("Please select a location.");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Your password does not meet the security requirements.");
      return;
    }

    const requestData = {
      username: `${data.firstName}${data.lastName}`.toLowerCase(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role,
      phone: data.phone,
      LocationLatitude: selectedLocation.lat,
      LocationLongitude: selectedLocation.lon,
      ...(data.role === "Doctor" && {
        specialty: data.specialty, // Now selected from dropdown
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
      .catch((err: Error) => {
        console.error("Registration error:", err);
        toast.error(err.message || "Registration failed. Please try again.");
      });
  };

  return (
    
    <div className="register-container">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div>
            <span className="nav-logo">Healthcare</span>
          </div>
          <div className="nav-links">
            {navItems.map((item, index) => (
              <a key={index} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </div>
          <div className="nav-buttons">
            <button className="btn btn-outline" onClick={()=>navigate("/register")}>Sign Up</button>
            <button className="btn btn-primary"onClick={()=>navigate("/login")}>Log In</button>
          
          </div>
        </div>
      </nav>
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

        {/* ✅ Password Requirements Display */}
        <div className="password-requirements">
          {passwordRequirements.map((req, index) => (
            <p key={index} className={req.regex.test(password) ? "valid" : "invalid"}>
              {req.regex.test(password) ? "✅" : "❌"} {req.label}
            </p>
          ))}
        </div>

        <input {...register("phone", { required: "Phone number is required" })} placeholder="Phone Number" />

        <select {...register("role", { required: "Role is required" })}>
          <option value="">Select Role</option>
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
        </select>

        {selectedRole === "Doctor" && (
          <>
            {/* ✅ Specialty Dropdown */}
            <select {...register("specialty", { required: "Specialty is required" })}>
              <option value="">Select Specialty</option>
              {specialties.map((specialty, index) => (
                <option key={index} value={specialty}>{specialty}</option>
              ))}
            </select>

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
            <textarea {...register("medicalHistory")} placeholder="Medical History" />
          </>
        )}

        <LocationSearch onSelectLocation={setSelectedLocation} />

        <button className="register-button" type="submit" disabled={!isPasswordValid || loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
