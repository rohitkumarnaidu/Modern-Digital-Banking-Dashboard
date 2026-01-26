import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#2563EB", "#DC2626", "#16A34A", "#F59E0B"];

const CategoryBreakdownChart = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!data || data.length === 0) {
    return <p style={{ color: "#64748b" }}>No data available</p>;
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 220 : 240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          outerRadius={isMobile ? 35 : 40}
          label={({ category, amount }) => {
            const percent = ((amount / total) * 100).toFixed(1);
            return `${category} (${percent}%)`;
          }}
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip
          formatter={(value, name) => [`₹ ${value}`, name]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryBreakdownChart;
