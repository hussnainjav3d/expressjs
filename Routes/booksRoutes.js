const express = require('express');
const { getAllBooks, createBook, updateBook, deleteBook, getBook, checkId, validateBody } = require('../Controllers/booksController');


const router = express.Router();

router.param('id', checkId)

router.route('/')
    .get(getAllBooks)
    .post(validateBody,createBook);

router.route("/:id")
    .patch(updateBook)
    .delete(deleteBook)
    .get(getBook)


module.exports = router