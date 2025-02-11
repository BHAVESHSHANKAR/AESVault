// // import { useState } from "react";
// // import axios from "axios";
// // import { UploadCloud, User, UserCheck } from "lucide-react"; // Icons
// // import "../styles/Upload.css";
// // import { useLocation } from "react-router-dom";
// // const Upload = () => {
// //     const {username,uniqueId}=useLocation().state || {};
// //     const [file, setFile] = useState(null);
// //     const [receiverId, setReceiverId] = useState("");
// //     const [senderId, setSenderId] = useState("");
// //     const [message, setMessage] = useState("");

// //     const handleFileChange = (e) => {
// //         setFile(e.target.files[0]);
// //     };

// //     const handleUpload = async () => {
// //         if (!file || !receiverId || !senderId) {
// //             setMessage("⚠️ All fields are required!");
// //             return;
// //         }

// //         const formData = new FormData();
// //         formData.append("file", file);
// //         formData.append("receiverId", receiverId);
// //         formData.append("senderId", senderId);

// //         try {
// //             const response = await axios.post("http://localhost:5000/api/auth/upload", formData, {
// //                 headers: { "Content-Type": "multipart/form-data" },
// //             });
// //             if (uniqueId !== senderId) {
// //                 setMessage("❌Unauthirized access! You can only enter Your uniqueId because you are Sender");
// //                 return;
// //             }
// //             setMessage("✅ " + response.data.message);
// //             setFile(null);
// //             setReceiverId("");
// //             setSenderId("");
// //         } catch (error) {
// //             setMessage("❌ File upload failed.");
// //             console.error(error);
// //         }
// //     };

// //     return (
// //         <div className="upload-container">
// //             <h1>Welcome {username}</h1>
// //             <h2 className="upload-title">
// //                 <UploadCloud size={24} /> Secure File Upload
// //             </h2>
// //             <p className="upload-subtitle">
// //                 Upload encrypted files securely. Only the intended receiver can access them.
// //             </p>

// //             <div className="upload-form">
// //                 <div className="input-group">
// //                     <User size={18} />
// //                     <input 
// //                         type="text" 
// //                         placeholder="Sender ID" 
// //                         value={senderId} 
// //                         onChange={(e) => setSenderId(e.target.value)} 
// //                     />
// //                 </div>

// //                 <div className="input-group">
// //                     <UserCheck size={18} />
// //                     <input 
// //                         type="text" 
// //                         placeholder="Receiver ID" 
// //                         value={receiverId} 
// //                         onChange={(e) => setReceiverId(e.target.value)} 
// //                     />
// //                 </div>

// //                 <input type="file" onChange={handleFileChange} />

// //                 <button onClick={handleUpload} className="upload-btn">Upload File</button>

// //                 <p>{message}</p>
// //             </div>
// //         </div>
// //     );
// // };

// // export default Upload;
// import { useState, useRef } from "react";
// import axios from "axios";
// import { UploadCloud, User, UserCheck } from "lucide-react"; // Icons
// import "../styles/Upload.css";
// import { useLocation } from "react-router-dom";

// const Upload = () => {
//     const { username, uniqueId } = useLocation().state || {};
//     const [file, setFile] = useState(null);
//     const [receiverId, setReceiverId] = useState("");
//     const [senderId, setSenderId] = useState("");
//     const [message, setMessage] = useState("");
//     const fileInputRef = useRef(null); // Ref for file input

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };

//     const handleUpload = async () => {
//         if (!file || !receiverId || !senderId) {
//             setMessage("⚠️ All fields are required!");
//             return;
//         }

//         if (uniqueId !== senderId) {
//             setMessage("❌ Unauthorized access! You can only enter your uniqueId because you are the Sender.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("receiverId", receiverId);
//         formData.append("senderId", senderId);

//         try {
//             const response = await axios.post(`https://aes-vault-apis.vercel.app/api/auth/upload`, formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });

//             setMessage("✅ " + response.data.message);
//             setFile(null);
//             setReceiverId("");
//             setSenderId("");

