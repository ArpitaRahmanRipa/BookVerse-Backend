const axios = require("axios");
const ReadingProgress = require("../models/ReadingProgress");


// ========================================
// FORMAT GOOGLE BOOK
// ========================================

const formatGoogleBook = (item) => {

    const info = item.volumeInfo || {};

    return {

        googleBookId:
            item.id || null,


        openLibraryId:
            null,


        title:
            info.title || "Unknown title",


        authors:
            info.authors || [],


        description:
            info.description ||
            "No description available.",


        isbn:
            info.industryIdentifiers?.[0]?.identifier ||
            null,


        publicationDate:
            info.publishedDate || null,


        pageCount:
            info.pageCount || 0,


        language:
            info.language || null,


        categories:
            info.categories || [],


        coverImage:
            info.imageLinks?.thumbnail ||
            info.imageLinks?.smallThumbnail ||
            "",


        averageRating:
            info.averageRating || 0,


        ratingsCount:
            info.ratingsCount || 0,


        previewLink:
            info.previewLink || ""

    };

};





// ========================================
// READER ACTIVITY
// ========================================

const getReaderActivity = async (bookTitle) => {


    const currentlyReading =
        await ReadingProgress.countDocuments({

            bookTitle,

            status:
            "Currently Reading"

        });



    const completed =
        await ReadingProgress.countDocuments({

            bookTitle,

            status:
            "Finished"

        });



    const totalReaders =
        await ReadingProgress.countDocuments({

            bookTitle

        });



    return {

        currentlyReading,

        completed,

        totalReaders

    };

};







// ========================================
// SEARCH BOOKS
// GET /api/books/search
// ========================================

const searchBooks = async (req,res)=>{


    try{


        const {

            title,

            author,

            isbn,

            genre,

            year,

            query


        } = req.query;



        const terms = [];



        if(title)
            terms.push(
                `intitle:${title}`
            );



        if(author)
            terms.push(
                `inauthor:${author}`
            );



        if(isbn)
            terms.push(
                `isbn:${isbn}`
            );



        if(genre)
            terms.push(
                `subject:${genre}`
            );



        if(year)
            terms.push(
                year
            );



        if(query)
            terms.push(
                query
            );





        if(terms.length === 0){


            return res.status(400).json({

                success:false,

                message:
                "Provide search value"

            });


        }






        const response =

            await axios.get(

                `${process.env.GOOGLE_BOOKS_API}/volumes`,

                {

                    params:{


                        q:
                        terms.join(" "),


                        maxResults:
                        20,


                        key:
                        process.env.GOOGLE_BOOKS_KEY


                    },


                    timeout:
                    30000


                }

            );







        const books =

            (response.data.items || [])

            .map(formatGoogleBook);







        return res.status(200).json({


            success:true,


            source:
            "Google Books",



            totalItems:
            response.data.totalItems || 0,



            results:
            books.length,



            books


        });





    }


    catch(error){



        console.log(

            "Google Books Error:",

            error.response?.data ||
            error.message

        );





        return res.status(500).json({


            success:false,


            message:
            "Unable to search books",



            error:
            error.response?.data ||
            error.message



        });



    }



};









// ========================================
// GET BOOK DETAILS
// GET /api/books/:id
// ========================================

const getBookDetails = async(req,res)=>{


    try{


        const {

            id

        } = req.params;





        const response =

            await axios.get(


                `${process.env.GOOGLE_BOOKS_API}/volumes/${id}`,

                {

                    params:{


                        key:
                        process.env.GOOGLE_BOOKS_KEY


                    }

                }


            );







        const book =

            formatGoogleBook(

                response.data

            );







        const readerActivity =

            await getReaderActivity(

                book.title

            );








        return res.status(200).json({



            success:true,



            source:
            "Google Books",



            book,



            readerActivity,



            shelfOptions:[


                "Want to Read",


                "Currently Reading",


                "Read"


            ]



        });





    }


    catch(error){



        console.log(

            "Book Details Error:",

            error.response?.data ||
            error.message

        );





        return res.status(500).json({


            success:false,


            message:
            "Unable to retrieve book details",



            error:
            error.response?.data ||
            error.message



        });



    }



};








// ========================================
// EXPORT
// ========================================


module.exports = {


    searchBooks,


    getBookDetails


};