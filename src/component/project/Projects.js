import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import Header from '../Header';
import { FaTrash } from 'react-icons/fa'; // DELETE ICON

const Project = () => {
  const [projects, setProjects] = useState({
    'Not Started': [],
    'In Progress': [],
    'Completed': [],
    'Delayed': []
  });
  const [activeTab, setActiveTab] = useState('Not Started');
  const [newProjectName, setNewProjectName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://task-tracker-backend-eight.vercel.app/project/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleNavigate = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleAddProject = async () => {
    if (!newProjectName.trim()) {
      alert('Please enter a project name.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://task-tracker-backend-eight.vercel.app/project/create',
        { name: newProjectName },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNewProjectName('');
      fetchProjects();
      setActiveTab('Not Started');
    } catch (error) {
      console.error('Error creating project:', error);
      alert("Cannot be created as Project count exceeds 4 !!");
    }
  };

  // 🛑 DELETE Project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://task-tracker-backend-eight.vercel.app/project/delete/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchProjects(); // Refresh after deletion
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project.');
    }
  };

  const tabs = ['Not Started', 'In Progress', 'Completed', 'Delayed', 'Add Project'];

  return (
    <div>
      <Header />

      <div className="p-6 sm:p-10 min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-white relative">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-semibold text-md transition-all duration-300 tracking-wide shadow-sm ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-indigo-100 hover:scale-105'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab !== 'Add Project' ? (
            <>
              {projects[activeTab]?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {projects[activeTab].map((project) => (
                    <div
                      key={project._id}
                      className="relative p-6 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.05]"
                    >
                      {/* 🗑️ DELETE ICON */}
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // stop card click
                            handleDeleteProject(project._id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>

                      <div
                        onClick={() => handleNavigate(project._id)}
                        className="flex flex-col h-full justify-between"
                      >
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">
                            Created: {format(new Date(project.createdAt), 'dd/MM/yyyy EEE hh:mm a')}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-700 font-medium">
                            📝 Tasks: {project.taskCount}
                          </span>
                          <div className="flex items-center justify-center bg-blue-800 text-white w-10 h-10 rounded-full">
                            <span className="text-2xl font-bold transform">→</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 italic text-lg">No projects found under "{activeTab}"</p>
              )}
            </>
          ) : (
            // Add Project Tab
            <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-2xl">
              <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Create New Project</h2>

              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg"
              />

              <button
                onClick={handleAddProject}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all text-lg"
              >
                ➕ Create Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Project;
