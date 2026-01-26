import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getBudgets } from "@/services/api";

const BudgetSummary = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await getBudgets(month, year);
      setBudgets(res.data);
    } catch (err) {
      console.error("Failed to load budget summary", err);
    } finally {
      setLoading(false);
    }
  };

  const totalLimit = budgets.reduce(
    (sum, b) => sum + Number(b.limit_amount || 0),
    0
  );

  const totalSpent = budgets.reduce(
    (sum, b) => sum + Number(b.spent_amount || 0),
    0
  );

  const remaining = totalLimit - totalSpent;

  if (loading) {
    return <div className="p-4 sm:p-6">Loading summary...</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Budget Summary</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Overview for {month}/{year}
          </p>
        </div>
      </div>

      {/* TOTAL SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <SummaryCard title="Total Budget" value={`₹${totalLimit}`} />
        <SummaryCard title="Total Spent" value={`₹${totalSpent}`} />
        <SummaryCard title="Remaining" value={`₹${remaining}`} />
      </div>

      {/* CATEGORY BREAKDOWN */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          Category-wise Breakdown
        </h2>

        {budgets.length === 0 ? (
          <p className="text-gray-500 text-xs sm:text-sm">
            No budgets found for this month.
          </p>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {budgets.map((b) => {
              const percent =
                b.limit_amount > 0
                  ? Math.min(
                      (b.spent_amount / b.limit_amount) * 100,
                      100
                    )
                  : 0;

              return (
                <div key={b.id} className="border rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <div>
                      <p className="text-sm sm:text-base font-medium">{b.category}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        ₹{b.spent_amount} / ₹{b.limit_amount}
                      </p>
                    </div>

                    <span
                      className={`text-xs sm:text-sm font-medium self-start sm:self-auto ${
                        percent >= 100
                          ? "text-red-600"
                          : percent >= 80
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {percent.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value }) => (
  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
    <p className="text-xs sm:text-sm text-gray-500">{title}</p>
    <p className="text-lg sm:text-xl font-semibold">{value}</p>
  </div>
);

export default BudgetSummary;
