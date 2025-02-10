// const mongoose = require("mongoose");

// const fileSchema = new mongoose.Schema({
//     fileName: { type: String, required: true },
//     fileUrl: { type: String, required: true },
//     senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     uploadedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("File", fileSchema);
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true }, // ✅ URL instead of local path
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploadedAt: { type: Date, default: Date.now },
});

// ✅ Ensure consistency with import/export naming
module.exports = mongoose.model("Files", fileSchema);
