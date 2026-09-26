import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import UserDashboard from "../components/UserDashboard.jsx";
import ProtectedFoodPartnerRoute from "../components/ProtectedFoodPartnerRoute.jsx";
import UserRegister from "../components/UserRegister.jsx";
import UserLogin from "../components/UserLogin.jsx";
import FoodPartnerRegister from "../components/FoodPartnerRegister.jsx";
import FoodPartnerLogin from "../components/FoodPartnerLogin.jsx";
import Home from "../components/Home.jsx";
import FoodPartnerDashboard from "../components/FoodPartnerDashboard.jsx";

const AppRoutes = () => {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route
          path="/user/register"
          element={<UserRegister />}
        />

        <Route
          path="/user/login"
          element={<UserLogin />}
        />
        <Route
          path="/user/dashboard"
          element={<UserDashboard />}
        />
        <Route
          path="/food-partner/register"
          element={<FoodPartnerRegister />}
        />

        <Route
          path="/food-partner/login"
          element={<FoodPartnerLogin />}
        />
        <Route
          path="/food-partner/dashboard"
          element={
            <ProtectedFoodPartnerRoute>
              <FoodPartnerDashboard />
            </ProtectedFoodPartnerRoute>
          }
        />


      </Routes>
    </Router>
  );
};

export default AppRoutes;