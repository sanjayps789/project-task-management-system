import { NavLink, useNavigate } from "react-router-dom";
import {
    MdDashboard,
    MdFolder,
    MdTask,
    MdLogout,
    MdClose,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useState } from "react";

const menus = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: MdDashboard,
    },
    {
        title: "Projects",
        path: "/projects",
        icon: MdFolder,
    },
    {
        title: "Tasks",
        path: "/tasks",
        icon: MdTask,
    },
];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const [isLogout, setIsLogout] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleNavigate = () => {
        setIsSidebarOpen(false);
    };

    const handleLogout = () => {
        setIsLogout(true);

        setTimeout(() => {
            setIsLogout(false);

            sessionStorage.removeItem("token");
            sessionStorage.removeItem("persist:root");

            dispatch(logout());

            navigate("/login", { replace: true });
        }, 1000); 
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                onClick={() => setIsSidebarOpen(false)}
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    isSidebarOpen ? "visible opacity-100" : "invisible opacity-0"
                }`}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out lg:static ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-border px-6">
                    <div>
                        <h1 className="text-xl font-bold text-primary">
                            ProManage
                        </h1>

                        <p className="text-xs text-slate-500">
                            Project Management
                        </p>
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
                        aria-label="Close Sidebar"
                    >
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Menu */}
                <div className="flex-1 overflow-y-auto px-3 py-6">
                    <p className="mb-3 px-3 text-xs uppercase tracking-wider text-slate-400">
                        Main Menu
                    </p>

                    <div className="space-y-2">
                        {menus.map((menu) => {
                            const Icon = menu.icon;

                            return (
                                <NavLink
                                    key={menu.path}
                                    to={menu.path}
                                    onClick={handleNavigate}
                                >
                                    {({ isActive }) => (
                                        <div
                                            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                                                isActive
                                                    ? "bg-primary text-white shadow-md"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-primary"
                                            }`}
                                        >
                                            <Icon
                                                size={22}
                                                className={isActive ? "text-white" : "text-slate-600"}
                                            />

                                            <span
                                                className={`font-medium ${
                                                    isActive ? "text-white" : "text-slate-600"
                                                }`}
                                            >
                                                {menu.title}
                                            </span>
                                        </div>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border p-4">
                    <button
                        onClick={handleLogout}
                        disabled={isLogout}
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                    >
                        <MdLogout size={20} />
                        {isLogout ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;