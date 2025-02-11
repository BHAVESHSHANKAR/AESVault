import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Key, Eye, EyeOff, ShieldCheck, FileLock, Send } from 'lucide-react'; 
import '../styles/SignUp.css';

function SignUp() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
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
            const response = await axios.post(`https://aes-vault-apis.vercel.app/api/auth/signup`, formData);
            alert(response.data.message);
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.error);
        }
    };

    return (
        <div className="signup-page">
            {/* Left Section - Signup Form */}
            <div className="how-it-works">
                <h2>🔒 How It Works?</h2>
                <p>
                    AES Vault provides a highly secure file-sharing experience using 
                    **Advanced Encryption Standard (AES-256)** to encrypt and decrypt files.
                </p>

                <div className="feature">
                    <ShieldCheck size={28} className="icon-feature" />
                    <h3>End-to-End Encryption</h3>
                    <p>Data is encrypted before leaving your device and only decrypted upon retrieval.</p>
                </div>

                <div className="feature">
                    <FileLock size={28} className="icon-feature" />
                    <h3>File Protection</h3>
                    <p>Every file is locked with AES encryption to prevent unauthorized access.</p>
                </div>

                <div className="feature">
                    <Send size={28} className="icon-feature" />
                    <h3>Secure Sharing</h3>
                    <p>Files can only be accessed by authorized users using unique decryption keys.</p>
                </div>
                <div className="scroll-down">
    Scroll Down to Sign Up
    <br />
    <Lock size={24} />
</div>

            </div>
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
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {showPassword ? 
                            <EyeOff size={20} className="eye-icon" onClick={() => setShowPassword(false)} /> : 
                            <Eye size={20} className="eye-icon" onClick={() => setShowPassword(true)} />
                        }
                    </div>

                    <button type="submit" className="signup-button">Sign Up</button>

                    <p className="login-link">
                        Already have an account? <a href="/login">Log in here</a>.
                    </p>
                </form>
            </div>

            {/* Right Section - How It Works */}
            
        </div>
    );
}

export default SignUp;
