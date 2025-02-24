import React, { useState } from "react";

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
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>OTP Verification</h2>
            {step === 1 ? (
                <>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button onClick={sendOTP}>Send OTP</button>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button onClick={verifyOTP}>Verify OTP</button>
                </>
            )}
            <p>{message}</p>
        </div>
    );
};

export default OTPVerification;
