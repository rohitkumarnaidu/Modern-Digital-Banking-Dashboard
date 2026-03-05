/**
 * Transactions history page
 *
 * Part of:
 * - Dashboard
 * - Route: /dashboard/transactions
 *
 * Connected Files:
 * - Uses: services/api.js (transactions)
 *
 * Purpose:
 * Displays list of past transactions
 * including credits, debits, and transfers.
 */

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

import { API_ENDPOINTS } from "@/constants";
import useResponsive from "@/hooks/useResponsive";
import api from "@/services/api";
import AddTransactionModal from "@/components/user/transactions/AddTransactionalModal";
import TransactionFilter from "@/components/user/transactions/TransactionFilter";
import TransactionRow from "@/components/user/transactions/TransactionRow";
import TransactionSearch from "@/components/user/transactions/TransactionSearch";

const isSearchMatch = (transaction, search) => {
  if (!search) return true;
  return transaction.description?.toLowerCase().includes(search.toLowerCase());
};

const isAccountFilterMatch = (transaction, accountId) => {
  if (!accountId) return true;
  return transaction.account_id === Number(accountId);
};

const isTypeFilterMatch = (transaction, txnType) => {
  if (!txnType) return true;
  return transaction.txn_type === txnType;
};

const isFromDateMatch = (transaction, fromDate) => {
  if (!fromDate) return true;
  return new Date(transaction.txn_date) >= new Date(fromDate);
};

const isToDateMatch = (transaction, toDate) => {
  if (!toDate) return true;
  return new Date(transaction.txn_date) <= new Date(toDate);
};

const filterTransactions = (transactions, search, filters) =>
  transactions.filter((transaction) => {
    if (!isSearchMatch(transaction, search)) return false;
    if (!isAccountFilterMatch(transaction, filters.account_id)) return false;
    if (!isTypeFilterMatch(transaction, filters.txn_type)) return false;
    if (!isFromDateMatch(transaction, filters.from)) return false;
    if (!isToDateMatch(transaction, filters.to)) return false;
    return true;
  });

const downloadBlobAsCsv = (blobData, filename) => {
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const Transactions = () => {
  const { isMobile, isTablet } = useResponsive();
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    account_id: "",
    txn_type: "",
    from: "",
    to: "",
  });

  const fetchAccounts = async () => {
    const res = await api.get(API_ENDPOINTS.ACCOUNTS);
    setAccounts(res.data);
  };

  const fetchTransactions = async () => {
    const res = await api.get(API_ENDPOINTS.TRANSACTIONS);
    setTransactions(res.data);
  };

  const handleExport = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.TRANSACTIONS_EXPORT, { responseType: "blob" });
      downloadBlobAsCsv(res.data, "transactions.csv");
    } catch (err) {
      alert("Failed to export transactions");
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(API_ENDPOINTS.TRANSACTIONS_IMPORT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchTransactions();
      alert("Transactions imported successfully");
    } catch (err) {
      alert("Failed to import transactions");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchAccounts(), fetchTransactions()]);
      } catch (err) {
        console.error("Transaction load error:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
        } else {
          alert("Failed to load transactions");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredTransactions = filterTransactions(transactions, search, filters);

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div style={{ padding: isMobile ? "16px" : isTablet ? "18px" : "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "16px" : "0",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: isMobile ? "20px" : isTablet ? "22px" : "24px",
              fontWeight: "600",
              marginBottom: isMobile ? "8px" : "0",
            }}
          >
            Transactions
          </h1>
          <p
            style={{
              color: "#64748b",
              marginBottom: isMobile ? "0" : "20px",
              fontSize: isMobile ? "13px" : "14px",
            }}
          >
            View and manage your transaction history
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              border: "1px solid #2563eb",
              padding: "9px 16px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "500",
              background: "#ffffff",
              color: "#2563eb",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              cursor: "pointer",
            }}
          >
            + Add Transaction
          </button>

          <button
            onClick={handleExport}
            style={{
              background: "linear-gradient(135deg, #2563eb, #1e40af)",
              color: "#fff",
              padding: "9px 16px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 8px 18px rgba(37,99,235,0.35)",
            }}
          >
            Export
          </button>
        </div>
      </div>

      <TransactionSearch value={search} onChange={setSearch} />

      <TransactionFilter accounts={accounts} filters={filters} onChange={setFilters} />

      {filteredTransactions.length === 0 && (
        <p style={{ marginTop: "20px", color: "#64748b" }}>No transactions found</p>
      )}

      {filteredTransactions.map((tx) => (
        <TransactionRow key={tx.id} txn={tx} />
      ))}

      {showAddModal &&
        createPortal(
          <AddTransactionModal
            onClose={() => setShowAddModal(false)}
            onAdd={(txn) => {
              setTransactions((prev) => [txn, ...prev]);
            }}
          />,
          document.getElementById("modal-root")
        )}
    </div>
  );
};

export default Transactions;
