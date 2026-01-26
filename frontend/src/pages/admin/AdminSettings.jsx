import { useEffect, useState } from "react";
import api from "@/services/api";
import { User } from "lucide-react";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isLaptop = screenWidth >= 1024;

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    loadAdminProfile();
  }, []);

  const loadAdminProfile = async () => {
    try {
      const res = await api.get("/admin/profile");
      setAdmin(res.data);
    } catch {
      const localUser = JSON.parse(localStorage.getItem("user")) || {};
      setAdmin({
        name: localUser.name || "",
        email: localUser.email || "",
        phone: localUser.phone || "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put("/admin/profile", {
        name: admin.name,
        phone: admin.phone,
      });
      alert("Admin profile updated");
    } catch {
      alert("Failed to save admin details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading settings…</div>;
  }

  return (
    <div style={{
      padding: isMobile
        ? "1rem"
        : isTablet
        ? "1.5rem 1.5rem 1.5rem 3rem"  // ✅ tablet left offset
        : "1.5rem",
      maxWidth: "100%",
      overflow: "hidden"
    }}>
      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{
          fontSize: isMobile ? "1.5rem" : "2rem",
          fontWeight: 600,
          color: "#1f2937",
          marginBottom: "0.5rem"
        }}>Settings</h1>
        <p style={{
          fontSize: "0.875rem",
          color: "#6b7280"
        }}>
          Administrative configuration and preferences
        </p>
      </div>

      {/* ADMIN PROFILE */}
      <Section
        icon={<User />}
        title="Admin Profile"
        description="Your administrator account information"
        isMobile={isMobile}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gap: "1rem"
        }}>
          <Field label="Name">
            <input
              className="input"
              value={admin.name}
              onChange={(e) =>
                setAdmin({ ...admin, name: e.target.value })
              }
            />
          </Field>

          <Field label="Email">
            <input
              className="input bg-gray-100 cursor-not-allowed"
              value={admin.email}
              disabled
            />
          </Field>

          <Field label="Phone">
            <input
              className="input"
              value={admin.phone}
              onChange={(e) =>
                setAdmin({ ...admin, phone: e.target.value })
              }
            />
          </Field>
        </div>

        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => setShowPasswordModal(true)}
        >
          Change Password
        </button>
      </Section>

      {/* SAVE */}
      <div style={{
        display: "flex",
        justifyContent: isMobile ? "stretch" : "flex-end",
        marginTop: "2rem"
      }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            backgroundColor: "#111827",
            color: "white",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.5 : 1,
            width: isMobile ? "100%" : "auto"
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          padding: isMobile ? "1rem" : "0"
        }}>
          <div style={{
            backgroundColor: "white",
            width: "100%",
            maxWidth: isMobile ? "100%" : "28rem",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}>
            <h2 style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              marginBottom: "0.25rem"
            }}>Change Password</h2>
            <p style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              marginBottom: "1rem"
            }}>
              Update your administrator password
            </p>

            <PasswordField
              label="Current Password"
              value={passwords.current}
              onChange={(v) =>
                setPasswords({ ...passwords, current: v })
              }
            />

            <PasswordField
              label="New Password"
              value={passwords.new}
              onChange={(v) =>
                setPasswords({ ...passwords, new: v })
              }
            />

            <PasswordField
              label="Confirm New Password"
              value={passwords.confirm}
              onChange={(v) =>
                setPasswords({ ...passwords, confirm: v })
              }
            />

            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "flex-end",
              gap: "0.75rem",
              marginTop: "1.5rem"
            }}>
              <button
                style={{
                  border: "1px solid #d1d5db",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  backgroundColor: "white",
                  cursor: "pointer",
                  width: isMobile ? "100%" : "auto"
                }}
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>

              <button
                style={{
                  backgroundColor: "#111827",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer",
                  width: isMobile ? "100%" : "auto"
                }}
                onClick={async () => {
                  if (passwords.new !== passwords.confirm) {
                    alert("Passwords do not match");
                    return;
                  }

                  if (passwords.new.length < 8) {
                    alert("Password must be at least 8 characters");
                    return;
                  }

                  try {
                    await api.put("/admin/change-password", {
                      current_password: passwords.current,
                      new_password: passwords.new,
                    });

                    alert("Password updated successfully");

                    setPasswords({ current: "", new: "", confirm: "" });
                    setShowPasswordModal(false);
                  } catch (err) {
                    alert(
                      err?.response?.data?.detail ||
                      "Failed to update password"
                    );
                  }
                }}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;


/* ---------- UI HELPERS ---------- */

const Section = ({ icon, title, description, children, isMobile }) => (
  <div style={{
    backgroundColor: "white",
    borderRadius: "0.75rem",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    padding: isMobile ? "1rem" : "1.5rem",
    marginBottom: "2rem"
  }}>
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: "0.75rem",
      marginBottom: "1.25rem"
    }}>
      <div style={{
        padding: "0.5rem",
        backgroundColor: "#f3f4f6",
        borderRadius: "0.5rem",
        width: "fit-content"
      }}>{icon}</div>
      <div>
        <h3 style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          marginBottom: "0.25rem"
        }}>{title}</h3>
        <p style={{
          fontSize: "0.875rem",
          color: "#6b7280"
        }}>{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: "0.25rem" }}>
    <label style={{
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#374151",
      display: "block",
      marginBottom: "0.25rem"
    }}>{label}</label>
    {children}
  </div>
);

/* ---------- INPUT STYLE ---------- */
const style = document.createElement("style");
style.innerHTML = `
  .input {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5f5;
    font-size: 14px;
  }
`;
document.head.appendChild(style);

const PasswordField = ({ label, value, onChange }) => (
  <div style={{ marginBottom: "1rem" }}>
    <label style={{
      display: "block",
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#374151",
      marginBottom: "0.25rem"
    }}>
      {label}
    </label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "0.5rem 0.75rem",
        border: "1px solid #d1d5db",
        borderRadius: "0.375rem",
        fontSize: "0.875rem",
        outline: "none"
      }}
    />
  </div>
);
