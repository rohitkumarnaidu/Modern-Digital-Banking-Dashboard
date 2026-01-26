/**
 * Main dashboard layout
 *
 * Part of:
 * - Protected area of the application
 * - Route: /dashboard/*
 *
 * Connected Files:
 * - Renders sidebar, header, and <Outlet />
 * - Loads child pages like DashboardHome, Accounts, Payments, etc.
 *
 * Purpose:
 * Acts as the base layout for all authenticated pages.
 * Controls overall dashboard structure and navigation.
 */




import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  CreditCard,
  Send,
  Wallet,
  ArrowLeftRight,
  PieChart,
  FileText,
  Gift,
  LineChart,
  Settings,
  AlertCircle,
  Bell,
  Menu,
  X
} from "lucide-react";
import logo from "@/assets/logo.png";
import api from "@/services/api";


const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const username = user?.name || "User";

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );


  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;


  const isActive = (path) =>{
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  }


  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const sidebarItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/dashboard/accounts", icon: CreditCard, label: "Accounts" },
    { path: "/dashboard/transfers", icon: Send, label: "Send Money" },
    { path: "/dashboard/balance", icon: Wallet, label: "Check Balance" },
    { path: "/dashboard/transactions", icon: ArrowLeftRight, label: "Transactions" },
    { path: "/dashboard/budgets", icon: PieChart, label: "Budgets" },
    { path: "/dashboard/bills", icon: FileText, label: "Recharge & Bills" },
    { path: "/dashboard/rewards", icon: Gift, label: "Rewards" },
    { path: "/dashboard/insights", icon: LineChart, label: "Insights" },
    { path: "/dashboard/alerts", icon: AlertCircle, label: "Alerts" },
    { path: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  useEffect(() => {
    const closeMenu = () => setShowProfileMenu(false);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);

      // ✅ Close mobile sidebar when leaving mobile
      if (width >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize(); // initial sync
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);


  useEffect(() => {
  const fetchUnreadAlerts = async () => {
    try {
      const res = await api.get("/alerts");
      setUnreadCount(res.data.length);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      setUnreadCount(0);
    }
  };

  fetchUnreadAlerts();
}, []);


  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#eaf1f8" }}>
      {/* MOBILE MENU BUTTON */}
      {(isMobile || isTablet) && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            position: "fixed",
            top: "16px",
            left: "16px",
            zIndex: 1001,
            width: "44px",
            height: "44px",
            borderRadius: "8px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* MOBILE OVERLAY */}
      {(isMobile || isTablet) && isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`sidebar ${(isMobile || isTablet) ? 'mobile' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
      >

        {/* LOGO */}
        <div className="sidebar-logo">
          <img src={logo} 
          alt="Aureus Logo" 
          className="sidebar-logo-img"
          />
        </div>

        {/* NAV */}
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => (isMobile || isTablet) && setIsMobileMenuOpen(false)}
            >
              <item.icon size={20} />
              <span className="sidebar-text">{item.label}</span>
            </Link>
          ))}
        </nav>

      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* FLOATING PROFILE ICON */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? "16px" : "20px",
            right: isMobile ? "16px" : "24px",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "12px" : "16px",
          }}
        >
 
        <div
          onClick={(e) => {
            e.stopPropagation();
            navigate("/dashboard/notifications");
          }}
         style={{
          width: isMobile ? 32 : 36,
          height: isMobile ? 32 : 36,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          background: "#fff",
          border: "1px solid #e2e8f0",
          position: "relative"
          }}
        title="Notifications"
        >
      <Bell size={isMobile ? 16 : 20} />

        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "#ef4444",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 600,
              minWidth: "16px",
              height: "16px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unreadCount}
          </span>
        )}
        </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu(!showProfileMenu);
              }}
              style={{
                width: isMobile ? 32 : 36,
                height: isMobile ? 32 : 36,
                borderRadius: "50%",
                border: "2px solid #3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "#fff",
                fontSize: isMobile ? "14px" : "16px"
              }}
            >
              👤
            </div>

            {showProfileMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  right: 0,
                  top: isMobile ? "40px" : "48px",
                  width: isMobile ? "180px" : "220px",
                  background: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                }}
              >
                <MenuItem label="Profile" onClick={() => navigate("/dashboard/profile")} />
                <MenuItem label="Settings" onClick={() => navigate("/dashboard/settings")} />
                <MenuItem label="Logout" danger onClick={handleLogout} />
              </div>
            )}
          </div>
 

        <main className="dashboard-main">
          <Outlet/>
        </main>
      </div>

      {/* RESPONSIVE STYLES */}
      <style>{`
        .sidebar {
          width: 72px;
          background: linear-gradient(
          180deg,
          #edf3fa 0%,
          #eaf1f8 50%,
          #e7eef6 100%
    );

          display: flex;
          flex-direction: column;
          padding: 20px 12px;
          transition: width 0.25s ease, background 0.25s ease, transform 0.25s ease;
          overflow: hidden;
          position: fixed;
          height: 100vh;
          top: 0;
          left: 0;
          z-index: 1000;
        }

        /* Mobile sidebar styles */
        .sidebar.mobile {
          width: 280px;
          transform: translateX(-100%);
          background: linear-gradient(
            135deg,
            #020617 0%,
            #020d1f 35%,
            #081a2e 65%,
            rgba(2,6,23,0.95) 100%
          );
          box-shadow: 6px 0 24px rgba(2, 6, 23, 0.45);
        }

        .sidebar.mobile.mobile-open {
          transform: translateX(0);
        }

        .sidebar.mobile .sidebar-text {
          opacity: 1;
          transform: translateX(0);
        }

        .sidebar.mobile .sidebar-item {
          color: #cbd5f5;
        }

        .sidebar.mobile .sidebar-item svg {
          color: #ffffff;
        }

        .sidebar::after{
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        left: auto;
        width: 28%;
        height: 100%;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.25s ease;
        }


        /* Desktop hover ONLY */
        @media (min-width: 1024px) {
          .sidebar:hover {
            width: 220px;
          }

          .sidebar:hover ~ div .dashboard-main {
            margin-left: 220px;
          }
        }

        .sidebar:hover:not(.mobile) {
          width: 220px;
          background: linear-gradient(
          135deg,
          #020617 0%,
          #020d1f 35%,
          #081a2e 65%,
          rgba(2,6,23,0.85) 100%
        );
        box-shadow: 6px 0 24px rgba(2, 6, 23, 0.45);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 56px;
          height: 48px;
        }

        .sidebar-logo-img {
          height: 36px;
          width: auto;
          object-fit: contain;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 14px;
          text-decoration: none;
          color: #334155;
          border-radius: 10px;
          transition: background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        /* ICON SIZE FIX */
        .sidebar-item svg {
        min-width: 20px;
        color: #0f172a;
        transition: color 0.2s ease;
        }

        .sidebar:hover:not(.mobile) .sidebar-item {
          color: #cbd5f5;
        }

        .sidebar-item:hover{
          background: rgba(255,255,255,0.08);
          }

        .sidebar-item.active {
          background: rgba(255,255,255,0.18);
        }

        .sidebar-text {
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .sidebar:hover:not(.mobile) .sidebar-text {
          opacity: 1;
          transform: translateX(0);
        }

        .sidebar-item svg {
          color: #334155;
          transition: color 0.2s ease;
        }

        .sidebar:hover:not(.mobile) .sidebar-item svg {
          color: #ffffff;
       }

        .sidebar-item.active svg {
          stroke-width: 2.6;
          color: #1e293b;
        }

        /* Desktop margin */
        .dashboard-main {
         margin-left: 72px;
         transition: margin-left 0.25s ease;
        }

        /* Mobile responsive styles */
        @media (max-width: 767px) {
          .dashboard-main {
            margin-left: 0 !important;
          }
          
          .sidebar-logo {
            margin-bottom: 32px;
          }
          
          .sidebar-item {
            padding: 12px 16px;
            font-size: 16px;
          }
        }

        .dashboard-main {
          padding: 40px;
        }

        /* Mobile */
        @media (max-width: 767px) {
          .dashboard-main {
            padding: 64px 16px 16px;
          }
        }

      `}</style>
    </div>
  );
};

export default Dashboard;

const MenuItem = ({ label, onClick, danger }) => (
  <div
    onClick={onClick}
    style={{
      padding: "12px 16px",
      cursor: "pointer",
      fontSize: "14px",
      color: danger ? "#dc2626" : "#0f172a",
      borderBottom: "1px solid #f1f5f9",
    }}
  >
    {label}
  </div>
);
