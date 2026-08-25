const mongoose = require("mongoose");

const Review = require("../models/Review");

const {
    createNotification
} = require("./notificationController");



// ==========================================
// FIND REVIEW SAFELY
// ==========================================

const findReviewSafely = async (id) => {

    try {

        if (mongoose.Types.ObjectId.isValid(id)) {

            return await Review.findById(id);

        }


        return await Review.findOne({
            _id: id
        });


    } catch(error) {


        console.error(
            "Find review error:",
            error
        );


        return null;

    }

};




// ==========================================
// 1. CREATE REVIEW
// POST /api/reviews
// ==========================================

const createReview = async (req,res)=>{

    try{


        const {

            googleBookId,

            openLibraryId,

            bookTitle,

            reviewerId,

            reviewerName,

            rating,

            reviewText


        } = req.body;



        if(

            !bookTitle ||

            !reviewerId ||

            !reviewerName ||

            !rating ||

            !reviewText

        ){

            return res.status(400).json({

                success:false,

                message:
                "bookTitle, reviewerId, reviewerName, rating and reviewText are required"

            });

        }



        if(
            rating < 1 ||
            rating > 5
        ){

            return res.status(400).json({

                success:false,

                message:
                "Rating must be between 1 and 5"

            });

        }




        const review =
        await Review.create({

            googleBookId:
            googleBookId || null,


            openLibraryId:
            openLibraryId || null,


            bookTitle,


            reviewerId,


            reviewerName,


            rating,


            reviewText,


            likedBy:[],


            comments:[]

        });





        return res.status(201).json({

            success:true,

            message:
            "Review created successfully",

            data:
            review

        });



    }
    catch(error){


        console.error(
            error
        );


        return res.status(500).json({

            success:false,

            message:
            "Failed to create review",

            error:
            error.message

        });


    }


};




// ==========================================
// 2. GET REVIEWS FOR BOOK
// ==========================================

const getReviewsForBook = async(req,res)=>{


    try{


        const {
            bookId
        } = req.params;



        const reviews =
        await Review.find({

            $or:[

                {
                    googleBookId:bookId
                },


                {
                    openLibraryId:bookId
                }

            ]

        })
        .sort({

            createdAt:-1

        });





        return res.status(200).json({

            success:true,

            count:
            reviews.length,

            data:
            reviews

        });



    }
    catch(error){


        return res.status(500).json({

            success:false,

            message:
            "Failed to get reviews",

            error:
            error.message

        });


    }


};
// ==========================================
// 3. LIKE / UNLIKE REVIEW
// POST /api/reviews/:id/like
// ==========================================

const toggleLikeReview = async (req,res)=>{


    try{


        const {
            userId
        } = req.body;



        if(!userId){

            return res.status(400).json({

                success:false,

                message:
                "userId is required"

            });

        }



        const review =
        await findReviewSafely(
            req.params.id
        );



        if(!review){

            return res.status(404).json({

                success:false,

                message:
                "Review not found"

            });

        }




        const alreadyLiked =
        review.likedBy.includes(
            userId
        );




        if(alreadyLiked){


            review.likedBy =
            review.likedBy.filter(

                id =>
                id !== userId

            );


        }
        else{


            review.likedBy.push(
                userId
            );



            // CREATE LIKE NOTIFICATION

            if(
                review.reviewerId !== userId
            ){


                await createNotification(

                    review.reviewerId,

                    "Someone liked your review",

                    "LIKE",

                    review._id

                );


            }


        }




        await review.save();





        return res.status(200).json({

            success:true,

            message:
            alreadyLiked
            ?
            "Review unliked"
            :
            "Review liked",


            data:
            review

        });



    }
    catch(error){


        console.error(
            "Like error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:
            "Failed to like review",

            error:
            error.message

        });


    }


};






// ==========================================
// 4. ADD COMMENT
// POST /api/reviews/:id/comments
// ==========================================

