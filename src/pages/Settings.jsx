import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./Settings.css";

const Settings = () => {
  const { user, updateProfile, updatePassword, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileError, setProfileError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileMessage('');
    setProfileLoading(true);

    try {
      await updateProfile(name, email);
      setProfileMessage('Profile updated successfully.');
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    } 
     }

     const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setSuccessMessage('');
    

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    } 
    setPasswordLoading(true);


    try {
      await updatePassword(currentPassword, newPassword);
      setSuccessMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

    return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Settings</h2>
        <div className="header-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/settings">Settings</Link>
        </div>
        <button onClick={logout}>Logout</button>
     </div>

     <div className="settings-body">
        <div className="profile">
        <form onSubmit={handleProfileSubmit}>
          <h3>Update Profile</h3>
          {profileError && <div className="error-message">{profileError}</div>}
          {profileMessage && <div className="success-message">{profileMessage}</div>}
          <div className="form-group">
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" disabled={profileLoading}>
            {profileLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      <div className="password">
        <form onSubmit={handlePasswordSubmit}>
          <h3>Update Password</h3>
          {passwordError && <div className="error-message">{passwordError}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <div className="form-group">
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              placeholder="current password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              placeholder="new password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={passwordLoading}>
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
     </div>
      
    </div>
  );
};

export default Settings;

