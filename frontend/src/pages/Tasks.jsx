import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiCheckSquare, FiEye } from "react-icons/fi";
import Swal from "sweetalert2";

import TaskModal from "../components/tasks/TaskModal";
import Loader from "../components/common/Loader";
import { getTasksAPI, createTaskAPI, updateTaskAPI, deleteTaskAPI, getUsersAPI, getProjectsAPI, updateTaskStatusAPI } from "../services/allAPI";

const Tasks = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    const fetchDropdownData = async () => {
      if (!token) return;
      try {
        const reqHeader = { Authorization: `Bearer ${token}` };
        const [usersRes, projectsRes] = await Promise.all([
          getUsersAPI(reqHeader),
          getProjectsAPI({ limit: 100 }, reqHeader)
        ]);
        if (usersRes.data.success) setUsers(usersRes.data.data);
        if (projectsRes.data.success) setProjects(projectsRes.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDropdownData();
  }, [token]);

  const fetchTasks = useCallback(async (page = 1) => {
    if (!token) return;
    try {
      setIsLoading(true);
      const reqHeader = { Authorization: `Bearer ${token}` };

      const params = { page, sortBy, order };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (userFilter) params.assignedTo = userFilter;

      const response = await getTasksAPI(params, reqHeader);

      if (response.data.success) {
        setTasks(response.data.data || []);
        setPagination(response.data.pagination || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token, search, statusFilter, priorityFilter, userFilter, sortBy, order]);

  useEffect(() => {
    fetchTasks(currentPage);
  }, [fetchTasks, currentPage]);

  const handleSubmit = async (formData) => {
    try {
      setIsSaving(true);
      const reqHeader = { Authorization: `Bearer ${token}` };
      let response;

      if (selectedTask) {
        response = await updateTaskAPI(selectedTask._id, formData, reqHeader);
      } else {
        response = await createTaskAPI(formData, reqHeader);
      }

      if (response.data.success) {
        setShowModal(false);
        setSelectedTask(null);
        setSelectedProjectId("");
        Swal.fire({ icon: "success", title: "Success", text: "Task saved successfully", timer: 1500, showConfirmButton: false });

        if (!selectedTask) {
          setCurrentPage(1);
          if (currentPage === 1) fetchTasks(1);
        } else {
          fetchTasks(currentPage);
        }
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Failed to save task" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Delete Task?", text: "This task will be deleted permanently!", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (!result.isConfirmed) return;

    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await deleteTaskAPI(id, reqHeader);
      if (response.data.success) {
        const nextPage = (tasks.length === 1 && currentPage > 1) ? currentPage - 1 : currentPage;
        setCurrentPage(nextPage);
        fetchTasks(nextPage);
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to delete task" });
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      await updateTaskStatusAPI(taskId, newStatus, reqHeader);
      fetchTasks(currentPage);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to update status" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">All Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">Manage tasks across all projects</p>
        </div>
        <button
          onClick={() => { setSelectedTask(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
        >
          <FiPlus /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-5">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl border border-border py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Statuses</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
          className="rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select
          value={userFilter}
          onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }}
          className="rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Assigned Users</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
        <select
          value={`${sortBy}-${order}`}
          onChange={(e) => {
            const [field, sortOrder] = e.target.value.split("-");
            setSortBy(field);
            setOrder(sortOrder);
            setCurrentPage(1);
          }}
          className="rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="createdAt-desc">Newest First (Created)</option>
          <option value="createdAt-asc">Oldest First (Created)</option>
          <option value="dueDate-asc">Due Date (Earliest)</option>
          <option value="dueDate-desc">Due Date (Latest)</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {isLoading ? (
          <Loader text="Loading tasks..." />
        ) : tasks.length === 0 ? (
          <div className="py-16 text-center">
            <FiCheckSquare className="mx-auto mb-3 text-4xl text-slate-300" />
            <h3 className="font-semibold text-slate-700">No tasks found</h3>
            <p className="text-xs text-slate-500 mt-1">Try changing your search or filter parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-slate-50 border-b border-border">
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">Task</th>
                  <th className="px-5 py-4">Project</th>
                  <th className="px-5 py-4">Assigned To</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">{task.title}</div>
                      <p className="mt-0.5 text-xs text-slate-500">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 font-medium">{task.project?.name || "N/A"}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {task.assignedTo ? task.assignedTo.name : <span className="text-slate-400">Unassigned</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${task.priority === "High" ? "bg-red-100 text-red-700" :
                        task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>{task.priority}</span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none ${task.status === "Completed" ? "bg-green-100 text-green-700 border-green-200" :
                          task.status === "In Progress" ? "bg-blue-100 text-blue-700 border-blue-200" :
                            task.status === "Review" ? "bg-purple-100 text-purple-700 border-purple-200" :
                              "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                      >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => navigate(`/tasks/${task._id}`)} title="View Details" className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition"><FiEye size={17} /></button>
                        <button onClick={() => { setSelectedTask(task); setSelectedProjectId(task.project?._id); setShowModal(true); }} title="Edit Task" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><FiEdit2 size={17} /></button>
                        <button onClick={() => handleDelete(task._id)} title="Delete Task" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><FiTrash2 size={17} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isLoading && tasks.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-slate-500">Page {currentPage} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <button disabled={!pagination.hasPrevPage} onClick={() => setCurrentPage(p => p - 1)} className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 transition">Prev</button>
            <button disabled={!pagination.hasNextPage} onClick={() => setCurrentPage(p => p + 1)} className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 transition">Next</button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            {!selectedTask && !selectedProjectId ? (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800">Select Project</h2>
                <p className="text-xs text-slate-500">Choose a project to create a task under it.</p>
                <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className="w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-primary">
                  <option value="">-- Choose Project --</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setShowModal(false)} className="rounded-xl border border-border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                </div>
              </div>
            ) : (
              <TaskModal task={selectedTask} projectId={selectedProjectId} onClose={() => { setShowModal(false); setSelectedTask(null); }} onSubmit={handleSubmit} loading={isSaving} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;