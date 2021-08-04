//Prefix:/book


//Initializing Express Router
const Router=require("express").Router();

//Database Models

const BookModel=require("../../database/book");


/* 
Route:/ (root)
Description: get all books
Access:public
Parameter:none
Methods:get
*/

Router.get("/",async(req,res)=>{
    const getAllBooks= await BookModel.find();
    return res.json(getAllBooks);
});

/* 
Route:/is 
Description: get specific books based on ISBN
Access:public
Parameter:isbn
Methods:get

*/
Router.get("/is/:isbn",async(req,res)=>{
    const getSpecificBook=await BookModel.findOne({ISBN:req.params.isbn});
       
       if(!getSpecificBook)
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

Router.get("/c/:category",async(req,res)=>{
    const getSpecificBook=await BookModel.findOne({category:req.params.category,});
    
    if(!getSpecificBook)
    {
        return res.json({error:`No book found for the category of ${req.params.category}`,
    });
    }
    return res.json({books:getSpecificBook});
   
   });

/* 
Route:/l
Description: to get list of books based on languages
Access:public
Parameter:language
Methods:get
*/
Router.get("/l/:language",(req,res)=>{
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
Router.post("/add",async(req,res)=>{
    const{newBook}=req.body;
    BookModel.create(newBook);
    return res.json({message:"book was added!"});
});

/* 
Route:/book/update/title
Description: update book title
Access:public
Parameter:isbn
Methods:put
*/
Router.put("/update/title/:isbn",async(req,res)=>{
    const updatedBook=await BookModel.findOneAndUpdate(
       {
        ISBN:req.params.isbn,
       },
       {
        title:req.body.bookTitle,
       },
       {
           new:true,
       }
    );
     
 return res.json({books:updatedBook});
 });

 /* 
Route:/book/delete
Description: delete a book
Access:public
Parameter:isbn
Methods:delete
*/
Router.delete("/delete/:isbn",async(req,res)=>{
  
    const updatedBookDatabase=await BookModel.findOneAndDelete({
       ISBN:req.params.isbn, 
    })
        
        //const updatedBookDatabase=database.books.filter((book)=>book.ISBN!==req.params.isbn);
        //database.books=updatedBookDatabase;
        return res.json({books:updatedBookDatabase});
    
    });


    /* 
Route:/book/update/author
Description: update /add new author for a book
Access:public
Parameter:isbn
Methods:put
*/
Router.put("/update/author/:isbn",async (req,res)=>{
    //update book database
  
    const updatedBook=await BookModel.findOneAndUpdate(
        {
          ISBN:req.params.isbn,
        },
        {
          $addToSet:{
            authors:req.body.newAuthor
          },
        },
        {
            new:true,
        }
    );
  
    //update the author database
  
    const updatedAuthor=await AuthorModel.findOneAndUpdate(
        {
            id:req.body.newAuthor,
        },
        {
            $addToSet:{
                books:req.params.isbn,
            },
        },
        {
         new:true
        }
        );
  
    /*database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            return book.author.push(parseInt(req.params.authorId));
        }
    });
    //update author database
  
    database.author.forEach((author)=>{
        if(author.id===parseInt(req.params.authorId)) return author.books.push(req.params.isbn);
    });*/
    return res.json({
        books:updatedBook,
        author:updatedAuthor,
        message:"New author was added",
      });
  });
  
  

module.exports=Router;