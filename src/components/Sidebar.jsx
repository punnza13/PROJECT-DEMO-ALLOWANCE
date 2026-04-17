import { NavLink, useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';
import { 
  LogOut, 
  User, 
  LayoutDashboard, 
  PlusCircle, 
  CheckSquare, 
  Activity, 
  FileText,
  Calendar,
  ClipboardList,
  BarChart,
  Settings
} from 'lucide-react';
import './Sidebar.css';

function Sidebar() {
  const { currentUser, logout } = useWorkflow();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-header">
          <div className="logo-circle"></div>
          <span className="logo-text">LOGO</span>
        </div>

        {currentUser && (
          <div className="profile-card">
            <div className="profile-avatar"></div>
            <span className="profile-name">Name and id</span>
          </div>
        )}

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/tasks" className={({ isActive }) => isActive ? "active" : ""}>
                <div className="icon-circle"><ClipboardList size={16} /></div>
                <span>Tasks</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/calendar" className={({ isActive }) => isActive ? "active" : ""}>
                <div className="icon-circle"><Calendar size={16} /></div>
                <span>Calendar</span>
              </NavLink>
            </li>

            <hr className="sidebar-divider" />

            <li className="nav-item">
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                <div className="icon-circle"><LayoutDashboard size={16} /></div>
                <span>Dashboard</span>
              </NavLink>
            </li>
            
            {(currentUser?.role === 'Coordinator' || currentUser?.role === 'Owner') && (
              <li className="nav-item">
                <NavLink to="/create-request" className={({ isActive }) => isActive ? "active" : ""}>
                  <div className="icon-circle"><PlusCircle size={16} /></div>
                  <span>Create Request</span>
                </NavLink>
              </li>
            )}

            {(currentUser?.role === 'Owner' || currentUser?.role === 'HR') && (
              <li className="nav-item">
                <NavLink to="/approvals" className={({ isActive }) => isActive ? "active" : ""}>
                  <div className="icon-circle"><CheckSquare size={16} /></div>
                  <span>Approvals</span>
                </NavLink>
              </li>
            )}
            
            <li className="nav-item">
              <NavLink to="/activity" className={({ isActive }) => isActive ? "active" : ""}>
                <div className="icon-circle"><Activity size={16} /></div>
                <span>Activity</span>
              </NavLink>
            </li>

            <hr className="sidebar-divider" />

            <li className="nav-item">
              <NavLink to="/reports" className={({ isActive }) => isActive ? "active" : ""}>
                <div className="icon-circle"><BarChart size={16} /></div>
                <span>Reports</span>
              </NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>
                <div className="icon-circle"><Settings size={16} /></div>
                <span>Settings</span>
              </NavLink>
            </li>

            <hr className="sidebar-divider" />

            <li className="nav-item">
              <NavLink to="/google-form" className={({ isActive }) => isActive ? "active" : ""}>
                <div className="icon-circle"><FileText size={16} /></div>
                <span>Google Form</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {currentUser && (
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
