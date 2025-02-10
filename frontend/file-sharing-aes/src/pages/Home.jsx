import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, FileText, ShieldCheck, UploadCloud, Key, CheckCircle } from 'lucide-react';
import '../styles/Home.css'; 
function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-title">
                <img src="./MainLogo-removebg-preview.png" alt="Logo" className="title-logo" />
            </div>
            
            <p className="home-description">
                In today’s digital world, data security is crucial. Our platform ensures <strong>secure file sharing</strong> using the 
                <strong> AES (Advanced Encryption Standard)</strong> algorithm, protecting your files from unauthorized access. 
                Share sensitive data with confidence.
            </p>
            <div className="how-it-works">
                <h2><ShieldCheck size={28} className="icon" /> How AES Encryption Works</h2>
                <ul>
                    <li>
                        <span><UploadCloud size={20} className="icon" /> The sender uploads a file and provides the recipient’s email.</span>
                    </li>
                    <li>
                        <span><FileText size={20} className="icon" /> The file is <strong>encrypted</strong> using the AES algorithm before being stored.</span>
                    </li>
                    <li>
                        <span><Key size={20} className="icon" /> The recipient gets a secure download link.</span>
                    </li>
                    <li>
                        <span><Lock size={20} className="icon" /> Only the intended recipient can decrypt the file using a <strong>unique decryption key</strong>.</span>
                    </li>
                    <li>
                        <span><ShieldCheck size={20} className="icon" /> This ensures <strong>end-to-end security</strong> and <strong>data privacy</strong>.</span>
                    </li>
                </ul>
            </div>
            <div className="benefits">
                <h2><CheckCircle size={28} className="icon" /> Why Choose Our Platform?</h2>
                <ul>
                    <li>
                        <span><ShieldCheck size={20} className="icon" /> <strong>End-to-End Encryption</strong> – No third party can access your files.</span>
                    </li>
                    <li>
                        <span><UploadCloud size={20} className="icon" /> <strong>Fast & Secure Transfers</strong> – Encrypted files are transmitted quickly.</span>
                    </li>
                    <li>
                        <span><CheckCircle size={20} className="icon" /> <strong>Easy to Use</strong> – Simple UI for hassle-free file sharing.</span>
                    </li>
                    <li>
                        <span><FileText size={20} className="icon" /> <strong>No File Size Limit</strong> – Upload large files without restrictions.</span>
                    </li>
                </ul>
            </div>
            <div className="button-container">
                <button onClick={() => navigate('/signup')} className="signup-button">
                    Sign Up
                </button>
                <button onClick={() => navigate('/login')} className="login-button">
                    Login
                </button>
            </div>
        </div>
    );
}

export default Home;
