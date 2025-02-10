import React, { useState, useEffect } from 'react';
import { FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ProfilDoctor.css'; // Import the CSS file

interface ProfileSidebarProps {
  isProfileOpen: boolean;
  toggleProfileSidebar: () => void;
}
declare global {
  interface Window {
    cloudinary: any;
  }
}



const DoctorProfile: React.FC<ProfileSidebarProps> = ({ isProfileOpen, toggleProfileSidebar }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phoneNumber: '',
    password: '',
    avatarUrl: '', // URL for the avatar image
  });
 
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize the navigate hook

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleUpdateProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    console.log('Profile saved:', profileData);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Handle the Cloudinary image upload
  const handleImageUpload = (result: any) => {
    if (result.event === 'success') {
      // Update the avatar URL in the profile data state
      setProfileData({
        ...profileData,
        avatarUrl: result.info.secure_url, // Save the uploaded image URL
      });
    }
  };

  // Initialize Cloudinary Upload Widget
  useEffect(() => {
    // Create the Cloudinary widget when the component is mounted
    const cloudinaryWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'your_cloud_name', // Replace with your Cloudinary Cloud Name
        uploadPreset: 'your_upload_preset', // Replace with your Upload Preset
        sources: ['local', 'url', 'camera', 'image_search'],
      },
      (error: any, result: any) => {
        if (result.event === 'success') {
          handleImageUpload(result);
        }
      }
    );

    // You can assign this widget to a button or any other element
    const uploadButton = document.getElementById('uploadButton');
    if (uploadButton) {
      uploadButton.onclick = () => cloudinaryWidget.open();
    }
  }, [profileData]);

  return (
    <div className={`profile-sidebar ${isProfileOpen ? 'open' : ''}`}>
      <div className="profile-header">
        <button onClick={isEditing ? handleSaveProfile : handleUpdateProfile} className="edit-button">
          <FaEdit className="icon" />
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
        <button onClick={toggleProfileSidebar} className="close-button">
          &times;
        </button>
      </div>

      <div className="profile-content">
        <img
          src={profileData.avatarUrl || 'https://via.placeholder.com/150'}
          alt="User Avatar"
          className="profile-avatar"
        />

        {/* Cloudinary Upload Widget */}
        {!isEditing && (
          <div className="upload-button">
            <button id="uploadButton">Upload Profile Picture</button>
          </div>
        )}

        {isEditing ? (
          <div className="profile-form">
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              placeholder="Address"
            />
            <input
              type="text"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
            <input
              type="password"
              name="password"
              value={profileData.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
          </div>
        ) : (
          <div className="profile-info">
            <p><strong>First Name:</strong> {profileData.firstName || 'N/A'}</p>
            <p><strong>Last Name:</strong> {profileData.lastName || 'N/A'}</p>
            <p><strong>Email:</strong> {profileData.email || 'N/A'}</p>
            <p><strong>Address:</strong> {profileData.address || 'N/A'}</p>
            <p><strong>Phone Number:</strong> {profileData.phoneNumber || 'N/A'}</p>
            <p><strong>Password:</strong> ********</p>
          </div>
        )}
      </div>

      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt className="icon" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default DoctorProfile;