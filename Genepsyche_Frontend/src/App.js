import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Schedule from "./pages/Schedule";
import Payments from "./pages/Payments";
import Feedback from "./pages/Feedback";
import Users from "./pages/Users";
import Login from "./components/Login"; // ✅ import login page
import "./styles/App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ login state

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedActivePage = localStorage.getItem("activePage") || "Dashboard";
    const savedLogin = localStorage.getItem("isLoggedIn") === "true"; // ✅ remember login

    setDarkMode(savedDarkMode);
    setActivePage(savedActivePage);
    setIsLoggedIn(savedLogin);

    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);

    if (newDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    localStorage.setItem("activePage", page);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
  };

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Patients":
        return <Patients />;
      case "Schedule":
        return <Schedule />;
      case "Payments":
        return <Payments />;
      case "Feedback":
        return <Feedback />;
      case "Users":
        return <Users />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      {isLoggedIn ? (
        <>
          <Sidebar activePage={activePage} setActivePage={handlePageChange} />
          <div className="main-content">
            <Header
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              onLogout={handleLogout} // ✅ pass logout handler
            />
            {renderPage()}
          </div>
        </>
      ) : (
        <Login onLogin={handleLogin} /> // ✅ show login if not logged in
      )}
    </div>
  );
}

export default App;
