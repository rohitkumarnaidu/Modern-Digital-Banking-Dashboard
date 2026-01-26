/**
 * Financial insights page
 *
 * Route:
 * - /dashboard/insights
 *
 * Purpose:
 * Dynamic analytics using backend data
 */

import { useEffect, useState } from "react";
import {
  getInsightsSummary,
  getMonthlySpending,
  getCategoryBreakdown,
} from "@/services/api";

import MonthlySpendingChart from "@/components/user/insights/MonthlySpendingChart";
import CategoryBreakdownChart from "@/components/user/insights/CategoryBreakdownChart";

/* ---------- CONSTANTS ---------- */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const YEARS = [2023, 2024, 2025, 2026];

const Insights = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [savings, setSavings] = useState(0);

  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isMobile = screenWidth <= 480;
  const isTablet = screenWidth <= 768;
  const isLaptop = screenWidth <= 1024;

  const [loading, setLoading] = useState(true);

  const loadInsights = async () => {
    try {
      setLoading(true);

      const [summaryRes, monthlyRes, categoryRes] = await Promise.all([
        getInsightsSummary(),
        getMonthlySpending(month, year),
        getCategoryBreakdown(month, year),
      ]);

      setIncome(summaryRes.data.total_income || 0);
      setExpense(summaryRes.data.total_expense || 0);
      setSavings(summaryRes.data.savings || 0);

      setMonthlyData(monthlyRes.data || []);
      setCategoryData(categoryRes.data || []);
    } catch (err) {
      console.error("Insights load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // 🔥 CRITICAL: force sync once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);


  useEffect(() => {
    loadInsights();
  }, [month, year]);

  return (
    <div>
      {/* HEADER */}
      <div style={{
        textAlign: "center",
        marginBottom: isMobile ? "20px" : "28px",
      }}>
        <h1 style={{
          fontSize: isMobile ? "22px" : "26px",
          marginBottom: "6px",
        }}>Insights</h1>
        <p style={{
          color: "#64748b",
          fontSize: isMobile ? "13px" : "14px",
        }}>
          Analyze your income, expenses, and spending trends
        </p>
      </div>

      {/* FILTER BAR */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#ffffff",
        padding: isMobile ? "14px 16px" : "16px 22px",
        borderRadius: "18px",
        boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
        margin: isMobile ? "16px 0 24px" : "20px 0 32px",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "12px" : "0",
      }}>
        <div style={{
          fontSize: isMobile ? "16px" : "18px",
          fontWeight: 600,
          color: "#0f172a",
        }}>
          {MONTHS[month - 1]} {year}
        </div>

        <div style={{
          display: "flex",
          gap: isMobile ? "8px" : "12px",
        }}>
          {/* MONTH (numeric) */}
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: isMobile ? "8px 12px" : "8px 14px",
              justifyContent: isMobile ? "center" : "flex-end",
              fontSize: isMobile ? "13px" : "14px",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option value={m}>
                {MONTHS[m - 1]}
              </option>
            ))}
          </select>

          {/* YEAR */}
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: isMobile ? "6px 10px" : "8px 14px",
              fontSize: isMobile ? "13px" : "14px",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SUMMARY */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        gap: isMobile ? "16px" : "20px",
        marginBottom: isMobile ? "28px" : "36px",
      }}>
        <InsightCard title="Total Income" value={income} accent="#2563EB" isMobile={isMobile}/>
        <InsightCard title="Total Expense" value={expense} accent="#DC2626" isMobile={isMobile} />
        <InsightCard title="Savings" value={savings} accent="#16A34A" isMobile={isMobile}/>
      </div>

      {/* CHARTS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 1fr",
        gap: isMobile ? "20px" : "28px",
      }}>
        <ChartCard title="Monthly Spending" isMobile={isMobile}>
          {loading ? "Loading…" : <MonthlySpendingChart 
          key={`${month}-${year}-${screenWidth}`}
          data={monthlyData} />}
        </ChartCard>

        <ChartCard title="Category Breakdown">
          {loading ? "Loading…" : (
            <CategoryBreakdownChart 
            key={`${month}-${year}-${screenWidth}`}
            data={categoryData} />
          )}
        </ChartCard>
      </div>

      {/* EMPTY STATE */}
      {!loading && income === 0 && expense === 0 && (
        <div style={{
          textAlign: "center",
          marginTop: isMobile ? "30px" : "40px",
          color: "#64748b",
        }}>
          <h3>No Insights Yet</h3>
          <p>Start making transactions to see insights here.</p>
        </div>
      )}
    </div>
  );
};

export default Insights;

/* ========== COMPONENTS ========== */

const InsightCard = ({ title, value, accent, isMobile }) => {
  
  return (
    <div style={{
      position: "relative",
      background: "#fff",
      padding: isMobile ? "18px" : "22px",
      borderRadius: "18px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "6px",
        height: "100%",
        borderRadius: "6px 0 0 6px",
        background: accent,
      }} />
      <p style={{
        color: "#64748b",
        marginBottom: "6px",
        fontSize: isMobile ? "13px" : "14px",
      }}>{title}</p>
      <h2 style={{
        fontSize: isMobile ? "18px" : "20px",
      }}>₹ {value.toLocaleString()}</h2>
    </div>
  );
};

const ChartCard = ({ title, children, isMobile }) => {
  
  return (
    <div style={{
      background: "#fff",
      padding: isMobile ? "20px" : "24px",
      borderRadius: "18px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    }}>
      <h3 style={{
        marginBottom: "14px",
        fontSize: isMobile ? "16px" : "18px",
      }}>{title}</h3>
      <div style={{
        height: isMobile ? "220px" : "260px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>{children}</div>
    </div>
  );
};