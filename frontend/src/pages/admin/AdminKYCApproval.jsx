import { useEffect, useState } from "react";
import { ShieldCheck, XCircle, CheckCircle, Search, User } from "lucide-react";
import api from "@/services/api";

const AdminKYCApproval = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  const KYC_UI_MAP = {
    UNVERIFIED: "PENDING",
    VERIFIED: "APPROVED",
    REJECTED: "REJECTED",
  };

  const KYC_API_MAP = {
    PENDING: "unverified",
    APPROVED: "verified",
    REJECTED: "rejected",
  };

  const fetchUsers = async () => {
    const res= await api.get("/admin/users", {
      params: {
        search: search || undefined,
        kyc_status:
         filter === "ALL" 
         ? undefined 
         : KYC_API_MAP[filter],
      },
    });


    const formatted = res.data.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      kycStatus: KYC_UI_MAP[u.kyc_status?.toUpperCase()] || "PENDING",
    }));

    setUsers(formatted);
  }

  useEffect(() => {
    fetchUsers();
  }, [filter, search]);


  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/users/${id}/kyc`, {
        status: KYC_API_MAP[status],
      });
      
      setSelectedUser(null);
      fetchUsers(); // Refresh list
    } catch (err) {
      alert("Failed to update KYC status");
    }
  };

  return (
    <div className="admin-kyc">
      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">
          KYC Approval
        </h1>
        <p className="page-subtitle">
          Review and verify customer identity details.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="filters-container">
        <div className="filter-input">
          <Search size={16} className="input-icon" />
          <input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-select">
          <ShieldCheck size={16} className="input-icon" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select-input"
          >
            <option value="ALL">All KYC Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="kyc-table">
            <thead className="table-header">
              <tr>
                <th className="table-th">Name</th>
                <th className="table-th hidden-mobile">Email</th>
                <th className="table-th hidden-mobile">Phone</th>
                <th className="table-th">KYC Status</th>
                <th className="table-th">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-cell">
                    <div className="empty-state">
                      <ShieldCheck size={34} />
                      <div className="empty-title">
                        No KYC requests found
                      </div>
                      <div className="empty-subtitle">
                        Pending KYC requests will appear here
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="table-row">
                    <td className="table-td">
                      <div className="user-info">
                        <div className="user-name">{u.name}</div>
                        <div className="user-details-mobile">
                          <div className="user-email">{u.email}</div>
                          <div className="user-phone">{u.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-td hidden-mobile">{u.email}</td>
                    <td className="table-td hidden-mobile">{u.phone}</td>
                    <td className="table-td">
                      <StatusBadge status={u.kycStatus} />
                    </td>
                    <td className="table-td">
                      {u.kycStatus === "PENDING" && (
                        <button
                          className="review-btn"
                          onClick={() => setSelectedUser(u)}
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="mobile-kyc-list">
        {users.map((u) => (
          <div key={u.id} className="mobile-kyc-card">
            <div className="card-top">
              <div className="card-name">{u.name}</div>
              <StatusBadge status={u.kycStatus} />
            </div>

            <div className="card-meta">
              <div>{u.email}</div>
              <div>{u.phone}</div>
            </div>

            {u.kycStatus === "PENDING" && (
              <button
                className="review-btn mobile-full"
                onClick={() => setSelectedUser(u)}
              >
                Review
              </button>
            )}
          </div>
        ))}
      </div>


      {/* MODAL */}
      {selectedUser && (
        <KYCModal
          user={selectedUser}
          onApprove={() =>
            updateStatus(selectedUser.id, "APPROVED")
          }
          onReject={() =>
            updateStatus(selectedUser.id, "REJECTED")
          }
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* RESPONSIVE STYLES */}
      <style>{`
        .admin-kyc {
          padding: 1rem;
          max-width: 100%;
        }       

        .page-header {
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .page-header {
            padding-left: 3rem; /* same as md:pl-12 */
          }
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .filters-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: white;
          padding: 1rem;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }

        .filter-input, .filter-select {
          position: relative;
          flex: 1;
        }

        .filter-select {
          max-width: none;
        }

        .input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          z-index: 1;
        }

        .search-input, .select-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          font-size: 0.875rem;
          background: white;
        }

        .select-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }

        .table-container {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .kyc-table {
          width: 100%;
          border-collapse: collapse;
        }


        .table-header {
          background: #f8fafc;
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
          border-bottom: 1px solid #f1f5f9;
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
          display: block;
        }

        .user-email, .user-phone {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .review-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.5rem 0.875rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .review-btn:hover {
          background: #1d4ed8;
        }

        .empty-cell {
          padding: 3rem 1rem;
          text-align: center;
          color: #6b7280;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .empty-title {
          font-weight: 500;
          font-size: 1rem;
        }

        .empty-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
        }

        @media (max-width: 639px) {
          .hidden-mobile {
            display: none;
          }
        }

        @media (min-width: 640px) {
          .hidden-mobile {
            display: table-cell;
          }
        }


        @media (min-width: 640px) {
          .admin-kyc {
            padding: 1.5rem;
          }

          .page-title {
            font-size: 1.75rem;
          }

          .filters-container {
            flex-direction: row;
          }

          .review-btn {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }

          .user-details-mobile {
            display: none;
          }
        }

        @media (min-width: 1024px) {
          .admin-kyc {
            padding: 2rem;
          }

          .page-title {
            font-size: 2rem;
          }
        }

        /* MOBILE CARD VIEW */
        .mobile-kyc-list {
          display: none;
        }

        @media (max-width: 639px) {
          /* hide table on mobile */
          .table-container {
            display: none;
          }

          .mobile-kyc-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .mobile-kyc-card {
            background: white;
            border-radius: 0.75rem;
            padding: 1rem;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          }

          .card-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          }

          .card-name {
            font-weight: 600;
            color: #1f2937;
          }

          .card-meta {
            font-size: 0.75rem;
            color: #6b7280;
            margin-bottom: 0.75rem;
          }

          .mobile-full {
            width: 100%;
          }
        }


      `}</style>
    </div>
  );
};

export default AdminKYCApproval;

/* ---------------- MODAL ---------------- */

const KYCModal = ({ user, onApprove, onReject, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2 className="modal-title">KYC Review</h2>
      <p className="modal-subtitle">
        Verify submitted user details
      </p>

      <div className="user-details">
        <div className="detail-item"><b>Name:</b> {user.name}</div>
        <div className="detail-item"><b>Email:</b> {user.email}</div>
        <div className="detail-item"><b>Phone:</b> {user.phone}</div>
        <div className="detail-item"><b>Document:</b> Aadhaar / PAN</div>
      </div>

      <div className="modal-actions">
        <button className="approve-btn" onClick={onApprove}>
          <CheckCircle size={16} /> Approve
        </button>
        <button className="reject-btn" onClick={onReject}>
          <XCircle size={16} /> Reject
        </button>
      </div>

      <button className="close-btn" onClick={onClose}>
        Close
      </button>
    </div>

    <style>{`
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        padding: 1rem;
      }

      .modal-content {
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        width: 100%;
        max-width: 420px;
        max-height: 90vh;
        overflow-y: auto;
      }

      .modal-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #1f2937;
      }

      .modal-subtitle {
        color: #6b7280;
        margin-bottom: 1rem;
        font-size: 0.875rem;
      }

      .user-details {
        margin-bottom: 1.5rem;
      }

      .detail-item {
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: #374151;
      }

      .modal-actions {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .approve-btn, .reject-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.875rem;
      }

      .approve-btn {
        background: #22c55e;
        color: white;
      }

      .approve-btn:hover {
        background: #16a34a;
      }

      .reject-btn {
        background: #ef4444;
        color: white;
      }

      .reject-btn:hover {
        background: #dc2626;
      }

      .close-btn {
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid #d1d5db;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.875rem;
      }

      .close-btn:hover {
        background: #f9fafb;
      }

      @media (min-width: 640px) {
        .modal-content {
          padding: 2rem;
        }

        .modal-title {
          font-size: 1.5rem;
        }
      }
    `}</style>
  </div>
);

/* ---------------- COMPONENTS ---------------- */

const StatusBadge = ({ status }) => {
  const map = {
    PENDING: "#facc15",
    APPROVED: "#22c55e",
    REJECTED: "#ef4444",
  };
  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        color: "#fff",
        background: map[status],
      }}
    >
      {status}
    </span>
  );
};