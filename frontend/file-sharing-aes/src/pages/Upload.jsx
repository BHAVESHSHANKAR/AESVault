import { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud, User, UserCheck, Loader, Home } from "lucide-react";
import { Layout, Card, Input, Button, message, Space, Typography } from 'antd';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Upload.css";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Upload = () => {
    const { username, uniqueId } = useLocation().state || {};
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [receiverId, setReceiverId] = useState("");
    const [senderId, setSenderId] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");  // ✅ Success message
    const [errorMessage, setErrorMessage] = useState("");    // ❌ Unauthorized message
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        setUploadMessage("");  // Reset messages
        setErrorMessage("");

        if (!file || !receiverId || !senderId) {    
            message.error("⚠️ All fields are required!");
            return;
        }

        if (uniqueId !== senderId) {
            setErrorMessage("❌ Unauthorized access! You can only enter your uniqueId because you are the Sender.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("receiverId", receiverId);
        formData.append("senderId", senderId);

        setLoading(true);

        try {
            const response = await axios.post(`https://aes-vault-apis.vercel.app/api/auth/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            message.success("✅ " + response.data.message);
            setUploadMessage(`✅ File successfully sent to receiver`); // ✅ Display success message
            // Reset fields
            setFile(null);
            setReceiverId("");
            setSenderId("");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            message.error("❌ File upload failed.");
            console.error(error);
        } finally {
            setLoading(false);
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

    return (
        <Layout className="upload-layout">
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

                <Content className="upload-content">
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
                        className="upload-card-section"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Card className="upload-card">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Title level={2} className="upload-title">
                                    <Space>
                                        <UploadCloud size={24} className="title-icon" />
                                        Secure File Upload
                                    </Space>
                                </Title>
                                
                                <Text className="upload-subtitle">
                                    Upload encrypted files securely. Only the intended receiver can access them.
                                </Text>

                                <Space direction="vertical" size="large" className="upload-form">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <Card className="input-card">
                                            <Input 
                                                prefix={<User size={18} className="input-icon" />}
                                                placeholder="Sender ID (Your Unique ID)" 
                                                value={senderId} 
                                                onChange={(e) => setSenderId(e.target.value)}
                                                className="styled-input"
                                            />
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <Card className="input-card">
                                            <Input 
                                                prefix={<UserCheck size={18} className="input-icon" />}
                                                placeholder="Receiver ID" 
                                                value={receiverId} 
                                                onChange={(e) => setReceiverId(e.target.value)}
                                                className="styled-input"
                                            />
                                        </Card>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileChange}
                                            className="file-input" 
                                        />
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button 
                                            type="primary"
                                            onClick={handleUpload}
                                            disabled={loading}
                                            className="upload-button"
                                            block
                                            size="large"
                                        >
                                            {loading ? (
                                                <Space>
                                                    <Loader className="loading-icon" size={20} />
                                                    Uploading...
                                                </Space>
                                            ) : (
                                                'Upload File'
                                            )}
                                        </Button>
                                    </motion.div>

                                    {/* ✅ Display Success or Error Message Below Upload Button */}
                                    {uploadMessage && <Text className="upload-success">{uploadMessage}</Text>}
                                    {errorMessage && <Text className="upload-error">{errorMessage}</Text>}
                                    <a onClick={()=>navigate("/forgot")}>Frogot Your UniqueId ?</a>
                                </Space>
                            </motion.div>
                        </Card>
                    </motion.div>
                </Content>
            </motion.div>
        </Layout>
    );
};

export default Upload;
