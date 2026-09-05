import { 
    useEffect, 
    useState 
} from "react"; 

import { 
    Link 
} from "react-router"; 

import { 
    getMyReadingLists, 
    deleteReadingList 
} from "../services/readingListApi"; 



export default function MyReadingLists(){


    const [readingLists,setReadingLists] =
        useState([]);


    const [loading,setLoading] =
        useState(true);



    const ownerId = "reader001";




    useEffect(()=>{

        loadLists();

    },[]);





    const loadLists = async()=>{

        try{


            const result =
            await getMyReadingLists(ownerId);



            setReadingLists(
                result.data || []
            );



        }catch(error){

            console.log(error);

        }
        finally{

            setLoading(false);

        }

    };







    const handleDelete = async(id)=>{


        const confirmDelete =
        window.confirm(
            "Are you sure you want to delete this reading list?"
        );


        if(!confirmDelete)
            return;



        try{


            await deleteReadingList(
                id,
                {
                    userId: ownerId
                }
            );


            loadLists();



        }catch(error){

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








    return(


        <div className="
        mx-auto
        max-w-6xl
        p-6
        ">



            {/* HEADER */}

            <div className="
            mb-8
            flex
            justify-between
            items-center
            ">



                <div>


                    <h1 className="
                    text-3xl
                    font-bold
                    text-[#352522]
                    ">

                        My Reading Lists

                    </h1>



                    <p className="
                    mt-2
                    text-stone-600
                    ">

                        View and manage your reading collections.

                    </p>



                </div>





                <Link

                to="/reading-lists/create"

                className="
                rounded-xl
                bg-[#b56536]
                px-5
                py-3
                text-white
                font-semibold
                "

                >

                    + Create List

                </Link>



            </div>









            {/* LISTS */}


            <div className="
            space-y-5
            ">



            {
                readingLists.map((list)=>(



                <div

                key={list._id}

                className="
                rounded-xl
                bg-white
                p-6
                shadow
                "



                >




                    <div className="
                    flex
                    justify-between
                    items-start
                    ">





                        {/* LEFT SIDE */}


                        <div>



                            <div className="
                            flex
                            items-center
                            gap-3
                            ">


                                <h2 className="
                                text-xl
                                font-bold
                                text-[#352522]
                                ">

                                    {list.title}

                                </h2>





                                {/* VISIBILITY BADGE */}


                                {
                                    list.visibility === "public" ?


                                    (

                                    <span
                                    className="
                                    rounded-full
                                    bg-green-100
                                    px-3
                                    py-1
                                    text-sm
                                    text-green-700
                                    "
                                    >

                                        🌍 Public

                                    </span>


                                    )


                                    :


                                    (

                                    <span
                                    className="
                                    rounded-full
                                    bg-red-100
                                    px-3
                                    py-1
                                    text-sm
                                    text-red-700
                                    "
                                    >

                                        🔒 Private

                                    </span>


                                    )

                                }



                            </div>






                            <p className="
                            mt-2
                            text-stone-600
                            ">

                                {
                                list.description ||
                                "No description provided."
                                }

                            </p>



                        </div>









                        {/* BUTTONS */}


                        <div className="
                        flex
                        gap-3
                        ">



                            <Link

                            to={`/reading-lists/${list._id}`}

                            className="
                            rounded-lg
                            bg-[#352522]
                            px-4
                            py-2
                            text-white
                            "

                            >

                                View

                            </Link>






                            <Link

                            to={`/reading-lists/edit/${list._id}`}

                            className="
                            rounded-lg
                            bg-blue-600
                            px-4
                            py-2
                            text-white
                            "

                            >

                                ✏ Edit

                            </Link>







                            <button


                            onClick={()=>
                                handleDelete(list._id)
                            }


                            className="
                            rounded-lg
                            bg-red-600
                            px-4
                            py-2
                            text-white
                            "

                            >

                                🗑 Delete


                            </button>





                        </div>





                    </div>









                    {/* STATISTICS */}


                    <div className="
                    mt-5
                    flex
                    gap-6
                    text-sm
                    text-stone-700
                    ">



                        <span>

                            📚 {list.books?.length || 0} Books

                        </span>





                        <span>

                            ♡ {list.likedBy?.length || 0} Likes

                        </span>





                        <span>

                            🔖 {list.savedBy?.length || 0} Saves

                        </span>





                    </div>






                </div>



                ))

            }





            </div>






        </div>



    );


}