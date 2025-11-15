"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import "../provider.css";

interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
}

interface ServiceRequest {
  _id: string;
  serviceName: string;
  customerName: string;
  status: string;
  createdAt: string;
}

export default function ProviderDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
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
      const response = await fetch("/api/requests/pending");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (response.ok) {
        alert("Request accepted!");
        fetchRequests();
      }
    } catch (err) {
      console.error("Failed to accept request:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="provider-dashboard">
      <div className="header">
        <div className="header-left">
          <img src="/logo_circle.png" alt="AyudaBesh Logo" style={{ height: '50px', width: 'auto', marginRight: '15px' }} />
          <h1>AyudaBesh Provider Dashboard</h1>
        </div>
        <div className="header-actions">
          <p>Welcome, {user.fullName}</p>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <h2>Available Service Requests</h2>

        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p>No pending requests at this time.</p>
        ) : (
          <div className="requests-grid">
            {requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="card-header">
                  <h3>{request.serviceName}</h3>
                  <span className={`status ${request.status}`}>{request.status}</span>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Customer:</strong> {request.customerName}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="card-footer">
                  <button
                    onClick={() => handleAcceptRequest(request._id)}
                    className="accept-btn"
                  >
                    Accept Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
