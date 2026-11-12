import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { loginAPI, registerAPI } from "../services/allAPI";
import { setUser } from "../redux/slices/authSlice";

const Auth = ({ isRegister }) => {
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerAPI(inputData);

        if (res.status === 200 || res.status === 201) {
          toast.success("Registration successful!");
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 1500);
        }
      } else {
        const res = await loginAPI({
          email: inputData.email,
          password: inputData.password,
        });

        if (res.status === 200) {
          const { user, token } = res.data.data;

          dispatch(
            setUser({
              user: {
                name: user.name,
                email: user.email,
              },
              token,
            })
          );

          toast.success("Login successful!");
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1500);

          setInputData({
            name: "",
            email: "",
            password: "",
          });
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all duration-300";

  const labelClass =
    "mb-1 block text-sm font-medium text-slate-700";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-primary">
          {isRegister ? "Create Account" : "Login"}
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          {isRegister ? "Sign up to start managing projects" : "Welcome back! Please enter your details"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className={labelClass}>Name</label>
              <input
                name="name"
                required
                value={inputData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={inputClass}
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              name="email"
              required
              value={inputData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass}
              disabled={loading}
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="name" 
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={6}
                value={inputData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`${inputClass} pr-12`}
                disabled={loading}
              />
              
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-2/3 -translate-y-1/2 text-slate-800 hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Register"
                : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <Link
            to={isRegister ? "/login" : "/register"}
            className="font-medium text-primary transition hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;