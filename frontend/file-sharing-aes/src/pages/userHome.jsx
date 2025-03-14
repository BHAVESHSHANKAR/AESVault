import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, UploadCloud, LayoutDashboard, LogOut, MessageSquare, ChevronDown } from 'lucide-react';
import { Layout, Card, Button, Typography, Row, Col, Space, message, Dropdown, Avatar } from 'antd';
import { motion } from 'framer-motion';
import '../styles/userHome.css';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const UserHome = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token: stateToken, username, uniqueId } = location.state || {
        token: localStorage.getItem('token'),
        username: localStorage.getItem('username'),
        uniqueId: localStorage.getItem('uniqueId'),
    };
    const token = stateToken || localStorage.getItem('token'); // Ensure token is available

    const [user, setUser] = useState({ username: 'Guest' });

    console.log('UserHome - Token:', token);
    console.log('UserHome - Username:', username);
    console.log('UserHome - UniqueId:', uniqueId);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        } else if (username) {
            // Fallback to state username if 'user' isn't in localStorage
            setUser({ username });
        }
    }, [username]);

    const goToUpload = () => {
        if (!token || !uniqueId) {
            message.error('Authentication required');
            navigate('/login');
            return;
        }
        navigate('/upload', { state: { token, username, uniqueId } });
    };

    const goToDashboard = () => {
        if (!token || !uniqueId) {
            message.error('Authentication required');
            navigate('/login');
            return;
        }
        navigate('/dashboard', { state: { token, username, uniqueId } });
    };

    const goToChat = () => {
        if (!token || !uniqueId) {
            message.error('Authentication required');
            navigate('/login');
            return;
        }
        navigate('/chats', { state: { token, username, uniqueId } });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('uniqueId');
        localStorage.removeItem('user');
        message.success('Logged out successfully');
        navigate('/');
    };

    const items = [
        {
            key: '1',
            label: (
                <div className="profile-menu-item">
                    <User size={16} />
                    <span>Welcome, {username || 'Guest'}</span>
                </div>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: (
                <div 
                    className="profile-menu-item logout-item"
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </div>
            ),
            danger: true,
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const cardHoverVariants = {
        hover: { 
            scale: 1.03,
            boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
            transition: { type: "spring", stiffness: 400 }
        }
    };

    return (
        <Layout className="user-home-layout">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <Header className="user-home-header">
                    <Row justify="space-between" align="middle">
                        <Col>
                            <motion.img 
                                src="./MainLogo-removebg-preview.png" 
                                alt="Logo" 
                                className="header-logo"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                        </Col>
                        <Col>
                            <Dropdown 
                                menu={{ items }}
                                trigger={['click']}
                                placement="bottomRight"
                                overlayClassName="profile-dropdown"
                            >
                                <Button className="profile-button" type="text">
                                    <Space>
                                        <Avatar 
                                            icon={<User size={20} />} 
                                            className="profile-avatar"
                                        />
                                        <span className="username-display">{username || 'Guest'}</span>
                                        <ChevronDown size={16} />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </Col>
                    </Row>
                </Header>

                <Content className="user-home-content">
                    <motion.div
                        variants={itemVariants}
                        className="welcome-section"
                    >
                        <Title level={2}>
                            <Space>
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <User size={32} className="icon-title" />
                                </motion.div>
                                Welcome, {username || 'Guest'} 👋
                            </Space>
                        </Title>
                        <Text className="welcome-text">
                            Your secure file-sharing hub with AES encryption.
                        </Text>
                    </motion.div>

                    <Row gutter={[24, 24]} className="action-cards">
                        <Col xs={24} sm={12}>
                            <motion.div 
                                variants={itemVariants}
                                whileHover="hover"
                            >
                                <Card 
                                    hoverable 
                                    className="action-card"
                                    onClick={goToUpload}
                                    variants={cardHoverVariants}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <UploadCloud size={40} className="card-icon" />
                                    </motion.div>
                                    <Title level={3}>Share Files</Title>
                                    <Text>Upload and encrypt your files securely</Text>
                                </Card>
                            </motion.div>
                        </Col>
                        <Col xs={24} sm={12}>
                            <motion.div 
                                variants={itemVariants}
                                whileHover="hover"
                            >
                                <Card 
                                    hoverable 
                                    className="action-card"
                                    onClick={goToDashboard}
                                    variants={cardHoverVariants}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <LayoutDashboard size={40} className="card-icon" />
                                    </motion.div>
                                    <Title level={3}>View Dashboard</Title>
                                    <Text>Manage your encrypted files</Text>
                                </Card>
                            </motion.div>
                        </Col>
                        <Col xs={24} sm={12}>
                            <motion.div 
                                variants={itemVariants}
                                whileHover="hover"
                            >
                                <Card 
                                    hoverable 
                                    className="action-card"
                                    onClick={goToChat}
                                    variants={cardHoverVariants}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <MessageSquare size={40} className="card-icon" />
                                    </motion.div>
                                    <Title level={3}>Connect</Title>
                                    <Text>Chat with friends</Text>
                                </Card>
                            </motion.div>
                        </Col>
                    </Row>
                </Content>
            </motion.div>
        </Layout>
    );
};

export default UserHome;