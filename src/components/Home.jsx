// import React from "react";
import { Link } from "react-router-dom";
import "../style/Home.css";
const API_URL = import.meta.env.VITE_API_URL;
const Home = () => {
  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
          Foodora
        </Link>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#partners">Food Partners</a>
        </div>
        <div className="nav-buttons">
          <Link to="/user/login" className="login-btn">
            Login
          </Link>
          <Link to="/user/register" className="signup-btn">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">
            Delicious food. Just a few clicks away.
          </span>
          <h1>
            See It. <span>Crave It.</span> <br /> Order It.
          </h1>
          <p>
            Discover delicious food from local food partners, explore new
            flavours, and get your favourite meals without the hassle.
          </p>
          <div className="hero-buttons">
            <Link to="/user/register" className="primary-btn">
              Start Ordering
            </Link>
            <Link to="/food-partner/register" className="secondary-btn">
              Become a Food Partner
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="food-circle">🍔</div>
          <div className="floating-card card-top">
            <span>Fresh & Delicious</span>
            <strong>Made for you ❤️</strong>
          </div>
          <div className="floating-card card-bottom">
            <span>Discover</span>
            <strong>Local Food 🍕</strong>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="section-heading">
          <span>ABOUT FOODORA</span>
          <h2>Your food, your choice.</h2>
          <p>
            Foodora is a simple food discovery and ordering platform that
            connects hungry customers with food partners. Browse delicious
            meals, discover new places, and order what you're craving.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <span>HOW IT WORKS</span>
          <h2>Food ordering made simple.</h2>
        </div>
        <div className="steps">
          <div className="step-card">
            <div className="step-icon">🔎</div>
            <h3>Discover</h3>
            <p>Explore food and discover dishes from your favourite food partners.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">🛒</div>
            <h3>Choose</h3>
            <p>Pick the food you love and add it to your order.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">😋</div>
            <h3>Enjoy</h3>
            <p>Place your order and enjoy your favourite meal.</p>
          </div>
        </div>
      </section>

      {/* Food Partner Section */}
      <section className="partner-section" id="partners">
        <div className="partner-content">
          <span>FOR FOOD PARTNERS</span>
          <h2>Grow your food business with Foodora.</h2>
          <p>
            Join Foodora and showcase your food to customers looking for
            something delicious. Manage your food offerings and grow your
            presence on the platform.
          </p>
          <Link to="/food-partner/register" className="primary-btn">
            Join as a Food Partner
          </Link>
        </div>
        <div className="partner-features">
          <div className="feature-card">
            <div>📈</div>
            <h3>Reach Customers</h3>
            <p>Get your food discovered by more people.</p>
          </div>
          <div className="feature-card">
            <div>🍽️</div>
            <h3>Showcase Food</h3>
            <p>Display your dishes in one place.</p>
          </div>
          <div className="feature-card">
            <div>⚡</div>
            <h3>Simple Management</h3>
            <p>Manage your food offerings easily.</p>
          </div>
          <div className="feature-card">
            <div>❤️</div>
            <h3>Build Loyalty</h3>
            <p>Give customers reasons to come back.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Hungry?</h2>
        <p>Find something you'll love today.</p>
        <Link to="/user/register" className="cta-btn">
          Explore Food
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <h2>Foodora</h2>
            <p>See it. Crave it. Order it.</p>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#partners">Partners</a>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Foodora. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;