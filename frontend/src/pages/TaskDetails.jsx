import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiArrowLeft, FiClock, FiFlag, FiUser, FiFolder, FiActivity } from "react-icons/fi";

import Loader from "../components/common/Loader";
import { getTaskAPI } from "../services/allAPI";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTask = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await getTaskAPI(id, reqHeader);

      if (response.data.success) {
        setTask(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch task");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Task not found");
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (token && id) fetchTask();
  }, [fetchTask, token, id]);

  if (isLoading) return <Loader text="Loading task details..." />;
  
  if (error || !task) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <p className="text-red-500 font-medium mb-4">{error || "Task not found"}</p>
      <button 
        onClick={() => navigate("/tasks")} 
        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
      >
        Back to Tasks
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/tasks")} 
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-slate-600 hover:bg-slate-100 transition"
          title="Back to Tasks"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Task Details</h1>
          <p className="text-sm text-slate-500">View complete information about this task</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4">{task.title}</h2>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Description</h3>
              <div className="rounded-xl bg-slate-50 border border-border p-4 text-sm text-slate-600 whitespace-pre-wrap min-h-[120px] leading-relaxed">
                {task.description || "No description provided for this task."}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-semibold text-slate-800">Properties</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm"><FiFolder /> Project</div>
                <Link to={`/projects/${task.project?._id}`} className="text-sm font-medium text-primary hover:underline">
                  {task.project?.name || "Unknown Project"}
                </Link>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm"><FiActivity /> Status</div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  task.status === "Completed" ? "bg-green-100 text-green-700" :
                  task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                  task.status === "Review" ? "bg-purple-100 text-purple-700" :
                  "bg-slate-100 text-slate-700"
                }`}>{task.status}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm"><FiFlag /> Priority</div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  task.priority === "High" ? "bg-red-100 text-red-700" :
                  task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                  "bg-green-100 text-green-700"
                }`}>{task.priority}</span>
              </div>

              {/* Assigned To */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm"><FiUser /> Assigned To</div>
                <span className="text-sm font-medium text-slate-800">
                  {task.assignedTo ? task.assignedTo.name : "Unassigned"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm"><FiClock /> Due Date</div>
                <span className="text-sm font-bold text-slate-800">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;