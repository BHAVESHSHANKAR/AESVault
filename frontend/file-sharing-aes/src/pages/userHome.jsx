import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UploadCloud, LayoutDashboard, LogOut, ShieldCheck, FileText, KeyRound, BarChart2 } from 'lucide-react'; 
import '../styles/userHome.css';
import { useLocation } from 'react-router-dom';
const UserHome = () => {
    const location=useLocation();
    const{username,uniqueId}=location.state || {}; 
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: 'Guest' });

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user'); 
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);
    
    const goToUpload = () => navigate('/upload',{state:{username,uniqueId}});
    const goToDashboard = () => navigate('/dashboard',{state:{username,uniqueId}});
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="user-home-container">
            <h1><User size={28} className="icon-title" /> Welcome, {username} 👋</h1>
            <p>Your secure file-sharing hub with AES encryption.</p>

            <div className="button-group">
                <button onClick={goToUpload} className="action-button">
                    <UploadCloud size={18} className="icon-button" /> Share Files
                </button>
                <button onClick={goToDashboard} className="action-button">
                    <LayoutDashboard size={18} className="icon-button" /> View Dashboard
                </button>
            </div>

            
            <div className="extra-section">
                <h2><ShieldCheck size={24} className="icon-title" /> Features of AES Encrypted File Sharing</h2>
                <ul>
                    <li><ShieldCheck size={16} className="icon" /> Strong AES-256 encryption for maximum security.</li>
                    <li><FileText size={16} className="icon" /> Upload, download, and manage encrypted files.</li>
                    <li><KeyRound size={16} className="icon" /> Private decryption keys to access your files.</li>
                    <li><BarChart2 size={16} className="icon" /> Monitor uploaded files in an interactive dashboard.</li>
                </ul>
            </div>

            <button onClick={handleLogout} className="logout-button">
                <LogOut size={18} className="icon-button" /> Logout
            </button>
        </div>
    );
};

export default UserHome;
