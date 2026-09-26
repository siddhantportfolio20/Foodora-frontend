
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const UserRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [countdown, setCountdown] = useState(10);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous message
    setMessage("");
    setMessageType("");

    try {
      const response = await axios.post(
        `${API_URL}/auth/api/user/register`,
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Registration successful:", response.data);

      // Show success message
      setMessage(
        response.data.message || "Registration successful!"
      );
      setMessageType("success");

      // Start countdown
      setCountdown(10);

    } catch (error) {
      console.log(
        "Registration failed:",
        error.response?.data || error.message
      );

      // Get backend error message
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      setMessage(errorMessage);
      setMessageType("error");
    }
  };

  // Redirect after successful registration
  useEffect(() => {
    if (messageType !== "success") return;

    if (countdown === 0) {
      navigate("/user/login");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [messageType, countdown, navigate]);

  return (
    <div className="auth-page">

      <Link
        to="/food-partner/register"
        className="switch-account"
      >
        Register as Food Partner
      </Link>

      <div className="auth-card">

        <div className="brand">Foodora</div>

        <h1>Create your account</h1>

        <p className="subtitle">
          Discover amazing food and share your favorites.
        </p>

        {/* Message */}
        {message && (
          <div
            className={`message ${
              messageType === "success"
                ? "success-message"
                : "error-message"
            }`}
          >
            {message}

            {messageType === "success" && (
              <p>
                Redirecting to login in {countdown} seconds...
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={messageType === "success"}
          >
            Create account
          </button>

        </form>

        <p className="bottom-text">
          Already have an account?
          <Link to="/user/login"> Login</Link>
        </p>

      </div>

    </div>
  );
};

export default UserRegister;
