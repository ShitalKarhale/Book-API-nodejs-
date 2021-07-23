let books=[
    {
      ISBN:"12345Book",
      title:"Getting started with MERN",
      pubDate:"2021-07-07",
      language:"en",
      numPage:250,
      author:[1,2],
      publications:[1],
      category:["tech","programming","thriller"]
    },
    {
        ISBN:"12345ONE",
        title:"Getting started with Python",
        pubDate:"2021-10-10",
        language:"en",
        numPage:252,
        author:[1,2],
        publications:[1],
        category:["tech","programming","thriller"]
      },
];

const author=[
    {
      id:1,
      name:"Shital",
      books:["12345Book","123456789Secret","12345ONE"],
    },
    {
        id:2,
        name:"Elon Musk",
        books:["12345Book","12345ONE"],
    },
 ];

const publication=[
    {
        id:1,
        name:"writex",
        books:["12345Book"],

    },
    {
        "id": 2,
        "name": "Jinay",
        "books": [
            "12345ONE"
        ]
    },
    
];
module.exports={books,author,publication};