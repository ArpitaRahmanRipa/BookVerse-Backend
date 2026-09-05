const express = require("express");

const router = express.Router();


const {

createReadingList,

getPublicReadingLists,

getMyReadingLists,

getReadingListById,

toggleLikeReadingList,

toggleSaveReadingList,

deleteReadingList,

addBookToReadingList,

removeBookFromReadingList,

reorderBooks,

updateReadingList


} = require("../controllers/readingListController");





// CREATE

router.post(
"/",
createReadingList
);





// PUBLIC

router.get(
"/public",
getPublicReadingLists
);





// USER LISTS

router.get(
"/user/:ownerId",
getMyReadingLists
);





// UPDATE READING LIST

router.put(
"/:id",
updateReadingList
);





// ADD BOOK

router.post(
"/:id/books",
addBookToReadingList
);





// REMOVE BOOK

router.delete(
"/:id/books/:bookId",
removeBookFromReadingList
);





// REORDER BOOKS

router.put(
"/:id/reorder",
reorderBooks
);





// LIKE

router.post(
"/:id/like",
toggleLikeReadingList
);





// SAVE

router.post(
"/:id/save",
toggleSaveReadingList
);





// DELETE

router.delete(
"/:id",
deleteReadingList
);





// DETAILS
// IMPORTANT: KEEP THIS LAST

router.get(
"/:id",
getReadingListById
);



module.exports = router;