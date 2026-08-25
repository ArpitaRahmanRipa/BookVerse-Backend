import React, {
    useEffect,
    useState
} from "react";


import {
    getNotifications
} from "../services/notificationService";





export default function Notifications(){


    const [notifications,setNotifications]
        =
        useState([]);



    // Temporary user
    // Later replace with logged in user

    const userId =
        "reader001";





    useEffect(()=>{


        const loadNotifications =
        async()=>{


            try{


                const response =
                    await getNotifications(
                        userId
                    );



                setNotifications(
                    response.data || []
                );


            }
            catch(error){


                console.log(
                    "Notification error:",
                    error
                );


            }


        };



        loadNotifications();



    },[]);







    return (

        <div
        className="
        min-h-screen
        bg-[#f7f2e9]
        p-8
        "
        >



            <h1
            className="
            text-3xl
            font-bold
            mb-6
            "
            >

                🔔 Notifications

            </h1>






            {
                notifications.length === 0 ?


                (

                    <div
                    className="
                    bg-white
                    rounded-xl
                    p-6
                    shadow
                    "
                    >

                        No notifications yet.


                    </div>


                )


                :


                (

                    <div
                    className="
                    space-y-4
                    "
                    >


                    {
                        notifications.map(
                            (
                                notification,
                                index
                            )=>(


                                <div

                                key={index}

                                className="
                                bg-white
                                p-5
                                rounded-xl
                                shadow
                                "

                                >


                                    <h2
                                    className="
                                    font-semibold
                                    text-lg
                                    "
                                    >

                                    {
                                        notification.type
                                    }

                                    </h2>



                                    <p
                                    className="
                                    mt-2
                                    "
                                    >

                                    {
                                        notification.message
                                    }

                                    </p>



                                    <small
                                    className="
                                    text-gray-500
                                    "
                                    >

                                    {
                                        new Date(
                                            notification.createdAt
                                        )
                                        .toLocaleString()
                                    }

                                    </small>



                                </div>



                            )

                        )

                    }


                    </div>


                )


            }



        </div>

    );


}