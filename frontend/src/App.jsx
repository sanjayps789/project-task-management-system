import {  Route, Routes } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import Auth from "./pages/Auth";
import { ProtectedRoute, PublicRoute } from "./routes/ProtectedRoute";
import TaskDetails from "./pages/TaskDetails";
import NotFound from "./pages/NotFound";




function App() {
  return (

      <Routes>
        {/* Public */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth isRegister />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound/>} />
      </Routes>
  );
}

export default App;