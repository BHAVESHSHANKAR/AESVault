const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const crypto = require("crypto");
const User = require("../models/users");
const Files = require("../models/files");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// 🔹 Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 🔹 Multer Setup for Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔹 Encryption Setup
const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(process.env.SECRET_KEY, "hex"); // 32 bytes
const iv = Buffer.from(process.env.IV, "hex"); // 16 bytes

const encryptBuffer = (buffer) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    return Buffer.concat([cipher.update(buffer), cipher.final()]);
};

const decryptBuffer = (encryptedBuffer) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
    return decrypted;
};

// 🔹 User Signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, uniqueId } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { uniqueId }] });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, uniqueId });

        await newUser.save();
        res.status(200).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ error: "Signup failed", details: error.message });
    }
});

// 🔹 User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", username: user.username, uniqueId: user.uniqueId, token });

    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
    }
});
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const { receiverId, senderId } = req.body;
        const file = req.file;

        if (!file || !receiverId || !senderId) {
            return res.status(400).json({ error: "File, Sender ID, and Receiver ID are required" });
        }

        const receiver = await User.findOne({ uniqueId: receiverId });
        const sender = await User.findOne({ uniqueId: senderId });

        if (!receiver || !sender) {
            return res.status(404).json({ error: "Invalid sender or receiver ID" });
        }

        // 🔹 Encrypt the file buffer
        const encryptedBuffer = encryptBuffer(file.buffer);
        const encryptedFileName = file.originalname + ".enc"; // Preserve sender's filename with .enc extension

        // 🔹 Upload to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw", // For any file type
                folder: "user_uploads",
                public_id: encryptedFileName // Set filename in Cloudinary
            },
            async (error, result) => {
                if (error) return res.status(500).json({ error: "Cloudinary upload failed", details: error.message });

                // 🔹 Save File Details in MongoDB
                const newFile = new Files({
                    fileName: encryptedFileName,
                    fileUrl: result.secure_url,
                    senderId: sender._id,
                    receiverId: receiver._id
                });

                await newFile.save();
                res.status(200).json({ 
                    message: `File securely sent to ${receiver.username}`, 
                    fileUrl: result.secure_url 
                });
            }
        );

        streamifier.createReadStream(encryptedBuffer).pipe(uploadStream);

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "File upload failed", details: error.message });
    }
});

// 🔹 Get Received Files
router.get("/received-files/:uniqueId", async (req, res) => {
    try {
        const receiver = await User.findOne({ uniqueId: req.params.uniqueId });

        if (!receiver) return res.status(404).json({ error: "Receiver not found" });

        const receivedFiles = await Files.find({ receiverId: receiver._id }).populate("senderId", "username uniqueId");

        if (receivedFiles.length === 0) {
            return res.status(200).json({ receivedFiles: [], message: "No received files" });
        }

        res.status(200).json({ receivedFiles, receiverUniqueId: receiver.uniqueId });

    } catch (error) {
        console.error("Error fetching received files:", error);
        res.status(500).json({ error: "Failed to fetch received files" });
    }
});
router.get("/download/:fileId", async (req, res) => {
    try {
        const file = await Files.findById(req.params.fileId);
        if (!file) return res.status(404).json({ error: "File not found" });

        // 🔹 Fetch Encrypted File from Cloudinary
        const response = await fetch(file.fileUrl);
        if (!response.ok) throw new Error("Failed to fetch file from Cloudinary");

        const encryptedBuffer = Buffer.from(await response.arrayBuffer());

        // 🔹 Decrypt File
        const decryptedBuffer = decryptBuffer(encryptedBuffer);

        // 🔹 Restore Original File Name (removing .enc)
        const originalFileName = file.fileName.replace(".enc", "");

        // 🔹 Send File as Download
        res.setHeader("Content-Disposition", `attachment; filename="${originalFileName}"`);
        res.setHeader("Content-Type", "application/octet-stream");
        res.send(decryptedBuffer);

    } catch (error) {
        console.error("File download failed:", error);
        res.status(500).json({ error: "File download failed", details: error.message });
    }
});
// 🔹 Delete File from Cloudinary & MongoDB
// router.delete("/delete/:fileId", async (req, res) => {
//     try {
//         const fileId = req.params.fileId;
//         const file = await Files.findById(fileId);

//         if (!file) return res.status(404).json({ message: "File not found." });

//         const cloudinaryPublicId = file.fileUrl.split("/").pop().split(".")[0];

//         // 🔹 Delete File from Cloudinary
//         await cloudinary.uploader.destroy(`user_uploads/${cloudinaryPublicId}`, { resource_type: "raw" });

//         // 🔹 Delete File from MongoDB
//         await Files.findByIdAndDelete(fileId);

//         res.status(200).json({ message: "File deleted successfully." });

//     } catch (error) {
//         console.error("Error deleting file:", error);
//         res.status(500).json({ message: "Error deleting file." });
//     }
// });
router.delete("/delete/:fileId", async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await Files.findById(fileId);

        if (!file) return res.status(404).json({ message: "File not found." });

        console.log("Cloudinary File URL:", file.fileUrl);  // Debugging

        // 🔹 Extract Cloudinary Public ID Correctly
        const urlParts = file.fileUrl.split("/");
        const cloudinaryFileName = urlParts[urlParts.length - 1].split(".")[0];
        const cloudinaryPublicId = `user_uploads/${cloudinaryFileName}`;

        console.log("Cloudinary Public ID:", cloudinaryPublicId);  // Debugging

        // 🔹 Delete from Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.destroy(cloudinaryPublicId, { resource_type: "raw" });

        console.log("Cloudinary Delete Response:", cloudinaryResponse);  // Debugging

        if (cloudinaryResponse.result !== "ok" && cloudinaryResponse.result !== "not found") {
            return res.status(500).json({ message: "Cloudinary file deletion failed.", cloudinaryResponse });
        }

        // 🔹 Delete from MongoDB after Cloudinary deletion
        await Files.findByIdAndDelete(fileId);

        res.status(200).json({ message: "File deleted successfully from Cloudinary and MongoDB." });

    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: "Error deleting file.", error: error.message });
    }
});

module.exports = router;
