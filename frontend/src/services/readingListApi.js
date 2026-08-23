const API_BASE_URL =
  "http://127.0.0.1:9208/api/readinglists";



// ==========================================
// GET ALL PUBLIC READING LISTS
// GET /api/readinglists/public
// ==========================================

export const getPublicReadingLists = async () => {

  const response = await fetch(
    `${API_BASE_URL}/public`
  );


  const data =
    await response.json();


  return data;

};






// ==========================================
// CREATE A READING LIST
// POST /api/readinglists
// ==========================================

export const createReadingList = async (
  readingListData
) => {


  const response = await fetch(

    API_BASE_URL,

    {

      method:"POST",


      headers:{
        "Content-Type":"application/json",
      },


      body:JSON.stringify(
        readingListData
      ),

    }

  );



  const data =
    await response.json();



  return data;

};








// ==========================================
// GET MY READING LISTS
// GET /api/readinglists/user/:ownerId
// ==========================================

export const getMyReadingLists = async (
  ownerId
) => {


  const response = await fetch(

    `${API_BASE_URL}/user/${ownerId}`

  );



  const data =
    await response.json();



  return data;

};








// ==========================================
// GET SINGLE READING LIST DETAILS
// GET /api/readinglists/:id
// ==========================================

export const getReadingListById = async (
  id
) => {


  const response = await fetch(

    `${API_BASE_URL}/${id}`

  );



  const data =
    await response.json();



  return data;

};









// ==========================================
// LIKE / UNLIKE READING LIST
// POST /api/readinglists/:id/like
// ==========================================

export const toggleLikeReadingList = async (

  id,

  likeData

) => {



  const response = await fetch(

    `${API_BASE_URL}/${id}/like`,

    {


      method:"POST",



      headers:{
        "Content-Type":"application/json",
      },



      body:JSON.stringify(
        likeData
      )


    }

  );



  const data =
    await response.json();



  return data;

};









// ==========================================
// SAVE / UNSAVE READING LIST
// POST /api/readinglists/:id/save
// ==========================================

export const toggleSaveReadingList = async (

  id,

  saveData

) => {



  const response = await fetch(

    `${API_BASE_URL}/${id}/save`,

    {


      method:"POST",



      headers:{
        "Content-Type":"application/json",
      },



      body:JSON.stringify(
        saveData
      )


    }

  );



  const data =
    await response.json();



  return data;

};









// ==========================================
// ADD BOOK TO READING LIST
// POST /api/readinglists/:id/books
// ==========================================

export const addBookToReadingList = async (

  id,

  bookData

) => {



  const response = await fetch(

    `${API_BASE_URL}/${id}/books`,

    {


      method:"POST",



      headers:{
        "Content-Type":"application/json",
      },



      body:JSON.stringify(
        bookData
      )


    }

  );



  const data =
    await response.json();



  return data;

};









// ==========================================
// REMOVE BOOK FROM READING LIST
// DELETE /api/readinglists/:id/books/:bookId
// ==========================================

export const removeBookFromReadingList = async (

  id,

  bookId,

  data

) => {



  const response = await fetch(

    `${API_BASE_URL}/${id}/books/${bookId}`,

    {


      method:"DELETE",



      headers:{
        "Content-Type":"application/json",
      },



      body:JSON.stringify(
        data
      )


    }

  );



  const result =
    await response.json();



  return result;

};









// ==========================================
// REORDER BOOKS
// PUT /api/readinglists/:id/reorder
// ==========================================

export const reorderBooks = async (

  id,

  reorderData

) => {



  const response = await fetch(

    `${API_BASE_URL}/${id}/reorder`,

    {


      method:"PUT",



      headers:{
        "Content-Type":"application/json",
      },



      body:JSON.stringify(
        reorderData
      )


    }

  );



  const data =
    await response.json();



  return data;

};









// ==========================================
// UPDATE READING LIST
// PUT /api/readinglists/:id
// ==========================================

export const updateReadingList = async (

  id,

  updateData

) => {



  const response = await fetch(

    `${API_BASE_URL}/${id}`,

    {


      method:"PUT",



      headers:{
        "Content-Type":"application/json",
      },



      body:JSON.stringify(
        updateData
      )


    }

  );



  const data =
    await response.json();



  return data;

};









// ==========================================
// DELETE READING LIST
// DELETE /api/readinglists/:id
// ==========================================

export const deleteReadingList = async (

  id,

  data

) => {



  const response = await fetch(

    `${API_BASE_URL}/${id}`,

    {


      method:"DELETE",



      headers:{
        "Content-Type":"application/json",
      },



      body:JSON.stringify(
        data
      )


    }

  );



  const result =
    await response.json();



  return result;

};