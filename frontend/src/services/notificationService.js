import axios from "axios";


const API_URL =
    "http://127.0.0.1:9208/api/notifications";



// =====================================
// GET USER NOTIFICATIONS
// =====================================

export const getNotifications = async(userId)=>{


    const response =
        await axios.get(
            `${API_URL}/${userId}`
        );


    return response.data;


};