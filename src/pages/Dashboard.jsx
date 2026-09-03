import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">

     <div className="dashboard-header">
        <h2>AccountHub</h2>
        <div className="header-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/settings">Settings</Link>
        </div>
        <button onClick={logout}>Logout</button>
     </div>

     <div className="dashboard-body">
      <div className="dashboard-content">
        <h3>Welcome back, {user?.name}</h3>
        <p>Here's an overview of your account.</p>
      </div>

      <div className="dashboard-info">
      <div className="info-item">
            <h4>Email</h4>
            <p>{user?.email}</p>
      </div>
      <div className="info-item">
            <h4>Member Since</h4>
            <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="info-item">
            <h4>Account Status</h4>
            <p>{user?.isActive ? "Active" : "Inactive"}</p>
      </div>
     </div>

     <div className="dashboard-end">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
            <Link to="/settings">Edit Profile</Link>
            <Link to="/settings">Change Password</Link>
        </div>
     </div>
     </div>
    </div>
  );
};

export default Dashboard;