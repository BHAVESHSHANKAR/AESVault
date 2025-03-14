const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const crypto = require("crypto");
const User = require("../models/users");
const Files = require("../models/files");
const OTP = require("../models/otp");
const Friends = require("../models/friends");
const Messages = require("../models/messages");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const nodemailer = require("nodemailer");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

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
    return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: "Invalid token" });
        req.user = user; // { id, uniqueId }
        next();
    });
};

// Fetch User by UniqueId
router.get("/user/:uniqueId", authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ uniqueId: req.params.uniqueId });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, username: user.username, uniqueId: user.uniqueId });
    } catch (error) {
        console.error("Fetch user error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch user", details: error.message });
    }
});

// Send OTP for Forgot UniqueId
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.findOneAndUpdate(
        { email },
        { otp, createdAt: new Date() },
        { upsert: true, new: true }
    );

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.Email_User, pass: process.env.Email_Password },
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

// Send OTP for File Upload
router.post("/send-upload-otp", async (req, res) => {
    const { receiverId } = req.body;
    const user = await User.findOne({ uniqueId: receiverId });
    if (!user) return res.status(400).json({ success: false, message: "Receiver not found!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.findOneAndUpdate(
        { email: user.email },
        { otp, createdAt: new Date() },
        { upsert: true, new: true }
    );

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.Email_User, pass: process.env.Email_Password },
    });

    const mailOptions = {
        from: process.env.Email_User,
        to: user.email,
        subject: "OTP for File Upload Verification",
        text: `Your OTP for file-sharing is: ${otp}. Please share this with the sender. It expires in 5 minutes.`,
    };

    try {
        await transport.sendMail(mailOptions);
        res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
    }
});

// Verify OTP (unchanged, but included for completeness)
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) return res.status(400).json({ success: false, message: "Invalid or expired OTP!" });

    await OTP.deleteOne({ email });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found!" });

    res.json({ success: true, uniqueId: user.uniqueId, message: "OTP verified successfully" });
});

// Upload File (Updated to include OTP verification)
router.post("/upload", authenticateToken, upload.single("file"), async (req, res) => {
    try {
        const { receiverId, senderId, otp } = req.body; // Added otp to request body
        const file = req.file;
        if (!file || !receiverId || !senderId || !otp) {
            return res.status(400).json({ error: "File, Sender ID, Receiver ID, and OTP are required" });
        }

        const receiver = await User.findOne({ uniqueId: receiverId });
        const sender = await User.findOne({ uniqueId: senderId });
        if (!receiver || !sender) return res.status(404).json({ error: "Invalid sender or receiver ID" });

        // Verify OTP
        const otpRecord = await OTP.findOne({ email: receiver.email });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // OTP is valid, delete it after verification
        await OTP.deleteOne({ email: receiver.email });

        const encryptedBuffer = encryptBuffer(file.buffer);
        const encryptedFileName = file.originalname + ".enc";

        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "raw", folder: "user_uploads", public_id: encryptedFileName },
            async (error, result) => {
                if (error) return res.status(500).json({ error: "Cloudinary upload failed", details: error.message });

                const newFile = new Files({
                    fileName: encryptedFileName,
                    fileUrl: result.secure_url,
                    senderId: sender._id,
                    receiverId: receiver._id,
                });

                await newFile.save();
                res.status(200).json({ message: `File securely sent to ${receiver.username}`, fileUrl: result.secure_url });
            }
        );

        streamifier.createReadStream(encryptedBuffer).pipe(uploadStream);
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "File upload failed", details: error.message });
    }
});

// Get Received Files
router.get("/received-files/:uniqueId", async (req, res) => {
    try {
        const receiver = await User.findOne({ uniqueId: req.params.uniqueId });
        if (!receiver) return res.status(404).json({ error: "Receiver not found" });

        const receivedFiles = await Files.find({ receiverId: receiver._id }).populate("senderId", "username uniqueId");
        if (receivedFiles.length === 0) return res.status(200).json({ receivedFiles: [], message: "No received files" });

        res.status(200).json({ receivedFiles, receiverUniqueId: receiver.uniqueId });
    } catch (error) {
        console.error("Error fetching received files:", error);
        res.status(500).json({ error: "Failed to fetch received files" });
    }
});

// Download File
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

// Delete File
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

// Signup
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
        console.error("Signup error:", error);
        res.status(500).json({ error: "Signup failed", details: error.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, uniqueId: user.uniqueId }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", username: user.username, uniqueId: user.uniqueId, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed", details: error.message });
    }
});

