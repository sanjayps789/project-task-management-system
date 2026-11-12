import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const RecentProjects = ({ projects = [] }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-700";
            case "In Progress":
                return "bg-blue-100 text-blue-700";
            case "Pending":
            case "On Hold":
                return "bg-orange-100 text-orange-700";
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
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><p></p>
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                    Recent Projects
                </h2>

                <div>
                    <Link
                        to="/projects"
                        className="group flex items-center justify-start gap-2 rounded-md bg-primary px-4 py-2 !text-[#fff] hover:bg-primary/80 text-sm font-medium"
                    >
                        View All
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                            <FaArrowRight />
                        </span>
                    </Link>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="py-10 text-center text-slate-500">
                    No recent projects found.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b border-border text-left">
                                <th className="py-3 font-semibold">S.No</th>
                                <th className="py-3 font-semibold">Project</th>
                                <th className="py-3 font-semibold">Status</th>
                                <th className="py-3 font-semibold">Priority</th>
                                <th className="py-3 font-semibold">Created</th>
                            </tr>
                        </thead>

                        <tbody>
                            {projects.map((project, index) => (
                                <tr
                                    key={project._id}
                                    className="border-b border-slate-100 hover:bg-slate-50"
                                >
                                    <td className="py-4 font-medium text-slate-700">
                                        {index + 1}
                                    </td>

                                    <td className="py-4 text-md font-medium text-slate-700">
                                        {project.name}
                                    </td>

                                    <td className="py-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(project.status)}`}>
                                            {project.status}
                                        </span>
                                    </td>

                                    <td className="py-4 text-sm font-medium text-slate-700">
                                        {project.priority}
                                    </td>

                                    <td className="py-4 text-xs font-medium text-slate-500">
                                        {formatDate(project.createdAt)}
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

export default RecentProjects;