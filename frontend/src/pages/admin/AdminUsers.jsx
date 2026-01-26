import { useEffect, useState } from "react";
import { Search, ShieldCheck, User } from "lucide-react";
import api from "@/services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [search, kycFilter]);

  const updateKyc = async (userId, status) => {
    try {
      await api.patch(`/admin/users/${userId}/kyc`, {
        status,
      });
      fetchUsers(); // 🔄 refresh list
    } catch (err) {
      alert("Failed to update KYC");
    }
  };

  const KYC_FILTER_MAP = {
    PENDING: "unverified",
    APPROVED: "verified",
    REJECTED: "rejected",
  };


  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/users", {
        params: {
          search: search || undefined,
          kyc_status: kycFilter === "ALL" ? undefined : KYC_FILTER_MAP[kycFilter],
        },
      });

      const formatted = res.data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        kycStatus: u.kyc_status?.toUpperCase(),
      }));

      setUsers(formatted);
    } catch (err) {
      console.error("Failed to load users", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 w-full lg:max-w-7xl lg:mx-auto">
      {/* HEADER */}
      <h1
        className="
          text-xl sm:text-2xl lg:text-3xl
          font-semibold text-gray-800 mb-1
          md:pl-12 lg:pl-0
          leading-tight break-words
        "
      >
        Users
      </h1>
      <p className="text-sm sm:text-base text-gray-500 mb-6 md:pl-12 lg:pl-0">
        View and monitor registered platform users.
      </p>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 mb-6
        flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full pl-9 pr-3 py-2 sm:py-2.5
              border rounded-xl text-sm sm:text-base
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative w-full sm:w-64">
          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 sm:py-2.5
              border rounded-xl text-sm sm:text-base bg-white cursor-pointer"
          >
            <option value="ALL">All KYC Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead style={{ 
              background: "linear-gradient(to right, #f8fafc, #f1f5f9)",
              borderBottom: "2px solid #e5e7eb"
            }}>
              <tr>
                <th className="px-2 py-3 text-xs font-semibold text-left text-gray-700 uppercase">
                  ID
                </th>

                <th className="px-2 py-3 text-xs font-semibold text-left text-gray-700 uppercase">
                  Name
                </th>

                <th className="hidden sm:table-cell px-2 py-3 text-xs font-semibold text-left text-gray-700 uppercase">
                  Email
                </th>

                <th className="hidden md:table-cell px-2 py-3 text-xs font-semibold text-left text-gray-700 uppercase">
                  Phone
                </th>

                <th className="px-2 py-3 text-xs font-semibold text-left text-gray-700 uppercase">
                  KYC Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 md:px-8 md:py-12 text-center text-gray-500 text-sm md:text-base">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="px-4 py-8 md:px-8 md:py-12 flex flex-col items-center justify-center text-center text-gray-500">
                      <User size={32} className="md:w-10 md:h-10 mb-4 opacity-60" />
                      <div className="text-base md:text-lg font-semibold mb-2">
                        No users found
                      </div>
                      <div className="text-sm md:text-base">
                        Try adjusting search or filter criteria
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.boxShadow = "inset 4px 0 0 #3b82f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <td className="px-2 py-3 text-xs font-medium text-gray-900">
                      {u.id}
                    </td>

                    <td className="px-2 py-3 text-xs font-medium text-gray-900">
                      {u.name}
                    </td>

                    <td className="hidden sm:table-cell px-2 py-3 text-xs text-gray-900">
                      {u.email}
                    </td>

                    <td className="hidden md:table-cell px-2 py-3 text-xs text-gray-900">
                      {u.phone || "-"}
                    </td>

                    <td className="px-2 py-3 text-xs text-gray-900">
                      <KycBadge status={u.kycStatus} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

          {/* MOBILE CARD VIEW */}
    <div className="sm:hidden space-y-4 mt-4">
      {users.map((u) => (
        <div
          key={u.id}
          className="bg-white rounded-xl p-4 shadow border"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold text-gray-800">
              {u.name}
            </div>
            <KycBadge status={u.kycStatus} />
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>ID:</strong> {u.id}</div>
            <div><strong>Email:</strong> {u.email}</div>
            <div><strong>Phone:</strong> {u.phone || "-"}</div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};



export default AdminUsers;

/* ---------------- COMPONENTS ---------------- */

const KycBadge = ({ status }) => {
  const colors = {
    APPROVED: "#22c55e",
    PENDING: "#f59e0b",
    REJECTED: "#ef4444",
  };

  return (
    <span
      className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold text-white inline-block text-center min-w-16 md:min-w-20"
      style={{
        background: colors[status] || "#6b7280",
      }}
    >
      {status}
    </span>
  );
};