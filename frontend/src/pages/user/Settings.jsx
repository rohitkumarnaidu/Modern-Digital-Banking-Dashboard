/**
 * User settings page
 *
 * Part of:
 * - Dashboard
 * - Route: /dashboard/settings
 *
 * Purpose:
 * Allows users to update profile,
 * security settings, and preferences.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";


const Settings = () => {
  const navigate = useNavigate();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  const [loginAlerts, setLoginAlerts] = useState(true);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePinChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...pin];
    updated[index] = value;
    setPin(updated);
  };
  

  useEffect(() => {
    api.get("/settings").then(res => {
      setSettings(res.data);
    });
  }, []);


  const updateSetting = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    await api.put("/settings", {
    [key]: value,
  });
};

  if (!settings) return <p>Loading settings...</p>;


  const closeModal = () => {
    setPin(["", "", "", ""]);
    setShowPinModal(false);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "900px" }}>
          {/* ================= PREFERENCES ================= */}
          <SectionCard title="⚙️ Preferences" isMobile={isMobile}>
            <ToggleItem isMobile={isMobile}
              icon="🔔"
              title="Push Notifications"
              desc="Receive app notifications"
              value={settings.push_notifications}
              onChange={(val) =>
                updateSetting("push_notifications", val)
              }
            />

            <ToggleItem isMobile={isMobile}
              icon="📧"
              title="Email Alerts"
              desc="Get transaction alerts via email"
              value={settings.email_alerts}
              onChange={(val) =>
                updateSetting("email_alerts", val)
              }
            />

            <ToggleItem isMobile={isMobile}
              icon="🔐"
              title="Two-Factor Authentication"
              desc="Requires OTP during login (setup required)"
              value={settings.two_factor_enabled}
              onChange={(val) =>
                updateSetting("two_factor_enabled", val)
              }
            />

            <StaticItem isMobile={isMobile}
              icon="💱"
              title="Currency"
              desc="Display currency across dashboard"
              value="INR (₹)"
            />

            <StaticItem isMobile={isMobile}
              icon="🌐"
              title="Language"
              desc="Interface language (coming soon)"
              value="English"
            />
          </SectionCard>

          {/* ================= SECURITY ================= */}
          <SectionCard title="🛡 Security" isMobile={isMobile}>
            <ToggleItem isMobile={isMobile}
              icon="🔔"
              title="Login Alerts"
              desc="Notify when a new device logs in"
              value={settings.login_alerts}
              onChange={(val) =>
                updateSetting("login_alerts", val)
              }
            />

            <ActionItem isMobile={isMobile}
              icon="🔑"
              title="Change Password"
              desc="Update your account password"
              actionLabel="Change"
              onClick={() => navigate("/forgot-password")}
            />

            <ActionItem isMobile={isMobile}
              icon="🔢"
              title="Change PIN"
              desc="Update your account PIN"
              actionLabel="Change"
              onClick={() => navigate("/dashboard/accounts/verify-identity")}
            />
          </SectionCard>

          {/* ================= BALANCE ================= */}
          <SectionCard title="🔒 Balance" isMobile={isMobile}>
            <ActionItem isMobile={isMobile}
              icon="👁"
              title="Check Balance"
              desc="Verify using PIN to view balance"
              actionLabel="Check"
              onClick={() => navigate("/dashboard/check-balance")}
            />
          </SectionCard>

          {/* SAVE BUTTON */}
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <button
              style={{
                padding: isMobile ? "12px 24px" : "14px 32px",
                borderRadius: "14px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;

/* ================= COMPONENTS ================= */

const SectionCard = ({ title, children, isMobile }) => {

  return (
    <div
      style={{
        background: "#fff",
        padding: isMobile ? "20px" : "26px",
        borderRadius: isMobile ? "16px" : "22px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
        marginBottom: "30px",
      }}
    >
      <h2 style={{ marginBottom: "20px", fontWeight: "700", fontSize: isMobile ? "16px" : "18px" }}>{title}</h2>
      {children}
    </div>
  );
};

const ToggleItem = ({ icon, title, desc, value, onChange, isMobile }) => {

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: "1px solid #e5e7eb",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "12px" : "0",
    }}>
      <div style={{ display: "flex", gap: "14px", alignItems: isMobile ? "center" : "flex-start" }}>
        <span style={{ fontSize: isMobile ? "18px" : "20px" }}>{icon}</span>
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <div style={{ fontWeight: 600, fontSize: isMobile ? "14px" : "16px" }}>{title}</div>
          <div style={{ fontSize: isMobile ? "12px" : "14px", color: "#64748b" }}>{desc}</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: "600",
            color: value ? "#1d4ed8" : "#94a3b8",
          }}
        >
          {value ? "Enabled" : "Disabled"}
        </span>
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
    </div>
  );
};

const StaticItem = ({ icon, title, desc, value, isMobile }) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: "1px solid #e5e7eb",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "12px" : "0",
    }}>
      <div style={{ display: "flex", gap: "14px", alignItems: isMobile ? "center" : "flex-start" }}>
        <span style={{ fontSize: isMobile ? "18px" : "20px" }}>{icon}</span>
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <div style={{ fontWeight: 600, fontSize: isMobile ? "14px" : "16px" }}>{title}</div>
          <div style={{ fontSize: isMobile ? "12px" : "14px", color: "#64748b" }}>{desc}</div>
        </div>
      </div>

      <span
        style={{
          fontSize: isMobile ? "12px" : "14px",
          fontWeight: "600",
          color: "#000",
        }}
      >
        {value}
      </span>
    </div>
  );
};

const ActionItem = ({ icon, title, desc, actionLabel, onClick, isMobile }) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: "1px solid #e5e7eb",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "12px" : "0",
    }}>
      <div style={{ display: "flex", gap: "14px", alignItems: isMobile ? "center" : "flex-start" }}>
        <span style={{ fontSize: isMobile ? "18px" : "20px" }}>{icon}</span>
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <div style={{ fontWeight: 600, fontSize: isMobile ? "14px" : "16px" }}>{title}</div>
          <div style={{ fontSize: isMobile ? "12px" : "14px", color: "#64748b" }}>{desc}</div>
        </div>
      </div>
      <button 
        style={{
          padding: isMobile ? "6px 14px" : "8px 18px",
          borderRadius: "10px",
          border: "1px solid #93c5fd",
          background: "#f8fafc",
          color: "#000",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: isMobile ? "12px" : "14px",
        }} onClick={onClick}
        >
        {actionLabel}
      </button>
    </div>
  );
};

/* ================= STYLES ================= */

const selectStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #cbd5f5",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
};

const modalBox = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  width: "320px",
  textAlign: "center",
};

const pinInput = {
  width: "45px",
  height: "45px",
  textAlign: "center",
  fontSize: "18px",
  borderRadius: "8px",
  border: "1px solid #cbd5f5",
};

const confirmBtn = {
  flex: 1,
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
};

const cancelBtn = {
  flex: 1,
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #cbd5f5",
  background: "#fff",
  cursor: "pointer",
};