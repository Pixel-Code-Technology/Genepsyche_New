import React from "react";

const Header = ({ darkMode, toggleDarkMode, onLogout }) => {
  return (
    <div className="header">
      <div className="header-left">
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? (
            <span className="theme-icon">☀️</span>
          ) : (
            <span className="theme-icon">🌙</span>
          )}
        </button>
      </div>
      <div className="header-right">
        <div className="admin-profile">
          <img
            src="https://media.istockphoto.com/id/610003972/vector/vector-businessman-black-silhouette-isolated.jpg?s=612x612&w=0&k=20&c=Iu6j0zFZBkswfq8VLVW8XmTLLxTLM63bfvI6uXdkacM="
            alt="User"
            className="profile-image"
          />
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
