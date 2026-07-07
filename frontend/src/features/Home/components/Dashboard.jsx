import { useEffect, useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

// Adjust these imports to match your actual API module.
// getAll()    -> insurances ({ time, total_insurances, insurances: [...] } or [...])
// getLoans()  -> loan/checklist records ([{ loan, has_insurance, ... }, ...])
import { getAllLoan } from "../../Loan/api/BaseAPI";


const COLORS = {
  insured: "#10b981",   // emerald-500
  uninsured: "#f59e0b", // amber-500
};

const StatCard = ({ label, value, accent }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-3xl font-semibold mt-1 ${accent ?? "text-gray-900"}`}>
      {value}
    </p>
  </div>
);

    const Dashboard = () => {
//   const [insurances, setInsurances] = useState([]);
//   const [loans, setLoans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [insuranceRes, loanRes] = await Promise.all([
//           getAllLoan(),
//           getLoans(),
//         ]);

//         // Normalize: handle both wrapped ({ insurances: [...] }) and plain array responses
//         setInsurances(
//           Array.isArray(insuranceRes) ? insuranceRes : insuranceRes.insurances ?? []
//         );
//         setLoans(Array.isArray(loanRes) ? loanRes : loanRes.results ?? []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const stats = useMemo(() => {
//     const totalLoans = loans.length;
//     const totalInsurances = insurances.length;
//     const insuredLoans = loans.filter((l) => l.has_insurance).length;
//     const uninsuredLoans = totalLoans - insuredLoans;
//     return { totalLoans, totalInsurances, insuredLoans, uninsuredLoans };
//   }, [loans, insurances]);

    const pieData = useMemo(
      () => [
        { name: "Insured", value: 45 },
        { name: "Uninsured", value: 43 },
      ],
      []
    );

//   const insuranceTypeData = useMemo(() => {
//     const counts = {};
//     insurances.forEach((ins) => {
//       const type = ins.insurance_type ?? "Unspecified";
//       counts[type] = (counts[type] || 0) + 1;
//     });
//     return Object.entries(counts).map(([type, count]) => ({ type, count }));
//   }, [insurances]);

//   if (loading) return <div className="p-6">Loading dashboard...</div>;
//   if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Loans" value={15} />
        <StatCard label="Total Insurances" value={23} />
        <StatCard
          label="Insured Loans"
          value={23}
          accent="text-emerald-600"
        />
        <StatCard
          label="Uninsured Loans"
          value={45}
          accent="text-amber-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-medium text-gray-600 mb-4">
            Insurance Coverage
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                <Cell fill={COLORS.insured} />
                <Cell fill={COLORS.uninsured} />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/*<div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-medium text-gray-600 mb-4">
            Insurance Types
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={insuranceTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>*/}
      </div>
    </div>
  );
};

export default Dashboard;
