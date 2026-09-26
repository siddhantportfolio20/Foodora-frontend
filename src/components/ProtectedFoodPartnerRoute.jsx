import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const ProtectedFoodPartnerRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkFoodPartnerAuth = async () => {
      try {
        await axios.get(
          `${API_URL}/auth/api/food-partner/me`,
          {
            withCredentials: true,
          }
        );

        setAuthenticated(true);
      } catch (error) {
        console.log(
          "Food partner authentication failed:",
          error.response?.data || error.message
        );

        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkFoodPartnerAuth();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff0f3",
          color: "#ff477e",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/food-partner/login" replace />;
  }

  return children;
};

export default ProtectedFoodPartnerRoute;