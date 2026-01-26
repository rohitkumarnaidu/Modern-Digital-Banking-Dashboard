import { getBudgets, createBudget, updateBudget, deleteBudget } from "../../services/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ ADDED
import BudgetCard from "@/components/user/budgets/BudgetCard";
import AddBudgetModal from "@/components/user/budgets/AddBudgetModal";
import EditBudgetModal from "@/components/user/budgets/EditBudgetModal";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [editingBudget, setEditingBudget] = useState(null);

  const showFilters = budgets.length >= 3;
  const showRowOptions = budgets.length >= 8;
  const [month] = useState(new Date().getMonth() + 1);
  const [year] = useState(new Date().getFullYear());

  const fetchBudgets = async () => {
    try {
      const res = await getBudgets(month, year);
      setBudgets(res.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  // ✅ RECEIVE NEW BUDGET FROM MODAL
  const handleAddBudget = async () => {
    await fetchBudgets();
  };

  // ✅ SUMMARY CALCULATIONS
  const totalBudget = budgets.reduce(
    (sum, b) => sum + (b.limit_amount || 0),
    0
  );

  const totalSpent = budgets.reduce(
    (sum, b) => sum + (b.spent_amount || 0),
    0
  );

  const remainingBudget = totalBudget - totalSpent;

  const handleRemoveBudget = (budget) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove the "${budget.category}" budget?`
    );
    if (!confirmDelete) return;

    setBudgets((prev) => prev.filter((b) => b.id !== budget.id));
  };

  const handleUpdateBudget = (updatedBudget) => {
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === updatedBudget.id ? updatedBudget : b
      )
    );
  };

  return (
    <div className="p-4 sm:p-6 pt-6 sm:pt-10 space-y-4 sm:space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Monthly Budgets</h1>
          <p className="text-sm text-gray-500">
            Track your category-wise monthly spending
          </p>
        </div>

        {/* ✅ ADDED SUMMARY BUTTON (NO EXISTING CODE CHANGED) */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Link
            to="/dashboard/budgets/summary"
            className="border border-blue-600 text-blue-600
                       px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium
                       hover:bg-blue-50 text-center text-sm sm:text-base"
          >
            View Summary
          </Link>

          <AddBudgetModal onSave={handleAddBudget} />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <SummaryCard
          title="Total Budget"
          value={`₹${Number(totalBudget).toLocaleString("en-IN")}`}
        />
        <SummaryCard
          title="Spent"
          value={`₹${Number(totalSpent).toLocaleString("en-IN")}`}
        />
        <SummaryCard
          title="Remaining"
          value={`₹${Number(remainingBudget).toLocaleString("en-IN")}`}
        />
      </div>

      {/* SEARCH & FILTER */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 w-full sm:w-64 text-sm sm:text-base"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-md px-3 py-2 w-full sm:w-48 text-sm sm:text-base"
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>
      )}

      {/* ROW OPTIONS */}
      {showRowOptions && (
        <div className="flex justify-end">
          <select className="border rounded-md px-2 py-1 text-sm">
            <option>5 per page</option>
            <option>10 per page</option>
            <option>20 per page</option>
          </select>
        </div>
      )}

      {/* BUDGET LIST */}
      {budgets.length === 0 ? (
        <div className="bg-white rounded-xl p-6 sm:p-10 text-center border border-dashed">
          <h3 className="text-base sm:text-lg font-medium mb-2">
            No budgets created yet
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4">
            Start by creating a monthly budget for your spending categories.
          </p>

          <div className="flex justify-center mt-4">
            <AddBudgetModal onSave={handleAddBudget} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-4">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onEdit={() => setEditingBudget(b)}  
              onRemove={handleRemoveBudget}
            />
          ))}
        </div>
      )}

      {/* ✅ EDIT MODAL (FIXED LOCATION) */}
      <EditBudgetModal
        open={!!editingBudget}
        budget={editingBudget}
        onClose={() => setEditingBudget(null)}
        onSave={handleUpdateBudget}
      />
    </div>
  );
};

const SummaryCard = ({ title, value }) => (
  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-lg sm:text-xl font-semibold">{value}</p>
  </div>
);

export default Budgets;
