import { useEffect, useState } from "react";
import {
  Bell,
  ShieldCheck,
  AlertTriangle,
  Search,
} from "lucide-react";
import api from "@/services/api";

const AdminAlerts = () => {
  const [tab, setTab] = useState("alerts");
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

  /* ALERTS */
  const [alerts, setAlerts] = useState([]);
  const [alertType, setAlertType] = useState("");
  const [alertsLoading, setAlertsLoading] = useState(false);

  /* LOGS */
  const [logs, setLogs] = useState([]);
  const [action, setAction] = useState("");
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchAlerts = async () => {
    try {
      setAlertsLoading(true);
      const res = await api.get("/admin/alerts", {
        params: { type: alertType || undefined },
      });
      setAlerts(res.data.items || []);
    } catch {
      setAlerts([]);
    } finally {
      setAlertsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLogsLoading(true);
      const res = await api.get("/admin/logs", {
        params: { action: action || undefined },
      });
      setLogs(res.data.items || []);
    } catch {
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    tab === "alerts" ? fetchAlerts() : fetchLogs();
    // eslint-disable-next-line
  }, [tab]);

  return (
    <div
      style={{
        padding: isMobile ? "1rem" : "2rem",
        paddingTop: isTablet ? "4.5rem" : isMobile ? "3.5rem" : "2rem", // ✅ KEY LINE
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >

      {/* HEADER */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{
          fontSize: isMobile ? "1.5rem" : isTablet ? "1.75rem" : "2rem",
          fontWeight: 600,
          color: "#1e293b",
          marginBottom: "0.5rem"
        }}>
          Alerts & Logs
        </h1>
      </div>

      {/* TABS */}
      <div style={{
        background: "white",
        borderRadius: "0.75rem",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        border: "1px solid #e2e8f0",
        padding: "0.5rem",
        display: "inline-flex",
        gap: "0.5rem",
        marginBottom: "1.5rem",
        width: isMobile ? "100%" : "auto"
      }}>
        <button
          onClick={() => setTab("alerts")}
          style={{
            padding: isMobile ? "0.75rem 1rem" : "0.5rem 1.5rem",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            flex: isMobile ? 1 : "none",
            backgroundColor: tab === "alerts" ? "#0f172a" : "transparent",
            color: tab === "alerts" ? "white" : "#64748b"
          }}
        >
          Alerts
        </button>

        <button
          onClick={() => setTab("logs")}
          style={{
            padding: isMobile ? "0.75rem 1rem" : "0.5rem 1.5rem",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            flex: isMobile ? 1 : "none",
            backgroundColor: tab === "logs" ? "#0f172a" : "transparent",
            color: tab === "logs" ? "white" : "#64748b"
          }}
        >
          Audit Logs
        </button>
      </div>

      {/* FILTER BAR */}
      <div style={{
        background: "white",
        borderRadius: "0.75rem",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        border: "1px solid #e2e8f0",
        padding: isMobile ? "1rem" : "1.25rem 1.5rem",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "center",
        gap: isMobile ? "1rem" : "2rem",
        marginBottom: "1.5rem"
      }}>
        {tab === "alerts" ? (
          <>
            <div style={{ flex: isMobile ? "none" : 1 }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#334155",
                marginBottom: "0.25rem"
              }}>
                Alert Type
              </label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                style={{
                  height: "2.5rem",
                  width: isMobile ? "100%" : "15rem",
                  padding: "0 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.875rem",
                  outline: "none"
                }}
              >
                <option value="">All Alerts</option>
                <option value="low_balance">Low Balance</option>
                <option value="bill_due">Bill Due</option>
                <option value="budget_exceeded">Budget Exceeded</option>
                <option value="suspicious_activity">Suspicious Activity</option>
              </select>
            </div>

            <button
              onClick={fetchAlerts}
              style={{
                height: "2.5rem",
                padding: "0 1.5rem",
                backgroundColor: "#0f172a",
                color: "white",
                borderRadius: "0.5rem",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                cursor: "pointer",
                marginLeft: isMobile ? "0" : "auto",
                width: isMobile ? "100%" : "auto",
                justifyContent: "center"
              }}
            >
              <Search size={16} />
              Apply
            </button>
          </>
        ) : (
          <>
            <div style={{ flex: isMobile ? "none" : 1 }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#334155",
                marginBottom: "0.25rem"
              }}>
                Action Type
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                style={{
                  height: "2.5rem",
                  width: isMobile ? "100%" : "15rem",
                  padding: "0 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.875rem",
                  outline: "none"
                }}
              >
                <option value="">All</option>
                <option value="kyc_approved">KYC Approved</option>
                <option value="kyc_rejected">KYC Rejected</option>
                <option value="reward_updated">Reward Updated</option>
                <option value="account_action">Account Action</option>
              </select>
            </div>

            <button
              onClick={fetchLogs}
              style={{
                height: "2.5rem",
                padding: "0 1.5rem",
                backgroundColor: "#0f172a",
                color: "white",
                borderRadius: "0.5rem",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                cursor: "pointer",
                marginLeft: isMobile ? "0" : "auto",
                width: isMobile ? "100%" : "auto",
                justifyContent: "center"
              }}
            >
              <Search size={16} />
              Apply
            </button>
          </>
        )}
      </div>

      {/* TABLE */}
      <div style={{
        background: "white",
        borderRadius: "0.75rem",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        border: "1px solid #e2e8f0",
        overflow: "hidden"
      }}>
        <div style={{
          overflowX: isMobile || isTablet ? "auto" : "visible",
          WebkitOverflowScrolling: "touch"
        }}>
          {tab === "alerts" ? (
            <table style={{
              width: "100%",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              minWidth: isMobile ? "35rem" : "auto"
            }}>
              <thead style={{
                background: "linear-gradient(to right, #f1f5f9, #e2e8f0)",
                borderBottom: "2px solid #cbd5e1"
              }}>
                <tr>
                  <th style={{
                    padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Date</th>
                  <th style={{
                    padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>User</th>
                  <th style={{
                    padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Type</th>
                  <th style={{
                    padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Message</th>
                </tr>
              </thead>
              <tbody>
                {alertsLoading ? (
                  <tr>
                    <td colSpan="4" style={{
                      padding: isMobile ? "2rem 1rem" : "3rem 2rem",
                      textAlign: "center",
                      color: "#64748b",
                      fontSize: isMobile ? "0.875rem" : "1rem"
                    }}>
                      Loading alerts…
                    </td>
                  </tr>
                ) : alerts.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{
                      padding: isMobile ? "2rem 1rem" : "3.5rem 2rem",
                      textAlign: "center",
                      color: "#64748b"
                    }}>
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        <AlertTriangle size={isMobile ? 28 : 36} style={{ opacity: 0.6 }} />
                        <div style={{
                          fontSize: isMobile ? "0.875rem" : "1rem",
                          fontWeight: 500
                        }}>No alerts found</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  alerts.map((a, i) => (
                    <tr key={i} style={{
                      borderTop: "1px solid #f1f5f9",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{
                        padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                        color: "#374151",
                        fontSize: isMobile ? "0.75rem" : "0.875rem"
                      }}>{a.created_at}</td>
                      <td style={{
                        padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                        fontWeight: 500,
                        color: "#111827",
                        fontSize: isMobile ? "0.75rem" : "0.875rem"
                      }}>{a.user_name}</td>
                      <td style={{
                        padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                        color: "#374151",
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                        textTransform: "capitalize"
                      }}>
                        {a.type.replaceAll("_", " ")}
                      </td>
                      <td style={{
                        padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                        color: "#374151",
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                        lineHeight: "1.4"
                      }}>{a.message}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table style={{
              width: "100%",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              minWidth: isMobile ? "40rem" : "auto"
            }}>
              <thead style={{
                background: "linear-gradient(to right, #f1f5f9, #e2e8f0)",
                borderBottom: "2px solid #cbd5e1"
              }}>
                <tr>
                  <th style={{
                    padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Date & Time</th>
                  <th style={{
                    padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Admin</th>
                  <th style={{
                    padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Action</th>
                  <th style={{
                    padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Target</th>
                  <th style={{
                    padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {logsLoading ? (
                  <tr>
                    <td colSpan="5" style={{
                      padding: isMobile ? "2rem 1rem" : "3rem 2rem",
                      textAlign: "center",
                      color: "#64748b",
                      fontSize: isMobile ? "0.875rem" : "1rem"
                    }}>
                      Loading logs…
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{
                      padding: isMobile ? "2rem 1rem" : "3.5rem 2rem",
                      textAlign: "center",
                      color: "#64748b"
                    }}>
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        <ShieldCheck size={isMobile ? 28 : 36} style={{ opacity: 0.6 }} />
                        <div style={{
                          fontSize: isMobile ? "0.875rem" : "1rem",
                          fontWeight: 500
                        }}>No audit logs found</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((l, i) => (
                    <tr key={i} style={{
                      borderTop: "1px solid #f1f5f9",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{
                        padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                        color: "#374151",
                        fontSize: isMobile ? "0.75rem" : "0.875rem"
                      }}>{l.timestamp}</td>
                      <td style={{
                        padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                        fontWeight: 500,
                        color: "#111827",
                        fontSize: isMobile ? "0.75rem" : "0.875rem"
                      }}>{l.admin_name}</td>
                      <td style={{
                        padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                        color: "#374151",
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                        textTransform: "capitalize"
                      }}>
                        {l.action.replace("_", " ")}
                      </td>
                      <td style={{
                        padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                        color: "#374151",
                        fontSize: isMobile ? "0.75rem" : "0.875rem"
                      }}>
                        {l.target_type} #{l.target_id}
                      </td>
                      <td style={{
                        padding: isMobile ? "0.75rem 0.5rem" : "1rem 1.5rem",
                        color: "#374151",
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                        lineHeight: "1.4"
                      }}>{l.details || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* MOBILE CARD VIEW */}
      <div className="sm:hidden space-y-4 mt-4">

        {tab === "alerts" && (
          alertsLoading ? (
            <div className="text-center text-gray-500 py-6">
              Loading alerts…
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No alerts found
            </div>
          ) : (
            alerts.map((a, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow border">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-gray-800">
                    {a.type.replaceAll("_", " ")}
                  </div>
                  <span className="text-xs text-gray-500">
                    {a.created_at}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>User:</strong> {a.user_name}</div>
                  <div><strong>Message:</strong> {a.message}</div>
                </div>
              </div>
            ))
          )
        )}

        {tab === "logs" && (
          logsLoading ? (
            <div className="text-center text-gray-500 py-6">
              Loading logs…
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No audit logs found
            </div>
          ) : (
            logs.map((l, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow border">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-gray-800">
                    {l.action.replace("_", " ")}
                  </div>
                  <span className="text-xs text-gray-500">
                    {l.timestamp}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Admin:</strong> {l.admin_name}</div>
                  <div><strong>Target:</strong> {l.target_type} #{l.target_id}</div>
                  <div><strong>Details:</strong> {l.details || "—"}</div>
                </div>
              </div>
            ))
          )
        )}

      </div>

    </div>
  );
};

export default AdminAlerts;
