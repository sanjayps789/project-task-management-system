import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const initialForm = {
  name: "",
  description: "",
  startDate: "",
  dueDate: "",
  priority: "Medium",
  status: "Planning",
};

function ProjectModal({ project, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        startDate: project.startDate?.slice(0, 10) || "",
        dueDate: project.dueDate?.slice(0, 10) || "",
        priority: project.priority || "Medium",
        status: project.status || "Planning",
      });
    } else {
      setFormData(initialForm);
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      if (name === "startDate" && updated.dueDate && value > updated.dueDate) {
        updated.dueDate = value;
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-xl rounded-2xl bg-card border border-border shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {project ? "Edit Project" : "Add Project"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {project
                ? "Update your project details."
                : "Enter the details to create a new project."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Project Name *
            </label>
            <input
              type="text"
              name="name"
              required
              minLength={2}
              maxLength={100}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              maxLength={1000}
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              className="w-full resize-none rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                required
                min={formData.startDate || undefined}
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : project
                  ? "Update Project"
                  : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;