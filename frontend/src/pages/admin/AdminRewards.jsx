import { useEffect, useState } from "react";
import { Search, Gift, Calendar, Coins, Check, Trash2 } from "lucide-react";
import api from "@/services/api";
import "./AdminRewards.css";

const AdminRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [showAddReward, setShowAddReward] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [newReward, setNewReward] = useState({
    name: "",
    description: "",
    type: "Cashback",
    appliesTo: ["Savings"],
    value: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchRewards();
}, []);

  const fetchRewards = async () => {
    try {
      const res = await api.get("/admin/rewards");
      setRewards(res.data);
    } catch (err) {
      console.error("Failed to load rewards", err);
    }
  };


  const handleAddReward = async () => {
    if (!newReward.name || !newReward.value) {
      alert("Please fill required fields");
      return;
    }

    try {
      await api.post("/admin/rewards", {
        name: newReward.name,
        description: newReward.description,
        reward_type: newReward.type,
        applies_to: newReward.appliesTo,
        value: newReward.value,
      });

      setShowAddReward(false);
      fetchRewards();

      setNewReward({
        name: "",
        description: "",
        type: "Cashback",
        appliesTo: ["Savings"],
        value: "",
      });
    } catch (err) {
      alert("Failed to create reward");
    }
  };



  const approveReward = async (id) => {
    try {
      await api.patch(`/admin/rewards/${id}/approve`);
      fetchRewards();
    } catch (err) {
      alert("Failed to approve reward");
    }
  };

  const removeReward = async (id) => {
    if (!window.confirm("Remove this reward?")) return;
    
    try {
      await api.delete(`/admin/rewards/${id}`);
      fetchRewards();
    } catch (err) {
      alert("Failed to remove reward");
    }
  };

  const toggleApply = (type) => {
    setNewReward((prev) => ({
      ...prev,
      appliesTo: prev.appliesTo.includes(type)
        ? prev.appliesTo.filter((t) => t !== type)
        : [...prev.appliesTo, type],
    }));
  };

  return (
    <div
      style={{
        padding: isMobile ? "1rem" : "2rem",
        paddingTop: isTablet ? "4.5rem" : isMobile ? "3.5rem" : "2rem", // ✅ KEY FIX
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >

      <h1 style={{
        fontSize: isMobile ? "1.5rem" : isTablet ? "1.75rem" : "2rem",
        fontWeight: 600,
        color: "#1f2937",
        marginBottom: "0.5rem"
      }}>Rewards</h1>
      <p style={{
        color: "#64748b",
        marginBottom: isMobile ? "1rem" : "1.5rem",
        fontSize: "0.875rem"
      }}>
        Monitor and manage user reward activities
      </p>

      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "0.75rem" : "0.625rem",
        background: "#fff",
        padding: isMobile ? "1rem" : "0.875rem",
        borderRadius: "0.875rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        marginBottom: "1.25rem",
        justifyContent: "space-between"
      }}>
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "0.625rem",
          flex: 1
        }}>
          <div style={{
            position: "relative",
            flex: 1
          }}>
            <Search size={16} style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b"
            }} />
            <input
              placeholder="Search rewards..."
              style={{
                width: "100%",
                padding: "10px 10px 10px 36px",
                borderRadius: "10px",
                border: "1px solid #cbd5f5",
                fontSize: isMobile ? "0.875rem" : "1rem"
              }}
            />
          </div>

          <div style={{
            position: "relative",
            width: isMobile ? "100%" : "auto",
            minWidth: isMobile ? "auto" : "12rem"
          }}>
            <Gift size={16} style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b"
            }} />
            <select style={{
              width: "100%",
              padding: "10px 10px 10px 36px",
              borderRadius: "10px",
              border: "1px solid #cbd5f5",
              fontSize: isMobile ? "0.875rem" : "1rem",
              appearance: "none",
              backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem"
            }}>
              <option>All Rewards</option>
              <option>Cashback</option>
              <option>Offer</option>
              <option>Referral</option>
            </select>
          </div>

          <div style={{
            position: "relative",
            width: isMobile ? "100%" : "auto",
            minWidth: isMobile ? "auto" : "10rem"
          }}>
            <Calendar size={16} style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b"
            }} />
            <input
              type="date"
              style={{
                width: "100%",
                padding: "10px 10px 10px 36px",
                borderRadius: "10px",
                border: "1px solid #cbd5f5",
                fontSize: isMobile ? "0.875rem" : "1rem"
              }}
            />
          </div>
        </div>

        <button
          onClick={() => setShowAddReward(true)}
          style={{
            padding: isMobile ? "0.75rem 1rem" : "0.625rem 1rem",
            background: "#2E5A88",
            color: "#fff",
            borderRadius: "0.625rem",
            border: "none",
            fontWeight: 600,
            fontSize: isMobile ? "0.875rem" : "1rem",
            cursor: "pointer",
            width: isMobile ? "100%" : "auto",
            whiteSpace: "nowrap"
          }}
        >
          + Add Reward
        </button>
      </div>

      <div style={{
        background: "#fff",
        borderRadius: "1rem",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        overflow: "hidden"
      }}>
        <div style={{
          overflowX: isMobile || isTablet ? "auto" : "visible",
          WebkitOverflowScrolling: "touch"
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: isMobile ? "40rem" : "auto"
          }}>
            <thead style={{
              background: "#f8fafc"
            }}>
              <tr>
                <th style={{
                  padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                  textAlign: "left",
                  color: "#475569",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  fontWeight: 600
                }}>Reward</th>
                <th style={{
                  padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                  textAlign: "left",
                  color: "#475569",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  fontWeight: 600
                }}>Type</th>
                <th style={{
                  padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                  textAlign: "left",
                  color: "#475569",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  fontWeight: 600
                }}>Applies To</th>
                <th style={{
                  padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                  textAlign: "left",
                  color: "#475569",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  fontWeight: 600
                }}>Points</th>
                <th style={{
                  padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                  textAlign: "left",
                  color: "#475569",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  fontWeight: 600
                }}>Status</th>
                <th style={{
                  padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                  textAlign: "left",
                  color: "#475569",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  fontWeight: 600
                }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {rewards.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div style={{
                      padding: isMobile ? "2rem 1rem" : "3rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      color: "#64748b",
                      gap: "0.5rem"
                    }}>
                      <Coins size={isMobile ? 28 : 32} />
                      <div style={{
                        fontSize: isMobile ? "0.875rem" : "1rem",
                        fontWeight: 500
                      }}>No rewards created</div>
                    </div>
                  </td>
                </tr>
              ) : (
                rewards.map((r) => (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{
                      padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                      fontSize: isMobile ? "0.75rem" : "0.875rem"
                    }}>{r.name}</td>
                    <td style={{
                      padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                      fontSize: isMobile ? "0.75rem" : "0.875rem"
                    }}>{r.reward_type}</td>
                    <td style={{
                      padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                      fontSize: isMobile ? "0.75rem" : "0.875rem"
                    }}>{r.applies_to.join(", ")}</td>
                    <td style={{
                      padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                      fontSize: isMobile ? "0.75rem" : "0.875rem"
                    }}>{r.value}</td>
                    <td style={{
                      padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                      fontSize: isMobile ? "0.75rem" : "0.875rem"
                    }}>{r.status}</td>
                    <td style={{
                      padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                      fontSize: isMobile ? "0.75rem" : "0.875rem"
                    }}>
                      <div style={{
                        display: "flex",
                        gap: "0.375rem",
                        flexDirection: isMobile ? "column" : "row"
                      }}>
                        {r.status === "Pending" && (
                          <button
                            onClick={() => approveReward(r.id)}
                            style={{
                              background: "#22c55e",
                              color: "#fff",
                              border: "none",
                              borderRadius: "0.375rem",
                              padding: isMobile ? "0.5rem" : "0.375rem 0.625rem",
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              justifyContent: "center"
                            }}
                          >
                            <Check size={14} /> {!isMobile && "Approve"}
                          </button>
                        )}
                        <button
                          onClick={() => removeReward(r.id)}
                          style={{
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: "0.375rem",
                            padding: isMobile ? "0.5rem" : "0.375rem 0.5rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* MOBILE CARD VIEW */}
      <div className="mobile-rewards-list">
        {rewards.map((r) => (
          <div key={r.id} className="mobile-reward-card">
            <div className="card-top">
              <div className="card-title">{r.name}</div>
              <span className={`status ${r.status.toLowerCase()}`}>
                {r.status}
              </span>
            </div>

            <div className="card-meta">
              <div><strong>Type:</strong> {r.reward_type}</div>
              <div><strong>Applies:</strong> {r.applies_to.join(", ")}</div>
              <div><strong>Value:</strong> {r.value}</div>
            </div>

            <div className="card-actions">
              {r.status === "Pending" && (
                <button
                  className="approve-btn"
                  onClick={() => approveReward(r.id)}
                >
                  <Check size={14} /> Approve
                </button>
              )}
              <button
                className="delete-btn"
                onClick={() => removeReward(r.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>


      {/* ADD MODAL */}
      {showAddReward && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.25)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "1rem" : "0",
          zIndex: 50
        }}>
          <div style={{
            background: "#fff",
            padding: isMobile ? "1.5rem" : "1.5rem",
            borderRadius: "1rem",
            width: isMobile ? "100%" : "26.25rem",
            maxWidth: "100%",
            maxHeight: isMobile ? "90vh" : "auto",
            overflowY: isMobile ? "auto" : "visible"
          }}>
            <h3 style={{
              fontSize: isMobile ? "1rem" : "1.125rem",
              marginBottom: "0.25rem",
              fontWeight: 600
            }}>
              Add Reward
            </h3>
            <p style={{
              marginBottom: "1.125rem",
              fontSize: "0.8125rem",
              color: "#64748b"
            }}>
              Create reward rule (approval required)
            </p>

            <input
              placeholder="Reward Name"
              style={{
                width: "100%",
                padding: "0.625rem",
                marginBottom: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #cbd5f5",
                fontSize: isMobile ? "0.875rem" : "1rem"
              }}
              value={newReward.name}
              onChange={(e) =>
                setNewReward({ ...newReward, name: e.target.value })
              }
            />

            <textarea
              placeholder="Reward Description"
              style={{
                width: "100%",
                padding: "0.625rem",
                marginBottom: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #cbd5f5",
                height: "3.75rem",
                fontSize: isMobile ? "0.875rem" : "1rem",
                resize: "vertical"
              }}
              value={newReward.description}
              onChange={(e) =>
                setNewReward({ ...newReward, description: e.target.value })
              }
            />

            <select
              style={{
                width: "100%",
                padding: "0.625rem",
                marginBottom: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #cbd5f5",
                fontSize: isMobile ? "0.875rem" : "1rem"
              }}
              value={newReward.type}
              onChange={(e) =>
                setNewReward({ ...newReward, type: e.target.value })
              }
            >
              <option>Cashback</option>
              <option>Offer</option>
              <option>Referral</option>
            </select>

            <div
              style={{
                marginBottom: "0.875rem",
                padding: "0.625rem 0.75rem",
                border: "1px solid #cbd5f5",
                borderRadius: "0.625rem",
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                gap: "0.5rem",
                background: "#f8fafc",
              }}
            >
              {["Savings", "Debit", "Credit", "UPI"].map((t) => (
                <label
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={newReward.appliesTo.includes(t)}
                    onChange={() => toggleApply(t)}
                  />
                  {t}
                </label>
              ))}
            </div>

            <input
              placeholder="Points / % / ₹"
              style={{
                width: "100%",
                padding: "0.625rem",
                marginBottom: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #cbd5f5",
                fontSize: isMobile ? "0.875rem" : "1rem"
              }}
              value={newReward.value}
              onChange={(e) =>
                setNewReward({ ...newReward, value: e.target.value })
              }
            />

            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "0.625rem"
            }}>
              <button
                onClick={handleAddReward}
                style={{
                  flex: 1,
                  background: "#2E5A88",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.625rem",
                  fontSize: isMobile ? "0.875rem" : "1rem",
                  cursor: "pointer"
                }}
              >
                Save
              </button>
              <button
                onClick={() => setShowAddReward(false)}
                style={{
                  flex: 1,
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.625rem",
                  fontSize: isMobile ? "0.875rem" : "1rem",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminRewards;


