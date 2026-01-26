/**
 * Rewards Page
 *
 * What:
 * - Displays user rewards
 * - Backend-driven (read-only)
 * - Refer & Earn always visible
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RewardsModal from "@/components/user/rewards/RewardsModal";
import api from "@/services/api";
import useResponsive from "@/hooks/useResponsive";

const Rewards = () => {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();

  const [activeTab, setActiveTab] = useState("AVAILABLE");
  const [search, setSearch] = useState("");
  const [selectedReward, setSelectedReward] = useState(null);
  const [availableRewards, setAvailableRewards] = useState([]);

  /* ---------- COUNTS ---------- */
  const totalEarned = availableRewards
    .filter((r) => r.status === "COMPLETED")
    .reduce((sum, r) => sum + r.points, 0);

  const completedCount = availableRewards.filter(
    (r) => r.status === "COMPLETED"
  ).length;

  /* ---------- FILTER ---------- */
  const filteredRewards = availableRewards.filter(
    (r) =>
      r.status === activeTab &&
      r.title.toLowerCase().includes(search.toLowerCase())
  );


  useEffect(() => {
    const fetchAvailableRewards = async () => {
      try {
        const res = await api.get("/rewards/available");

        const mapped = res.data.map(r => ({
          id: r.id,
          title: r.name,
          description: r.description || "Complete actions to earn rewards",
          points: Number(r.value),
          status: "AVAILABLE",
        }));

        // Always prepend Refer & Earn
        mapped.unshift({
          id: "refer",
          title: "Refer & Earn",
          description: "Invite friends and earn rewards",
          points: 50,
          status: "AVAILABLE",
        });

        setAvailableRewards(mapped);
      } catch {
        console.error("Failed to load available rewards");
      }
    };

    fetchAvailableRewards();
  }, []);


  return (
    <div>
      <h2 style={{
        fontSize: isMobile ? "20px" : "22px",
        marginBottom: "16px",
      }}>Rewards</h2>

      {/* SUMMARY ROW */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: isMobile ? "12px" : "16px",
        marginBottom: "22px",
      }}>
        <SummaryCard
          label="Total Earned"
          value={totalEarned}
          accent="#2563EB"
          bg="#FFFFFF"
          onClick={() => navigate("/dashboard/rewards/total-earned")}
        />
        <SummaryCard
          label="Completed"
          value={completedCount}
          accent="#16A34A"
          bg="#FFFFFF"
          onClick={() => setActiveTab("COMPLETED")}
        />
      </div>

      {/* SEARCH */}
      <input
        style={{
          width: "100%",
          padding: isMobile ? "12px 14px" : "14px 16px",
          borderRadius: "12px",
          border: "1px solid #CBD5F5",
          marginBottom: "18px",
          fontSize: isMobile ? "14px" : "16px",
        }}
        placeholder="Search rewards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABS */}
      <div style={{
        display: "flex",
        gap: isMobile ? "6px" : "8px",
        marginBottom: "22px",
        flexWrap: isMobile ? "wrap" : "nowrap",
      }}>
        {["AVAILABLE", "COMPLETED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: isMobile ? "8px 12px" : "6px 14px",
              borderRadius: "18px",
              border: "none",
              cursor: "pointer",
              fontSize: isMobile ? "13px" : "14px",
              background: activeTab === tab ? "#2E5A88" : "#E5E7EB",
              color: activeTab === tab ? "#fff" : "#111",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
        gap: isMobile ? "14px" : "18px",
      }}>
        {filteredRewards.length === 0 && (
          <p style={{ color: "#64748b" }}>No rewards found</p>
        )}

        {filteredRewards.map((reward) => (
          <div
            key={reward.id}
            style={{
              background: "#fff",
              padding: isMobile ? "16px" : "18px",
              borderRadius: "18px",
              boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
              cursor: "pointer",
            }}
            onClick={() => {
              if (reward.title === "Refer & Earn") {
                setSelectedReward(reward);
              }
            }}
          >
            <h4 style={{
              fontSize: isMobile ? "16px" : "18px",
              marginBottom: "8px",
            }}>{reward.title}</h4>
            <p style={{
              color: "#64748b",
              fontSize: isMobile ? "13px" : "14px",
            }}>{reward.description}</p>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "16px",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "8px" : "0",
            }}>
              <strong style={{
                fontSize: isMobile ? "14px" : "16px",
              }}>+{reward.points}</strong>

              {reward.status === "AVAILABLE" && (
                <span style={{
                  background: "#2E5A88",
                  color: "#fff",
                  padding: isMobile ? "8px 12px" : "6px 16px",
                  borderRadius: "20px",
                  fontSize: isMobile ? "12px" : "13px",
                  opacity: 0.6,
                }}>
                  View Details
                </span>
              )}

              {reward.status === "COMPLETED" && (
                <span style={{
                  background: "#22c55e",
                  color: "#fff",
                  padding: isMobile ? "8px 12px" : "6px 16px",
                  borderRadius: "20px",
                  fontSize: isMobile ? "12px" : "13px",
                }}>Completed</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* REFER MODAL */}
      {selectedReward && (
        <RewardsModal
          reward={selectedReward}
          onClose={() => setSelectedReward(null)}
        />
      )}
    </div>
  );
};

export default Rewards;

/* ---------- SMALL COMPONENT ---------- */
const SummaryCard = ({ label, value, bg, accent, onClick }) => {
  const { isMobile } = useResponsive();
  
  return (
    <div
      style={{
        position: "relative",
        padding: isMobile ? "16px" : "18px",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        overflow: "hidden",
        background: bg,
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        width: "6px",
        background: accent,
      }} />
      <p style={{
        color: "#64748b",
        fontSize: isMobile ? "12px" : "13px",
      }}>{label}</p>
      <h3 style={{
        color: "#0f172a",
        marginTop: "4px",
        fontSize: isMobile ? "18px" : "20px",
      }}>{value}</h3>
    </div>
  );
};


