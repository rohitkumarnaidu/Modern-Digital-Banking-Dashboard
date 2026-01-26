import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import useResponsive from "@/hooks/useResponsive";

const TransactionRow = ({ txn }) => {
  const { isMobile } = useResponsive();
  
  if (!txn) return null;

  const isCredit = txn.txn_type === "credit";

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      padding: isMobile ? "14px 16px" : "18px 20px",
      borderRadius: isMobile ? "12px" : "16px",
      background: "#ffffff",
      boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
      marginBottom: "14px",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "12px" : "0",
    }}>
      {/* LEFT SECTION */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: isMobile ? "10px" : "14px",
        width: isMobile ? "100%" : "auto",
      }}>
        {/* ICON */}
        <div
          style={{
            width: isMobile ? "36px" : "42px",
            height: isMobile ? "36px" : "42px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: isCredit ? "#dcfce7" : "#fee2e2",
            color: isCredit ? "#16a34a" : "#dc2626",
          }}
        >
          {isCredit ? (
            <ArrowDownLeft size={isMobile ? 16 : 18} />
          ) : (
            <ArrowUpRight size={isMobile ? 16 : 18} />
          )}
        </div>

        {/* TEXT */}
        <div>
          <p style={{
            fontSize: isMobile ? "14px" : "15px",
            fontWeight: "600",
            color: "#0f172a",
            lineHeight: "1.4",
          }}>{txn.description}</p>
          <p style={{
            fontSize: isMobile ? "11px" : "12px",
            color: "#64748b",
            marginTop: "4px",
          }}>
            {new Date(txn.txn_date).toLocaleDateString()} • {txn.txn_type}
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div style={{ 
        textAlign: "right",
        alignSelf: isMobile ? "flex-end" : "auto"
      }}>
        <p
          style={{
            fontSize: isMobile ? "15px" : "16px",
            fontWeight: "700",
            color: isCredit ? "#16a34a" : "#dc2626",
          }}
        >
          {isCredit ? "+" : "-"} ₹{Number(txn.amount).toLocaleString()}
        </p>

        <p style={{
          fontSize: isMobile ? "11px" : "12px",
          color: "#64748b",
          marginTop: "4px",
        }}>{txn.category || "Payments"}</p>
      </div>
    </div>
  );
};

export default TransactionRow;
