import React, { useEffect, useState } from "react";
import "./UserProfile.css";

function UserProfile() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userHistory, setUserHistory] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
  });

  
  const role = localStorage.getItem("role"); 

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = () => {
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers([...users, data]);
        setShowForm(false);
        setNewUser({ name: "", email: "", password: "", role: "Employee" });
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  const handleGetHistory = (userId) => {
    console.log("Button Clicked! Fetching history for user:", userId);
    setUserHistory([]);

    fetch(`http://localhost:5000/history?userId=${userId}`)
      .then((response) => {
        console.log("API Response Status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched history:", data);
        if (data.length === 0) {
          console.warn("No history found for user:", userId);
        }
        setUserHistory(data);
        setSelectedUser(userId);
      })
      .catch((error) => console.error("Error fetching history:", error));
  };

  return (
    <div className="user-profile-container">
      <h2>User Profiles</h2>

     
      {role === "admin" && (
        <button onClick={() => setShowForm(true)}>Add New User</button>
      )}

      {showForm && (
        <div className="user-form">
          <h3>*** Add New User ***</h3>
          <button onClick={() => setShowForm(false)}>Cancel</button>
          <br />
          <label>Name:</label>
          <input type="text" name="name" value={newUser.name} onChange={handleInputChange} />
          <br />
          <label>Email:</label>
          <input type="email" name="email" value={newUser.email} onChange={handleInputChange} />
          <br />
          <label>Password:</label>
          <input type="password" name="password" value={newUser.password} onChange={handleInputChange} />
          <br />
          <label>Role:</label>
          <select name="role" value={newUser.role} onChange={handleInputChange}>
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
          </select>
          <br />
          <button onClick={handleAddUser}>Create User</button>
        </div>
      )}

      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={() => handleGetHistory(user.id)}>Get History</button>
          </div>
        ))}
      </div>

     
      {selectedUser && (
        <div className="user-history">
          <h3>Tasks Worked By {users.find((user) => user.id === selectedUser)?.name || "Unknown"}</h3>
          {userHistory.length > 0 ? (
            userHistory.map((task) => (
              <div key={task.id} className="task-card">
                <p><strong>Title:</strong> {task.taskTitle}</p>
                <p><strong>Description:</strong> {task.taskDescription}</p>
                <p><strong>Status:</strong> {task.taskStatus}</p>
              </div>
            ))
          ) : (
            <p>No history found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
