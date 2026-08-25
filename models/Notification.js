const mongoose = require("mongoose");


// ==========================================
// NOTIFICATION SCHEMA
// ==========================================

const notificationSchema = new mongoose.Schema(
    {

        // User who receives notification
        userId: {
            type: String,
            required: true
        },


        // Message shown to user
        message: {
            type: String,
            required: true
        },


        // Notification type
        type: {
            type: String,
            enum: [
                "LIKE",
                "COMMENT"
            ],
            required: true
        },


        // Related review
        reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
            required: true
        },


        // Read status
        isRead: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
);



module.exports = mongoose.model(
    "Notification",
    notificationSchema
);