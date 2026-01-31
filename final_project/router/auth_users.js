const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });

  return usersWithSameName.length > 0;
};

const authenticatedUser = (username, password) => {
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  return validUsers.length > 0;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      'access',
      { expiresIn: 60 * 60 },
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    res.status(200).send('User successfully logged in');
  } else {
    res.status(208).send('Invalid login');
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; // Review is passed as a query parameter
  const username = req.session.authorization['username']; // Get username from session

  if (books[isbn]) {
    let book = books[isbn];
    // If the review for this ISBN doesn't exist, create it; otherwise update it
    book.reviews[username] = review;
    return res
      .status(200)
      .send(
        `The review for the book with ISBN ${isbn} has been added/updated.`,
      );
  } else {
    return res.status(404).json({ message: 'ISBN not found' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
