import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, FileText, ShieldCheck, UploadCloud, Key, CheckCircle } from 'lucide-react';
import { Layout, Button, Typography, Row, Col, Space, Drawer } from 'antd';
import '../styles/Home.css';
import { motion } from "framer-motion";
import { MenuOutlined } from '@ant-design/icons';

function Home() {
    const navigate = useNavigate();
    const { Header, Content } = Layout;
    const { Title, Paragraph } = Typography;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const EncryptionSteps = () => {
        const steps = [
            {
                icon: <UploadCloud size={24} />,
                text: "The sender uploads a file and provides the recipient's email."
            },
            {
                icon: <FileText size={24} />,
                text: "The file is encrypted using the AES algorithm before being stored."
            },
            {
                icon: <Key size={24} />,
                text: "The recipient gets a secure download link."
            },
            {
                icon: <Lock size={24} />,
                text: "Only the intended recipient can decrypt the file using a unique decryption key."
            },
            {
                icon: <ShieldCheck size={24} />,
                text: "This ensures end-to-end security and data privacy."
            }
        ];

        return (
            <div className="encryption-section">
                <motion.div 
                    className="center-circle"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography.Title level={3}>
                        AES Encryption
                    </Typography.Title>
                </motion.div>
                
                <div className="steps-orbit">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="step-item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <div className="step-icon">
                                {step.icon}
                            </div>
                            <Typography.Text>{step.text}</Typography.Text>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Layout className="layout">
            <Header className="header">
                <Row justify="space-between" align="middle" style={{ height: '100%' }}>
                    <Col>
                        <motion.img 
                            src="./MainLogo-removebg-preview.png" 
                            alt="Logo" 
                            className="logo"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            onClick={() => navigate('/')}
                        />
                    </Col>
                    
                    {/* Desktop Menu */}
                    <Col className="desktop-menu">
                        <Space size="large">
                            <Button type="primary" ghost onClick={() => navigate('/login')} size="large">
                                Login
                            </Button>
                            <Button type="primary" onClick={() => navigate('/signup')} size="large">
                                Sign Up
                            </Button>
                            <Button type="primary" onClick={() => window.open('/aboutus', '_blank')}  size="large">
                                About us
                            </Button>
                            
                        </Space>
                    </Col>

                    {/* Mobile Menu Icon */}
                    <Col className="mobile-menu-icon">
                        <Button 
                            type="text" 
                            icon={<MenuOutlined style={{ fontSize: '24px' }} />}
                            onClick={() => setMobileMenuOpen(true)}
                        />
                    </Col>
                </Row>
            </Header>

            {/* Mobile Menu Drawer */}
            <Drawer
                title="Menu"
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                className="mobile-menu-drawer"
            >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Button 
                        type="primary" 
                        ghost 
                        onClick={() => {
                            navigate('/login');
                            setMobileMenuOpen(false);
                        }} 
                        block
                    >
                        Login
                    </Button>
                    <Button 
                        type="primary" 
                        onClick={() => {
                            navigate('/signup');
                            setMobileMenuOpen(false);
                        }} 
                        block
                    >
                        Sign Up
                    </Button>
                    <Button 
                        type="primary" 
                        onClick={() => {
                            // navigate('/aboutus');
                            window.open('/aboutus', '_blank')
                            setMobileMenuOpen(false);
                        }} 
                        block
                    >
                        About us
                    </Button>
                    
                </Space>
            </Drawer>

            <Content style={{ padding: '50px' }}>
                <div className="hero-section">
                    <Row justify="center">
                        <Col xs={24} sm={20} md={16}>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <Typography.Title level={1} className="main-title">
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                        className="highlight"
                                    >
                                        Secure File Sharing
                                    </motion.span>
                                    <br />
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8, duration: 0.8 }}
                                        className="gradient-text"
                                    >
                                        with AES Encryption
                                    </motion.span>
                                </Typography.Title>
                            </motion.div>
                            
                            <div className="hero-content">
                                <Row gutter={[24, 24]} justify="center">
                                    <Col xs={24} md={8}>
                                        <motion.div
                                            className="hero-feature"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                        >

                                        </motion.div>
                                    </Col>
                                   
                                </Row>

                                <motion.div
                                    className="hero-cta"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                >
                                    <Button type="primary" size="large" onClick={() => navigate('/signup')}>
                                        Get Started
                                    </Button>
                                </motion.div>
                            </div>
                        </Col>
                    </Row>
                </div>

                <div className="encryption-workflow">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="workflow-header"
                    >
                        <Typography.Title level={2} className="section-title">
                            <ShieldCheck size={28} className="title-icon" />
                            How AES Encryption Works
                        </Typography.Title>
                    </motion.div>

                    <div className="workflow-container">
                        {[
                            {
                                icon: <UploadCloud size={40} />,
                                title: "Upload",
                                description: "The sender uploads a file and provides the recipient's uniqueId."
                            },
                            {
                                icon: <FileText size={40} />,
                                title: "Encrypt",
                                description: "The file is encrypted using the AES algorithm before being stored."
                            },
                            {
                                icon: <Key size={40} />,
                                title: "Share",
                                description: "The recipient gets a secure download button after files received."
                            },
                            {
                                icon: <Lock size={40} />,
                                title: "Secure Access",
                                description: "Only the intended recipient can decrypt the file using a uniqueId."
                            },
                            {
                                icon: <ShieldCheck size={40} />,
                                title: "Privacy",
                                description: "This ensures end-to-end security and data privacy."
                            }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                className="workflow-step"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ 
                                    duration: 0.5,
                                    delay: index * 0.2,
                                }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="step-icon">
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        {step.icon}
                                    </motion.div>
                                </div>
                                <Typography.Title level={4} className="step-title">
                                    {step.title}
                                </Typography.Title>
                                <Typography.Text className="step-description">
                                    {step.description}
                                </Typography.Text>
                                {index < 4 && <div className="step-arrow" />}
                            </motion.div>
                        ))}
                    </div>
                </div>

             
             
            </Content>

            <Layout.Footer className="footer">
                <div className="footer-container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Title level={2} className="footer-title">
                            <CheckCircle size={28} className="icon" /> Why Choose Our Platform?
                        </Title>
                    </motion.div>

                    <Row gutter={[32, 32]} className="footer-grid">
                        {[
                            {
                                icon: <ShieldCheck size={32} />,
                                title: "End-to-End Encryption",
                                
                            },
                            {
                                icon: <UploadCloud size={32} />,
                                title: "Fast & Secure Transfers",
                                
                            },
                            {
                                icon: <CheckCircle size={32} />,
                                title: "Easy to Use",
                                
                            },
                            {
                                icon: <FileText size={32} />,
                                title: "No File Size Limit",
                                
                            }
                        ].map((item, index) => (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <motion.div
                                    className="feature-card"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="feature-icon">{item.icon}</div>
                                    <Typography.Title level={4}>{item.title}</Typography.Title>
                                    <Typography.Text>{item.text}</Typography.Text>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Layout.Footer>
        </Layout>
    );
}

export default Home;
