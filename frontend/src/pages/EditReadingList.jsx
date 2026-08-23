import {
    useEffect,
    useState
} from "react";


import {
    useNavigate,
    useParams
} from "react-router";


import {
    getReadingListById,
    updateReadingList,
    addBookToReadingList,
    removeBookFromReadingList
} from "../services/readingListApi";




export default function EditReadingList(){


    const {id}=useParams();


    const navigate=useNavigate();




    const [formData,setFormData]=useState({

        title:"",
        description:"",
        visibility:"public",
        tags:""

    });




    const [books,setBooks]=useState([]);




    const [newBook,setNewBook]=useState({

        bookId:"",
        title:"",
        author:"",
        notes:""

    });





    const [loading,setLoading]=useState(true);





    useEffect(()=>{

        loadList();

    },[]);






    const loadList=async()=>{


        try{


            const result =
            await getReadingListById(id);



            const list=result.data;



            setFormData({

                title:list.title || "",

                description:list.description || "",

                visibility:list.visibility || "public",

                tags:list.tags?.join(", ") || ""

            });



            setBooks(
                list.books || []
            );



        }catch(error){

            console.log(error);

        }
        finally{

            setLoading(false);

        }


    };









    const handleChange=(e)=>{


        setFormData({

            ...formData,

            [e.target.name]:
            e.target.value

        });


    };







    const handleBookChange=(e)=>{


        setNewBook({

            ...newBook,

            [e.target.name]:
            e.target.value

        });


    };








    const handleSubmit=async(e)=>{


        e.preventDefault();



        try{


            await updateReadingList(

                id,

                {

                    title:formData.title,

                    description:formData.description,

                    visibility:formData.visibility,

                    tags:
                    formData.tags
                    .split(",")
                    .map(
                        tag=>tag.trim()
                    )

                }

            );



            alert(
                "Reading list updated"
            );



        }catch(error){


            console.log(error);


        }


    };









    const handleAddBook=async()=>{


        try{


            await addBookToReadingList(

                id,

                {

                    bookId:
                    newBook.bookId,


                    title:
                    newBook.title,


                    author:
                    newBook.author,


                    notes:
                    newBook.notes


                }

            );



            setNewBook({

                bookId:"",
                title:"",
                author:"",
                notes:""

            });



            loadList();



        }catch(error){


            console.log(error);


        }


    };









    const handleRemoveBook=async(bookId)=>{


        try{


            await removeBookFromReadingList(

                id,

                bookId,

                {}

            );


            loadList();



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
        max-w-3xl
        p-6
        ">



            <div className="
            rounded-xl
            bg-white
            p-8
            shadow
            ">




            <h1 className="
            text-3xl
            font-bold
            text-[#352522]
            ">

                Edit Reading List

            </h1>








            <form

            onSubmit={handleSubmit}

            className="
            mt-6
            space-y-5
            ">



                <input

                name="title"

                value={formData.title}

                onChange={handleChange}

                placeholder="Title"

                className="w-full rounded-lg border p-3"

                />





                <textarea

                name="description"

                value={formData.description}

                onChange={handleChange}

                placeholder="Description"

                className="w-full rounded-lg border p-3"

                />





                <select

                name="visibility"

                value={formData.visibility}

                onChange={handleChange}

                className="w-full rounded-lg border p-3"

                >


                    <option value="public">

                        Public

                    </option>


                    <option value="private">

                        Private

                    </option>


                </select>






                <input

                name="tags"

                value={formData.tags}

                onChange={handleChange}

                placeholder="Tags"

                className="w-full rounded-lg border p-3"

                />





                <button

                className="
                rounded-xl
                bg-[#b56536]
                px-6
                py-3
                text-white
                "

                >

                    Save Changes

                </button>


            </form>









            <hr className="my-8"/>









            <h2 className="
            text-2xl
            font-bold
            text-[#352522]
            ">

                Books

            </h2>








            {
                books.map((book)=>(


                <div

                key={book.bookId}

                className="
                mt-4
                rounded-lg
                border
                p-4
                ">


                    <h3 className="font-bold">

                        #{book.rank} {book.title}

                    </h3>


                    <p>

                        Author: {book.author}

                    </p>


                    <p>

                        Notes: {book.notes}

                    </p>



                    <button

                    onClick={()=>
                    handleRemoveBook(book.bookId)
                    }

                    className="
                    mt-2
                    rounded-lg
                    bg-red-600
                    px-3
                    py-2
                    text-white
                    "

                    >

                        Remove

                    </button>



                </div>


                ))

            }









            <h2 className="
            mt-8
            text-xl
            font-bold
            ">

                Add New Book

            </h2>





            <div className="
            mt-4
            space-y-3
            ">


                <input

                name="bookId"

                value={newBook.bookId}

                onChange={handleBookChange}

                placeholder="Book ID"

                className="w-full rounded-lg border p-3"

                />



                <input

                name="title"

                value={newBook.title}

                onChange={handleBookChange}

                placeholder="Book Title"

                className="w-full rounded-lg border p-3"

                />



                <input

                name="author"

                value={newBook.author}

                onChange={handleBookChange}

                placeholder="Author"

                className="w-full rounded-lg border p-3"

                />



                <textarea

                name="notes"

                value={newBook.notes}

                onChange={handleBookChange}

                placeholder="Notes"

                className="w-full rounded-lg border p-3"

                />





                <button

                onClick={handleAddBook}

                className="
                rounded-xl
                bg-[#352522]
                px-5
                py-3
                text-white
                "

                >

                    + Add Book

                </button>


            </div>





            </div>


        </div>


    );


}