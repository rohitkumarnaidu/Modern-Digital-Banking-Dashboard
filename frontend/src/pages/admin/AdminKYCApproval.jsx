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
    <div>
      {/* HEADER */}
      <h1 style={{ fontSize: "28px", marginBottom: "6px" }}>
        KYC Approval
      </h1>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>
        Review and verify customer identity details.
      </p>


      {/* FILTER BAR */}
      <div style={filters}>
        <div style={inputWrap}>
          <Search size={16} style={inputIcon} />
          <input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />
        </div>

        <div style={selectWrap}>
          <ShieldCheck size={16} style={inputIcon} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={select}
          >
            <option value="ALL">All KYC Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>


      {/* TABLE */}
      <div style={card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Phone</th>
              <th style={th}>KYC Status</th>
              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" style={empty}>
                  <div style={emptyWrap}>
                    <ShieldCheck size={34} />
                    <div style={{ fontWeight: 500 }}>
                      No KYC requests found
                    </div>
                    <div style={subText}>
                      Pending KYC requests will appear here
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} style={row}>
                  <td style={td}>{u.name}</td>
                  <td style={td}>{u.email}</td>
                  <td style={td}>{u.phone}</td>
                  <td style={td}>
                    <StatusBadge status={u.kycStatus} />
                  </td>
                  <td style={td}>
                    {u.kycStatus === "PENDING" && (
                      <button
                        style={reviewBtn}
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
    </div>
  );
};

export default AdminKYCApproval;

/* ---------------- MODAL ---------------- */

const KYCModal = ({ user, onApprove, onReject, onClose }) => (
  <div style={overlay}>
    <div style={modal}>
      <h2 style={{ marginBottom: "8px" }}>KYC Review</h2>
      <p style={{ color: "#64748b", marginBottom: "16px" }}>
        Verify submitted user details
      </p>

      <div style={detail}><b>Name:</b> {user.name}</div>
      <div style={detail}><b>Email:</b> {user.email}</div>
      <div style={detail}><b>Phone:</b> {user.phone}</div>
      <div style={detail}><b>Document:</b> Aadhaar / PAN</div>

      <div style={actions}>
        <button style={approveBtn} onClick={onApprove}>
          <CheckCircle size={16} /> Approve
        </button>
        <button style={rejectBtn} onClick={onReject}>
          <XCircle size={16} /> Reject
        </button>
      </div>

      <button style={closeBtn} onClick={onClose}>
        Close
      </button>
    </div>
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

/* ---------------- STYLES ---------------- */

const select = {
  width: "100%",
  padding: "10px 10px 10px 36px", // 👈 THIS IS THE FIX
  borderRadius: "10px",
  border: "1px solid #cbd5f5",
  background: "#fff",
};


const card = {
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  overflow: "hidden",
};

const th = {
  padding: "16px",
  textAlign: "left",
  fontSize: "14px",
  color: "#475569",
};

const td = {
  padding: "16px",
  fontSize: "14px",
};

const row = {
  borderBottom: "1px solid #f1f5f9",
};

const empty = {
  padding: "48px",
  textAlign: "center",
  color: "#64748b",
};

const emptyWrap = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
};

const subText = {
  fontSize: "13px",
  color: "#64748b",
};

/* MODAL STYLES */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  borderRadius: "16px",
  padding: "24px",
  width: "420px",
};

const detail = {
  marginBottom: "8px",
  fontSize: "14px",
};

const actions = {
  display: "flex",
  gap: "12px",
  marginTop: "20px",
};

const approveBtn = {
  flex: 1,
  background: "#22c55e",
  color: "#fff",
  border: "none",
  padding: "10px",
  borderRadius: "10px",
  cursor: "pointer",
};

const rejectBtn = {
  flex: 1,
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "10px",
  borderRadius: "10px",
  cursor: "pointer",
};

const closeBtn = {
  marginTop: "14px",
  width: "100%",
  padding: "8px",
  borderRadius: "10px",
  border: "1px solid #cbd5f5",
};

const reviewBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
};

const filters = {
  display: "flex",
  gap: "10px",
  background: "#ffffff",
  padding: "14px",
  borderRadius: "14px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  marginBottom: "20px",
};


const inputWrap = {
  position: "relative",
  flex: 1,
};

const inputIcon = {
  position: "absolute",
  left: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#64748b",
};

const searchInput = {
  width: "100%",
  padding: "10px 10px 10px 36px",
  borderRadius: "10px",
  border: "1px solid #cbd5f5",
};

const selectWrap = {
  position: "relative",
  width: "220px",
};