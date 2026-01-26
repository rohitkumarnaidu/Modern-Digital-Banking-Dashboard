import { useEffect, useState } from "react";
import {
  Layers,
  ArrowLeftRight,
  Calendar,
  FileText,
  Download,
  Upload,
  Search,
} from "lucide-react";
import api from "@/services/api";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/transactions",{
        params: {
          category: category|| undefined,
          type: type|| undefined,
          date: dateFilter|| undefined,
        },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXPORT ================= */
  const exportData = async () => {
    try {
      const res = await api.get("/admin/transactions/export");
      const blob = new Blob([res.data.content], {
        type: "text/csv",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.data.filename;
      a.click();
    } catch (err) {
      alert("Export failed");
    }
  };


  /* ================= IMPORT ================= */
  const importCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/admin/transactions/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchTransactions(); // refresh table
    } catch (err) {
      alert("Import failed");
    }
  };
  const filteredTransactions = transactions.filter((tx) => {
  const matchesSearch =
    tx.user_name?.toLowerCase().includes(search.toLowerCase()) ||
    tx.email?.toLowerCase().includes(search.toLowerCase());

  const matchesCategory = category ? tx.category === category : true;
  const matchesType = type ? tx.txn_type === type : true;
  const matchesDate = dateFilter ? tx.txn_date === dateFilter : true;

  return matchesSearch && matchesCategory && matchesType && matchesDate;
});




  return (
    <div className="admin-transactions">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Transactions</h1>
            <p className="page-subtitle">
              View and monitor all user transactions
            </p>
          </div>

          <div className="header-actions">
            <label className="action-btn secondary-btn">
              <Upload size={16} /> 
              <span className="btn-text">Import CSV</span>
              <input hidden type="file" accept=".csv" onChange={importCSV} />
            </label>

            <button className="action-btn primary-btn" onClick={exportData}>
              <Download size={16} /> 
              <span className="btn-text">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="filters-container">
        <div className="filter-row">
          <div className="filter-group">
            <Layers size={16} className="filter-icon" />
            <select 
              className="filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="food">Food & Dining</option>
              <option value="shopping">Shopping</option>
              <option value="bills">Bills & Utilities</option>
              <option value="transfers">Transfers</option>
            </select>
          </div>

          <div className="filter-group">
            <ArrowLeftRight size={16} className="filter-icon" />
            <select className="filter-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group search-group">
            <Search size={16} className="filter-icon" />
            <input
              type="text"
              placeholder="Search user or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group date-group">
            <Calendar size={16} className="filter-icon" />
            <input 
              type="date" 
              className="date-input"
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <button className="apply-btn" onClick={fetchTransactions}>
            Apply
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="transactions-table">
            <thead className="table-header">
              <tr>
                <th className="table-th">User</th>
                <th className="table-th hidden-mobile">Email</th>
                <th className="table-th">Type</th>
                <th className="table-th">Amount</th>
                <th className="table-th hidden-mobile">Status</th>
                <th className="table-th hidden-mobile">Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                   <td colSpan="6" className="loading-cell">
                    Loading transactions…
                    </td>
                    </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <FileText size={32} />
                      <div>No transactions recorded</div>
                      <small>User activity will appear once transactions occur</small>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="table-row">
                    <td className="table-td">
                      <div className="user-info">
                        <div className="user-name">{tx.user_name}</div>
                        <div className="user-details-mobile">
                          <div className="user-email">{tx.email}</div>
                          <div className="transaction-meta">
                            <StatusBadge status="SUCCESS" /> • {tx.txn_date}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-td hidden-mobile">{tx.email}</td>
                    <td className="table-td">{tx.txn_type}</td>
                    <td className="table-td amount-cell">₹{tx.amount}</td>
                    <td className="table-td hidden-mobile"><StatusBadge status="SUCCESS" /></td>
                    <td className="table-td hidden-mobile">{tx.txn_date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* MOBILE CARD VIEW */}
      <div className="mobile-transactions-list">
        {filteredTransactions.map((tx) => (
          <div key={tx.id} className="mobile-transaction-card">
            
            <div className="card-top">
              <div className="card-user">{tx.user_name}</div>
              <StatusBadge status="SUCCESS" />
            </div>

            <div className="card-meta">
              <div className="card-email">{tx.email}</div>
              <div className="card-date">{tx.txn_date}</div>
            </div>

            <div className="card-bottom">
              <div className="card-type">{tx.txn_type}</div>
              <div className="card-amount">₹{tx.amount}</div>
            </div>

          </div>
        ))}
      </div>


      {/* RESPONSIVE STYLES */}
      <style>{`
        .admin-transactions {
          padding: 2rem;
          max-width: 100%;
        }

        @media (max-width: 1023px) {
          .admin-transactions {
            padding: 1.5rem;
          }
        }

        @media (max-width: 639px) {
          .admin-transactions {
            padding: 1rem;
          }
        }

        .page-header {
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .page-header {
            padding-left: 3rem; /* same as md:pl-12 */
          }
        }

        .header-content {
          display: flex;
          flex-direction: row;
          gap: 1rem;
          align-items: center;
        }

        @media (max-width: 639px) {
          .header-content {
            flex-direction: column;
            align-items: stretch;
          }
        }

        .header-text {
          flex: 1;
        }

        .page-title {
          font-size: 2rem;
        }

        @media (max-width: 1023px) {
          .page-title {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 639px) {
          .page-title {
            font-size: 1.5rem;
          }
        }

        .page-subtitle {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .header-actions {
          display: flex;
          flex-direction: row;
          gap: 0.75rem;
        }

        @media (max-width: 639px) {
          .header-actions {
            flex-direction: column;
          }
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          justify-content: center;
        }

        .primary-btn {
          background: #1e40af;
          color: white;
        }

        .primary-btn:hover {
          background: #1d4ed8;
        }

        .secondary-btn {
          background: #f0f7ff;
          color: #1e40af;
          border: 1.5px solid #93c5fd;
        }

        .secondary-btn:hover {
          background: #dbeafe;
        }

        .btn-text {
          display: inline;
        }

        @media (max-width: 639px) {
          .btn-text {
            display: none;
          }
        }

        .filters-container {
          background: white;
          padding: 1.5rem;
          border-radius: 0.75rem;
          border: 1.5px solid #cbd5e1;
          margin-bottom: 1.5rem;
        }

        .filter-row {
          display: flex;
          gap: 1rem;
        }

        @media (max-width: 639px) {
          .filters-container {
            padding: 0.75rem;
          }

          .filter-row {
            flex-direction: column;
            gap: 0.75rem;
          }
        }


        .filter-row:last-child {
          margin-bottom: 0;
        }

        .filter-group {
          position: relative;
          flex: 1;
        }

        .search-group {
          flex: 2;
        }

        .filter-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          z-index: 1;
        }

        .filter-select, .search-input, .date-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border-radius: 0.5rem;
          border: 1px solid #cbd5e1;
          background: white;
          font-size: 0.875rem;
        }

        .filter-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }

        .apply-btn {
          background: #0f172a;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .apply-btn:hover {
          background: #1e293b;
        }

        .table-container {
          background: white;
          border-radius: 1rem;
          border: 1px solid #d6e0f0;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12);
          overflow: hidden;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .transactions-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        .table-header {
          background: #f1f6fd;
        }

        .table-th {
          padding: 1rem;
          font-size: 0.875rem;
          text-align: left;
          color: #475569;
          font-weight: 600;
          white-space: nowrap;
        }

        .table-td {
          padding: 1rem;
          font-size: 0.875rem;
          color: #1f2937;
          border-bottom: 1px solid #e2e8f0;
        }

        .table-row {
          transition: all 0.2s ease;
        }

        .table-row:hover {
          background: #f8fafc;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 500;
          color: #1f2937;
        }

        .user-details-mobile {
          margin-top: 0.25rem;
          display: none;
        }

        @media (max-width: 639px) {
        .user-details-mobile {
          display: block;
        }
      }

        .user-email {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .transaction-meta {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .amount-cell {
          font-weight: 600;
          color: #059669;
        }

        .loading-cell {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }

        .empty-state {
          padding: 3rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          color: #475569;
          text-align: center;
        }

        .hidden-mobile {
          display: table-cell;
        }

        @media (max-width: 639px) {
          .hidden-mobile {
            display: none;
          }
        }


       .transactions-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        @media (max-width: 1023px) {
          .transactions-table {
            min-width: 600px;
          }
        }

        /* ================= MOBILE TRANSACTION CARDS ================= */

        .mobile-transactions-list {
          display: none;
        }

        .mobile-transaction-card {
          background: white;
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-user {
          font-weight: 600;
          color: #1f2937;
        }

        .card-meta {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #64748b;
        }

        .card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.75rem;
        }

        .card-type {
          font-size: 0.75rem;
          text-transform: capitalize;
          color: #475569;
        }

        .card-amount {
          font-weight: 700;
          color: #059669;
        }

        /* SHOW CARDS ON MOBILE */
        @media (max-width: 639px) {
          .table-container {
            display: none;
          }

          .mobile-transactions-list {
            display: block;
          }
        }

        @media (max-width: 639px) {
        .filters-container {
          padding: 0.75rem;
        }

        .filter-row {
          gap: 0.75rem;
        }

        .apply-btn {
          width: 100%;
        }

        .header-actions {
          width: 100%;
        }

        .action-btn {
          width: 100%;
        }
      }

      `}</style>
    </div>
  );
};

export default AdminTransactions;

/* ---------- COMPONENTS ---------- */

const StatusBadge = ({ status }) => {
  const colors = {
    SUCCESS: "#22c55e",
    FAILED: "#ef4444",
    PENDING: "#facc15",
  };

  return (
    <span style={{
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 600,
      color: "#fff",
      background: colors[status] || "#64748b",
    }}>
      {status}
    </span>
  );
};