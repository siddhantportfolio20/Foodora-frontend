import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const FoodPartnerLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/auth/api/food-partner/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Login successful:", response.data);

      setMessage(
        response.data?.message || "Login successful!"
      );

      // Go directly to dashboard
      navigate("/food-partner/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.log(
        "Login failed:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <Link
        to="/user/login"
        className="switch-account"
      >
        Login as User
      </Link>

      <div className="auth-card">

        <div className="brand">
          Foodora
        </div>

        <span className="partner-badge">
          FOOD PARTNER
        </span>

        <h1>
          Welcome back, partner
        </h1>

        <p className="subtitle">
          Manage your restaurant and connect with customers.
        </p>

        <form onSubmit={handleSubmit}>

          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <div className="forgot">
            <a href="#">
              Forgot password?
            </a>
          </div>

          {message && (
            <p className="success-message">
              {message}
            </p>
          )}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="bottom-text">
          New food partner?

          <Link to="/food-partner/register">
            {" "}Register
          </Link>
        </p>

      </div>

    </div>
  );
};

export default FoodPartnerLogin;