"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import "../customer.css";

interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  image?: string;
}

const SERVICES = [
  {
    _id: "1",
    name: "House Cleaning",
    description: "Professional house cleaning services for regular upkeep and deep cleans.",
    category: "cleaning",
    image: "/services/house_cleaning.jpg",
  },
  {
    _id: "2",
    name: "Plumbing and Electrical Repairs",
    description: "Qualified technicians for plumbing fixes and electrical repairs.",
    category: "repairs",
    image: "/services/plumbing_electrical.jpg",
  },
  {
    _id: "3",
    name: "Pest Control",
    description: "Safe and effective pest control solutions for homes and properties.",
    category: "pest",
    image: "/services/pest_control.webp",
  },
  {
    _id: "4",
    name: "General Home Maintenance",
    description: "Small repairs, installations, and general handyman tasks.",
    category: "maintenance",
    image: "/services/home_maintenance.webp",
  },
  {
    _id: "5",
    name: "Appliance Installation",
    description: "Installation and setup for household appliances.",
    category: "appliances",
    image: "/services/appliance_installation.jpg",
  },
  {
    _id: "6",
    name: "Minor Renovations",
    description: "Small renovation projects and upgrades to improve your space.",
    category: "renovation",
    image: "/services/minor_renovations.webp",
  },
];

export default function CustomerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchRequests();
  }, [router]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/requests/my-requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleRequestService = async (serviceId: string) => {
    try {
      const response = await fetch("/api/requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, status: "pending" }),
      });

      if (response.ok) {
        alert("Service request created successfully!");
        fetchRequests();
      }
    } catch (err) {
      console.error("Failed to create request:", err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <header>
        <nav className="navbar">
          <button
            className="hamburger-btn"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <a href="#" className="logo">
            <img src="/logo_circle.png" alt="AyudaBesh Logo" style={{ height: '50px', width: 'auto' }} />
            <h2>AyudaBesh</h2>
          </a>

          <ul className={`links ${showMenu ? "active" : ""}`}>
            <button
              className="close-btn"
              onClick={() => setShowMenu(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
            <li>
              <a className="nav-btn" href="#home">
                Home
              </a>
            </li>
            <li>
              <a className="nav-btn" href="#requests">
                My Requests
              </a>
            </li>
            <li>
              <a className="nav-btn" href="#services">
                Services
              </a>
            </li>
            <li>
              <a className="nav-btn" href="#help">
                Help
              </a>
            </li>
          </ul>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      <div className="home-hero">
        <div className="wrap">
          <div className="search">
            <input type="text" className="searchTerm" placeholder="Search services or providers..." />
            <button type="submit" className="searchButton">
              🔍
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="dashboard-content">
          <div className="request-content" id="requests">
            <h3>My Requests</h3>
            <p>View and manage your current service requests here.</p>

            <div className="info-grid">
              {requests.length === 0 ? (
                <p>No requests yet. Browse services to get started!</p>
              ) : (
                requests.map((req: any) => (
                  <div key={req._id} className="info-card">
                    <div className="card-text">
                      <h4>{req.serviceName}</h4>
                      <p>Status: {req.status}</p>
                      <p>Date: {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="service-content" id="services">
            <h3>Available Services</h3>
            <p>Explore the services we offer and request assistance.</p>

            <div className="info-grid">
              {SERVICES.map((service) => (
                <div key={service._id} className="info-card service-card">
                  <div className="card-image">
                    <img 
                      src={service.image || "/placeholder.svg"} 
                      alt={service.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-text">
                    <h4>{service.name}</h4>
                    <p>{service.description}</p>
                    <button
                      onClick={() => handleRequestService(service._id)}
                      className="request-btn"
                    >
                      Request Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="help-content" id="help">
            <h3>Help & Resources</h3>
            <p>Find FAQs, contact support, and other resources.</p>

            <div className="info-grid">
              <div className="info-card">
                <div className="card-text">
                  <h4>How to Request a Service</h4>
                  <p>Browse available services and click "Request Service" to get started.</p>
                </div>
              </div>
              <div className="info-card">
                <div className="card-text">
                  <h4>Contact Support</h4>
                  <p>Email us at support@ayudabesh.com for assistance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
