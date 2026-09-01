import { useEffect, useState } from "react";
import { getYearlyReadingWrapped } from "../services/readingWrappedApi";

const USER_ID = "21201436";


export default function ReadingWrapped() {

  const [wrapped, setWrapped] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const year = new Date().getFullYear();



  useEffect(() => {

    const loadWrapped = async () => {

      try {

        const result =
          await getYearlyReadingWrapped(
            USER_ID,
            year
          );


        setWrapped(result.data);


      } catch (err) {

        setError(err.message);


      } finally {

        setLoading(false);

      }

    };


    loadWrapped();


  }, []);





  const handleShare = async () => {

    const topBook =
      wrapped.highestRatedBooks?.[0];


    const shareText = `
📚 My ${wrapped.year} Reading Wrapped

Books Read: ${wrapped.totalBooksRead}

Pages Read: ${wrapped.totalPagesRead}

Favourite Author:
${wrapped.favoriteAuthors?.[0]?.author || "N/A"}

Top Rated Book:
${topBook?.title || "N/A"}

Rating:
⭐ ${topBook?.rating || "N/A"}

Achievement:
${wrapped.achievements?.[0]?.title || "N/A"}

Created with BookVerse
    `;


    try {

      if (navigator.share) {

        await navigator.share({

          title:
            `${wrapped.year} Reading Wrapped`,

          text:
            shareText,

        });


        setShareMessage(
          "Shared successfully!"
        );


      } else {


        await navigator.clipboard.writeText(
          shareText
        );


        setShareMessage(
          "Copied to clipboard!"
        );

      }


    } catch (error) {

      setShareMessage(
        "Sharing cancelled."
      );

    }

  };





  if (loading) {

    return (

      <div className="p-10 text-center">

        Loading your Reading Wrapped...

      </div>

    );

  }





  if (error) {

    return (

      <div className="p-10 text-center text-red-600">

        {error}

      </div>

    );

  }





  return (

    <div className="min-h-screen bg-[#f7f2e9] p-8">


      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow p-8">



        <h1 className="text-4xl font-bold text-center mb-5">

          📚 {wrapped.year} Reading Wrapped

        </h1>




        {/* Share Button */}

        <div className="text-center mb-8">


          <button

            onClick={handleShare}

            className="rounded-xl bg-[#352522] px-6 py-3 font-semibold text-white hover:bg-[#4a332e]"

          >

            📤 Share My Reading Wrapped

          </button>



          {shareMessage && (

            <p className="mt-3 text-green-700">

              {shareMessage}

            </p>

          )}


        </div>







        {/* Summary Cards */}


        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">



          <div className="bg-[#faf6ef] rounded-xl p-5">

            <p className="text-gray-500">
              Books Read
            </p>

            <h2 className="text-3xl font-bold">

              {wrapped.totalBooksRead}

            </h2>

          </div>





          <div className="bg-[#faf6ef] rounded-xl p-5">

            <p className="text-gray-500">
              Pages Read
            </p>

            <h2 className="text-3xl font-bold">

              {wrapped.totalPagesRead}

            </h2>

          </div>





          <div className="bg-[#faf6ef] rounded-xl p-5">

            <p className="text-gray-500">
              Active Month
            </p>

            <h2 className="text-xl font-bold">

              {wrapped.mostActiveMonth?.month ||
                "N/A"}

            </h2>

          </div>





          <div className="bg-[#faf6ef] rounded-xl p-5">

            <p className="text-gray-500">
              Achievements
            </p>

            <h2 className="text-3xl font-bold">

              {wrapped.achievements.length}

            </h2>

          </div>



        </div>







        {/* Highest Rated Books */}


        <section className="mt-10">


          <h2 className="text-2xl font-bold mb-4">

            ⭐ Highest Rated Books

          </h2>



          {wrapped.highestRatedBooks.map(

            (book,index)=>(

              <div

                key={index}

                className="border rounded-xl p-4 mb-3"

              >

                <p className="font-semibold">

                  {book.title}

                </p>


                <p>

                  {book.author}

                </p>


                <p>

                  Rating: ⭐ {book.rating}

                </p>


              </div>

            )

          )}



        </section>







        {/* Favourite Authors */}


        <section className="mt-10">


          <h2 className="text-2xl font-bold mb-4">

            ✍️ Favourite Authors

          </h2>



          {wrapped.favoriteAuthors.map(

            (author,index)=>(

              <p key={index}>

                {author.author}

                {" "}

                ({author.booksRead} books)

              </p>

            )

          )}



        </section>







        {/* Achievements */}


        <section className="mt-10">


          <h2 className="text-2xl font-bold mb-4">

            🏆 Achievements

          </h2>




          {wrapped.achievements.map(

            (item,index)=>(

              <div

                key={index}

                className="bg-[#faf6ef] rounded-xl p-4 mb-3"

              >

                <p className="font-bold">

                  {item.title}

                </p>


                <p>

                  {item.description}

                </p>


              </div>

            )

          )}




        </section>




      </div>


    </div>

  );

}