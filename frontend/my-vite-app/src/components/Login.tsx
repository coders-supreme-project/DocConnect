import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { login } from "../store/authSlice";
import { setEmailOrUsername, setPassword } from "../store/formSlice";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPasswordState] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setEmailOrUsername(email));
    dispatch(setPassword(password));

    const loginData = { email, password };
    dispatch(login(loginData)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/");
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ width: "300px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPasswordState(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          required
        />
        <button
          type="submit"
          style={{ width: "100%", padding: "10px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "10px" }}>
        Don't have an account? <span onClick={() => navigate("/register")} style={{ color: "blue", cursor: "pointer" }}>Register here</span>
      </p>
    </div>
  );
};

export default Login;
