const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const crypto = require("crypto");
const User = require("../models/users");
const Files = require("../models/files");
const OTP = require("../models/otp");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const nodemailer = require("nodemailer");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// 🔹 Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(process.env.SECRET_KEY, "hex");
const iv = Buffer.from(process.env.IV, "hex");

const encryptBuffer = (buffer) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    return Buffer.concat([cipher.update(buffer), cipher.final()]);
};

const decryptBuffer = (encryptedBuffer) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
    return decrypted;
};

// 🔹 Fetch User by UniqueId
router.get("/user/:uniqueId", async (req, res) => {
    try {
        const user = await User.findOne({ uniqueId: req.params.uniqueId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ email: user.email, uniqueId: user.uniqueId });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user", details: error.message });
    }
});

// 🔹 Send OTP for Forgot UniqueId
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, message: "User not found!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
        { email },
        { otp, createdAt: new Date() },
        { upsert: true, new: true }
    );

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.Email_User,
            pass: process.env.Email_Password,
        },
    });

    const mailOptions = {
        from: process.env.Email_User,
        to: email,
        subject: "OTP for Unique ID Recovery",
        text: `Your OTP to recover your Unique ID is: ${otp}. It expires in 5 minutes.`,
    };

    try {
        await transport.sendMail(mailOptions);
        res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
    }
});

// 🔹 Send OTP for File Upload (New Endpoint)
router.post("/send-upload-otp", async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, message: "User not found!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
        { email },
        { otp, createdAt: new Date() },
        { upsert: true, new: true }
    );

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.Email_User,
            pass: process.env.Email_Password,
        },
    });

    const mailOptions = {
        from: process.env.Email_User,
        to: email,
        subject: "OTP for File Upload Verification",
        text: `Your OTP for file-sharing  is: ${otp}. Please share this with the sender. It expires in 5 minutes.`,
    };

    try {
        await transport.sendMail(mailOptions);
        res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
    }
});

// 🔹 Verify OTP (Shared for both flows)
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP!" });
    }

    await OTP.deleteOne({ email });

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found!" });
    }

    res.json({ success: true, uniqueId: user.uniqueId, message: "OTP verified successfully" });
});

// 🔹 Upload File
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

        const encryptedBuffer = encryptBuffer(file.buffer);
        const encryptedFileName = file.originalname + ".enc";

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                folder: "user_uploads",
                public_id: encryptedFileName,
            },
            async (error, result) => {
                if (error) return res.status(500).json({ error: "Cloudinary upload failed", details: error.message });

                const newFile = new Files({
                    fileName: encryptedFileName,
                    fileUrl: result.secure_url,
                    senderId: sender._id,
                    receiverId: receiver._id,
                });

                await newFile.save();
                res.status(200).json({
                    message: `File securely sent to ${receiver.username}`,
                    fileUrl: result.secure_url,
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

// 🔹 Download File
router.get("/download/:fileId", async (req, res) => {
    try {
        const file = await Files.findById(req.params.fileId);
        if (!file) return res.status(404).json({ error: "File not found" });

        const response = await fetch(file.fileUrl);
        if (!response.ok) throw new Error("Failed to fetch file from Cloudinary");

        const encryptedBuffer = Buffer.from(await response.arrayBuffer());
        const decryptedBuffer = decryptBuffer(encryptedBuffer);
        const originalFileName = file.fileName.replace(".enc", "");

        res.setHeader("Content-Disposition", `attachment; filename="${originalFileName}"`);
        res.setHeader("Content-Type", "application/octet-stream");
        res.send(decryptedBuffer);
    } catch (error) {
        console.error("File download failed:", error);
        res.status(500).json({ error: "File download failed", details: error.message });
    }
});

// 🔹 Delete File
router.delete("/delete/:fileId", async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await Files.findById(fileId);

        if (!file) return res.status(404).json({ message: "File not found." });

        const urlParts = file.fileUrl.split("/");
        const cloudinaryFileName = urlParts[urlParts.length - 1].split(".")[0];
        const cloudinaryPublicId = `user_uploads/${cloudinaryFileName}`;

        const cloudinaryResponse = await cloudinary.uploader.destroy(cloudinaryPublicId, {
            resource_type: "raw",
            invalidate: true,
        });

        if (cloudinaryResponse.result !== "ok" && cloudinaryResponse.result !== "not found") {
            return res.status(500).json({ message: "Cloudinary file deletion failed.", cloudinaryResponse });
        }

        await Files.findByIdAndDelete(fileId);
        res.status(200).json({ message: "File deleted successfully from Cloudinary and MongoDB." });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: "Error deleting file.", error: error.message });
    }
});

// 🔹 Signup
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

// 🔹 Login
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

module.exports = router;