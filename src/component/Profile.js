import React, { useEffect, useState } from 'react';
import Header from './Header'; // Assuming you already have a Header.js
import axios from 'axios';
import { useNavigate } from 'react-router';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you saved token in localStorage
        if (!token) {
          navigate('/login'); // Redirect if token is missing
          return;
        }

        const response = await axios.get('https://task-tracker-backend-eight.vercel.app/user/userDetails', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUserData(response.data.data.user);
        } else {
          console.error('Error fetching user details');
        }
      } catch (error) {
        console.error('API Error:', error);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
        {userData ? (
          <div className="space-y-4">
            <div><strong>Name:</strong> {userData.name}</div>
            <div><strong>Email:</strong> {userData.email}</div>
            <div><strong>Country:</strong> {userData.country}</div>
            <div><strong>User ID:</strong> {userData._id}</div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
