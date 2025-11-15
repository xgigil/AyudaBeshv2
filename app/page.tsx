import Image from "next/image";
import Link from "next/link";
import "./home.css";

export default function Home() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-container">
          <div className="logo-section">
            <Image src="/logo.png" alt="AyudaBesh" className="main-logo" width={200} height={60} />
          </div>
          <nav className="landing-nav">
            <Link href="/login" className="nav-link">Login</Link>
            <Link href="/signup" className="nav-link primary">Sign Up</Link>
          </nav>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero">
          <h1>Welcome to AyudaBesh</h1>
          <p>Your trusted platform for professional home services</p>
          <div className="hero-cta">
            <Link href="/signup?role=customer" className="btn btn-primary">Get Services</Link>
            <Link href="/signup?role=provider" className="btn btn-secondary">Become a Provider</Link>
          </div>
        </section>

        <section className="features">
          <h2>Why Choose AyudaBesh?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Trusted Providers</h3>
              <p>Connect with verified and experienced service professionals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Safe</h3>
              <p>Your data and transactions are protected with industry standards</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Quick & Easy</h3>
              <p>Book services in minutes and get the help you need fast</p>
            </div>
          </div>
        </section>

        <section className="services-preview">
          <h2>Our Services</h2>
          <div className="services-preview-grid">
            <div className="service-preview">
              <Image src="/services/house_cleaning.jpg" alt="House Cleaning" width={300} height={150} />
              <h3>House Cleaning</h3>
            </div>
            <div className="service-preview">
              <Image src="/services/plumbing_electrical.jpg" alt="Plumbing & Electrical" width={300} height={150} />
              <h3>Plumbing & Electrical</h3>
            </div>
            <div className="service-preview">
              <Image src="/services/pest_control.webp" alt="Pest Control" width={300} height={150} />
              <h3>Pest Control</h3>
            </div>
            <div className="service-preview">
              <Image src="/services/home_maintenance.webp" alt="Home Maintenance" width={300} height={150} />
              <h3>Home Maintenance</h3>
            </div>
            <div className="service-preview">
              <Image src="/services/appliance_installation.jpg" alt="Appliance Installation" width={300} height={150} />
              <h3>Appliance Installation</h3>
            </div>
            <div className="service-preview">
              <Image src="/services/minor_renovations.webp" alt="Minor Renovations" width={300} height={150} />
              <h3>Minor Renovations</h3>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2025 AyudaBesh. All rights reserved.</p>
      </footer>
    </div>
  );
}
