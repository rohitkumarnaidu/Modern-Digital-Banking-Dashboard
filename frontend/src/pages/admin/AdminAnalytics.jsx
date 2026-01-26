import { useEffect, useState } from "react";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ArrowUpRight,
  Gift,
} from "lucide-react";
import api from "@/services/api";

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
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

  const [summary, setSummary] = useState({
    totalUsers: 0,
    kycApproved: 0,
    kycPending: 0,
    kycRejected: 0,
    totalTransactions: 0,
    rewardsIssued: 0,
  });

  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    fetchAdminAnalytics();
  }, []);

  const fetchAdminAnalytics = async () => {
    try {
      setLoading(true);

      // 🔹 summary analytics
      const summaryRes = await api.get("/admin/analytics/summary");
      setSummary(summaryRes.data);

      // 🔹 top users analytics
      const topUsersRes = await api.get("/admin/analytics/top-users");
      setTopUsers(topUsersRes.data || []);
    } catch (err) {
      console.error("Failed to load admin analytics", err);
    } finally {
      setLoading(false);
    }
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

      {/* HEADER */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{
          fontSize: isMobile ? "1.5rem" : isTablet ? "1.75rem" : "2rem",
          fontWeight: 600,
          color: "#1f2937",
          marginBottom: "0.5rem"
        }}>
          Admin Analytics
        </h1>
        <p style={{
          fontSize: "0.875rem",
          color: "#6b7280"
        }}>
          System-wide insights and compliance overview
        </p>
      </div>

      {loading && (
        <div style={{
          padding: isMobile ? "2rem 1rem" : "2.5rem 2rem",
          textAlign: "center",
          color: "#6b7280",
          fontSize: isMobile ? "0.875rem" : "1rem"
        }}>
          Loading analytics…
        </div>
      )}

      {!loading && (
          <>
        {/* KPI CARDS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gap: isMobile ? "1rem" : "1.25rem",
          marginBottom: "1.5rem"
        }}>
          <AnalyticsCard
            title="Total Users"
            value={summary.totalUsers}
            icon={<Users style={{ color: "#2563eb" }} />}
            isMobile={isMobile}
          />
          <AnalyticsCard
            title="KYC Approved"
            value={summary.kycApproved}
            icon={<ShieldCheck style={{ color: "#16a34a" }} />}
            isMobile={isMobile}
          />
          <AnalyticsCard
            title="KYC Pending"
            value={summary.kycPending}
            icon={<ShieldAlert style={{ color: "#ca8a04" }} />}
            isMobile={isMobile}
          />
          <AnalyticsCard
            title="KYC Rejected"
            value={summary.kycRejected}
            icon={<ShieldX style={{ color: "#dc2626" }} />}
            isMobile={isMobile}
          />
          <AnalyticsCard
            title="Total Transactions"
            value={summary.totalTransactions}
            icon={<ArrowUpRight style={{ color: "#4f46e5" }} />}
            isMobile={isMobile}
          />
          <AnalyticsCard
            title="Rewards Issued"
            value={summary.rewardsIssued}
            icon={<Gift style={{ color: "#9333ea" }} />}
            isMobile={isMobile}
          />
        </div>

        {/* ANALYTICS BLOCKS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: isMobile ? "1rem" : "1.5rem",
          marginBottom: "1.5rem"
        }}>
          {/* KYC OVERVIEW */}
          <div style={{
            background: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            padding: isMobile ? "1rem" : "1.25rem"
          }}>
            <h3 style={{
              fontSize: isMobile ? "1rem" : "1.125rem",
              fontWeight: 500,
              color: "#1f2937",
              marginBottom: "1rem"
            }}>
              KYC Status Overview
            </h3>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              fontSize: "0.875rem"
            }}>
              <StatusRow
                label="Approved"
                value={summary.kycApproved}
                color="#10b981"
              />
              <StatusRow
                label="Pending"
                value={summary.kycPending}
                color="#f59e0b"
              />
              <StatusRow
                label="Rejected"
                value={summary.kycRejected}
                color="#ef4444"
              />
            </div>
          </div>

          {/* TRANSACTION OVERVIEW */}
          <div style={{
            background: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            padding: isMobile ? "1rem" : "1.25rem"
          }}>
            <h3 style={{
              fontSize: isMobile ? "1rem" : "1.125rem",
              fontWeight: 500,
              color: "#1f2937",
              marginBottom: "1rem"
            }}>
              Transaction Overview
            </h3>

            <div style={{
              fontSize: "0.875rem",
              color: "#4b5563",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem"
            }}>
              <p>
                <span style={{ fontWeight: 500 }}>Total Transactions:</span>{" "}
                {summary.totalTransactions}
              </p>
              <p>
                <span style={{ fontWeight: 500 }}>Average per User:</span>{" "}
                {summary.totalUsers > 0
                  ? Math.round(
                      summary.totalTransactions / summary.totalUsers
                    )
                  : 0}
              </p>
              <p>
                <span style={{ fontWeight: 500 }}>System Status:</span>{" "}
                <span style={{
                  color: "#16a34a",
                  fontWeight: 500
                }}>
                  Normal Operation
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* TOP USERS TABLE */}
        <div style={{
          background: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          overflow: "hidden"
        }}>
          <div style={{
            padding: isMobile ? "1rem" : "1.25rem",
            borderBottom: "1px solid #e5e7eb"
          }}>
            <h3 style={{
              fontSize: isMobile ? "1rem" : "1.125rem",
              fontWeight: 500,
              color: "#1f2937"
            }}>
              Top Users by Activity
            </h3>
          </div>

          <div style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch"
          }}>
            <table style={{
              width: "100%",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              minWidth: isMobile ? "30rem" : "auto"
            }}>
              <thead style={{
                background: "#f9fafb",
                color: "#4b5563"
              }}>
                <tr>
                  <th style={{
                    padding: isMobile ? "0.75rem 0.5rem" : "0.75rem 1rem",
                    textAlign: "left",
                    fontWeight: 500
                  }}>User</th>
                  <th style={{
                    padding: isMobile ? "0.75rem 0.5rem" : "0.75rem 1rem",
                    textAlign: "left",
                    fontWeight: 500
                  }}>Transactions</th>
                  <th style={{
                    padding: isMobile ? "0.75rem 0.5rem" : "0.75rem 1rem",
                    textAlign: "left",
                    fontWeight: 500
                  }}>Total Amount</th>
                  <th style={{
                    padding: isMobile ? "0.75rem 0.5rem" : "0.75rem 1rem",
                    textAlign: "left",
                    fontWeight: 500
                  }}>KYC Status</th>
                </tr>
              </thead>

              <tbody>
                {!loading && topUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        padding: isMobile ? "1.5rem 1rem" : "1.5rem 1rem",
                        textAlign: "center",
                        color: "#6b7280"
                      }}
                    >
                      No analytics data available
                    </td>
                  </tr>
                )}

                {topUsers.map((u, i) => (
                  <tr
                    key={i}
                    style={{
                      borderTop: "1px solid #f3f4f6",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{
                      padding: isMobile ? "0.75rem 0.5rem" : "0.75rem 1rem"
                    }}>{u.name}</td>
                    <td style={{
                      padding: isMobile ? "0.75rem 0.5rem" : "0.75rem 1rem"
                    }}>{u.transaction_count}</td>
                    <td style={{
                      padding: isMobile ? "0.75rem 0.5rem" : "0.75rem 1rem"
                    }}>₹{u.total_amount}</td>
                    <td style={{
                      padding: isMobile ? "0.75rem 0.5rem" : "0.75rem 1rem"
                    }}>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          backgroundColor: u.kyc_status === "approved"
                            ? "#dcfce7"
                            : u.kyc_status === "pending"
                            ? "#fef3c7"
                            : "#fee2e2",
                          color: u.kyc_status === "approved"
                            ? "#166534"
                            : u.kyc_status === "pending"
                            ? "#92400e"
                            : "#991b1b"
                        }}
                      >
                        {u.kyc_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
      )}
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const AnalyticsCard = ({ title, value, icon, isMobile }) => (
  <div style={{
    background: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    padding: isMobile ? "1rem" : "1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }}>
    <div>
      <p style={{
        fontSize: "0.875rem",
        color: "#6b7280",
        marginBottom: "0.25rem"
      }}>{title}</p>
      <p style={{
        fontSize: isMobile ? "1.5rem" : "2rem",
        fontWeight: 600,
        color: "#1f2937"
      }}>{value}</p>
    </div>
    <div style={{
      padding: "0.75rem",
      background: "#f3f4f6",
      borderRadius: "9999px"
    }}>{icon}</div>
  </div>
);

const StatusRow = ({ label, value, color }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }}>
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
      <span style={{
        width: "0.75rem",
        height: "0.75rem",
        borderRadius: "9999px",
        backgroundColor: color
      }} />
      <span style={{ color: "#374151" }}>{label}</span>
    </div>
    <span style={{
      fontWeight: 500,
      color: "#1f2937"
    }}>{value}</span>
  </div>
);

export default AdminAnalytics;
