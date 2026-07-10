import React, { useEffect, useState } from "react";
import { getUsers, getRoles, createUser } from "../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function loadRoles() {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !roleId) {
      return alert("All fields are required");
    }

    setCreating(true);
    try {
      await createUser({ firstName, lastName, email, password, roleId });
      alert("User created successfully");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setRoleId("");
      setShowForm(false);
      loadUsers();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <h2>Manage Users</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New User"}
        </button>
        <button onClick={loadUsers} disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3>Create New User</h3>
          <form onSubmit={handleCreateUser}>
            <label>First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />

            <label>Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
            />

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <label>Role</label>
            <select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            <div style={{ marginTop: 12 }}>
              <button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <p>Loading users...</p>}

      {users.length === 0 && !loading && <p className="muted">No users found</p>}

      <div className="orders-grid">
        {users.map((user) => (
          <div className="order-card" key={user.id}>
            <div className="order-card-content">
              <div className="card-header">
                <div>
                  <strong>
                    {user.firstName} {user.lastName}
                  </strong>
                  <div className="muted small">{user.email}</div>
                </div>
                <div
                  className={`status-badge ${user.isActive ? "completed" : "pending"}`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </div>
              </div>

              <div className="order-details">
                <div>
                  Role: <strong>{user.role?.name}</strong>
                </div>
                <div>
                  Created: <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
