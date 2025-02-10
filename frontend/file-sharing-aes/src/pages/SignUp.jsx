import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Key } from 'lucide-react'; 
import '../styles/SignUp.css'; 

function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        uniqueId: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, formData);
            alert(response.data.message);
            navigate('/login'); 
        } catch (error) {
            alert(error.response?.data?.error);
        }
    };

    return (
        
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                <h2 className="signup-title">
                    <Lock size={28} className="icon" /> Create a Secure Account
                </h2>
                
               
                <p className="signup-info">
                    Our platform uses <strong>AES Encryption</strong> to secure your file-sharing experience. 
                    Your files are encrypted before transmission, ensuring <strong>end-to-end security</strong> 
                    against unauthorized access.
                </p>

                <div className="input-group">
                    <label><User size={20} className="icon" /> Username</label>
                    <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                </div>
                
                <div className="input-group">
                    <label><Mail size={20} className="icon" /> Email</label>
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="input-group">
                    <label><Key size={20} className="icon" /> Unique ID</label>
                    <input type="text" name="uniqueId" placeholder="Keep any UniqueId" value={formData.uniqueId} onChange={handleChange} required />
                </div>

                <div className="input-group">
                    <label><Lock size={20} className="icon" /> Password</label>
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                </div>
                
                <button type="submit" className="signup-button">Sign Up</button>

                
                <p className="login-link">
                    Already have an account? <a href="/login">Log in here</a>.
                </p>
            </form>
        </div>
    );
}

export default SignUp;
