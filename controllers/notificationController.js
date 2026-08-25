const Notification = require("../models/Notification");


// ==========================================
// GET USER NOTIFICATIONS
// GET /api/notifications/:userId
// ==========================================

const getNotifications = async (req, res) => {

    try {

        const {
            userId
        } = req.params;


        const notifications =
            await Notification.find({
                userId
            })
            .sort({
                createdAt: -1
            });



        return res.status(200).json({

            success: true,

            count:
                notifications.length,

            data:
                notifications

        });



    } catch (error) {


        console.error(
            "Get notifications error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to get notifications",

            error:
                error.message

        });

    }

};





// ==========================================
// CREATE NOTIFICATION
// Internal Function
// Used by Review Controller
// ==========================================

const createNotification = async (
    userId,
    message,
    type,
    reviewId
) => {


    try {


        const notification =
            await Notification.create({

                userId,

                message,

                type,

                reviewId

            });



        return notification;



    } catch (error) {


        console.error(
            "Create notification error:",
            error
        );


        return null;

    }

};






// ==========================================
// MARK NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
// ==========================================

const markNotificationRead = async (
    req,
    res
) => {


    try {


        const notification =
            await Notification.findById(
                req.params.id
            );



        if (!notification) {


            return res.status(404).json({

                success: false,

                message:
                    "Notification not found"

            });

        }



        notification.isRead = true;


        await notification.save();




        return res.status(200).json({

            success: true,

            message:
                "Notification marked as read",

            data:
                notification

        });




    } catch (error) {


        console.error(
            "Mark notification error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to update notification",

            error:
                error.message

        });

    }

};






// ==========================================
// EXPORT
// ==========================================

module.exports = {


    getNotifications,

    createNotification,

    markNotificationRead

};