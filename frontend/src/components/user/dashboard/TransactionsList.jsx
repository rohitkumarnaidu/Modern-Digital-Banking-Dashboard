import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

/**
 * TransactionsList
 *
 * Purpose:
 * - Show recent transactions like real banking apps
 * - Debit = red, Credit = green
 * - Improved visual hierarchy
 * - Backend driven (no logic change)
 */

const TransactionsList = ({ data = [] }) => {
  return (
    <div style={card}>
      <h3 style={title}>Recent Transactions</h3>

      {data.length === 0 ? (
        <p style={muted}>No recent transactions</p>
      ) : (
        data.map((txn) => {
          const isDebit = txn.txn_type === "debit";

          return (
            <div key={txn.id} style={row}>
              {/* LEFT */}
              <div style={left}>
                <div
                  style={{
                    ...iconWrap,
                    background: isDebit ? "#fee2e2" : "#dcfce7",
                    color: isDebit ? "#dc2626" : "#16a34a",
                  }}
                >
                  {isDebit ? (
                    <ArrowUpRight size={window.innerWidth <= 480 ? 16 : 18} />
                  ) : (
                    <ArrowDownLeft size={window.innerWidth <= 480 ? 16 : 18} />
                  )}
                </div>

                <div>
                  <div style={desc}>{txn.description}</div>
                  <div style={meta}>
                    {txn.txn_date} • {txn.txn_type}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div
                style={{
                  ...amount,
                  color: isDebit ? "#dc2626" : "#16a34a",
                }}
              >
                {isDebit ? "-" : "+"}₹{txn.amount}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TransactionsList;

/* ===== RESPONSIVE STYLES ===== */

const card = {
  background: "#ffffff",
  padding: window.innerWidth <= 480 ? 16 : window.innerWidth <= 768 ? 20 : 24,
  borderRadius: window.innerWidth <= 480 ? 14 : 18,
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  marginBottom: window.innerWidth <= 480 ? 24 : 36,
};

const title = {
  marginBottom: window.innerWidth <= 480 ? 12 : 16,
  fontSize: window.innerWidth <= 480 ? 16 : 18,
  fontWeight: 600,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: window.innerWidth <= 480 ? "flex-start" : "center",
  padding: window.innerWidth <= 480 ? "12px 0" : "14px 0",
  borderBottom: "1px solid #e5e7eb",
  flexDirection: window.innerWidth <= 480 ? "column" : "row",
  gap: window.innerWidth <= 480 ? "8px" : "0",
};

const left = {
  display: "flex",
  alignItems: "center",
  gap: window.innerWidth <= 480 ? 10 : 14,
  width: window.innerWidth <= 480 ? "100%" : "auto",
};

const iconWrap = {
  width: window.innerWidth <= 480 ? 32 : 38,
  height: window.innerWidth <= 480 ? 32 : 38,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const desc = {
  fontWeight: 600,
  fontSize: window.innerWidth <= 480 ? 14 : 15,
  lineHeight: "1.4",
};

const meta = {
  fontSize: window.innerWidth <= 480 ? 12 : 13,
  color: "#64748b",
  marginTop: 2,
};

const amount = {
  fontWeight: 700,
  fontSize: window.innerWidth <= 480 ? 15 : 16,
  alignSelf: window.innerWidth <= 480 ? "flex-end" : "auto",
};

const muted = {
  color: "#64748b",
  fontSize: window.innerWidth <= 480 ? 13 : 14,
  textAlign: "center",
  padding: window.innerWidth <= 480 ? "20px 0" : "24px 0",
};