const addComment = async(req,res)=>{


    try{


        const {

            commenterId,

            commenterName,

            text

        } = req.body;




        if(

            !commenterId ||

            !commenterName ||

            !text

        ){

            return res.status(400).json({

                success:false,

                message:
                "commenterId, commenterName and text are required"

            });

        }





        const review =
        await findReviewSafely(
            req.params.id
        );



        if(!review){

            return res.status(404).json({

                success:false,

                message:
                "Review not found"

            });

        }





        review.comments.push({

            commenterId,

            commenterName,

            text

        });





        await review.save();





        // CREATE COMMENT NOTIFICATION

        if(
            review.reviewerId !== commenterId
        ){


            await createNotification(

                review.reviewerId,

                "Someone commented on your review",

                "COMMENT",

                review._id

            );


        }





        return res.status(201).json({

            success:true,

            message:
            "Comment added successfully",

            data:
            review

        });




    }
    catch(error){


        console.error(
            "Comment error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:
            "Failed to add comment",

            error:
            error.message

        });


    }


};
// ==========================================
// 5. DELETE OWN COMMENT
// DELETE /api/reviews/:reviewId/comments/:commentId
// ==========================================

const deleteOwnComment = async(req,res)=>{


    try{


        const {

            reviewId,

            commentId

        } = req.params;



        const {
            userId
        } = req.body;



        if(!userId){

            return res.status(400).json({

                success:false,

                message:
                "userId is required"

            });

        }




        const review =
        await findReviewSafely(
            reviewId
        );



        if(!review){

            return res.status(404).json({

                success:false,

                message:
                "Review not found"

            });

        }




        const comment =
        review.comments.id(
            commentId
        );



        if(!comment){

            return res.status(404).json({

                success:false,

                message:
                "Comment not found"

            });

        }





        if(
            comment.commenterId !== userId
        ){

            return res.status(403).json({

                success:false,

                message:
                "You can only delete your own comment"

            });

        }





        comment.deleteOne();


        await review.save();





        return res.status(200).json({

            success:true,

            message:
            "Comment deleted successfully",

            data:
            review

        });




    }
    catch(error){


        console.error(
            error
        );


        return res.status(500).json({

            success:false,

            message:
            "Failed to delete comment",

            error:
            error.message

        });


    }


};






// ==========================================
// 6. MODERATOR DELETE COMMENT
// DELETE /api/reviews/:reviewId/comments/:commentId/moderator
// ==========================================

const moderatorDeleteComment = async(req,res)=>{


    try{


        const {

            reviewId,

            commentId

        } = req.params;



        const {

            moderatorId

        } = req.body;



        if(!moderatorId){

            return res.status(400).json({

                success:false,

                message:
                "moderatorId is required"

            });

        }





        const review =
        await findReviewSafely(
            reviewId
        );



        if(!review){

            return res.status(404).json({

                success:false,

                message:
                "Review not found"

            });

        }





        const comment =
        review.comments.id(
            commentId
        );



        if(!comment){

            return res.status(404).json({

                success:false,

                message:
                "Comment not found"

            });

        }




        comment.deleteOne();


        await review.save();





        return res.status(200).json({

            success:true,

            message:
            "Comment removed by moderator",

            data:
            review

        });



    }
    catch(error){


        console.error(
            error
        );


        return res.status(500).json({

            success:false,

            message:
            "Failed to remove comment",

            error:
            error.message

        });


    }


};






// ==========================================
// 7. DELETE OWN REVIEW
// DELETE /api/reviews/:reviewId
// ==========================================

const deleteOwnReview = async(req,res)=>{


    try{


        const {

            reviewId

        } = req.params;



        const {

            userId

        } = req.body;




        if(!userId){

            return res.status(400).json({

                success:false,

                message:
                "userId is required"

            });

        }





        const review =
        await findReviewSafely(
            reviewId
        );



        if(!review){

            return res.status(404).json({

                success:false,

                message:
                "Review not found"

            });

        }




        if(
            review.reviewerId !== userId
        ){

            return res.status(403).json({

                success:false,

                message:
                "You can only delete your own review"

            });

        }




        await Review.deleteOne({

            _id:
            review._id

        });





        return res.status(200).json({

            success:true,

            message:
            "Review deleted successfully"

        });




    }
    catch(error){


        console.error(
            error
        );


        return res.status(500).json({

            success:false,

            message:
            "Failed to delete review",

            error:
            error.message

        });


    }


};






// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {

    createReview,

    getReviewsForBook,

    toggleLikeReview,

    addComment,

    deleteOwnComment,

    moderatorDeleteComment,

    deleteOwnReview

};