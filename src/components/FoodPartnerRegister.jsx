
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/auth/api/food-partner/register`,
        {
          shopName,
          ownerName,
          contactNumber,
          email,
          password,
          address,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Registration successful:", response.data);

      setMessage(
        response.data?.message || "Food Partner registered successfully!"
      );

      // Clear form
      setShopName("");
      setOwnerName("");
      setContactNumber("");
      setEmail("");
      setPassword("");
      setAddress("");

      // Redirect to login after 10 seconds
      setTimeout(() => {
        navigate("/food-partner/login");
      }, 10000);

    } catch (error) {
      console.log(
        "Registration failed:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-page">

      <Link
        to="/user/register"
        className="switch-account"
      >
        Register as User
      </Link>

      <div className="auth-card">

        <div className="brand">Foodora</div>

        <span className="partner-badge">
          FOOD PARTNER
        </span>

        <h1>Partner with us</h1>

        <p className="subtitle">
          Grow your restaurant and reach more customers.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Shop Name</label>
          <input
            type="text"
            placeholder="Enter your shop name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />

          <label>Owner Name</label>
          <input
            type="text"
            placeholder="Enter owner's name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
          />

          <label>Contact Number</label>
          <input
            type="tel"
            placeholder="Enter contact number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
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

          <label>Address</label>
          <textarea
            placeholder="Enter shop address"
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></textarea>

          {/* Success message */}
          {message && (
            <p className="success-message">
              {message}
              <br />
              Redirecting to login in 10 seconds...
            </p>
          )}

          {/* Error message */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button type="submit">
            Become a Partner
          </button>

        </form>

        <p className="bottom-text">
          Already a partner?
          <Link to="/food-partner/login"> Login</Link>
        </p>

      </div>
    </div>
  );
};

export default FoodPartnerRegister;