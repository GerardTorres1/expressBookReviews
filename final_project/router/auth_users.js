const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let validUsers = users.filter(user => user.username === username);
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

function set_review(isbn, username, review) {
  let userFound = false;
  if (Object.keys(books[isbn].reviews).length == 0) {
    books[isbn].reviews = [];
    books[isbn].reviews.push({ username: username, review: review });
  }
  else {
    books[isbn].reviews.forEach((rev, index) => {
      if (rev.username == username) {
        books[isbn].reviews[index].review = review;
        userFound = true;
      }
    });
    if (!userFound) {
      books[isbn].reviews.push({ username: username, review: review });
    }
  }
}

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.body.review;
  let username = req.session.authorization.username;
  if (books[isbn]) {
    if (review) {
      set_review(isbn, username, review);
      return res.status(200).json(books[isbn]);
    }
    else {
      return res.status(400).json({ message: "Invalid request" });
    }
  }
  else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  if (books[isbn]) {
    let reviewIndex = -1;
    books[isbn].reviews.forEach((rev, index) => {
      if (rev.username == username) {
        reviewIndex = index;
      }
    });
    if (reviewIndex >= 0) {
      books[isbn].reviews.splice(reviewIndex, 1);
      return res.status(200).json(`${username}'s review has been deleted`);
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
