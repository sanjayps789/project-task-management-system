import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useSelector } from "react-redux";

const Navbar = ({ setIsSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      {/* Left */}
      <div>
        <h1 className="text-xl font-semibold text-slate-800">
          Welcome <span className="text-blue-600">{user?.name || "User"} !!!</span>
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="hidden cursor-pointer items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-slate-100 md:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-800">
              {user?.name}
            </h4>

            <p className="text-xs text-slate-500">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-lg p-2 transition hover:bg-slate-100 md:hidden"
          aria-label="Open Sidebar"
        >
          <HiOutlineMenuAlt2 size={24} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;