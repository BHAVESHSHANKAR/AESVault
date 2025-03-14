import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, KeyRound, Eye, EyeOff, Loader, Home } from 'lucide-react';
import { Card, Input, Button, Typography, Space, message } from 'antd';
import { motion } from 'framer-motion';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { Title } = Typography;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                email,
                password,
            });
            const { token, username, uniqueId } = response.data;
            // Store token in localStorage for persistence
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('uniqueId', uniqueId);
            message.success(response.data.message);
            // Redirect to UserHome with state
            navigate('/userhome', { state: { token, username, uniqueId } });
        } catch (error) {
            message.error(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="home-button-container">
                <Button 
                    type="primary" 
                    icon={<Home size={20} />}
                    onClick={() => navigate('/')}
                    className="home-button"
                >
                    Home
                </Button>
            </div>

            <motion.div 
                className="logo-section"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <img 
                    src="./MainLogo-removebg-preview.png" 
                    alt="Logo" 
                    className="title-logo"
                />
            </motion.div>

            <motion.div
                className="login-card-container"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="login-card">
                    <form onSubmit={handleSubmit}>
                        <Title level={2} className="login-title">
                            <LogIn size={24} className="icon-title" /> Login
                        </Title>

                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div className="input-group">
                                <Input
                                    prefix={<Mail size={16} className="icon" />}
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    size="large"
                                />
                            </div>

                            <div className="input-group password-input">
                                <Input
                                    prefix={<Lock size={16} className="icon" />}
                                    suffix={
                                        showPassword ? 
                                            <Eye size={16} className="eye-icon" onClick={() => setShowPassword(false)} /> : 
                                            <EyeOff size={16} className="eye-icon" onClick={() => setShowPassword(true)} />
                                    }
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    size="large"
                                />
                            </div>

                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                block 
                                size="large"
                                loading={loading}
                                icon={<KeyRound size={16} />}
                            >
                                {loading ? 'Signing In...' : 'Login'}
                            </Button>

                            <div className="extra-links">
                                <Button type="link" onClick={() => navigate('/signup')}>
                                    Create an Account
                                </Button>
                            </div>
                        </Space>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;