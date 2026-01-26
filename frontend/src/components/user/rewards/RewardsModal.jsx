/**
 * Rewards Modal
 *
 * What:
 * - Shows full reward details
 * - Allows swipe-to-share action (Refer & Earn only)
 *
 * Used In:
 * - Rewards.jsx
 */

import { useState } from "react";
import useResponsive from "@/hooks/useResponsive";

const RewardsModal = ({ reward, onClose }) => {
  const { isMobile } = useResponsive();
  const [swipe, setSwipe] = useState(0);
  const [showShare, setShowShare] = useState(false);

  const handleSwipe = (e) => {
    const value = Number(e.target.value);
    setSwipe(value);

    if (value >= 100) {
      setShowShare(true);
    }
  };

  const handleShare = () => {
    const url = "http://localhost:5173/register";
    const text = `Join Modern Digital Banking using my referral 🎁`;

    if (navigator.share) {
      navigator.share({
        title: "Modern Digital Banking",
        text,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied! Share with your friends.");
    }

    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: isMobile ? "16px" : "0",
    }} onClick={onClose}>
      <div style={{
        width: isMobile ? "100%" : "420px",
        maxWidth: isMobile ? "100%" : "420px",
        background: "#fff",
        padding: isMobile ? "20px" : "26px",
        borderRadius: "20px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
        maxHeight: isMobile ? "90vh" : "auto",
        overflowY: isMobile ? "auto" : "visible",
      }} onClick={(e) => e.stopPropagation()}>
        <h2>{reward.title}</h2>
        <p style={{
          color: "#64748b",
          marginBottom: "18px",
          fontSize: isMobile ? "14px" : "16px",
        }}>{reward.description}</p>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          padding: isMobile ? "12px 14px" : "14px 16px",
          background: "#f1f5f9",
          borderRadius: "12px",
          marginBottom: "18px",
          fontSize: isMobile ? "13px" : "14px",
        }}>
          <span>Reward</span>
          <strong>+{reward.points} Points</strong>
        </div>

        <div style={{
          fontSize: isMobile ? "12px" : "13px",
          color: "#475569",
          marginBottom: "18px",
        }}>
          <p>• Invite friends to join</p>
          <p>• Earn points on successful signup</p>
          <p>• Backend auto-tracks completion</p>
        </div>

        {!showShare && (
          <>
            <p style={{
              fontSize: isMobile ? "12px" : "13px",
              marginBottom: "6px",
            }}>Swipe to share</p>
            <input
              type="range"
              min="0"
              max="100"
              value={swipe}
              onChange={handleSwipe}
              style={{
                width: "100%",
                cursor: "pointer",
              }}
            />
          </>
        )}

        {showShare && (
          <button onClick={handleShare} style={{
            marginTop: "16px",
            width: "100%",
            padding: isMobile ? "14px 12px" : "12px",
            borderRadius: "12px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: isMobile ? "14px" : "16px",
          }}>
            Share with Friends
          </button>
        )}

        <button onClick={onClose} style={{
          marginTop: "12px",
          width: "100%",
          padding: isMobile ? "14px 12px" : "12px",
          borderRadius: "12px",
          border: "none",
          background: "#e5e7eb",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: isMobile ? "14px" : "16px",
        }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default RewardsModal;
