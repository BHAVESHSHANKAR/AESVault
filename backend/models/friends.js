const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' }, // Added status
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Friend', friendSchema);