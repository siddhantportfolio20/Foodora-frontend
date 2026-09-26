import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error,setError] = useState("")

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  try {
    const response = await axios.post(
      `${API_URL}/auth/api/user/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    console.log("Login successful:", response.data);

    navigate("/user/dashboard");

  } catch (error) {
    setError(
      error.response?.data?.message || "Something went wrong"
    );
  }
};



  return (
    <div className="auth-page">
      {/* Top-right switch button */}
      <Link to="/food-partner/login" className="switch-account">
        Login as Food Partner
      </Link>

      <div className="auth-card">
        <div className="brand">Foodora</div>
        <h1>Welcome back</h1>
        <p className="subtitle">
          Login and discover your next favorite meal.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="bottom-text">
          Don't have an account? <Link to="/user/register">Register</Link>
        </p>
      </div>
          {error && (
            <p className="login-error">
              {error}
            </p>
          )}
    </div>
  );
};

export default UserLogin;