import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiFolder,
  FiEye,
} from "react-icons/fi";
import Swal from "sweetalert2";

import ProjectModal from "../components/projects/ProjectModal";
import Loader from "../components/common/Loader";

import {
  getProjectsAPI,
  createProjectAPI,
  updateProjectAPI,
  deleteProjectAPI,
} from "../services/allAPI";

const Projects = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

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
  
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = useCallback(async (page = 1) => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError("");

      const reqHeader = {
        Authorization: `Bearer ${token}`,
      };

      const params = {
        page,
        limit: 10,
        sortBy,
        order,
      };

      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const response = await getProjectsAPI(params, reqHeader);

      if (response.data.success) {
        setProjects(response.data.data || []);
        setPagination(response.data.pagination || {});
      } else {
        setError(response.data.message || "Failed to fetch projects");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong while fetching projects"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, search, statusFilter, priorityFilter, sortBy, order]);

  useEffect(() => {
    fetchProjects(currentPage);
  }, [fetchProjects, currentPage]);

  const handleAdd = () => {
    setSelectedProject(null);
    setShowModal(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSaving(true);
      const reqHeader = { Authorization: `Bearer ${token}` };
      let response;

      if (selectedProject) {
        response = await updateProjectAPI(selectedProject._id, formData, reqHeader);
      } else {
        response = await createProjectAPI(formData, reqHeader);
      }

      if (response.data.success) {
        setShowModal(false);
        setSelectedProject(null);

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message || "Project saved successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        if (!selectedProject) {
          setCurrentPage(1);
          if (currentPage === 1) await fetchProjects(1);
        } else {
          await fetchProjects(currentPage);
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to save project",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This project will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await deleteProjectAPI(id, reqHeader);

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: response.data.message || "Project deleted successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        const isLastItemOnPage = projects.length === 1 && currentPage > 1;
        const nextPage = isLastItemOnPage ? currentPage - 1 : currentPage;

        setCurrentPage(nextPage);
        await fetchProjects(nextPage);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to delete project",
      });
    }
  };

  const handleView = (project) => {
    navigate(`/projects/${project._id}`);
  };

  const totalPages = pagination.totalPages || 1;
  const totalProjects = pagination.total || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and track all your projects</p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
        >
          <FiPlus /> Add Project
        </button>
      </div>

      {/* Search, Filters and Sorting */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-4">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-border py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Status</option>
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
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

      {/* Projects Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {isLoading ? (
          <Loader text="Loading projects..." />
        ) : error ? (
          <div className="py-16 text-center text-red-500">
            <p className="font-medium">{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center">
            <FiFolder className="mx-auto mb-3 text-4xl text-slate-300" />
            <h3 className="font-semibold text-slate-700">No projects found</h3>
            <p className="text-xs text-slate-500 mt-1">Try changing your search or filter parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50 border-b border-border">
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">Project</th>
                  <th className="px-5 py-4">Start Date</th>
                  <th className="px-5 py-4">Due Date</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Tasks</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">{project.name}</div>
                      <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500">
                        {project.description || "No description"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        project.priority === "High" ? "bg-red-100 text-red-700" :
                        project.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {project.priority}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        project.status === "Completed" ? "bg-green-100 text-green-700" :
                        project.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                        project.status === "On Hold" ? "bg-red-100 text-red-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {project.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 font-medium">
                      {project.taskStats?.completed || 0}/{project.taskStats?.total || 0}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleView(project)} title="View Project" className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition">
                          <FiEye size={17} />
                        </button>
                        <button onClick={() => handleEdit(project)} title="Edit Project" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <FiEdit2 size={17} />
                        </button>
                        <button onClick={() => handleDelete(project._id)} title="Delete Project" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                          <FiTrash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isLoading && totalProjects > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row pt-2">
          <p className="text-sm text-slate-500">
            Showing Page {currentPage} of {totalPages} ({totalProjects} total projects)
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 transition"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 rounded-xl text-sm font-medium transition ${
                  currentPage === page ? "bg-primary text-white shadow-sm" : "border border-border bg-card text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <ProjectModal
          project={selectedProject}
          onClose={() => {
            setShowModal(false);
            setSelectedProject(null);
          }}
          onSubmit={handleSubmit}
          loading={isSaving}
        />
      )}
    </div>
  );
};

export default Projects;