import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { AppDispatch } from "../store/store";
import toast from "react-hot-toast";
import "./login.css";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    if (!data.email.trim() || !data.password.trim()) {
      toast.error("Email and Password are required.");
      return;
    }

    const loginData = {
      email: data.email.trim(),
      password: data.password.trim(),
    };

    console.log("Sending login request:", JSON.stringify(loginData, null, 2));

    try {
      setIsLoading(true);
      const result = await dispatch(login(loginData)).unwrap();

      if (result.token) {
        localStorage.setItem("token", result.token); // Store token
        toast.success("Login successful! Redirecting...");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          placeholder="Email"
          type="email"
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          {...register("password", { required: "Password is required" })}
          placeholder="Password"
          type="password"
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button className="login-button" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