// Send Friend Request
router.post("/friends/add", authenticateToken, async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const user = await User.findOne({ uniqueId: userId });
        const friend = await User.findOne({ uniqueId: friendId });
        if (!user || !friend) return res.status(404).json({ success: false, message: "User not found" });
        if (userId === friendId) return res.status(400).json({ success: false, message: "Cannot send friend request to yourself" });

        const existingFriendship = await Friends.findOne({
            $or: [
                { userId: user._id, friendId: friend._id, status: 'accepted' },
                { userId: friend._id, friendId: user._id, status: 'accepted' },
            ],
        });
        if (existingFriendship) return res.status(400).json({ success: false, message: "Already friends" });

        const existingRequest = await Friends.findOne({
            userId: user._id,
            friendId: friend._id,
            status: 'pending',
        });
        if (existingRequest) return res.status(400).json({ success: false, message: "Friend request already sent" });

        const friendRequest = new Friends({
            userId: user._id,
            friendId: friend._id,
            status: 'pending',
        });
        await friendRequest.save();
        res.json({ success: true, message: "Friend request sent" });
    } catch (error) {
        console.error("Send friend request error:", error);
        res.status(500).json({ success: false, message: "Failed to send friend request", details: error.message });
    }
});

// Accept Friend Request
router.post("/friends/accept", authenticateToken, async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const user = await User.findOne({ uniqueId: userId });
        const friend = await User.findOne({ uniqueId: friendId });
        if (!user || !friend) return res.status(404).json({ success: false, message: "User not found" });

        const friendRequest = await Friends.findOneAndUpdate(
            { userId: friend._id, friendId: user._id, status: 'pending' },
            { status: 'accepted' },
            { new: true }
        );
        if (!friendRequest) return res.status(400).json({ success: false, message: "No pending friend request found" });

        res.json({ success: true, message: "Friend request accepted" });
    } catch (error) {
        console.error("Accept friend request error:", error);
        res.status(500).json({ success: false, message: "Failed to accept friend request", details: error.message });
    }
});

// Get Friends List
router.get("/friends/:uniqueId", authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ uniqueId: req.params.uniqueId });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const friendships = await Friends.find({
            $or: [{ userId: user._id }, { friendId: user._id }],
            status: 'accepted',
        }).populate("friendId userId", "username uniqueId");

        const friends = friendships.map(friendship => {
            const friend = friendship.userId._id.equals(user._id) ? friendship.friendId : friendship.userId;
            return { username: friend.username, uniqueId: friend.uniqueId };
        });

        res.json({ success: true, friends });
    } catch (error) {
        console.error("Fetch friends error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch friends", details: error.message });
    }
});

// Get Friend Requests
router.get("/friend-requests/:uniqueId", authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ uniqueId: req.params.uniqueId });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const requests = await Friends.find({ friendId: user._id, status: 'pending' }).populate("userId", "username uniqueId");
        const friendRequests = requests.map(req => ({
            senderId: req.userId.uniqueId,
            senderUsername: req.userId.username,
        }));

        res.json({ success: true, requests: friendRequests });
    } catch (error) {
        console.error("Fetch friend requests error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch friend requests", details: error.message });
    }
});

// Send Message
router.post("/messages/send", authenticateToken, async (req, res) => {
    const { senderId, receiverId, content } = req.body;
    try {
        const sender = await User.findOne({ uniqueId: senderId });
        const receiver = await User.findOne({ uniqueId: receiverId });
        if (!sender || !receiver) return res.status(404).json({ success: false, message: "User not found" });

        const friendship = await Friends.findOne({
            $or: [
                { userId: sender._id, friendId: receiver._id, status: 'accepted' },
                { userId: receiver._id, friendId: sender._id, status: 'accepted' },
            ],
        });
        if (!friendship) return res.status(403).json({ success: false, message: "Users are not friends" });

        const message = new Messages({ senderId, receiverId, content });
        await message.save();
        res.json({ success: true, message: "Message sent" });
    } catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({ success: false, message: "Failed to send message", details: error.message });
    }
});

// Get Messages with a Friend
router.get("/messages/:friendId", authenticateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user.uniqueId;
    try {
        const user = await User.findOne({ uniqueId: userId });
        const friend = await User.findOne({ uniqueId: friendId });
        if (!user || !friend) return res.status(404).json({ success: false, message: "User not found" });

        const friendship = await Friends.findOne({
            $or: [
                { userId: user._id, friendId: friend._id, status: 'accepted' },
                { userId: friend._id, friendId: user._id, status: 'accepted' },
            ],
        });
        if (!friendship) return res.status(403).json({ success: false, message: "Not friends with this user" });

        const messages = await Messages.find({
            $or: [
                { senderId: userId, receiverId: friendId },
                { senderId: friendId, receiverId: userId },
            ],
        }).sort({ timestamp: 1 });

        res.json({ success: true, messages });
    } catch (error) {
        console.error("Fetch messages error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch messages", details: error.message });
    }
});

module.exports = router;