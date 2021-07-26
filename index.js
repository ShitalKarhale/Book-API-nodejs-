require("dotenv").config();
//Frame work
const express=require("express");
const mongoose=require("mongoose");

//Database
const database=require("./database");

//Initialization
const booky=express();

//configuration

booky.use(express.json());

//Establish Database connection

mongoose.
connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
    })
 .then(()=>console.log("connection established!!!!"));
/* 
Route:/ (root)
Description: get all books
Access:public
Parameter:none
Methods:get

*/

booky.get("/",(req,res)=>{
    return res.json({books:database.books});
});

/* 
Route:/is 
Description: get specific books based on ISBN
Access:public
Parameter:isbn
Methods:get

*/


booky.get("/is/:isbn",(req,res)=>{
    const getSpecificBook=database.books.filter((book)=>book.ISBN===req.params.isbn);
    
    if(getSpecificBook.length===0)
    {
        return res.json({error:`No book found for the ISBN of ${req.params.isbn}`,
    });
    }
    return res.json({book:getSpecificBook});


});

/* 
Route:/c
Description: get specific books based on category
Access:public
Parameter:category
Methods:get
*/
booky.get("/c/:category",(req,res)=>{
 const getSpecificBook=database.books.filter((book)=>book.category.includes(req.params.category));
 
 if(getSpecificBook.length===0)
 {
     return res.json({error:`No book found for the category of ${req.params.category}`,
 });
 }
 return res.json({book:getSpecificBook});




});
/* 
Route:/l
Description: to get list of books based on languages
Access:public
Parameter:language
Methods:get
*/
booky.get("/l/:language",(req,res)=>{
    const getSpecificBook=database.books.filter((book)=>book.language===req.params.language);
    
    if(getSpecificBook.length===0)
    {
        return res.json({error:`No book found for the language of ${req.params.language}`,
    });
    }
    return res.json({book:getSpecificBook});
   
});
/* 
Route:/book/add
Description: add new book
Access:public
Parameter:none
Methods:post
*/
booky.post("/book/add",(req,res)=>{
    const{newBook}=req.body;
    database.books.push(newBook);
    return res.json({books:database.books});
});
/* 
Route:/book/update/title
Description: update book title
Access:public
Parameter:isbn
Methods:put
*/
booky.put("/book/update/title/:isbn",(req,res)=>{
database.books.forEach((book)=>{
   if(book.ISBN===req.params.isbn) {
       book.title=req.body.newBookTitle;
       return;
   }
});
return res.json({books:database.books});
});

/* 
Route:/book/delete
Description: delete a book
Access:public
Parameter:isbn
Methods:delete
*/
booky.delete("/book/delete/:isbn",(req,res)=>{
    const updatedBookDatabase=database.books.filter((book)=>book.ISBN!==req.params.isbn);
    database.books=updatedBookDatabase;
    return res.json({books:database.books});

});


/* 
Route:/book/update/author
Description: update /add new author for a book
Access:public
Parameter:isbn
Methods:put
*/
booky.put("/book/update/author/:isbn/:authorId",(req,res)=>{
  //update book database

  database.books.forEach((book)=>{
      if(book.ISBN===req.params.isbn){
          return book.author.push(parseInt(req.params.authorId));
      }
  });
  //update author database

  database.author.forEach((author)=>{
      if(author.id===parseInt(req.params.authorId)) return author.books.push(req.params.isbn);
  });
  return res.json({books:database.books,author:database.author});
});





/* 
Route:/l
Description: to get all authors
Access:public
Parameter:none
Methods:get
*/
booky.get("/author",(req,res)=>{
    return res.json({authors:database.author});
});

/* 
Route:/author/book
Description: get all authors based on books
Access:public
Parameter:isbn
Methods:get
*/

booky.get("/author/book/:isbn",(req,res)=>{
    const getSpecificAuthor=database.author.filter((author)=>author.books.includes(req.params.isbn));
 
    if(getSpecificAuthor.length===0)
    {
        return res.json({error:`No book found for the book of ${req.params.isbn}`,
    });
    }
    return res.json({author:getSpecificAuthor});
   
      
});

   
   

/* 
Route:/author/add
Description: add new author
Access:public
Parameter:none
Methods:post
*/
booky.post("/author/add",(req,res)=>{
    const { newAuthor }=req.body;
    database.author.push(newAuthor);
    return res.json({authors:database.author});
});

/* 
Route:/book/delete/author
Description: delete a author from a book
Access:public
Parameter:isbn
Methods:delete
*/
booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
  //update the book database
  database.books.forEach((book)=>{
    if(book.ISBN===req.params.isbn){
        const newAuthorList=book.author.filter(
          (author)=>author!==parseInt(req.params.authorId)  
        );
        book.author=newAuthorList;
        return;
    }
  });  
  //update the author database
  database.author.forEach((author)=>{
  if(author.id===parseInt(req.params.authorId)){
      const newBookList=author.books.filter(
      (book)=>book!==req.params.isbn
      );
      author.books=newBookList;
      return;
  }
  });
  return res.json({book:database.books,author:database.author,
    message:"author was deleted!!!",
});
});
    
/* 
Route:/publications
Description: get all publications
Access:public
Parameter:none
Methods:get
*/
booky.get("/publications",(req,res)=>{
    return res.json({publication:database.publication});
});

/* 
Route:/publication/add
Description: add new publication
Access:public
Parameter:none
Methods:post
*/
booky.post("/publication/add",(req,res)=>{
    const { newPublication }=req.body;
    database.publication.push(newPublication);
    return res.json({publication:database.publication});
});
/* 
Route:/publication/update/book
Description: update/add new book to a publication
Access:public
Parameter:isbn
Methods:put
*/
booky.put("/publication/update/book/:isbn",(req,res)=>{

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
booky.delete("/publication/delete/book/:isbn/:pubId",(req,res)=>{

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

booky.listen(3000,()=>console.log("Hey server is running"));