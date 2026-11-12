import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const RecentTasks = ({ tasks = [] }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
      case "Todo":
        return "bg-orange-100 text-orange-700";
      case "Review":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Recent Tasks
        </h2>

        <div>
          <Link 
            to="/tasks" 
            className="group flex items-center justify-start gap-2 rounded-md bg-primary px-4 py-2 !text-[#fff] hover:bg-primary/80 text-sm font-medium"
          >
            View All 
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <FaArrowRight />
            </span>
          </Link>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="py-10 text-center text-slate-500">
          No recent tasks found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-3 font-semibold">Task</th>
                <th className="py-3 font-semibold">Project</th>
                <th className="py-3 font-semibold">Priority</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold">Due Date</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task._id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-4 font-medium text-slate-700">
                    {task.title}
                  </td>

                  <td className="py-4 text-slate-600">
                    {task.project?.name || "N/A"}
                  </td>

                  <td className="py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyle(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>

                  <td className="py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(task.status)}`}>
                      {task.status}
                    </span>
                  </td>

                  <td className="py-4 text-xs font-medium text-slate-500">
                    {formatDate(task.dueDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentTasks;