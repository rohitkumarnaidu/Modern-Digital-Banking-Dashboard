/**
 * Accounts Page
 *
 * Handles:
 * - Listing bank accounts
 * - Empty state (no accounts)
 * - Add / Delete accounts
 */

import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "@/services/api";
import AddAccount from "./AddAccount";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const navigate = useNavigate();
  const pinRefs = useRef([]);

  // 🔐 DELETE WITH PIN STATES
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [deleteError, setDeleteError] = useState("");

  const location = useLocation();
  const selectedId = location.state?.accountId;

  const visibleAccounts = selectedId
    ? accounts.filter(a => a.id === selectedId)
    : accounts;

  // Responsive breakpoints
  const isMobile = screenWidth <= 480;
  const isTablet = screenWidth <= 768;
  const isLaptop = screenWidth <= 1024;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);
  
  // Helper function for responsive values
  const getResponsiveValue = (mobile, tablet, desktop) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };
  
  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts");
      setAccounts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const openCheckBalance = (accountId) => {
    navigate("/dashboard/balance",{
      state: { accountId },
    });
  };

  const openChangePin = (accountId) => {
    console.log("Change PIN:", accountId);
  };

  const handleDeleteClick = (id) => {
    setSelectedAccountId(id);
    setShowPinModal(true);
    setPin(["", "", "", ""]);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/accounts/${selectedAccountId}`, {
        data: { pin: pin.join("") },
      });
      setShowPinModal(false);
      fetchAccounts();
    } catch {
      setDeleteError("Invalid PIN");
    }
  };

  if (loading) return <p>Loading accounts...</p>;

  return (
    <div style={{
      padding: getResponsiveValue("16px", "20px 24px", "24px 32px")
    }}>
      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: getResponsiveValue(20, 28, 28),
        flexDirection: getResponsiveValue("column", "row", "row"),
        gap: getResponsiveValue("12px", "0", "0")
      }}>
        <h1 style={{
          fontSize: getResponsiveValue("20px", "22px", "26px"),
          fontWeight: "700",
          color: "#0f172a"
        }}>Accounts</h1>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          paddingRight: getResponsiveValue("0", "12px", "12px")
        }}>
          <button style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: getResponsiveValue("12px 16px", "10px 18px", "10px 18px"),
            borderRadius: 10,
            fontWeight: 600,
            fontSize: getResponsiveValue("14px", "16px", "16px"),
            cursor: "pointer"
          }} onClick={() => setShowAdd(true)}>
            + Add Account
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {accounts.length === 0 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: getResponsiveValue(40, 60, 60),
          padding: getResponsiveValue("0 16px", "0", "0")
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: getResponsiveValue(16, 22, 22),
            padding: getResponsiveValue("40px 24px", "56px 40px", "72px"),
            width: "100%",
            maxWidth: 820,
            boxShadow: "0 18px 40px rgba(0,0,0,0.08)"
          }}>
            <div style={{
              maxWidth: 560,
              margin: "0 auto",
              textAlign: "center"
            }}>
            <h3 style={{
              fontSize: getResponsiveValue(18, 20, 24),
              fontWeight: 700,
              marginBottom: 10,
              color: "#0f172a"
            }}>
              Get Started with Your First Account
            </h3>
            <p style={{
              color: "#64748b",
              margin: "10px 0 24px",
              fontSize: getResponsiveValue(13, 14, 14),
              lineHeight: "1.5"
            }}>
              Add a bank account to view balances, make transfers, pay bills, and manage your finances securely all in one place.
            </p>
            <button style={{
              marginTop: 16,
              width: "100%",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: getResponsiveValue("12px", "14px", "14px"),
              borderRadius: 12,
              fontWeight: 600,
              fontSize: getResponsiveValue(14, 15, 15),
              cursor: "pointer"
            }} onClick={() => setShowAdd(true)}>
              + Add Account
            </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCOUNT LIST */}
      {accounts.map((acc) => (
        <div key={acc.id} style={{
          background: "#fff",
          borderRadius: getResponsiveValue(12, 16, 16),
          padding: getResponsiveValue("16px", "18px 22px", "18px 22px"),
          display: "flex",
          justifyContent: "space-between",
          alignItems: getResponsiveValue("flex-start", "center", "center"),
          marginBottom: 14,
          boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
          flexDirection: getResponsiveValue("column", "row", "row"),
          gap: getResponsiveValue("16px", "0", "0")
        }}>
          {/* LEFT */}
          <div>
            <div style={{
              fontSize: getResponsiveValue(14, 16, 16),
              fontWeight: 700
            }}>{acc.bank_name}</div>
            <div style={{
              fontSize: getResponsiveValue(12, 13, 13),
              color: "#64748b",
              marginTop: 4
            }}>{acc.masked_account}</div>
            <div style={{
              fontSize: getResponsiveValue(11, 12, 12),
              color: "#475569"
            }}>{acc.account_type.toUpperCase()}</div>
          </div>

          {/* RIGHT */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: getResponsiveValue("stretch", "flex-end", "flex-end"),
            width: getResponsiveValue("100%", "auto", "auto")
          }}>
            <div style={{
              display: "flex",
              gap: getResponsiveValue(8, 10, 10),
              marginBottom: 8,
              flexDirection: getResponsiveValue("column", "row", "row")
            }}>
              <button
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: getResponsiveValue("10px 12px", "7px 14px", "7px 14px"),
                  borderRadius: 8,
                  fontSize: getResponsiveValue(12, 13, 13),
                  cursor: "pointer"
                }}
                onClick={() => openCheckBalance(acc.id)}
              >
                Check Balance
              </button>

              <button
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #cbd5f5",
                  padding: getResponsiveValue("10px 12px", "7px 14px", "7px 14px"),
                  borderRadius: 8,
                  fontSize: getResponsiveValue(12, 13, 13),
                  cursor: "pointer"
                }}
                onClick={() => 
                  navigate("/dashboard/accounts/verify-identity", {
                    state: { accountId: acc.id },
                  })
                }
              >
                Change PIN
              </button>
            </div>

            <button
              style={{
                background: "transparent",
                border: "none",
                color: "#dc2626",
                fontSize: getResponsiveValue(12, 13, 13),
                cursor: "pointer",
                textAlign: getResponsiveValue("center", "right", "right"),
                padding: getResponsiveValue("8px", "0", "0")
              }}
              onClick={() => handleDeleteClick(acc.id)}
            >
              Remove Account
            </button>
          </div>
        </div>
      ))}

      {/* ADD ACCOUNT */}
      {showAdd && (
        <AddAccount
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            fetchAccounts();
          }}
        />
      )}

      {/* DELETE PIN MODAL */}
      {showPinModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px"
        }}>
          <div style={{
            background: "#fff",
            padding: getResponsiveValue(20, 28, 28),
            borderRadius: 16,
            width: "100%",
            maxWidth: getResponsiveValue("320px", "360px", "360px")
          }}>
            <h3 style={{ 
              textAlign: "center", 
              marginBottom: 16,
              fontSize: isMobile ? "16px" : "18px"
            }}>
              Enter PIN to Delete
            </h3>

            <div style={{
              display: "flex",
              gap: getResponsiveValue(8, 12, 12),
              justifyContent: "center",
              marginBottom: 16
            }}>
              {pin.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => (pinRefs.current[i] = el)}
                  maxLength="1"
                  type="password"
                  value={v}
                  onChange={(e) => {
                    if (!/^\d?$/.test(e.target.value)) return;
                    const updated = [...pin];
                    updated[i] = e.target.value;
                    setPin(updated);

                    if (e.target.value && i < 3) {
                      pinRefs.current[i + 1]?.focus();
                    }
                  }}

                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !pin[i] && i > 0) {
                      pinRefs.current[i - 1]?.focus();
                    }
                  }}
                  style={{
                    width: getResponsiveValue(40, 48, 48),
                    height: getResponsiveValue(40, 48, 48),
                    textAlign: "center",
                    fontSize: getResponsiveValue(16, 20, 20),
                    borderRadius: 10,
                    border: "1px solid #d1d5db"
                  }}
                />
              ))}
            </div>

            {deleteError && (
              <p style={{ 
                color: "#dc2626", 
                textAlign: "center",
                fontSize: isMobile ? "12px" : "14px",
                marginBottom: "12px"
              }}>
                {deleteError}
              </p>
            )}

            <div style={{
              display: "flex",
              gap: 12,
              flexDirection: getResponsiveValue("column", "row", "row")
            }}>
              <button
                style={{
                  flex: getResponsiveValue("none", 1, 1),
                  padding: getResponsiveValue(14, 12, 12),
                  borderRadius: 10,
                  background: "#e5e7eb",
                  border: "none",
                  cursor: "pointer"
                }}
                onClick={() => setShowPinModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  flex: getResponsiveValue("none", 1, 1),
                  padding: getResponsiveValue(14, 12, 12),
                  borderRadius: 10,
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer"
                }}
                disabled={pin.join("").length !== 4}
                onClick={handleConfirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;


