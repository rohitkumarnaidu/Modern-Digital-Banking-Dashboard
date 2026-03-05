import { useState } from "react";
import { convertUsdToInr } from "@/services/currency";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    try {
      setLoading(true);
      const convertedAmount = await convertUsdToInr(amount);
      if (!convertedAmount) {
        setResult("Not available");
        return;
      }

      setResult(convertedAmount);
    } catch (error) {
      console.error("Conversion failed", error);
      setResult("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={card}>
      <h3 style={heading}>Currency Converter</h3>

      <div style={grid}>
        {/* USD INPUT */}
        <div style={currencyBox}>
          <span style={symbol}>$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={currencyInput}
          />
          <span style={code}>USD</span>
        </div>

        {/* INR OUTPUT */}
        <div style={{ ...currencyBox, background: "#f8fafc" }}>
          <span style={symbol}>₹</span>
          <input
            type="text"
            value={result}
            readOnly
            style={currencyInput}
          />
          <span style={code}>INR</span>
        </div>

        {/* CONVERT BUTTON */}
        <button onClick={convert} style={button} disabled={loading}>
          {loading ? "Converting..." : "Convert"}
        </button>
      </div>
    </div>
  );
};

export default CurrencyConverter;

/* ================= STYLES ================= */

const card = {
  background: "#ffffff",
  padding: "28px",
  borderRadius: "18px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  marginBottom: "40px",
};

const heading = {
  fontSize: "22px",
  fontWeight: 600,
  marginBottom: "24px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
};

const currencyBox = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "0 14px",
  height: "48px",
};

const currencyInput = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: "16px",
  background: "transparent",
};

const symbol = {
  fontSize: "18px",
  fontWeight: 600,
};

const code = {
  fontSize: "14px",
  color: "#64748b",
};

const button = {
  height: "48px",
  borderRadius: "12px",
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 500,
  cursor: "pointer",
};
