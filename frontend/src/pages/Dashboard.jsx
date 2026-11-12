import { useEffect, useState, useCallback } from "react";
import {
  FaFolder,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import { useSelector } from "react-redux";

import StatusCard from "../components/dashboard/StatusCard";
import RecentProjects from "../components/dashboard/RecentProjects";
import RecentTasks from "../components/dashboard/RecentTasks";
import Loader from "../components/common/Loader"; // Reusable loader imported
import { getDashboardAPI } from "../services/allAPI";

const cardConfig = [
  {
    key: "totalProjects",
    title: "Total Projects",
    icon: FaFolder,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    key: "totalTasks",
    title: "Total Tasks",
    icon: FaTasks,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    key: "completedTasks",
    title: "Completed Tasks",
    icon: FaCheckCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    key: "inProgressTasks",
    title: "In Progress Tasks",
    icon: FaSpinner,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    key: "pendingTasks",
    title: "Pending Tasks",
    icon: FaClock,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { token } = useSelector((state) => state.auth);

  const fetchDashboard = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      const reqHeader = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const res = await getDashboardAPI(reqHeader);

      if (res.data.success) {
        setDashboardData(res.data.data);
      } else {
        setError(res.data.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(
        err.response?.data?.message ||
        "Something went wrong while fetching dashboard data"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <Loader text="Loading dashboard overview..." />;
  }

  if (error) {
    return (
      <div className="py-16 text-center text-red-500">
        <p className="font-medium">{error}</p>
        <button 
          onClick={fetchDashboard}
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm text-white hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          Welcome back! Here's an overview of your workspace.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {cardConfig.map((card) => (
          <StatusCard
            key={card.key}
            title={card.title}
            value={dashboardData?.stats?.[card.key] ?? 0}
            icon={card.icon}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
          />
        ))}
      </div>

      <RecentProjects projects={dashboardData?.recentProjects || []} />

      <RecentTasks tasks={dashboardData?.recentTasks || []} />
    </div>
  );
};

export default Dashboard;