const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  //Write your code here
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({ message: 'Book not found' });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const allBooks = Object.keys(books);
  let matchingBooks = [];

  allBooks.forEach((key) => {
    if (books[key].author === author) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks > 0) {
    return res.status(200).json(matchingBooks);
  }
  return res.status(404).json({ message: 'No books found by this author' });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const allBooks = Object.key(books);
  let matchingBooks = [];

  allBooks.forEach((key) => {
    if (books[key].title === title) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  }
  return res.status(404).json({ message: 'No books foudn with this title' });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: 'Book not found' });
});

module.exports.general = public_users;
