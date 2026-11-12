import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiArrowLeft, FiEdit2, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

import TaskModal from "../components/tasks/TaskModal";
import Loader from "../components/common/Loader";
import { 
  getProjectAPI, 
  getTasksAPI, 
  createTaskAPI, 
  updateTaskAPI, 
  deleteTaskAPI,
  updateTaskStatusAPI 
} from "../services/allAPI";

const ProjectDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  // Task Pagination State
  const [taskPage, setTaskPage] = useState(1);
  const [taskPagination, setTaskPagination] = useState({
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchProjectDetails = useCallback(async () => {
    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await getProjectAPI(id, reqHeader);
      if (response.data.success) {
        setProject(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch project details", err);
    }
  }, [id, token]);

  const fetchProjectTasks = useCallback(async (page = 1) => {
    try {
      setIsTasksLoading(true);
      const reqHeader = { Authorization: `Bearer ${token}` };
      
      const response = await getTasksAPI({ project: id, page }, reqHeader); 
      
      if (response.data.success) {
        setTasks(response.data.data || []);
        setTaskPagination(response.data.pagination || {});
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setIsTasksLoading(false);
      setIsLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (token && id) {
      fetchProjectDetails();
      fetchProjectTasks(taskPage);
    }
  }, [fetchProjectDetails, fetchProjectTasks, token, id, taskPage]);

  const handleTaskSubmit = async (formData) => {
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
        setShowTaskModal(false);
        setSelectedTask(null);
        
        fetchProjectDetails();
        
        if (!selectedTask) {
          setTaskPage(1);
          if (taskPage === 1) fetchProjectTasks(1);
        } else {
          fetchProjectTasks(taskPage);
        }
        
        Swal.fire({ icon: "success", title: "Success", text: "Task saved successfully", timer: 1500, showConfirmButton: false });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Failed to save task" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTaskDelete = async (taskId) => {
    const result = await Swal.fire({ title: "Delete Task?", text: "This task will be deleted permanently!", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (!result.isConfirmed) return;

    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await deleteTaskAPI(taskId, reqHeader);
      if (response.data.success) {
        const isLastItem = tasks.length === 1 && taskPage > 1;
        const nextPage = isLastItem ? taskPage - 1 : taskPage;
        
        setTaskPage(nextPage);
        fetchProjectTasks(nextPage);
        fetchProjectDetails(); 
      }
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      await updateTaskStatusAPI(taskId, newStatus, reqHeader);
      fetchProjectTasks(taskPage);
      fetchProjectDetails();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to update status" });
    }
  };

  if (isLoading) return <Loader text="Loading project details..." />;
  if (!project) return <div className="p-10 text-center text-red-500 font-medium">Project not found</div>;

  const totalTasks = project.taskStats?.total || 0;
  const completedTasks = project.taskStats?.completed || 0;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/projects")} 
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-slate-600 hover:bg-slate-100 transition"
          title="Back to Projects"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
          <p className="text-sm text-slate-500">Project Workspace Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-slate-800">Description</h2>
            <p className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">{project.description || "No description provided."}</p>
          </div>

          {/* TASKS SECTION */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Project Tasks ({taskPagination.total || 0})</h2>
              <button 
                onClick={() => { setSelectedTask(null); setShowTaskModal(true); }}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
              >
                + Add Task
              </button>
            </div>

            {isTasksLoading ? (
              <Loader text="Loading tasks..." />
            ) : tasks.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border bg-slate-50">
                <p className="text-sm text-slate-500">No tasks created yet for this project.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task._id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border bg-slate-50/50 p-4 transition hover:bg-white hover:shadow-sm">
                    <div>
                      <h3 className="font-semibold text-slate-800">{task.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()} | Priority: <span className="font-medium text-slate-700">{task.priority}</span>
                      </p>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-3 sm:mt-0">

                      {/* Status Dropdown */}
                      <select 
                        value={task.status} 
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none ${
                          task.status === "Completed" ? "bg-green-100 text-green-700 border-green-200" :
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

                      <button onClick={() => { setSelectedTask(task); setShowTaskModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit Task">
                        <FiEdit2 size={16}/>
                      </button>
                      <button onClick={() => handleTaskDelete(task._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete Task">
                        <FiTrash2 size={16}/>
                      </button>
                    </div>
                  </div>
                ))}

                {taskPagination.totalPages > 1 && (
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <p className="text-xs text-slate-500">
                      Page {taskPage} of {taskPagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        disabled={!taskPagination.hasPrevPage}
                        onClick={() => setTaskPage((p) => p - 1)}
                        className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        disabled={!taskPagination.hasNextPage}
                        onClick={() => setTaskPage((p) => p + 1)}
                        className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-semibold text-slate-800">Project Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Status</span> <span className="font-medium text-sm text-slate-800">{project.status}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Priority</span> <span className="font-medium text-sm text-slate-800">{project.priority}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Start Date</span> <span className="font-medium text-sm text-slate-800">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Due Date</span> <span className="font-medium text-sm text-slate-800">{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "-"}</span></div>
              
              <div className="pt-4 border-t border-border">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">Task Progress</span>
                  <span className="font-bold text-primary">{progressPercentage}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <p className="mt-2 text-xs text-slate-500 text-right">{completedTasks} of {totalTasks} tasks completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTaskModal && (
        <TaskModal 
          task={selectedTask} 
          projectId={project._id} 
          onClose={() => { setShowTaskModal(false); setSelectedTask(null); }} 
          onSubmit={handleTaskSubmit} 
          loading={isSaving} 
        />
      )}
    </div>
  );
};

export default ProjectDetails;