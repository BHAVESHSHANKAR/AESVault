// import { useState } from "react";
// import axios from "axios";
// import { DownloadCloud, UserCheck } from "lucide-react";
// import "../styles/Dashboard.css";
// import { useLocation } from "react-router-dom";
// const Dashboard = () => {
//     const {username,uniqueId}=useLocation().state || {};
//     const [files, setFiles] = useState([]);
//     const [receiverId, setReceiverId] = useState("");
//     const [message, setMessage] = useState("");

//    const fetchFiles = async () => {
//     if (!receiverId) {
//         setMessage("⚠️ Enter your Receiver ID.");
//         return;
//     }

//     try {
//         const response = await axios.get(`http://localhost:5000/api/auth/received-files/${receiverId}`);

//         console.log("API Response:", response.data); // Debugging

//         // ✅ First, check if files exist
//         if (!response.data.receivedFiles || response.data.receivedFiles.length === 0) {
//             setMessage("ℹ️ No received files.");
//             setFiles([]); 
//             return;
//         }

//         // ✅ Then, check authorization AFTER confirming files exist
//         if (response.data.receiverUniqueId !== uniqueId) {
//             setMessage("❌ Unauthorized access! You cannot view these files.");
//             setFiles([]); 
//             return;
//         }

//         // ✅ Set files correctly
//         setFiles(response.data.receivedFiles);
//         setMessage(""); 

//     } catch (error) {
//         setMessage("❌ Failed to fetch files.");
//         console.error("Error fetching files:", error);
//     }
// };

    
    

//     const handleDownload = async (fileId) => {
//         try {
//             window.open(`http://localhost:5000/api/auth/download/${fileId}`, "_blank");
//         } catch (error) {
//             console.error("Download failed", error);
//         }
//     };

//     return (
//         <div className="dashboard-container">
//             <h1>Welcome {username}</h1>
//             <h2 className="dashboard-title">
//                 <DownloadCloud size={24} /> Received Files
//             </h2>

//             <div className="dashboard-form">
//                 <div className="input-group">
//                     <UserCheck size={18} />
//                     <input 
//                         type="text" 
//                         placeholder="Enter Receiver ID" 
//                         value={receiverId} 
//                         onChange={(e) => setReceiverId(e.target.value)} 
//                     />
//                 </div>
//                 <button onClick={fetchFiles} className="fetch-btn">Fetch Files</button>
//             </div>

//             <p>{message}</p>
//             <ul className="file-list">
//     {files.length === 0 ? (
//         <p>No files received.</p>
//     ) : (
//         files.map((file) => (
//             <li key={file._id} className="file-item">
//                 <strong>📄 {file.fileName}</strong>
//                 <p>📤 Sent by: <b>{file.senderId?.username || "Unknown"}</b></p>
//                 <button onClick={() => handleDownload(file._id)} className="download-btn">
//                     Download
//                 </button>
//             </li>
//         ))
//     )}
// </ul>

//         </div>
//     );
// };

// export default Dashboard;
import { useState } from "react";
import axios from "axios";
import { DownloadCloud, UserCheck, Trash2 } from "lucide-react"; // Added Trash2 icon
import "../styles/Dashboard.css";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
    const { username, uniqueId } = useLocation().state || {};
    const [files, setFiles] = useState([]);
    const [receiverId, setReceiverId] = useState("");
    const [message, setMessage] = useState("");

    const fetchFiles = async () => {
        if (!receiverId) {
            setMessage("⚠️ Enter your Receiver ID.");
            return;
        }

        try {
            const response = await axios.get(`https://aes-vault-apis.vercel.app/api/auth/received-files/${receiverId}`);

            console.log("API Response:", response.data); // Debugging

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
            setMessage("");

        } catch (error) {
            setMessage("❌ Failed to fetch files.");
            console.error("Error fetching files:", error);
        }
    };

    const handleDownload = async (fileId) => {
        try {
            window.open(`https://aes-vault-apis.vercel.app/api/auth/download/${fileId}`, "_blank");
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    const handleDelete = async (fileId) => {
        try {
            const response = await axios.delete(`https://aes-vault-apis.vercel.app/api/auth/delete/${fileId}`);
            if (response.status === 200) {
                setFiles(files.filter(file => file._id !== fileId)); // Remove from UI
                setMessage("✅ File deleted successfully.");
            } else {
                setMessage("❌ Failed to delete file.");
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            setMessage("❌ Error deleting file.");
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Welcome {username}</h1>
            <h2 className="dashboard-title">
                <DownloadCloud size={24} /> Received Files
            </h2>

            <div className="dashboard-form">
                <div className="input-group">
                    <UserCheck size={18} />
                    <input
                        type="text"
                        placeholder="Enter Receiver ID (Your Unique ID)"
                        value={receiverId}
                        onChange={(e) => setReceiverId(e.target.value)}
                    />
                </div>
                <button onClick={fetchFiles} className="fetch-btn">Get Files</button>
            </div>

            <p>{message}</p>
            <ul className="file-list">
                {files.length === 0 ? (
                    <p>No files received.</p>
                ) : (
                    files.map((file) => (
                        <li key={file._id} className="file-item">
                            <strong>📄 {file.fileName}</strong>
                            <p>📤 Sent by: <b>{file.senderId?.username || "Unknown"}</b></p>
                            <button onClick={() => handleDownload(file._id)} className="download-btn">
                                Download
                            </button>
                            <button onClick={() => handleDelete(file._id)} className="delete-btn">
                                <Trash2 size={18} /> Delete
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};
export default Dashboard;