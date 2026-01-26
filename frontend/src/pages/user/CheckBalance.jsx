/**
 * Check Balance Page
 *
 * What:
 * - Shows accounts as cards
 * - Requires PIN to reveal balance
 * - Real banking UX
 *
 * Backend:
 * - GET /accounts
 */

import { useEffect, useState, useRef } from "react";
import api from "@/services/api";
import AddAccount from "./AddAccount";

const CheckBalance = () => {

  const [accounts, setAccounts] = useState([]);
  const [showPin, setShowPin] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [verifiedAccountId, setVerifiedAccountId] = useState(null);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const pinRefs = useRef([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get("/accounts");
        setAccounts(res.data || []);
      } catch {
        setAccounts([]);
      }
    };
    fetchAccounts();
  }, []);

  const openPinModal = (account) => {
    setSelectedAccount(account);
    setPin(["", "", "", ""]);
    setError("");
    setShowPin(true);
  };

  const confirmPin = async () => {
    if (pin.join("").length !== 4) return;

    setVerifiedAccountId(selectedAccount.id);
    setShowPin(false);
  };

  return (
    <div style={{
      padding: window.innerWidth <= 480 ? "16px" : window.innerWidth <= 768 ? "20px 24px" : "24px 32px"
    }}>
      <h2 style={{ 
        fontSize: window.innerWidth <= 480 ? "18px" : window.innerWidth <= 768 ? "20px" : "22px", 
        marginBottom: window.innerWidth <= 480 ? "20px" : "28px"
      }}>
        Check Balance
      </h2>

      {/* ================= NO ACCOUNTS ================= */}
      {accounts.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: window.innerWidth <= 480 ? 40 : 80,
            padding: window.innerWidth <= 480 ? "0 16px" : "0",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: window.innerWidth <= 480 ? 16 : 22,
              padding: window.innerWidth <= 480 ? "40px 24px" : window.innerWidth <= 768 ? "56px 40px" : "72px",
              width: "100%",
              maxWidth: 820,
              boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >
            <h3 style={{ 
              fontSize: window.innerWidth <= 480 ? 18 : window.innerWidth <= 768 ? 20 : 22, 
              fontWeight: 700 
            }}>
              Get Started with Your First Account
            </h3>

            <p style={{ 
              color: "#64748b", 
              margin: "12px 0 28px",
              fontSize: window.innerWidth <= 480 ? 13 : 14,
              lineHeight: "1.5"
            }}>
              Add a bank account to view balances securely.
            </p>

            <button
              onClick={() => setShowAdd(true)}
              style={{
                width: "100%",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: window.innerWidth <= 480 ? "12px" : "14px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: window.innerWidth <= 480 ? 14 : 15,
                cursor: "pointer",
              }}
            >
              + Add Account
            </button>
          </div>
        </div>
      )}

      {/* ================= ACCOUNT CARDS ================= */}
      {accounts.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth <= 480 
              ? "1fr" 
              : window.innerWidth <= 768 
                ? "repeat(auto-fit, minmax(280px, 1fr))" 
                : "repeat(auto-fit, minmax(360px, 1fr))",
            gap: window.innerWidth <= 480 ? "16px" : "22px",
          }}
        >
          {accounts.map((acc) => (
            <div
              key={acc.id}
              style={{
                background: "#ffffff",
                padding: window.innerWidth <= 480 ? "20px" : window.innerWidth <= 768 ? "22px" : "26px",
                borderRadius: window.innerWidth <= 480 ? "14px" : "18px",
                boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ 
                fontWeight: 700,
                fontSize: window.innerWidth <= 480 ? "16px" : "18px"
              }}>{acc.bank_name}</h3>
              <p style={{ 
                color: "#64748b", 
                marginBottom: window.innerWidth <= 480 ? 14 : 18,
                fontSize: window.innerWidth <= 480 ? "13px" : "14px"
              }}>
                •••• {acc.masked_account.slice(-4)}
              </p>

              {verifiedAccountId === acc.id ? (
                <>
                  <p style={{ 
                    color: "#64748b", 
                    fontSize: window.innerWidth <= 480 ? 12 : 13 
                  }}>
                    Available Balance
                  </p>
                  <h1 style={{ 
                    marginTop: 4,
                    fontSize: window.innerWidth <= 480 ? "24px" : window.innerWidth <= 768 ? "28px" : "32px"
                  }}>
                    ₹{acc.balance}
                  </h1>
                </>
              ) : (
                <button
                  onClick={() => openPinModal(acc)}
                  style={{
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    padding: window.innerWidth <= 480 ? "8px 18px" : "10px 22px",
                    borderRadius: "24px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: window.innerWidth <= 480 ? "13px" : "14px",
                  }}
                >
                  🔒 Check Balance
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= PIN MODAL ================= */}
      {showPin && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={{ 
              textAlign: "center", 
              marginBottom: 18,
              fontSize: window.innerWidth <= 480 ? "16px" : "18px"
            }}>
              Enter PIN
            </h3>

            <div style={pinRow}>
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
                  style={pinBox}
                />
              ))}
            </div>

            {error && (
              <p style={{ 
                color: "#dc2626", 
                textAlign: "center",
                fontSize: window.innerWidth <= 480 ? "12px" : "14px",
                marginBottom: "12px"
              }}>
                {error}
              </p>
            )}

            <div style={btnRow}>
              <button
                style={cancelBtn}
                onClick={() => setShowPin(false)}
              >
                Cancel
              </button>
              <button
                style={submitBtn}
                disabled={pin.join("").length !== 4}
                onClick={confirmPin}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= ADD ACCOUNT MODAL ================= */}
      {showAdd && (
        <AddAccount
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default CheckBalance;

/* ================= RESPONSIVE STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  padding: "16px",
};

const modal = {
  background: "#fff",
  padding: window.innerWidth <= 480 ? 20 : 28,
  borderRadius: 18,
  width: "100%",
  maxWidth: window.innerWidth <= 480 ? "320px" : "360px",
};

const pinRow = {
  display: "flex",
  gap: window.innerWidth <= 480 ? 8 : 12,
  justifyContent: "center",
  marginBottom: 16,
};

const pinBox = {
  width: window.innerWidth <= 480 ? 40 : 48,
  height: window.innerWidth <= 480 ? 40 : 48,
  textAlign: "center",
  fontSize: window.innerWidth <= 480 ? 16 : 20,
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const btnRow = {
  display: "flex",
  gap: 12,
  flexDirection: window.innerWidth <= 480 ? "column" : "row",
};

const cancelBtn = {
  flex: window.innerWidth <= 480 ? "none" : 1,
  padding: window.innerWidth <= 480 ? 14 : 12,
  borderRadius: 10,
  background: "#e5e7eb",
  border: "none",
  cursor: "pointer",
};

const submitBtn = {
  flex: window.innerWidth <= 480 ? "none" : 1,
  padding: window.innerWidth <= 480 ? 14 : 12,
  borderRadius: 10,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};
