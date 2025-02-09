import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { AppDispatch } from "../store/store";
import toast from "react-hot-toast";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Container,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";

interface LoginForm {
  email: string;
  password: string;
}
interface NavItem {
  label: string;
  href: string;
}

export default function Login() {
  const navItems: NavItem[] = [
    { label: 'Home', href: '#' },
    { label: 'Service', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Help', href: '#' },
    { label: 'Blogs', href: '#' },
  ];
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    if (!data.email.trim() || !data.password.trim()) {
      toast.error("Email and Password are required.");
      return;
    }

    try {
      setIsLoading(true);
      const result = await dispatch(login(data)).unwrap();

      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.user.id.toString());
        localStorage.setItem("role", result.user.role);
        if (result.user.firstName) {
          localStorage.setItem("firstName", result.user.firstName);
        }

        toast.success(`Welcome, ${result.user.firstName || "User"}!`);
        navigate(result.user.role === "Doctor" ? "/dashboard" : "/");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
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
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, textAlign: "center", mt: 6 }}>
        <LockOutlined color="primary" sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h5" fontWeight="bold">Login</Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "1rem" }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
