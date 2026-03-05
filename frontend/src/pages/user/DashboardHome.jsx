/**
 * Dashboard Home
 * Route: /dashboard
 * Real banking dashboard (no static values)
 */

import { useEffect, useState } from "react";
import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { getUser } from "@/utils/storage";

import CircleMetric from "@/components/user/dashboard/CircleMetric";
import CurrencyConverter from "@/components/user/dashboard/CurrencyConverter";
import InsightsChart from "@/components/user/dashboard/InsightsChart";
import TransactionsList from "@/components/user/dashboard/TransactionsList";
import QuickActions from "@/components/user/dashboard/QuickActions";


const DashboardHome = () => {
  const user = getUser() || {};
  const username = user?.name || "User";

  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isMobile = screenWidth <= 480;


  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summaryRes, insightsRes, txnRes] = await Promise.all([
          api.get(API_ENDPOINTS.INSIGHTS_SUMMARY),
          api.get(`${API_ENDPOINTS.INSIGHTS_DASHBOARD_DAILY}?days=15`),
          api.get(API_ENDPOINTS.TRANSACTIONS_RECENT),
        ]);

        setSummary(summaryRes.data);
        setInsights(insightsRes.data || []);
        setTransactions(txnRes.data || []);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);


  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize(); // sync immediately

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
}, []);



  const income = summary?.total_income || 0;
  const expense = summary?.total_expense || 0;
  const savings = summary?.savings || 0;

  const savingsPercent = income ? Math.round((savings / income) * 100) : 0;
  const expensePercent = income ? Math.round((expense / income) * 100) : 0;
  const incomeUsedPercent = income ? 100 - savingsPercent : 0;



  if (loading) return null;

  return (
    <div>
      {/* HEADER */}
      <div style={{
        ...header,
        marginBottom: isMobile ? 24 : 36,}}>
        <h1 style={{
          ...title,
          fontSize: isMobile ? 22 : 28,
          }}>Welcome, {username} 👋</h1>
        <p style={subtitle}>
          Here’s a snapshot of your financial health today.
        </p>
      </div>

{/* METRICS */}
<div style={circleGrid}>
  <CircleMetric label="Savings Rate" percent={savingsPercent} color="#16a34a" />
  <CircleMetric label="Expense Share" percent={expensePercent} color="#dc2626" />
  <CircleMetric label="Income Used" percent={incomeUsedPercent} color="#2563eb" />
</div>

{/* QUICK ACTIONS */}
<QuickActions />

{/* CURRENCY CONVERTER */}
<CurrencyConverter />

{/* LAST 15 DAYS BAR GRAPH */}
<InsightsChart data={insights} />
<TransactionsList data={transactions} />
    </div>
  );
};

export default DashboardHome;

/* ================= STYLES ================= */

const header = {
  textAlign: "center",
};

const title = {
  fontWeight: 600,
  marginBottom: 6,
};

const subtitle = {
  color: "#64748b",
};

const circleGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 24,
  marginBottom: 40,
};
