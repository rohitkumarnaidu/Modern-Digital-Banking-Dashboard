/**
 * User profile page
 *
 * Route: /dashboard/profile
 * Purpose:
 * Shows user overview, security status and preferences
 */

import "./Profile.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isMobile = screenWidth <= 480;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user.name || "User");
  const [email, setEmail] = useState(user.email || "user@example.com");
  const [phone, setPhone] = useState(user.phone || "9876543210");

  const role = user.is_admin ? "Admin" : "Standard User";


  useEffect(() => {
    const syncUser = async () => {
      try {
        const res = await api.get("/user/me");
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
      } catch (err) {
        console.error("Failed to sync user", err);
      }
    };

    syncUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    setUsername(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
  }, [user]);


  const kycMap = {
    unverified: "pending",
    verified: "approved",
    rejected: "rejected",
  };

  const kyc_status = kycMap[user.kyc_status] || "pending";

  const kycConfig = {
    approved: { text: "Approved", color: "#16a34a", tick: true },
    pending: { text: "Pending", color: "#facc15" },
    rejected: { text: "Rejected", color: "#ef4444" },
  };

  const lastLogin = user.last_login
    ? new Date(user.last_login).toLocaleString()
    : "—";

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: username,
      email,
      phone,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setEditing(false);
    alert("Profile updated successfully");
  };

  return (
    <div className="profile-page">
      {/* PAGE HEADER */}
      <div className="profile-header">
        <h1 style={{
          fontSize: isMobile ? "20px" : "26px",
          fontWeight: 700,
          color: "#0f172a",
        }}>Profile</h1>
        <p style={{
          color: "#64748b",
          fontSize: isMobile ? "13px" : "14px",
        }}>Your account overview and preferences</p>
      </div>

      {/* CENTERED PROFILE CARD */}
      <div style={{
        display: "flex",
        justifyContent: "center",
      }}>
        <div className="profile-card">

          {/* TOP HEADER */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "12px" : "20px",
            paddingBottom: isMobile ? "16px" : "24px",
            borderBottom: "1px solid #e5e7eb",
            marginBottom: isMobile ? "20px" : "28px",
            flexDirection: isMobile ? "column" : "row",
            textAlign: isMobile ? "center" : "left",
          }}>
            <div style={{
              width: isMobile ? "60px" : "72px",
              height: isMobile ? "60px" : "72px",
              borderRadius: "50%",
              background: "#2563eb",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "24px" : "30px",
              fontWeight: 700,
            }}>
              {username.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 style={{
                marginBottom: 4,
                fontSize: isMobile ? "18px" : "20px",
              }}>{username}</h2>
              <p style={{
                color: "#64748b",
                fontSize: isMobile ? "12px" : "14px",
              }}>
                {role} • <span style={{ color: "#16a34a" }}>Active</span>
              </p>
            </div>
          </div>

          {/* SECTIONS */}
          <div className="profile-sections">
            {/* PERSONAL INFO */}
            <Section isMobile={isMobile} title="Personal Information">
              <EditableField isMobile={isMobile}
                label="Username"
                value={username}
                editing={editing}
                onChange={setUsername}
              />
              <EditableField isMobile={isMobile}
                label="Email"
                value={email}
                editing={editing}
                onChange={setEmail}
              />
              <EditableField isMobile={isMobile}
                label="Phone Number"
                value={phone}
                editing={editing}
                onChange={setPhone}
              />
            </Section>

            {/* SECURITY */}
            <Section title="Security" isMobile={isMobile}>
              <StaticField isMobile={isMobile}
                label="Account Status"
                value="Active"
                color="#16a34a"
              />

              <StaticField isMobile={isMobile}
                label="KYC Status"
                value={kycConfig[kyc_status].text}
                color={kycConfig[kyc_status].color}
                tick={kycConfig[kyc_status].tick}
              />

              <StaticField isMobile={isMobile} label="Last Login" value={lastLogin} />

              </Section>
              
              

            {/* PREFERENCES */}
            <Section title="Preferences" isMobile={isMobile}>
              <StaticField isMobile={isMobile} label="Language" value="English" />
              <StaticField isMobile={isMobile} label="Notifications" value="Enabled" />
            </Section>
          </div>

          {/* ACTIONS */}
          <div style={{
            marginTop: isMobile ? "20px" : "28px",
            display: "flex",
            justifyContent: "center",
            gap: isMobile ? "8px" : "12px",
            flexDirection: isMobile ? "column" : "row",
          }}>
            <button style={{
              padding: isMobile ? "10px 16px" : "12px 20px",
              borderRadius: "10px",
              border: "1px solid #2563eb",
              background: "#fff",
              color: "#2563eb",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: isMobile ? "14px" : "16px",
            }} onClick={() => navigate("/dashboard")}>
              🏠 Go to Home
            </button>
            
            {!editing ? (
              <button style={{
                padding: isMobile ? "10px 16px" : "12px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "16px",
              }} onClick={() => setEditing(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <>
                <button style={{
                  padding: isMobile ? "10px 16px" : "12px 20px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: isMobile ? "14px" : "16px",
                }} onClick={handleSave}>
                  💾 Save Changes
                </button>
                <button
                  style={{
                    padding: isMobile ? "10px 16px" : "12px 20px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: isMobile ? "14px" : "16px",
                  }}
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

/* ================= SUB COMPONENTS ================= */

const Section = ({ title, children, isMobile }) => {
  return (
    <div style={{
      background: "#f1f5f9",
      padding: isMobile ? "16px" : "20px",
      borderRadius: isMobile ? "12px" : "16px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
    }}>
      <h3 style={{
        fontSize: isMobile ? "12px" : "14px",
        fontWeight: 700,
        marginBottom: isMobile ? "12px" : "16px",
        color: "#020617",
      }}>{title}</h3>
      <div style={{
        display: "grid",
        gap: isMobile ? "10px" : "14px",
      }}>{children}</div>
    </div>
  );
};

const EditableField = ({ label, value, editing, onChange, isMobile }) => {
  return (
    <div>
      <label style={{
        fontSize: isMobile ? "11px" : "12px",
        color: "#64748b",
      }}>{label}</label>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: isMobile ? "8px" : "11px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: isMobile ? "13px" : "14px",
          }}
        />
      ) : (
        <div style={{
          fontSize: isMobile ? "13px" : "15px",
          fontWeight: 600,
          color: "#0f172a",
        }}>{value}</div>
      )}
    </div>
  );
};

const StaticField = ({ label, value, color, tick, isMobile }) => {
  return (
    <div>
      <label style={{
        fontSize: isMobile ? "11px" : "12px",
        color: "#64748b",
      }}>{label}</label>
      <div
        style={{
          fontSize: isMobile ? "13px" : "15px",
          fontWeight: 600,
          color: color || "#0f172a",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {value}
        {tick && <span style={{ fontSize: isMobile ? "14px" : "16px", color: "#16a34a" }}>✔</span>}
      </div>
    </div>
  );
};

