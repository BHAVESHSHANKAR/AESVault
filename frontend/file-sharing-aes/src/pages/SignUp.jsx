import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Key, Eye, EyeOff, Home } from 'lucide-react';
import { Card, Input, Button, Typography, Space, message } from 'antd';
import { motion } from 'framer-motion';
import '../styles/SignUp.css';

function SignUp() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        try {
            // const response = await axios.post(`http://localhost:5000/api/auth/signup`, formData);
            const response = await axios.post(`https://aes-vault-apis.vercel.app/api/auth/signup`, formData);
            message.success(response.data.message);
            navigate('/login');
        } catch (error) {
            message.error(error.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            className="signup-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="home-button-container">
                <Button 
                    type="primary"
                    icon={<Home size={20} />}
                    size="large"
                    className="home-button"
                    onClick={() => navigate('/')}
                    shape="round"
                >
                    Back to Home
                </Button>
            </div>

            <motion.div 
                className="home-title"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <img 
                    src="./MainLogo-removebg-preview.png" 
                    alt="Logo" 
                    className="title-logo"
                />
            </motion.div>

            <motion.div
                className="signup-card-container"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="signup-card">
                    <form onSubmit={handleSubmit}>
                        <Typography.Title level={2} className="signup-title">
                            <Lock size={24} className="icon-title" /> Create Account
                        </Typography.Title>

                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Card className="input-card">
                                <Input
                                    prefix={<User size={16} className="input-icon" />}
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    size="large"
                                    className="styled-input"
                                />
                            </Card>

                            <Card className="input-card">
                                <Input
                                    prefix={<Mail size={16} className="input-icon" />}
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    size="large"
                                    className="styled-input"
                                />
                            </Card>

                            <Card className="input-card">
                                <Input
                                    prefix={<Key size={16} className="input-icon" />}
                                    name="uniqueId"
                                    placeholder="Keep any UniqueId"
                                    value={formData.uniqueId}
                                    onChange={handleChange}
                                    required
                                    size="large"
                                    className="styled-input"
                                />
                            </Card>

                            <Card className="input-card">
                                <Input
                                    prefix={<Lock size={16} className="input-icon" />}
                                    suffix={
                                        showPassword ? 
                                            <EyeOff size={16} className="eye-icon" onClick={() => setShowPassword(false)} /> : 
                                            <Eye size={16} className="eye-icon" onClick={() => setShowPassword(true)} />
                                    }
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    size="large"
                                    className="styled-input"
                                />
                            </Card>

                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                block 
                                size="large"
                                loading={loading}
                                className="signup-button"
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </Button>

                            <div className="extra-links">
                                <Button type="link" onClick={() => navigate('/login')}>
                                    Already have an account? Login
                                </Button>
                            </div>
                        </Space>
                    </form>
                </Card>
            </motion.div>
        </motion.div>
    );
}

export default SignUp;
