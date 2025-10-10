import React from "react";

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    "Patients",
    "Schedule",
    "Payments",
    "Feedback",
    // "Reviews",
    "Users",
    // "Blog",
  ];

  // const settingsItems = ["FAQs", "Legal Resources", "Cheat Sheet"];

  return (
    <div className="sidebar">
      <h2>Genepsyche</h2>
      <ul>
        <li
          className={activePage === "Dashboard" ? "active" : ""}
          onClick={() => setActivePage("Dashboard")}
        >
          Dashboard
        </li>
        {menuItems.map((item) => (
          <li
            key={item}
            className={activePage === item ? "active" : ""}
            onClick={() => setActivePage(item)}
          >
            {item}
          </li>
        ))}
      </ul>

      {/* <div className="settings-section">
        <h3>SETTINGS</h3>
        <ul>
          {settingsItems.map((item) => (
            <li
              key={item}
              className={activePage === item ? "active" : ""}
              onClick={() => setActivePage(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default Sidebar;
