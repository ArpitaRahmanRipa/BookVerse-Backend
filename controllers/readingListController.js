const ReadingList = require("../models/ReadingList");




// ==========================================
// 1. CREATE A NEW READING LIST
// POST /api/readinglists
// ==========================================

const createReadingList = async(req,res)=>{

try{


const {
ownerId,
title,
description,
visibility,
tags
}=req.body;



if(!ownerId || !title){

return res.status(400).json({

success:false,
message:"ownerId and title are required"

});

}



const readingList =
await ReadingList.create({

ownerId,

title,

description:description || "",

visibility:visibility || "public",

tags:tags || [],

books:[],

likedBy:[],

savedBy:[]

});



res.status(201).json({

success:true,

message:"Reading list created successfully",

data:readingList

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}

};








// ==========================================
// 2. GET PUBLIC READING LISTS
// ==========================================

const getPublicReadingLists = async(req,res)=>{


try{


const readingLists =
await ReadingList.find({

visibility:"public"

})
.sort({

createdAt:-1

});



res.json({

success:true,

data:readingLists

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};








// ==========================================
// 3. GET USER LISTS
// ==========================================

const getMyReadingLists = async(req,res)=>{


try{


const readingLists =
await ReadingList.find({

ownerId:req.params.ownerId

})
.sort({

createdAt:-1

});



res.json({

success:true,

data:readingLists

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};








// ==========================================
// 4. GET SINGLE READING LIST
// ==========================================


const getReadingListById = async(req,res)=>{


try{


const readingList =
await ReadingList.findById(
req.params.id
);



if(!readingList){


return res.status(404).json({

success:false,

message:"Reading list not found"

});


}




res.json({

success:true,

data:readingList

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// 5. UPDATE READING LIST
// PUT /api/readinglists/:id
// ==========================================


const updateReadingList = async(req,res)=>{


try{


const updatedList =
await ReadingList.findByIdAndUpdate(

req.params.id,

{

title:req.body.title,

description:req.body.description,

visibility:req.body.visibility,

tags:req.body.tags

},

{

new:true

}

);



if(!updatedList){


return res.status(404).json({

success:false,

message:"Reading list not found"

});


}



res.json({

success:true,

data:updatedList

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// 6. ADD BOOK TO READING LIST
// POST /api/readinglists/:id/books
// ==========================================


const addBookToReadingList = async(req,res)=>{


try{


const readingList =
await ReadingList.findById(
req.params.id
);



if(!readingList){


return res.status(404).json({

success:false,

message:"Reading list not found"

});


}




readingList.books.push({

bookId:req.body.bookId,

title:req.body.title,

author:req.body.author,

notes:req.body.notes || "",

rank:
readingList.books.length + 1


});




await readingList.save();



res.json({

success:true,

message:"Book added successfully",

data:readingList

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// 7. REMOVE BOOK
// DELETE /api/readinglists/:id/books/:bookId
// ==========================================


const removeBookFromReadingList = async(req,res)=>{


try{


const readingList =
await ReadingList.findById(
req.params.id
);



readingList.books =
readingList.books.filter(

book =>
book.bookId !== req.params.bookId

);



await readingList.save();



res.json({

success:true,

data:readingList

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// 8. REORDER BOOKS
// PUT /api/readinglists/:id/reorder
// ==========================================


const reorderBooks = async(req,res)=>{


try{


const readingList =
await ReadingList.findById(
req.params.id
);



readingList.books =
req.body.books;



await readingList.save();



res.json({

success:true,

data:readingList

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// 9. LIKE / UNLIKE
// ==========================================


const toggleLikeReadingList = async(req,res)=>{


try{


const list =
await ReadingList.findById(
req.params.id
);



const userId=req.body.userId;



if(list.likedBy.includes(userId)){


list.likedBy =
list.likedBy.filter(

id=>id!==userId

);


}else{


list.likedBy.push(userId);


}



await list.save();



res.json({

success:true,

data:list

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// 10. SAVE / UNSAVE
// ==========================================


const toggleSaveReadingList = async(req,res)=>{


try{


const list =
await ReadingList.findById(
req.params.id
);



const userId=req.body.userId;



if(list.savedBy.includes(userId)){


list.savedBy =
list.savedBy.filter(

id=>id!==userId

);


}else{


list.savedBy.push(userId);


}



await list.save();



res.json({

success:true,

data:list

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// 11. DELETE LIST
// ==========================================


const deleteReadingList = async(req,res)=>{


try{


await ReadingList.findByIdAndDelete(
req.params.id
);



res.json({

success:true,

message:"Deleted successfully"

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// EXPORT
// ==========================================


module.exports={


createReadingList,

getPublicReadingLists,

getMyReadingLists,

getReadingListById,

updateReadingList,

addBookToReadingList,

removeBookFromReadingList,

reorderBooks,

toggleLikeReadingList,

toggleSaveReadingList,

deleteReadingList


};