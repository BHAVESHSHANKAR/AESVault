import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, KeyRound } from 'lucide-react'; 
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://aes-vault-apis.vercel.app/api/auth/login`, { email, password });
            alert(response.data.message);
            const {username,uniqueId}=response.data;
            navigate('/userhome',{state:{username,uniqueId}}); 
        } catch (error) {
            console.error('Error logging in:', error);
            alert(error.response?.data?.error);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2><LogIn size={24} className="icon-title" /> Login</h2>

                <div className="input-group">
                    <label><Mail size={16} className="icon" /> Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <div className="input-group">
                    <label><Lock size={16} className="icon" /> Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>

                <button type="submit" className="login-button">
                    <KeyRound size={16} className="icon-button" /> Login
                </button>

               
                <div className="extra-links">
                    <a href="/forgot-password">Forgot Password?</a> | 
                    <a href="/signup"> Create an Account</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
