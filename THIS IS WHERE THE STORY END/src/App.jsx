import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WorkflowProvider, useWorkflow } from './context/WorkflowContext';
import './App.css';

import SharedLayout from './components/SharedLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import CreateRequest from './pages/CreateRequest';
import Approvals from './pages/Approvals';
import Evaluation from './pages/Evaluation';
import GoogleForm from './pages/GoogleForm';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Activity from './pages/Activity';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Project from './pages/Project';
import ApprovalDetails from './pages/ApprovalDetails';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useWorkflow();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/evaluation" element={<Evaluation />} /> {/* Public access */}
      
      <Route path="/" element={<ProtectedRoute><SharedLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create-request" element={<CreateRequest />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="activity" element={<Activity />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="google-form" element={<GoogleForm />} />
        <Route path="project/:id" element={<Project />} />
        <Route path="approvals/:id" element={<ApprovalDetails />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <WorkflowProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </WorkflowProvider>
  );
}

export default App;
