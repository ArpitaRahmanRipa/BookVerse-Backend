import {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router";


import {
    getReadingListById,
    toggleLikeReadingList,
    toggleSaveReadingList
} from "../services/readingListApi";



export default function ReadingListDetails(){


    const { id } = useParams();



    const [list,setList] = useState(null);

    const [loading,setLoading] = useState(true);



    const userId = "reader002";





    useEffect(()=>{


        loadList();


    },[id]);







    const loadList = async()=>{


        try{


            const result =
            await getReadingListById(id);



            setList(result.data);



        }
        catch(error){


            console.log(
                "Failed to load reading list:",
                error
            );


        }
        finally{


            setLoading(false);


        }


    };








    const handleLike = async()=>{


        try{


            await toggleLikeReadingList(

                id,

                {
                    userId
                }

            );



            loadList();



        }
        catch(error){


            console.log(error);


        }


    };








    const handleSave = async()=>{


        try{


            await toggleSaveReadingList(

                id,

                {
                    userId
                }

            );



            loadList();



        }
        catch(error){


            console.log(error);


        }


    };









    if(loading){


        return(

            <div className="p-8">

                Loading...

            </div>

        );


    }









    if(!list){


        return(

            <div className="p-8">

                Reading list not found

            </div>

        );


    }








    return(


        <div className="
        mx-auto
        max-w-5xl
        p-6
        ">



            <div className="
            rounded-xl
            bg-white
            p-8
            shadow
            ">







                {/* TITLE */}

                <h1 className="
                text-3xl
                font-bold
                text-[#352522]
                ">

                    {list.title}

                </h1>







                {/* DESCRIPTION */}

                <p className="
                mt-3
                text-stone-600
                ">

                    {list.description ||
                    "No description provided."}

                </p>








                {/* TAGS */}

                <div className="
                mt-5
                flex
                flex-wrap
                gap-2
                ">


                {
                    list.tags?.map(

                        (tag,index)=>(


                            <span

                            key={index}

                            className="
                            rounded-full
                            bg-[#f7f2e9]
                            px-3
                            py-1
                            text-sm
                            text-[#6f473c]
                            "

                            >

                                {tag}


                            </span>



                        )

                    )
                }



                </div>








                <hr className="my-6"/>









                {/* BOOKS */}

                <h2 className="
                text-2xl
                font-bold
                text-[#352522]
                ">

                    Books

                </h2>








                <div className="
                mt-5
                space-y-4
                ">



                {


                list.books?.map(


                    (book)=>(



                        <div

                        key={book.bookId}

                        className="
                        rounded-xl
                        border
                        p-5
                        "

                        >





                            <h3 className="
                            text-xl
                            font-bold
                            text-[#352522]
                            ">


                                #{book.rank}

                                {" "}

                                {book.title}


                            </h3>








                            <p className="mt-2">


                                <span className="font-semibold">

                                    Author:

                                </span>


                                {" "}


                                {
                                book.authors?.join(", ")
                                }


                            </p>









                            <p className="
                            mt-3
                            text-stone-600
                            ">


                                <span className="font-semibold">

                                    Notes:

                                </span>


                                {" "}


                                {

                                book.note ||

                                "No notes added"

                                }



                            </p>







                        </div>



                    )


                )



                }




                </div>









                {/* LIKE SAVE BUTTONS */}


                <div className="
                mt-8
                flex
                gap-4
                ">





                    <button


                    onClick={handleLike}


                    className="
                    rounded-xl
                    bg-[#352522]
                    px-5
                    py-3
                    text-white
                    hover:bg-[#241816]
                    "

                    >



                        {
                        list.likedBy?.includes(userId)

                        ?

                        "♥ Liked"

                        :

                        "♡ Like"

                        }


                        {" "}


                        {

                        list.likedBy?.length || 0

                        }



                    </button>









                    <button


                    onClick={handleSave}


                    className="
                    rounded-xl
                    bg-[#b56536]
                    px-5
                    py-3
                    text-white
                    hover:bg-[#9f542f]
                    "

                    >




                        {
                        list.savedBy?.includes(userId)

                        ?

                        "🔖 Saved"

                        :

                        "🔖 Save"

                        }



                        {" "}



                        {

                        list.savedBy?.length || 0

                        }





                    </button>





                </div>








            </div>





        </div>



    );


}