//             if (fileInputRef.current) {
//                 fileInputRef.current.value = ""; // Reset file input field
//             }
//         } catch (error) {
//             setMessage("❌ File upload failed.");
//             console.error(error);
//         }
//     };

//     return (
//         <div className="upload-container">
//             <div className="home-title">
//                 <img src="./MainLogo-removebg-preview.png" alt="Logo" className="title-logo" />
//             </div>
//             <h1>Welcome {username}</h1>
//             <h2 className="upload-title">
//                 <UploadCloud size={24} /> Secure File Upload
//             </h2>
//             <p className="upload-subtitle">
//                 Upload encrypted files securely. Only the intended receiver can access them.
//             </p>

//             <div className="upload-form">
//                 <div className="input-group">
//                     <User size={18} />
//                     <input 
//                         type="text" 
//                         placeholder="Sender ID (Your Unique ID)" 
//                         value={senderId} 
//                         onChange={(e) => setSenderId(e.target.value)} 
//                     />
//                 </div>

//                 <div className="input-group">
//                     <UserCheck size={18} />
//                     <input 
//                         type="text" 
//                         placeholder="Receiver ID" 
//                         value={receiverId} 
//                         onChange={(e) => setReceiverId(e.target.value)} 
//                     />
//                 </div>

//                 <input 
//                     type="file" 
//                     ref={fileInputRef} // Attach ref to file input
//                     onChange={handleFileChange} 
//                 />

//                 <button onClick={handleUpload} className="upload-btn">Upload File</button>

//                 <p>{message}</p>
//             </div>
//         </div>
//     );
// };

// export default Upload;
import { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud, User, UserCheck, Loader } from "lucide-react"; // Icons
import "../styles/Upload.css";
import { useLocation } from "react-router-dom";

const Upload = () => {
    const { username, uniqueId } = useLocation().state || {};
    const [file, setFile] = useState(null);
    const [receiverId, setReceiverId] = useState("");
    const [senderId, setSenderId] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); // State for loader
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !receiverId || !senderId) {
            setMessage("⚠️ All fields are required!");
            return;
        }

        if (uniqueId !== senderId) {
            setMessage("❌ Unauthorized access! You can only enter your uniqueId because you are the Sender.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("receiverId", receiverId);
        formData.append("senderId", senderId);

        setLoading(true); // Start loading animation

        try {
            const response = await axios.post(`https://aes-vault-apis.vercel.app/api/auth/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("✅ " + response.data.message);
            setFile(null);
            setReceiverId("");
            setSenderId("");

            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset file input
            }
        } catch (error) {
            setMessage("❌ File upload failed.");
            console.error(error);
        } finally {
            setLoading(false); // Stop loading animation
        }
    };

    return (
        <div className="upload-container">
            <div className="home-title">
                <img src="./MainLogo-removebg-preview.png" alt="Logo" className="title-logo" />
            </div>
            <h1>Welcome {username}</h1>
            <h2 className="upload-title">
                <UploadCloud size={24} /> Secure File Upload
            </h2>
            <p className="upload-subtitle">
                Upload encrypted files securely. Only the intended receiver can access them.
            </p>

            <div className="upload-form">
                <div className="input-group">
                    <User size={18} />
                    <input 
                        type="text" 
                        placeholder="Sender ID (Your Unique ID)" 
                        value={senderId} 
                        onChange={(e) => setSenderId(e.target.value)} 
                    />
                </div>

                <div className="input-group">
                    <UserCheck size={18} />
                    <input 
                        type="text" 
                        placeholder="Receiver ID" 
                        value={receiverId} 
                        onChange={(e) => setReceiverId(e.target.value)} 
                    />
                </div>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                />

                <button onClick={handleUpload} className="upload-btn" disabled={loading}>
                    {loading ? <Loader className="loading-icon" size={20} /> : "Upload File"}
                </button>

                <p>{message}</p>
            </div>
        </div>
    );
};

export default Upload;
