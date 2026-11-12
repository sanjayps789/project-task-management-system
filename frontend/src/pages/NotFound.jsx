import { Link } from "react-router-dom";
import { FiAlertTriangle, FiHome } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <FiAlertTriangle size={32} />
        </div>

        <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
        <h2 className="mt-2 text-xl font-bold text-gray-700">Page Not Found</h2>

        <p className="mt-2 text-sm text-gray-500">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-blue-700"
          >
            <FiHome size={16} /> Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;