const fs = require('fs')


let books = JSON.parse(fs.readFileSync("./data/books.json"));

// create param middleware
// to check if book against is present
// we can implement params in each router
//  what is param middleware and where we can use it 

const checkId = (req, res,next, value)=> {
    const book = books.find((book) => parseInt(book.id) === parseInt(value));

    if (!book) {
        return res.status(404).json({
            message: `Book with id ${value} is not found!`,
            status: "fail",
        });
    }

    next()
}

// middleware for body validation

const validateBody   = (req, res, next)=>{
    const book = req.body;
    if(!book.name || !book.releasedate || !book.page){
        return res.status(400).json({
            status: 'fail',
            message: 'invalid data for book'
        })
    }
    next()
}


// Route Handler Functions

const getAllBooks = (req, res) => {
    res.status(200).json({
        status: "success",
        count: books.length,
        data: {
            books,
        },
    });
}

const getBook = (req, res) => {
    console.log(req.params.id);
    const bookId = req.params.id;
    const book = books.find((book) => parseInt(book.id) === parseInt(bookId));

    // if (!book) {
    //     res.status(404).json({
    //         message: "Book not found",
    //         status: "fail",
    //     });
    //     return; // stops the function execution here if book not found
    // }

    res.status(200).json({
        status: "success",
        data: {
            book,
        },
    });
}

const updateBook = (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex((book) => parseInt(book.id) === bookId);

// CODE implemented in PARAM middleware

    // if (bookIndex === -1) {
    //     res.status(404).json({
    //         message: "Book not found",
    //         status: "fail",
    //     });
    //     return; // stops the function execution here if book not found
    // }

    const bookToUpdate = Object.assign({}, books[bookIndex], req.body);
    books[bookIndex] = bookToUpdate;

    // Save to file after updating the book  // null as second argument makes JSON.stringify pretty-print the JSON  // 2 as third argument makes JSON.stringify use 2 spaces for indentation
    fs.writeFile("./data/books.json", JSON.stringify(books, null, 2), (err) => {
        if (err) {
            res.status(500).json({ message: "Something went wrong" });
        }
        res.status(200).json({
            data: {
                book: bookToUpdate,
            },
            status: "success",
        });
    });
}

const deleteBook = (req, res) => {
    const bookId = req.params.id * 1;
    const bookToDelete = books.findIndex((book) => bookId === book.id * 1);

    // CODE implemented in PARAM middleware
    // if (bookToDelete === -1) {
    //     return res.status(404).json({
    //         data: {
    //             message: "Not Found!",
    //         },
    //         status: "fail",
    //     });
    // }
    // it will mutate the original array
    books.splice(bookToDelete, 1);
    fs.writeFile("./data/books.json", JSON.stringify(books, null, 2), (err) => {
        res.status(204).json({
            data: { book: null },
            status: "success",
        });
    });
}

const createBook = (req, res) => {
    const book = req.body;
    const id = books.length + 1;

    const newBook = Object.assign({ id }, book);
    books.push(newBook);

    // Save to file after adding the new book  // null as second argument makes JSON.stringify pretty-print the JSON  // 2 as third argument makes JSON.stringify use 2 spaces for indentation
    fs.writeFile("./data/books.json", JSON.stringify(books, null, 2), (err) => {
        if (err) {
            res.status(500).json({
                message: "Error saving book to file",
                status: 500,
                hasError: true,
            });
        }
        res.status(201).json({
            message: "Book created successfully",
            status: 201,
            hasError: false,
        });
    });

}

module.exports = {
    getAllBooks,
    createBook,
    getBook, 
    deleteBook, 
    updateBook, 
    checkId,
    validateBody
}
