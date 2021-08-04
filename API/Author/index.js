const Router=require("express").Router();

const AuthorModel=require("../../database/author");



/* 
Route:/l
Description: to get all authors
Access:public
Parameter:none
Methods:get
*/


Router.get("/",async(req,res)=>{
    const getAllAuthors=await AuthorModel.find();
    return res.json({authors:getAllAuthors});
});

/* 
Route:/author/book
Description: get all authors based on books
Access:public
Parameter:isbn
Methods:get
*/

Router.get("/book/:isbn",(req,res)=>{
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
Router.post("/add",(req,res)=>{
    const { newAuthor }=req.body;
    AuthorModel.create(newAuthor);
    return res.json({message:"author was added"});
});


/* 
Route:/book/delete/author
Description: delete a author from a book
Access:public
Parameter:isbn,author id
Methods:delete
*/
Router.delete("/book/delete/author/:isbn/:authorId",async (req,res)=>{
    //update the book database
  const updatedBook=await BookModel.findOneAndUpdate(
      {
        ISBN:req.params.isbn,
      },
      {
        $pull:{
         authors:parseInt(req.params.authorId),          
      },
      },
      {new:true}
  );
   
   
    /* database.books.forEach((book)=>{
      if(book.ISBN===req.params.isbn){
          const newAuthorList=book.author.filter(
            (author)=>author!==parseInt(req.params.authorId)  
          );
          book.author=newAuthorList;
          return;
      }
    });*/
  
  
    //update the author database
  
  const updatedAuthor=await AuthorModel.findOneAndUpdate(
      {
      id:parseInt(req.params.authorId),
      },
  
      {
          $pull:{
           books:req.params.isbn,
          },
      },
      {new:true}
  );
  
    /*database.author.forEach((author)=>{
    if(author.id===parseInt(req.params.authorId)){
        const newBookList=author.books.filter(
        (book)=>book!==req.params.isbn
        );
        author.books=newBookList;
        return;
    }
    });
    */
    return res.json({
        book:updatedBook,
        author:updatedAuthor,
        message:"author was deleted!!!",
  });
  });

  module.exports=Router;
      
  