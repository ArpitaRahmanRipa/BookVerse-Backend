import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
  getPublicReadingLists,
} from "../services/readingListApi";


export default function ReadingLists() {


  const [readingLists, setReadingLists] =
    useState([]);


  const [loading, setLoading] =
    useState(true);



  useEffect(() => {


    const loadReadingLists = async () => {


      try {


        const result =
          await getPublicReadingLists();


        setReadingLists(
          result.data || []
        );


      } catch (error) {


        console.error(
          "Failed to load reading lists:",
          error
        );


      } finally {


        setLoading(false);


      }


    };



    loadReadingLists();



  }, []);





  if (loading) {


    return (

      <div className="p-8">

        Loading reading lists...

      </div>

    );


  }






  return (


    <div className="mx-auto max-w-7xl p-6">





      {/* Header */}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">



        <div>


          <h1 className="text-3xl font-bold text-[#352522]">

            Reading Lists

          </h1>



          <p className="mt-2 text-stone-600">

            Discover reading collections created by BookVerse readers.

          </p>



        </div>





        <div className="flex gap-3">



          <Link

            to="/reading-lists/mine"

            className="rounded-xl bg-[#352522] px-5 py-3 font-semibold text-white hover:bg-[#241816]"

          >

            My Lists

          </Link>





          <Link

            to="/reading-lists/create"

            className="rounded-xl bg-[#b56536] px-5 py-3 font-semibold text-white hover:bg-[#9f542f]"

          >

            + Create List

          </Link>



        </div>



      </div>








      <h2 className="mb-5 text-2xl font-bold text-[#352522]">

        Public Reading Lists

      </h2>









      {readingLists.length === 0 ? (



        <div className="rounded-xl bg-white p-6 shadow">


          <p className="text-stone-600">

            No public reading lists found.

          </p>


        </div>



      ) : (



        <div className="space-y-4">





          {readingLists.map((list) => (




            <Link

              key={list._id}

              to={`/reading-lists/${list._id}`}

              className="block"

            >





              <div

                className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg cursor-pointer"

              >





                <h3 className="text-xl font-bold text-[#352522]">

                  {list.title}

                </h3>






                <p className="mt-2 text-stone-600">

                  {list.description ||

                    "No description provided."}

                </p>








                {list.tags?.length > 0 && (



                  <div className="mt-4 flex flex-wrap gap-2">



                    {list.tags.map((tag,index)=>(



                      <span

                        key={`${tag}-${index}`}

                        className="rounded-full bg-[#f7f2e9] px-3 py-1 text-sm text-[#6f473c]"

                      >

                        {tag}

                      </span>



                    ))}



                  </div>



                )}








                <div className="mt-5 flex flex-wrap gap-6 text-sm text-stone-700">



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





            </Link>





          ))}





        </div>




      )}





    </div>



  );

}