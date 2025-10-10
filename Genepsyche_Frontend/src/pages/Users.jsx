import React, { useState, useEffect } from "react";
import ShowSelect from "../components/ShowSelect";
import { 
  getAllUsers, 
  registerUser, 
  updateUser, 
  deleteUser 
} from "../services/index";

function Users() {
  const [search, setSearch] = useState("");
  const [showItems, setShowItems] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    userGroup: "ADMIN",
  });

  const [editUser, setEditUser] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setApiLoading(true);
    setError("");
    try {
      const result = await getAllUsers();
      if (result.success) {
        setUsers(result.data);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setApiLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editUser) {
        // Update existing user
        const updateData = {
          name: newUser.name,
          phone: newUser.phone,
          userGroup: newUser.userGroup
        };
        
        // Only include password if it's provided
        if (newUser.password) {
          updateData.password = newUser.password;
        }

        const result = await updateUser(editUser.id, updateData);
        
        if (result.success) {
          setSuccess("User updated successfully!");
          // Refresh the user list
          await fetchUsers();
        } else {
          setError("Failed to update user");
        }
      } else {
        // Add new user
        const result = await registerUser(newUser);
        
        if (result.success) {
          setSuccess("User created successfully!");
          // Refresh the user list
          await fetchUsers();
        } else {
          setError("Failed to create user");
        }
      }

      // Reset form and close modal
      setShowCreateModal(false);
      setEditUser(null);
      setNewUser({
        name: "",
        phone: "",
        email: "",
        password: "",
        userGroup: "ADMIN",
      });
    } catch (err) {
      setError(err.message || "Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setNewUser({
      name: user.name,
      phone: user.phone || "",
      email: user.email,
      password: "",
      userGroup: user.user_group || user.type || "ADMIN",
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setApiLoading(true);
      setError("");
      
      try {
        const result = await deleteUser(userId);
        
        if (result.success) {
          setSuccess("User deleted successfully!");
          // Refresh the user list
          await fetchUsers();
        } else {
          setError("Failed to delete user");
        }
      } catch (err) {
        setError(err.message || "Failed to delete user");
      } finally {
        setApiLoading(false);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.user_group || user.type).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-page">
      {/* Error and Success Messages */}
      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError("")} className="alert-close">×</button>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          {success}
          <button onClick={() => setSuccess("")} className="alert-close">×</button>
        </div>
      )}

      <div className="page-header">
        <div className="header-left">
          <span className="show-text"></span>
          <ShowSelect
            value={showItems}
            onChange={setShowItems}
            options={[5, 10, 25, 50, 100]}
          />
          <button
            className="btn-create-user"
            onClick={() => {
              setEditUser(null);
              setShowCreateModal(true);
            }}
            disabled={apiLoading}
          >
            {apiLoading ? "LOADING..." : "+ CREATE USER"}
          </button>
        </div>

        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search User"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={apiLoading}
            />
            <i className="fas fa-search search-icon"></i>
          </div>
        </div>
      </div>

      {apiLoading && <div className="loading">Loading users...</div>}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>TYPE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.slice(0, showItems).map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "N/A"}</td>
                  <td>
                    <span className={`user-type ${(user.user_group || user.type).toLowerCase()}`}>
                      {user.user_group || user.type}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action edit-btn"
                        title="Edit User"
                        onClick={() => handleEdit(user)}
                        disabled={apiLoading}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn-action delete-btn"
                        title="Delete User"
                        onClick={() => handleDelete(user.id)}
                        disabled={apiLoading}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-users">
                  {apiLoading ? "Loading..." : search ? "No users found matching your search" : "No users available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="table-footer">
          Showing {filteredUsers.length > 0 ? 1 : 0} to{" "}
          {Math.min(showItems, filteredUsers.length)} of {filteredUsers.length}{" "}
          entries
        </div>
      </div>

      {/* Create/Edit User Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editUser ? "EDIT USER" : "CREATE USER"}</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditUser(null);
                  setNewUser({
                    name: "",
                    phone: "",
                    email: "",
                    password: "",
                    userGroup: "ADMIN",
                  });
                }}
                disabled={loading}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <h3 className="form-subtitle">
                {editUser ? "Edit User Information" : "Create New User"}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={newUser.phone}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                    disabled={editUser || loading}
                  />
                </div>

                {!editUser && (
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                )}

                {editUser && (
                  <div className="form-group">
                    <label htmlFor="password">New Password (leave empty to keep current)</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      disabled={loading}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="userGroup">User Group</label>
                  <select
                    id="userGroup"
                    name="userGroup"
                    value={newUser.userGroup}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditUser(null);
                      setNewUser({
                        name: "",
                        phone: "",
                        email: "",
                        password: "",
                        userGroup: "ADMIN",
                      });
                    }}
                    disabled={loading}
                  >
                    CLOSE
                  </button>
                  <button 
                    type="submit" 
                    className="btn-save"
                    disabled={loading}
                  >
                    {loading ? "PROCESSING..." : (editUser ? "UPDATE" : "SAVE")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;