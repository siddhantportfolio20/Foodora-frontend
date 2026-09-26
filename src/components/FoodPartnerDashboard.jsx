import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/FoodPartnerDashboard.css";
const API_URL = import.meta.env.VITE_API_URL;
const FoodPartnerDashboard = () => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] =
    useState("dashboard");

  // =========================================================
  // LOGGED-IN FOOD PARTNER
  // =========================================================

  const [foodPartner, setFoodPartner] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    contactNumber: "",
    address: "",
  });

  const [profileLoading, setProfileLoading] =
    useState(true);

  // =========================================================
  // FOOD ITEMS
  // =========================================================

  const [foodItems, setFoodItems] =
    useState([]);

  const [foodItemsLoading, setFoodItemsLoading] =
    useState(false);

  // =========================================================
  // ORDERS
  // =========================================================

  const [orders, setOrders] = useState([]);

  const [ordersLoading, setOrdersLoading] =
    useState(false);

  const [orderUpdating, setOrderUpdating] =
    useState("");

  // =========================================================
  // ADD FOOD STATES
  // =========================================================

  const [foodName, setFoodName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [video, setVideo] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================================================
  // GET LOGGED-IN FOOD PARTNER
  // =========================================================

  useEffect(() => {
    const fetchFoodPartnerProfile =
      async () => {
        try {
          setProfileLoading(true);

          const response =
            await axios.get(
              `${API_URL}/auth/api/food-partner/me`,
              {
                withCredentials: true,
              }
            );

          console.log(
            "Logged in food partner:",
            response.data
          );

          if (
            response.data?.foodPartner
          ) {
            setFoodPartner(
              response.data.foodPartner
            );
          }

        } catch (error) {
          console.log(
            "Unable to fetch food partner:",
            error.response?.data ||
              error.message
          );

          if (
            error.response?.status ===
              401 ||
            error.response?.status ===
              403
          ) {
            navigate(
              "/food-partner/login",
              {
                replace: true,
              }
            );
          }

        } finally {
          setProfileLoading(false);
        }
      };

    fetchFoodPartnerProfile();
  }, [navigate]);

  // =========================================================
  // GET FOOD PARTNER FOOD ITEMS
  // =========================================================

  const fetchFoodPartnerItems =
    async () => {
      try {
        setFoodItemsLoading(true);

        const response =
          await axios.get(
            `${API_URL}/food-item/api/partner`,
            {
              withCredentials: true,
            }
          );

        console.log(
          "Food partner items:",
          response.data.foodItems
        );

        setFoodItems(
          response.data.foodItems || []
        );

      } catch (error) {
        console.log(
          "Unable to fetch food partner items:",
          error.response?.data ||
            error.message
        );

      } finally {
        setFoodItemsLoading(false);
      }
    };

  // =========================================================
  // GET FOOD PARTNER ORDERS
  // =========================================================

const fetchOrders = async () => {
  try {
    setOrdersLoading(true);

    const response = await axios.get(
      `${API_URL}0/order/api/partner`,
      {
        withCredentials: true,
      }
    );

    console.log("========== PARTNER ORDERS ==========");
    console.log("Full response:", response.data);
    console.log("Orders:", response.data.orders);
    console.log(
      "Order count:",
      response.data.orders?.length
    );
    console.log("====================================");

    setOrders(response.data.orders || []);

  } catch (error) {
    console.log(
      "========== ORDER FETCH ERROR =========="
    );

    console.log(
      "Status:",
      error.response?.status
    );

    console.log(
      "Response:",
      error.response?.data
    );

    console.log(
      "Message:",
      error.message
    );

    console.log(
      "======================================"
    );

  } finally {
    setOrdersLoading(false);
  }
};
  // =========================================================
  // FETCH ITEMS / ORDERS WHEN SECTION OPENS
  // =========================================================

  useEffect(() => {
    if (
      activeSection ===
      "food-items"
    ) {
      fetchFoodPartnerItems();
    }

    if (
      activeSection ===
      "orders"
    ) {
      fetchOrders();
    }
  }, [activeSection]);

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  const handleUpdateOrderStatus =
    async (orderId, status) => {
      try {
        setOrderUpdating(orderId);

        const response =
          await axios.patch(
            `${API_URL}/order/api/${orderId}/status`,
            {
              status,
            },
            {
              withCredentials: true,
            }
          );

        console.log(
          "Order status updated:",
          response.data
        );

        setOrders((previousOrders) =>
          previousOrders.map(
            (order) =>
              order._id === orderId
                ? {
                    ...order,
                    status,
                  }
                : order
          )
        );

      } catch (error) {
        console.log(
          "Unable to update order:",
          error.response?.data ||
            error.message
        );

        alert(
          error.response?.data?.message ||
            "Unable to update order status."
        );

      } finally {
        setOrderUpdating("");
      }
    };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    try {
      await axios.get(
        `${API_URL}/auth/api/food-partner/logout`,
        {
          withCredentials: true,
        }
      );

      navigate(
        "/food-partner/login",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.log(
        "Logout error:",
        error.response?.data ||
          error.message
      );
    }
  };

  // =========================================================
  // ADD FOOD
  // =========================================================

  const handleAddFood = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!foodName.trim()) {
      setMessage(
        "Please enter food name"
      );
      setMessageType("error");
      return;
    }

    if (!description.trim()) {
      setMessage(
        "Please enter food description"
      );
      setMessageType("error");
      return;
    }

    if (!video) {
      setMessage(
        "Please select a video"
      );
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "name",
        foodName
      );

      formData.append(
        "description",
        description
      );

      formData.append(
        "video",
        video
      );

      const response =
        await axios.post(
          `${API_URL}/food-item/api/`,
          formData,
          {
            withCredentials: true,
          }
        );

      console.log(
        "Food added:",
        response.data
      );

      setMessage(
        response.data?.message ||
          "Food added successfully!"
      );

      setMessageType("success");

      setFoodName("");
      setDescription("");
      setVideo(null);

      const fileInput =
        document.getElementById(
          "food-video"
        );

      if (fileInput) {
        fileInput.value = "";
      }

      await fetchFoodPartnerItems();

    } catch (error) {
      console.log(
        "Add food error:",
        error.response?.data ||
          error.message
      );

      setMessage(
        error.response?.data?.message ||
          "Something went wrong while adding food."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DASHBOARD
  // =========================================================

  const renderDashboard = () => {
    return (
      <div className="dashboard-content">

        <div className="dashboard-header">

          <div>

            <h1>
              Welcome,{" "}
              <span>
                {foodPartner.ownerName ||
                  "Food Partner"}
              </span>
            </h1>

            <p>
              Manage your restaurant and
              food items from here.
            </p>

          </div>

        </div>

        {/* STAT CARDS */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              🍔
            </div>

            <div>

              <p>
                Total Food Items
              </p>

              <h2>
                {foodItems.length}
              </h2>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              📦
            </div>

            <div>

              <p>
                Total Orders
              </p>

              <h2>
                {orders.length}
              </h2>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              💰
            </div>

            <div>

              <p>
                Total Revenue
              </p>

              <h2>
                ₹
                {orders
                  .filter(
                    (order) =>
                      order.status !==
                      "cancelled"
                  )
                  .reduce(
                    (
                      total,
                      order
                    ) =>
                      total +
                      Number(
                        order.totalAmount ||
                          0
                      ),
                    0
                  )}
              </h2>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ⭐
            </div>

            <div>

              <p>
                Rating
              </p>

              <h2>
                0.0
              </h2>

            </div>

          </div>

        </div>

        {/* RESTAURANT INFO */}

        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Restaurant Information
              </h2>

              <p>
                Your food partner account
                details
              </p>

            </div>

          </div>

          <div className="restaurant-info-grid">

            <div className="info-card">

              <span>
                Restaurant Name
              </span>

              <strong>
                {foodPartner.shopName ||
                  "Not available"}
              </strong>

            </div>

            <div className="info-card">

              <span>
                Owner Name
              </span>

              <strong>
                {foodPartner.ownerName ||
                  "Not available"}
              </strong>

            </div>

            <div className="info-card">

              <span>
                Email
              </span>

              <strong>
                {foodPartner.email ||
                  "Not available"}
              </strong>

            </div>

            <div className="info-card">

              <span>
                Contact Number
              </span>

              <strong>
                {foodPartner.contactNumber ||
                  "Not available"}
              </strong>

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Manage your restaurant
              </p>

            </div>

          </div>

          <div className="quick-actions">

            <button
              className="quick-action-card"
              onClick={() =>
                setActiveSection(
                  "add-food"
                )
              }
            >

              <span>
                ➕
              </span>

              <div>

                <h3>
                  Add Food
                </h3>

                <p>
                  Add a new food item
                </p>

              </div>

            </button>

            <button
              className="quick-action-card"
              onClick={() =>
                setActiveSection(
                  "food-items"
                )
              }
            >

              <span>
                🍴
              </span>

              <div>

                <h3>
                  Food Items
                </h3>

                <p>
                  Manage your food items
                </p>

              </div>

            </button>

            <button
              className="quick-action-card"
              onClick={() =>
                setActiveSection(
                  "orders"
                )
              }
            >

              <span>
                📦
              </span>

              <div>

                <h3>
                  Orders
                </h3>

                <p>
                  View customer orders
                </p>

              </div>

            </button>

            <button
              className="quick-action-card"
              onClick={() =>
                setActiveSection(
                  "profile"
                )
              }
            >

              <span>
                👤
              </span>

              <div>

                <h3>
                  Profile
                </h3>

                <p>
                  View your profile
                </p>

              </div>

            </button>

          </div>

        </div>

      </div>
    );
  };

  // =========================================================
  // ADD FOOD
  // =========================================================

  const renderAddFood = () => {
    return (
      <div className="dashboard-content">

        <div className="dashboard-header">

          <div>

            <h1>
              Add Food
            </h1>

            <p>
              Add a new food item to your
              restaurant.
            </p>

          </div>

        </div>

        <div className="form-card">

          <form
            onSubmit={handleAddFood}
          >

            <div className="form-group">

              <label htmlFor="food-name">
                Food Name
              </label>

              <input
                id="food-name"
                type="text"
                placeholder="Enter food name"
                value={foodName}
                onChange={(e) =>
                  setFoodName(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="form-group">

              <label htmlFor="food-description">
                Description
              </label>

              <textarea
                id="food-description"
                placeholder="Enter food description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows="5"
              />

            </div>

            <div className="form-group">

              <label htmlFor="food-video">
                Food Video
              </label>

              <input
                id="food-video"
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setVideo(
                    e.target.files[0]
                  )
                }
              />

            </div>

            {message && (

              <div
                className={`form-message ${
                  messageType ===
                  "success"
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>

            )}

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Adding Food..."
                : "Add Food"}
            </button>

          </form>

        </div>

      </div>
    );
  };

  // =========================================================
  // FOOD ITEMS
  // =========================================================

  const renderFoodItems = () => {
    return (
      <div className="dashboard-content">

        <div className="dashboard-header">

          <div>

            <h1>
              Food Items
            </h1>

            <p>
              Manage your restaurant's
              food items.
            </p>

          </div>

          <button
            className="primary-btn"
            onClick={() =>
              setActiveSection(
                "add-food"
              )
            }
          >
            + Add Food
          </button>

        </div>

        {foodItemsLoading ? (

          <div className="empty-state">

            <div className="empty-icon">
              🍔
            </div>

            <h2>
              Loading Food Items...
            </h2>

            <p>
              Fetching your uploaded
              food items.
            </p>

          </div>

        ) : foodItems.length ===
          0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              🍔
            </div>

            <h2>
              No Food Items Yet
            </h2>

            <p>
              Start adding food items
              to your restaurant.
            </p>

            <button
              className="primary-btn"
              onClick={() =>
                setActiveSection(
                  "add-food"
                )
              }
            >
              Add Your First Food
            </button>

          </div>

        ) : (

          <div className="food-items-grid">

            {foodItems.map(
              (foodItem) => (

                <div
                  className="food-item-card"
                  key={
                    foodItem._id
                  }
                >

                  <video
                    src={
                      foodItem.video
                    }
                    controls
                    muted
                    className="food-item-video"
                  />

                  <div className="food-item-details">

                    <h3>
                      {foodItem.name}
                    </h3>

                    <p>
                      {
                        foodItem.description
                      }
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>
    );
  };

  // =========================================================
  // ORDERS
  // =========================================================

  const renderOrders = () => {
    return (
      <div className="dashboard-content">

        <div className="dashboard-header">

          <div>

            <h1>
              Orders
            </h1>

            <p>
              Manage your customer orders.
            </p>

          </div>

          <button
            className="primary-btn"
            onClick={fetchOrders}
          >
            ↻ Refresh Orders
          </button>

        </div>

        {ordersLoading ? (

          <div className="empty-state">

            <div className="empty-icon">
              📦
            </div>

            <h2>
              Loading Orders...
            </h2>

            <p>
              Fetching customer orders.
            </p>

          </div>

        ) : orders.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              📦
            </div>

            <h2>
              No Orders Yet
            </h2>

            <p>
              Customer orders will
              appear here.
            </p>

          </div>

        ) : (

          <div className="orders-dashboard-list">

            {orders.map(
              (order) => (

                <div
                  className="partner-order-card"
                  key={order._id}
                >

                  {/* ORDER HEADER */}

                  <div className="partner-order-header">

                    <div>

                      <h3>
                        {order.foodItem
                          ?.name ||
                          "Food Item"}
                      </h3>

                      <p>
                        Order ID:{" "}
                        {order._id}
                      </p>

                    </div>

                    <span
                      className={`partner-order-status status-${order.status}`}
                    >
                      {order.status
                        ?.split("_")
                        .map(
                          (word) =>
                            word
                              .charAt(
                                0
                              )
                              .toUpperCase() +
                            word.slice(
                              1
                            )
                        )
                        .join(" ")}
                    </span>

                  </div>

                  {/* CUSTOMER */}

                  <div className="partner-order-details">

                    <div>

                      <span>
                        Customer
                      </span>

                      <strong>
                        {order.user
                          ?.name ||
                          "Customer"}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Email
                      </span>

                      <strong>
                        {order.user
                          ?.email ||
                          "Not available"}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Quantity
                      </span>

                      <strong>
                        {order.quantity}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Total
                      </span>

                      <strong>
                        ₹
                        {
                          order.totalAmount
                        }
                      </strong>

                    </div>

                    <div>

                      <span>
                        Contact
                      </span>

                      <strong>
                        {order.contactNumber}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Delivery Address
                      </span>

                      <strong>
                        {
                          order.deliveryAddress
                        }
                      </strong>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="partner-order-actions">

                    <span>
                      Update Order Status
                    </span>

                    <div>

                      <button
                        disabled={
                          orderUpdating ===
                            order._id ||
                          order.status ===
                            "accepted"
                        }
                        onClick={() =>
                          handleUpdateOrderStatus(
                            order._id,
                            "accepted"
                          )
                        }
                      >
                        Accept
                      </button>

                      <button
                        disabled={
                          orderUpdating ===
                            order._id ||
                          order.status ===
                            "preparing"
                        }
                        onClick={() =>
                          handleUpdateOrderStatus(
                            order._id,
                            "preparing"
                          )
                        }
                      >
                        Preparing
                      </button>

                      <button
                        disabled={
                          orderUpdating ===
                            order._id ||
                          order.status ===
                            "out_for_delivery"
                        }
                        onClick={() =>
                          handleUpdateOrderStatus(
                            order._id,
                            "out_for_delivery"
                          )
                        }
                      >
                        Out for Delivery
                      </button>

                      <button
                        disabled={
                          orderUpdating ===
                            order._id ||
                          order.status ===
                            "delivered"
                        }
                        onClick={() =>
                          handleUpdateOrderStatus(
                            order._id,
                            "delivered"
                          )
                        }
                      >
                        Delivered
                      </button>

                      <button
                        disabled={
                          orderUpdating ===
                            order._id ||
                          order.status ===
                            "cancelled"
                        }
                        onClick={() =>
                          handleUpdateOrderStatus(
                            order._id,
                            "cancelled"
                          )
                        }
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>
    );
  };

  // =========================================================
  // PROFILE
  // =========================================================

  const renderProfile = () => {
    return (
      <div className="dashboard-content">

        <div className="dashboard-header">

          <div>

            <h1>
              My Profile
            </h1>

            <p>
              View your food partner
              account information.
            </p>

          </div>

        </div>

        <div className="profile-card">

          <div className="profile-avatar">

            {(
              foodPartner.ownerName ||
              foodPartner.shopName ||
              "F"
            )
              .charAt(0)
              .toUpperCase()}

          </div>

          <div className="profile-details">

            <div className="profile-detail">

              <span>
                Owner Name
              </span>

              <strong>
                {foodPartner.ownerName ||
                  "Not available"}
              </strong>

            </div>

            <div className="profile-detail">

              <span>
                Restaurant Name
              </span>

              <strong>
                {foodPartner.shopName ||
                  "Not available"}
              </strong>

            </div>

            <div className="profile-detail">

              <span>
                Email
              </span>

              <strong>
                {foodPartner.email ||
                  "Not available"}
              </strong>

            </div>

            <div className="profile-detail">

              <span>
                Contact Number
              </span>

              <strong>
                {foodPartner.contactNumber ||
                  "Not available"}
              </strong>

            </div>

            <div className="profile-detail">

              <span>
                Address
              </span>

              <strong>
                {foodPartner.address ||
                  "Not available"}
              </strong>

            </div>

          </div>

        </div>

      </div>
    );
  };

  // =========================================================
  // RENDER CONTENT
  // =========================================================

  const renderContent = () => {
    switch (activeSection) {

      case "add-food":
        return renderAddFood();

      case "food-items":
        return renderFoodItems();

      case "orders":
        return renderOrders();

      case "profile":
        return renderProfile();

      case "dashboard":
      default:
        return renderDashboard();
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (profileLoading) {
    return (
      <div className="partner-dashboard">

        <div
          style={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff0f3",
            color: "#ff477e",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Loading your dashboard...
        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="partner-dashboard">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <div className="sidebar-logo">

          <h2>
            Foodora
          </h2>

          <span>
            Food Partner
          </span>

        </div>

        {/* LOGGED IN PARTNER */}

        <div className="sidebar-profile">

          <div className="sidebar-avatar">

            {(
              foodPartner.ownerName ||
              foodPartner.shopName ||
              "F"
            )
              .charAt(0)
              .toUpperCase()}

          </div>

          <div className="sidebar-profile-info">

            <strong>
              {foodPartner.ownerName ||
                "Food Partner"}
            </strong>

            <span>
              {foodPartner.shopName ||
                "Restaurant"}
            </span>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          <button
            className={
              activeSection ===
              "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveSection(
                "dashboard"
              )
            }
          >
            <span>
              🏠
            </span>

            Dashboard
          </button>

          <button
            className={
              activeSection ===
              "add-food"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveSection(
                "add-food"
              )
            }
          >
            <span>
              ➕
            </span>

            Add Food
          </button>

          <button
            className={
              activeSection ===
              "food-items"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveSection(
                "food-items"
              )
            }
          >
            <span>
              🍔
            </span>

            Food Items
          </button>

          <button
            className={
              activeSection ===
              "orders"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveSection(
                "orders"
              )
            }
          >
            <span>
              📦
            </span>

            Orders

            {orders.length > 0 && (
              <span className="order-count">
                {orders.length}
              </span>
            )}

          </button>

          <button
            className={
              activeSection ===
              "profile"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActiveSection(
                "profile"
              )
            }
          >
            <span>
              👤
            </span>

            Profile
          </button>

        </nav>

        {/* LOGOUT */}

        <div className="sidebar-bottom">

          <button
            className="logout-btn"
            onClick={handleLogout}
          >

            <span>
              🚪
            </span>

            Logout

          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="dashboard-main">

        {/* TOP BAR */}

        <header className="dashboard-topbar">

          <div>

            <span className="topbar-label">
              Food Partner Dashboard
            </span>

          </div>

          <div className="topbar-user">

            <div className="topbar-avatar">

              {(
                foodPartner.ownerName ||
                foodPartner.shopName ||
                "F"
              )
                .charAt(0)
                .toUpperCase()}

            </div>

            <div className="topbar-user-info">

              <strong>
                {foodPartner.ownerName ||
                  "Food Partner"}
              </strong>

              <span>
                {foodPartner.shopName ||
                  "Restaurant"}
              </span>

            </div>

          </div>

        </header>

        {/* CONTENT */}

        {renderContent()}

      </main>

    </div>
  );
};

export default FoodPartnerDashboard;