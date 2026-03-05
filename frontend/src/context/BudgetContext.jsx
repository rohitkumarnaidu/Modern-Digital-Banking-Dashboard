import { createContext, useContext, useState } from "react";

const BudgetContext = createContext();

const INITIAL_BUDGETS = [
  {
    id: 1,
    category: "Food",
    limit_amount: 10000,
    spent_amount: 9500,
  },
];

const findBudgetByCategory = (budgets, category) =>
  budgets.find((budget) => budget.category === category);

const getRemainingBudget = (budget) => budget.limit_amount - budget.spent_amount;

const isNearBudgetThreshold = (budget, amount) =>
  getRemainingBudget(budget) - amount <= budget.limit_amount * 0.2;

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState(INITIAL_BUDGETS);

  const applyPaymentToBudget = (category, amount) => {
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.category === category
          ? { ...budget, spent_amount: budget.spent_amount + amount }
          : budget
      )
    );
  };

  const checkBudget = (category, amount) => {
    const budget = findBudgetByCategory(budgets, category);
    if (!budget) return { status: "no-budget" };

    const remaining = getRemainingBudget(budget);
    if (amount > remaining) {
      return {
        status: "exceeded",
        exceededBy: amount - remaining,
        budget,
      };
    }

    if (isNearBudgetThreshold(budget, amount)) {
      return { status: "near", budget };
    }

    return { status: "ok", budget };
  };

  return (
    <BudgetContext.Provider value={{ budgets, checkBudget, applyPaymentToBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => useContext(BudgetContext);
