import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [scrumTeams, setScrumTeams] = useState([]);
  const [selectedScrumDetails, setSelectedScrumDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [taskStatus, setTaskStatus] = useState("");

  const [newScrum, setNewScrum] = useState({
    name: "",
    taskTitle: "",
    taskDescription: "",
    taskStatus: "To Do",
    assignedTo: "",
  });

  const navigate = useNavigate();
  const role = localStorage.getItem("role"); 

  useEffect(() => {
    fetch("http://localhost:5000/scrumTeams")
      .then((res) => res.json())
      .then((data) => setScrumTeams(data))
      .catch((error) => console.error("Error fetching scrum teams:", error));

   
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setAvailableUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleGetDetails = (teamId) => {
    fetch(`http://localhost:5000/scrumTeams/${teamId}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedScrumDetails(data);
        setTaskStatus(data.taskStatus); 
      })
      .catch((error) => console.error("Error fetching scrum team details:", error));
  };

  const handleStatusChange = (event) => {
    setTaskStatus(event.target.value);
  };

  const handleUpdateStatus = (teamId) => {
    fetch(`http://localhost:5000/scrumTeams/${teamId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskStatus }),
    })
      .then((res) => res.json())
      .then((updatedTeam) => {
        alert("Task status updated successfully!");
        setSelectedScrumDetails({ ...selectedScrumDetails, taskStatus });
        setScrumTeams(scrumTeams.map(team => 
          team.id === teamId ? { ...team, taskStatus } : team
        ));
      })
      .catch((error) => console.error("Error updating task status:", error));
  };

  const handleCreateScrum = () => {
    if (!newScrum.name || !newScrum.taskTitle || !newScrum.taskDescription || !newScrum.assignedTo) {
      alert("Please fill in all fields!");
      return;
    }
  
    const newScrumEntry = { 
      ...newScrum, 
      id: Date.now() 
    };
  
    fetch("http://localhost:5000/scrumTeams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newScrumEntry),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Scrum team created successfully!");
        
        
        setScrumTeams([...scrumTeams, data]); 
  
        
        setShowForm(false); 
  
       
        setNewScrum({
          name: "",
          taskTitle: "",
          taskDescription: "",
          taskStatus: "To Do",
          assignedTo: "",
        });
      })
      .catch((error) => console.error("Error creating scrum team:", error));
  };
  

  return (
    <div className="container">
      <h3 className="header">Dashboard</h3>
      
      <nav>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          {role === "admin" && <li><a href="/userprofiles">Profiles</a></li>}
          <li><a href="/welcome">Logout</a></li>
        </ul>
      </nav>

      <h2 className="scrum-title">Scrum Teams</h2>

      {role === "admin" && (
        <button className="add-button" onClick={() => setShowForm(true)}>
          Add New Scrum
        </button>
      )}

      {showForm && role === "admin" && (
        <div className="scrum-form">
          <h3>*** Add New Scrum ***</h3>
          <input type="text" name="name" placeholder="Scrum Name" value={newScrum.name} onChange={(e) => setNewScrum({ ...newScrum, name: e.target.value })} required />
          <input type="text" name="taskTitle" placeholder="Task Title" value={newScrum.taskTitle} onChange={(e) => setNewScrum({ ...newScrum, taskTitle: e.target.value })} required />
          <input type="text" name="taskDescription" placeholder="Task Description" value={newScrum.taskDescription} onChange={(e) => setNewScrum({ ...newScrum, taskDescription: e.target.value })} required />
          
          <select name="taskStatus" value={newScrum.taskStatus} onChange={(e) => setNewScrum({ ...newScrum, taskStatus: e.target.value })}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select name="assignedTo" value={newScrum.assignedTo} onChange={(e) => setNewScrum({ ...newScrum, assignedTo: e.target.value })} required>
            <option value="">Select User</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>

          <button className="create-button" onClick={handleCreateScrum}>Create Scrum</button>
          <button className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      {scrumTeams.length > 0 ? (
        <ul className="scrum-list">
          {scrumTeams
            .filter((team) => team && team.name)
            .map((team) => (
              <li key={team.id}>
                {team.name}
                <button className="get-details-button" onClick={() => handleGetDetails(team.id)}>
                  Get Details
                </button>
              </li>
            ))}
        </ul>
      ) : (
        <p>No scrum teams available.</p>
      )}

      {selectedScrumDetails && (
        <div className="scrum-details">
          <h3>Scrum Team Details</h3>
          <p><strong>Name:</strong> {selectedScrumDetails.name}</p>
          <p><strong>Task Title:</strong> {selectedScrumDetails.taskTitle}</p>
          <p><strong>Description:</strong> {selectedScrumDetails.taskDescription}</p>
          <p><strong>Assigned To:</strong> {selectedScrumDetails.assignedTo}</p>

          <label>Update Task Status: </label>
          <select value={taskStatus} onChange={handleStatusChange}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button className="update-button" onClick={() => handleUpdateStatus(selectedScrumDetails.id)}>
            Update Status
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
