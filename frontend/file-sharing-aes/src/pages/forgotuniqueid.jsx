import React, { useState } from "react";
import { Input, Button, Card, Typography, message as antMessage, Space, Row, Col } from "antd";
import { MailOutlined, KeyOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const OTPVerification = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [step, setStep] = useState(1);

    const sendOTP = async () => {
        try {
            const response = await fetch("https://aes-vault-apis.vercel.app/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (data.success) {
                setStep(2);
                setMessage("OTP sent to your email.");
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Failed to send OTP. Please try again.");
        }
    };

    const verifyOTP = async () => {
        try {
            const response = await fetch("https://aes-vault-apis.vercel.app/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();
            if (data.success) {
                setMessage(`OTP Verified! Your Unique ID is: ${data.uniqueId}`);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Failed to verify OTP. Please try again.");
        }
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Col xs={23} sm={20} md={16} lg={10} xl={8}>
                <Card
                    className="hover-shadow flip-animation"
                    style={{
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        background: 'white',
                    }}
                >
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ textAlign: 'center' }}>
                            <LockOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                            <Title level={2} style={{ margin: 0, color: '#262626' }}>
                                Forgot Unique ID
                            </Title>
                            <Paragraph type="secondary" style={{ marginTop: '8px' }}>
                                {step === 1 
                                    ? "Enter your email to receive an OTP" 
                                    : "Enter the OTP sent to your email"
                                }
                            </Paragraph>
                        </div>

                        {step === 1 ? (
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Input
                                    size="large"
                                    prefix={<MailOutlined style={{ color: '#1890ff' }} />}
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ borderRadius: '8px' }}
                                />
                                <Button 
                                    type="primary" 
                                    size="large"
                                    block
                                    onClick={sendOTP}
                                    style={{ 
                                        height: '48px',
                                        borderRadius: '8px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Send OTP
                                </Button>
                            </Space>
                        ) : (
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Input
                                    size="large"
                                    prefix={<KeyOutlined style={{ color: '#1890ff' }} />}
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    style={{ borderRadius: '8px' }}
                                />
                                <Button 
                                    type="primary" 
                                    size="large"
                                    block
                                    onClick={verifyOTP}
                                    style={{ 
                                        height: '48px',
                                        borderRadius: '8px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Verify OTP
                                </Button>
                            </Space>
                        )}

                        {message && (
                            <div
                                style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: message.includes("Failed") ? '#fff2f0' : '#f6ffed',
                                    border: `1px solid ${message.includes("Failed") ? '#ffccc7' : '#b7eb8f'}`,
                                }}
                            >
                                <Text style={{ 
                                    textAlign: 'center', 
                                    display: 'block',
                                    color: message.includes("Failed") ? '#ff4d4f' : '#52c41a'
                                }}>
                                    {message}
                                </Text>
                            </div>
                        )}
                    </Space>
                </Card>
            </Col>

            <style jsx global>{`
                .hover-shadow {
                    transition: all 0.3s ease;
                }
                .hover-shadow:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 24px rgba(0,0,0,0.12);
                }
                .flip-animation {
                    animation: flipIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    perspective: 1000px;
                }
                @keyframes flipIn {
                    0% {
                        opacity: 0;
                        transform: rotateX(-90deg);
                    }
                    50% {
                        opacity: 0.8;
                    }
                    100% {
                        opacity: 1;
                        transform: rotateX(0deg);
                    }
                }
            `}</style>
        </Row>
    );
};

export default OTPVerification;
