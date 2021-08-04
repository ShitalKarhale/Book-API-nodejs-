const Router=require("express").Router();



/* 
Route:/publications
Description: get all publications
Access:public
Parameter:none
Methods:get
*/
Router.get("/",(req,res)=>{
    return res.json({publication:database.publication});
});


/* 
Route:/publication/add
Description: add new publication
Access:public
Parameter:none
Methods:post
*/
Router.post("/add",(req,res)=>{
    const { newPublication }=req.body;
  PublicationModel.create(newPublication );
    return res.json({message:"publication was added!"});
});

/* 
Route:/publication/update/book
Description: update/add new book to a publication
Access:public
Parameter:isbn
Methods:put
*/

Router.put("/update/book/:isbn",(req,res)=>{

    //update the publication database
    database.publication.forEach((publication)=>{
        if(publication.id===req.body.pubId){
         return publication.books.push(req.params.isbn);
        }
    });
    
    //update the book database
    database.books.forEach((book)=>{
     if(book.ISBN===req.params.isbn){
        book.publication=req.body.pubId;
        return;
     }
    });

    return res.json({
        books:database.books,
        publication:database.publication,
        message:"Successfully updated publication",
    });
});


/* 
Route:/publication/delete/book
Description: delete a book from publication
Access:public
Parameter:isbn,publication id
Methods:delete

*/

Router.delete("/delete/book/:isbn/:pubId",(req,res)=>{

    //update publication database
    database.publication.forEach((publication)=>{
        if(publication.id===parseInt(req.params.pubId)){
            const newBookList=publication.books.filter(
             (book)=>book!==req.params.isbn
            );
            publication.books=newBookList;
            return;
        }
    });
    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            book.publication=0;//no publication available
            return;
        }
    });
    return res.json({books:database.books,publication:database.publication});
});

module.exports=Router;