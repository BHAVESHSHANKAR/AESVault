import { useState } from "react";
import axios from "axios";
import { DownloadCloud, UserCheck, Trash2, Loader, Home } from "lucide-react";
import { Layout, Card, Input, Button, message, Space, Typography, Avatar } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
    const { username, uniqueId } = useLocation().state || {};
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [receiverId, setReceiverId] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [downloadingFileId, setDownloadingFileId] = useState(null);
    const [deletingFileId, setDeletingFileId] = useState(null);

    const fetchFiles = async () => {
        if (!receiverId) {
            setMessage("⚠️ Enter your Receiver ID.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/received-files/${receiverId}`);

            if (!response.data.receivedFiles || response.data.receivedFiles.length === 0) {
                setMessage("ℹ️ No received files.");
                setFiles([]);
                return;
            }

            if (response.data.receiverUniqueId !== uniqueId) {
                setMessage("❌ Unauthorized access! You cannot view these files.");
                setFiles([]);
                return;
            }

            setFiles(response.data.receivedFiles);
        } catch (error) {
            setMessage("❌ Failed to fetch files.");
            console.error("Error fetching files:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileId) => {
        setDownloadingFileId(fileId);

        try {
            // window.open(`https://aes-vault-apis.vercel.app/api/auth/download/${fileId}`, "_blank");
            window.open(`${import.meta.env.VITE_API_URL}/api/auth/download/${fileId}`, "_blank");
        } catch (error) {
            console.error("Download failed", error);
            setMessage("❌ Download failed.");
        } finally {
            setDownloadingFileId(null);
        }
    };

    const handleDelete = async (fileId) => {
        setDeletingFileId(fileId);

        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/delete/${fileId}`);
            if (response.status === 200) {
                setFiles(files.filter(file => file._id !== fileId)); // Remove from UI
                setMessage("✅ File deleted successfully.");
            } else {
                setMessage("❌ Failed to delete file.");
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            setMessage("❌ Error deleting file.");
        } finally {
            setDeletingFileId(null);
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0,
            rotateY: 360,
            scale: 0.8
        },
        visible: { 
            opacity: 1,
            rotateY: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const listItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.3 }
        },
        exit: { 
            opacity: 0, 
            x: 20,
            transition: { duration: 0.2 }
        }
    };

    return (
        <Layout className="dashboard-layout">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Header className="site-header">
                    <div className="header-content">
                        <Button 
                            type="primary"
                            icon={<Home size={20} />}
                            size="large"
                            onClick={() => navigate('/userHome', { state: { username, uniqueId } })}
                            className="home-button"
                        >
                            Back to Home
                        </Button>
                    </div>
                </Header>

                <Content className="dashboard-content">
                    <motion.div 
                        className="logo-section"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img 
                            src="./MainLogo-removebg-preview.png" 
                            alt="Logo" 
                            className="main-logo"
                        />
                    </motion.div>

                    <motion.div 
                        className="dashboard-card-section"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Card className="dashboard-card">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Title level={2} className="dashboard-title">
                                    <Space>
                                        <DownloadCloud size={24} className="title-icon" />
                                        Received Files
                                    </Space>
                                </Title>

                                <Text className="dashboard-subtitle">
                                    View and manage your received encrypted files.
                                </Text>

                                <Space direction="vertical" size="large" className="dashboard-form">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <Card className="input-card">
                                            <Input 
                                                prefix={<UserCheck size={18} className="input-icon" />}
                                                placeholder="Enter Receiver ID (Your Unique ID)" 
                                                value={receiverId} 
                                                onChange={(e) => setReceiverId(e.target.value)}
                                                className="styled-input"
                                            />
                                        </Card>
                                    </motion.div>

                                    <Button 
                                        type="primary"
                                        onClick={fetchFiles}
                                        disabled={loading}
                                        className="fetch-button"
                                        block
                                        size="large"
                                    >
                                        {loading ? (
                                            <Space>
                                                <Loader className="loading-icon" size={20} />
                                                Fetching Files...
                                            </Space>
                                        ) : (
                                            'Get Files'
                                        )}
                                    </Button>

                                    {message && (
                                        <Text className={`message ${message.includes('❌') ? 'error' : ''}`}>
                                            {message}
                                        </Text>
                                    )}

                                    <AnimatePresence>
                                        {files.length > 0 && (
                                            <motion.ul 
                                                className="file-list"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                {files.map((file) => (
                                                    <motion.li
                                                        key={file._id}
                                                        variants={listItemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        className="file-item"
                                                    >
                                                        <div className="file-info">
                                                            <strong>📄 {file.fileName}</strong>
                                                            <p>📤 Sent by: <b>{file.senderId?.username || "Unknown"}</b></p>
                                                        </div>
                                                        <Space>
                                                            <Button 
                                                                type="primary"
                                                                onClick={() => handleDownload(file._id)}
                                                                disabled={downloadingFileId === file._id}
                                                                className="action-button download-btn"
                                                            >
                                                                {downloadingFileId === file._id ? (
                                                                    <Loader size={18} className="loading-icon" />
                                                                ) : (
                                                                    'Download'
                                                                )}
                                                            </Button>
                                                            <Button 
                                                                type="primary"
                                                                danger
                                                                onClick={() => handleDelete(file._id)}
                                                                disabled={deletingFileId === file._id}
                                                                className="action-button delete-btn"
                                                                icon={<Trash2 size={18} />}
                                                            >
                                                                {deletingFileId === file._id ? (
                                                                    <Loader size={18} className="loading-icon" />
                                                                ) : (
                                                                    'Delete'
                                                                )}
                                                            </Button>
                                                        </Space>
                                                    </motion.li>
                                                ))}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </Space>
                            </motion.div>
                        </Card>
                    </motion.div>
                </Content>
            </motion.div>
        </Layout>
    );
};

export default Dashboard;
