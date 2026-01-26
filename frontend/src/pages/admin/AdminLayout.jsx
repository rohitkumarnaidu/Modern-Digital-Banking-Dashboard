import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileText,
  Bell,
  BarChart3,
  Settings,
  Gift,
  AlertTriangle,
  Activity,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import logo from "@/assets/logo.png";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);

      // ✅ Close sidebar ONLY when switching to desktop
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const sidebarItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/kyc", icon: ShieldCheck, label: "KYC Approval" },
    { path: "/admin/transactions", icon: FileText, label: "Transactions" },
    { path: "/admin/rewards", icon: Gift, label: "Rewards" },
    { path: "/admin/analytics", icon: Activity, label: "Analytics" },
    { path: "/admin/alerts", icon: AlertTriangle, label: "Alerts & Logs" },
    { path: "/admin/settings", icon: Settings, label: "Admin Settings" },
  ];


  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#eaf1f8" }}>
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
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    )}


      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <img src={logo} alt="Admin Logo" className="sidebar-logo-img" />
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon size={20} />
              <span className="sidebar-text">{item.label}</span>
            </Link>
          ))}
        </nav>

      <div
        onClick={() => {
          handleLogout();
          setIsMobileMenuOpen(false);
        }}
        className="sidebar-item"
        style={{ marginTop: "auto" }}
      >
        <LogOut size={20} />
        <span className="sidebar-text">Logout</span>
      </div>
      </aside>


      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>

      {/* RESPONSIVE ADMIN LAYOUT STYLES */}
      <style>{`

        .mobile-menu-btn:hover {
          background: #f1f5f9;
        }


        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 25;
        }

        /* Sidebar Base Styles */
        .sidebar {
          width: ${isDesktop ? '72px' : '280px'};
          background: ${isDesktop ? 'linear-gradient(180deg, #edf3fa 0%, #eaf1f8 50%, #e7eef6 100%)' : 'linear-gradient(135deg, #020617 0%, #020d1f 35%, #081a2e 65%, rgba(2,6,23,0.9) 100%)'};
          display: flex;
          flex-direction: column;
          padding: ${isDesktop ? '20px 12px' : '20px 12px'};
          padding-top: 20px;
          transition: all 0.25s ease;
          overflow: hidden;
          position: fixed;
          height: 100vh;
          top: 0;
          left: 0;
          z-index: 30;
          transform: ${
            isDesktop 
              ? 'translateX(0)' 
              : isMobile || isTablet 
                ? 'translateX(-100%)' 
                : 'translateX(0)'
          };
          box-shadow: ${isDesktop ? 'none' : '6px 0 24px rgba(2,6,23,0.45)'};
        }

        /* Desktop Hover Effect */
        ${isDesktop ? `
        .sidebar:hover {
          width: 220px;
          background: linear-gradient(
            135deg,
            #020617 0%,
            #020d1f 35%,
            #081a2e 65%,
            rgba(2,6,23,0.9) 100%
          );
          box-shadow: 6px 0 24px rgba(2,6,23,0.45);
        }
        ` : ''}

        .sidebar-mobile-open {
          transform: translateX(0);
        }

        .sidebar-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 56px;
          height: 48px;
        }

        .sidebar-logo-img {
          height: 36px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 14px;
          border-radius: 10px;
          text-decoration: none;
          color: ${isDesktop ? '#334155' : '#cbd5f5'};
          transition: background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
        }

        .sidebar-item:hover {
          background: rgba(255,255,255,0.08);
        }

        .sidebar-item.active {
          background: rgba(255,255,255,0.18);
        }

        .sidebar-item svg {
          min-width: 20px;
          color: ${isDesktop ? '#334155' : '#ffffff'};
          transition: color 0.2s ease;
        }

        .sidebar:hover .sidebar-item {
          color: #cbd5f5;
        }

        .sidebar:hover .sidebar-item svg {
          color: #ffffff;
        }

        .sidebar-text {
          opacity: ${isDesktop ? '0' : '1'};
          transform: translateX(0);
        }

        .sidebar:hover .sidebar-text {
          opacity: 1;
          transform: translateX(0);
        }

        .dashboard-main {
          padding: ${
            isMobile 
              ? '72px 1rem 1rem' 
              : isTablet 
              ? '1.5rem' 
              : '2rem'
          };
          margin-left: ${isDesktop ? '72px' : '0'};
          transition: all 0.25s ease;
        }

        .sidebar:hover ~ div .dashboard-main {
          margin-left: ${isDesktop ? '220px' : '0'};
        }

        .logout-item {
          color: ${isDesktop ? '#334155' : '#cbd5f5'};
        }

        .sidebar:hover .logout-item {
          color: #cbd5f5;
        }

        .logout-item:hover {
          background: rgba(255, 255, 255, 0.08);
        }

      `}</style>
    </div>
  );
};

export default AdminLayout;