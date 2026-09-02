const mongoose = require("mongoose");


// ==========================================
// COMMENT SCHEMA
// ==========================================

const commentSchema = new mongoose.Schema(
    {

        // User who commented
        commenterId: {
            type: String,
            required: true
        },


        commenterName: {
            type: String,
            required: true
        },


        // Comment content
        text: {
            type: String,
            required: true,
            trim: true
        },


        // Related review ID
        // Automatically connects comment with review
        reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }

    },
    {
        timestamps: true
    }
);




// ==========================================
// REVIEW SCHEMA
// ==========================================

const reviewSchema = new mongoose.Schema(
    {


        // ==============================
        // BOOK INFORMATION
        // ==============================

        googleBookId: {
            type: String,
            default: null
        },


        openLibraryId: {
            type: String,
            default: null
        },


        bookTitle: {
            type: String,
            required: true,
            trim: true
        },



        // ==============================
        // REVIEW OWNER
        // ==============================

        reviewerId: {
            type: String,
            required: true
        },


        reviewerName: {
            type: String,
            required: true
        },



        // ==============================
        // REVIEW CONTENT
        // ==============================

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },


        reviewText: {
            type: String,
            required: true,
            trim: true
        },



        // ==============================
        // LIKE SYSTEM
        // ==============================

        likedBy: {

            type:[String],

            default:[]

        },



        // ==============================
        // COMMENT SYSTEM
        // ==============================

        comments:[

            commentSchema

        ]


    },

    {
        timestamps:true
    }

);



module.exports = mongoose.model(
    "Review",
    reviewSchema
);