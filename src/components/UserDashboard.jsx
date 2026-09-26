import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../style/UserDashboard.css";
const API_URL = import.meta.env.VITE_API_URL;
const UserDashboard = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // ORDER STATES
  // =========================================

  const [selectedFood, setSelectedFood] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderMessageType, setOrderMessageType] = useState("");

  // =========================================
  // USER ORDERS
  // =========================================

  const [userOrders, setUserOrders] = useState([]);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const videoRefs = useRef([]);

  // =========================================
  // TEMPORARY FOOD PRICE
  // =========================================
  // Your current fooditem model does not have
  // a price field, so we use ₹199 for now.

  const FOOD_PRICE = 199;

  // =========================================
  // FETCH FOOD ITEMS
  // =========================================

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/food-item/api/`,
          {
            withCredentials: true,
          }
        );

        console.log(
          "Food items:",
          response.data.findFoodItems
        );

        setFoodItems(
          response.data.findFoodItems || []
        );

      } catch (error) {
        console.log(
          "Unable to fetch food items:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            "Unable to load food items"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  // =========================================
  // AUTO PLAY / PAUSE VIDEOS
  // =========================================

  useEffect(() => {
    if (!foodItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.7,
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [foodItems]);

  // =========================================
  // OPEN ORDER MODAL
  // =========================================

  const handleOpenOrder = (foodItem) => {
    if (!foodItem.foodPartner) {
      alert(
        "This food item is currently unavailable for ordering."
      );
      return;
    }

    setSelectedFood(foodItem);

    setQuantity(1);
    setDeliveryAddress("");
    setContactNumber("");

    setOrderMessage("");
    setOrderMessageType("");

    setShowOrderModal(true);
  };

  // =========================================
  // CLOSE ORDER MODAL
  // =========================================

  const handleCloseOrder = () => {
    if (orderLoading) return;

    setShowOrderModal(false);
    setSelectedFood(null);
    setOrderMessage("");
    setOrderMessageType("");
  };

  // =========================================
  // PLACE ORDER
  // =========================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setOrderMessage("");
    setOrderMessageType("");

    if (!selectedFood) {
      setOrderMessage("Please select a food item.");
      setOrderMessageType("error");
      return;
    }

    if (!deliveryAddress.trim()) {
      setOrderMessage(
        "Please enter your delivery address."
      );
      setOrderMessageType("error");
      return;
    }

    if (!contactNumber.trim()) {
      setOrderMessage(
        "Please enter your contact number."
      );
      setOrderMessageType("error");
      return;
    }

    if (quantity < 1) {
      setOrderMessage(
        "Quantity must be at least 1."
      );
      setOrderMessageType("error");
      return;
    }

    try {
      setOrderLoading(true);

      const totalAmount =
        FOOD_PRICE * quantity;

      const response = await axios.post(
        `${API_URL}/order/api/`,
        {
          foodItem: selectedFood._id,
          quantity,
          deliveryAddress,
          contactNumber,
          totalAmount,
        },
        {
          withCredentials: true,
        }
      );

      console.log(
        "Order response:",
        response.data
      );

      setOrderMessage(
        response.data?.message ||
          "Order placed successfully!"
      );

      setOrderMessageType("success");

      setTimeout(() => {
        setShowOrderModal(false);
        setSelectedFood(null);
      }, 1500);

    } catch (error) {
      console.log(
        "Place order error:",
        error.response?.data || error.message
      );

      setOrderMessage(
        error.response?.data?.message ||
          "Unable to place order."
      );

      setOrderMessageType("error");

    } finally {
      setOrderLoading(false);
    }
  };

  // =========================================
  // FETCH USER ORDERS
  // =========================================

  const fetchUserOrders = async () => {
    try {
      setOrdersLoading(true);

      const response = await axios.get(
        `${API_URL}/order/api/user`,
        {
          withCredentials: true,
        }
      );

      console.log(
        "User orders:",
        response.data.orders
      );

      setUserOrders(
        response.data.orders || []
      );

    } catch (error) {
      console.log(
        "Unable to fetch user orders:",
        error.response?.data || error.message
      );

    } finally {
      setOrdersLoading(false);
    }
  };

  // =========================================
  // OPEN ORDERS
  // =========================================

  const handleOpenOrders = async () => {
    setShowOrdersModal(true);

    await fetchUserOrders();
  };

  // =========================================
  // CLOSE ORDERS
  // =========================================

  const handleCloseOrders = () => {
    setShowOrdersModal(false);
  };

  // =========================================
  // STATUS FORMATTER
  // =========================================

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="reels-loading">
        Loading delicious food...
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="reels-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  // =========================================
  // NO FOOD
  // =========================================

  if (foodItems.length === 0) {
    return (
      <div className="reels-empty">
        <h2>
          No food available yet 🍽️
        </h2>

        <p>
          Food partners haven't uploaded
          anything yet.
        </p>
      </div>
    );
  }

  // =========================================
  // DASHBOARD
  // =========================================

  return (
    <div className="reels-page">

      {/* =====================================
          NAVBAR
      ====================================== */}

      <header className="reels-navbar">

        <div className="reels-logo">
          Foodora
        </div>

        <div className="reels-nav-actions">

          <button type="button">
            🔍
          </button>

          <button
            type="button"
            onClick={handleOpenOrders}
          >
            🛒
          </button>

          <button type="button">
            👤
          </button>

        </div>

      </header>

      {/* =====================================
          REELS
      ====================================== */}

      <main className="reels-container">

        {foodItems.map(
          (foodItem, index) => (

            <section
              className="food-reel"
              key={foodItem._id}
            >

              {/* VIDEO */}

              <video
                ref={(element) => {
                  videoRefs.current[index] =
                    element;
                }}
                className="food-video"
                src={foodItem.video}
                muted
                loop
                playsInline
                preload="metadata"
              />

              {/* GRADIENT */}

              <div className="reel-gradient"></div>

              {/* FOOD INFORMATION */}

              <div className="food-information">

                <h2>
                  {foodItem.name}
                </h2>

                <p>
                  {foodItem.description}
                </p>

                <div className="food-partner-name">

                  🍽️{" "}

                  {foodItem.foodPartner
                    ?.shopName ||
                    "Food Partner"}

                </div>

                {/* ORDER BUTTON */}

                <button
                  type="button"
                  className="order-button"
                  disabled={
                    !foodItem.foodPartner
                  }
                  onClick={() =>
                    handleOpenOrder(
                      foodItem
                    )
                  }
                >
                  {foodItem.foodPartner
                    ? "Order Now"
                    : "Unavailable"}
                </button>

              </div>

              {/* ACTION BUTTONS */}

              <div className="reel-actions">

                <button
                  type="button"
                  className="reel-action"
                >
                  <span>❤️</span>
                  <small>Like</small>
                </button>

                <button
                  type="button"
                  className="reel-action"
                >
                  <span>💬</span>
                  <small>Comment</small>
                </button>

                <button
                  type="button"
                  className="reel-action"
                >
                  <span>↗️</span>
                  <small>Share</small>
                </button>

                <button
                  type="button"
                  className="reel-action"
                  disabled={
                    !foodItem.foodPartner
                  }
                  onClick={() =>
                    handleOpenOrder(
                      foodItem
                    )
                  }
                >
                  <span>🛒</span>
                  <small>Order</small>
                </button>

              </div>

              {/* COUNTER */}

              <div className="reel-counter">

                {index + 1} /{" "}
                {foodItems.length}

              </div>

            </section>

          )
        )}

      </main>

      {/* =====================================
          ORDER MODAL
      ====================================== */}

      {showOrderModal &&
        selectedFood && (

          <div
            className="order-modal-overlay"
            onClick={handleCloseOrder}
          >

            <div
              className="order-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                type="button"
                className="modal-close-btn"
                onClick={
                  handleCloseOrder
                }
              >
                ✕
              </button>

              <div className="order-modal-header">

                <h2>
                  Place Your Order
                </h2>

                <p>
                  Order from{" "}
                  <strong>
                    {selectedFood.foodPartner
                      ?.shopName}
                  </strong>
                </p>

              </div>

              {/* FOOD */}

              <div className="selected-food-card">

                <div>

                  <h3>
                    {selectedFood.name}
                  </h3>

                  <p>
                    {selectedFood.description}
                  </p>

                </div>

                <strong>
                  ₹{FOOD_PRICE}
                </strong>

              </div>

              <form
                onSubmit={
                  handlePlaceOrder
                }
              >

                {/* QUANTITY */}

                <div className="order-form-group">

                  <label>
                    Quantity
                  </label>

                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          Math.max(
                            1,
                            quantity - 1
                          )
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* ADDRESS */}

                <div className="order-form-group">

                  <label>
                    Delivery Address
                  </label>

                  <textarea
                    placeholder="Enter your complete delivery address"
                    value={
                      deliveryAddress
                    }
                    onChange={(e) =>
                      setDeliveryAddress(
                        e.target.value
                      )
                    }
                    rows="4"
                  />

                </div>

                {/* CONTACT */}

                <div className="order-form-group">

                  <label>
                    Contact Number
                  </label>

                  <input
                    type="tel"
                    placeholder="Enter your contact number"
                    value={
                      contactNumber
                    }
                    onChange={(e) =>
                      setContactNumber(
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* TOTAL */}

                <div className="order-total">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹
                    {FOOD_PRICE *
                      quantity}
                  </strong>

                </div>

                {/* MESSAGE */}

                {orderMessage && (

                  <div
                    className={`order-message ${
                      orderMessageType
                    }`}
                  >
                    {orderMessage}
                  </div>

                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="place-order-btn"
                  disabled={orderLoading}
                >
                  {orderLoading
                    ? "Placing Order..."
                    : `Place Order • ₹${
                        FOOD_PRICE *
                        quantity
                      }`}
                </button>

              </form>

            </div>

          </div>

        )}

      {/* =====================================
          USER ORDERS MODAL
      ====================================== */}

      {showOrdersModal && (

        <div
          className="order-modal-overlay"
          onClick={handleCloseOrders}
        >

          <div
            className="orders-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="modal-close-btn"
              onClick={
                handleCloseOrders
              }
            >
              ✕
            </button>

            <div className="order-modal-header">

              <h2>
                My Orders
              </h2>

              <p>
                Track your food orders
              </p>

            </div>

            {ordersLoading ? (

              <div className="orders-loading">
                Loading your orders...
              </div>

            ) : userOrders.length ===
              0 ? (

              <div className="orders-empty">

                <div>
                  📦
                </div>

                <h3>
                  No Orders Yet
                </h3>

                <p>
                  Your orders will appear
                  here.
                </p>

              </div>

            ) : (

              <div className="orders-list">

                {userOrders.map(
                  (order) => (

                    <div
                      className="user-order-card"
                      key={order._id}
                    >

                      <div className="user-order-info">

                        <h3>
                          {order.foodItem
                            ?.name ||
                            "Food Item"}
                        </h3>

                        <p>
                          {order.foodPartner
                            ?.shopName ||
                            "Food Partner"}
                        </p>

                        <span>
                          Quantity:{" "}
                          {order.quantity}
                        </span>

                        <span>
                          Total: ₹
                          {
                            order.totalAmount
                          }
                        </span>

                      </div>

                      <div className="user-order-status">

                        <span>
                          Status
                        </span>

                        <strong
                          className={`status-${order.status}`}
                        >
                          {formatStatus(
                            order.status
                          )}
                        </strong>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
};

export default UserDashboard;