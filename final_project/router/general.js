const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
    else {
      users.push({ username, password });
      //console.log(users);
      return res.status(200).json({ message: "User registered successfully" });
    }
  }
  else {
    return res.status(400).json({ message: "Invalid request." });
  }
});

// Get the book list available in the shop
/* public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).json(books);
}); */

// Task 10 
// Get the book list available in the shop using promises
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    });
});




// Get book details based on ISBN
/* public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  else {
    return res.status(404).json({ message: "Book not found" });
  }
}); */

// Task 11
// Get book details based on ISBN using promises
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    }
    else {
      reject({ message: "Book not found" });
    }
  })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(error => {
      console.error(error);
      return res.status(404).json(error);
    });
});


// Get book details based on author
/* public_users.get('/author/:author', function (req, res) {
  //Write your code here
  let author = req.params.author;
  let booksByAuthor = [];
  for (let book in books) {
    if (books[book].author.toLowerCase() == author.toLowerCase()) {
      booksByAuthor.push(books[book]);
    }
  }
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  }
  else {
    return res.status(404).json({ message: "Book not found" });
  }
}); */

// Task 12
// Get book details based on author using promises
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  new Promise((resolve, reject) => {
    let booksByAuthor = [];
    for (let book in books) {
      if (books[book].author.toLowerCase() == author.toLowerCase()) {
        booksByAuthor.push(books[book]);
      }
    }
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    }
    else {
      reject({ message: "Book not found" });
    }
  })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(error => {
      console.error(error);
      return res.status(404).json(error);
    });
});


// Get all books based on title
/* public_users.get('/title/:title', function (req, res) {
  //Write your code here
  let title = req.params.title;
  let booksByTitle = [];
  for (let book in books) {
    if (books[book].title.toLowerCase() == title.toLowerCase()) {
      booksByTitle.push(books[book]);
    }
  }
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  }
  else {
    return res.status(404).json({ message: "Book not found" });
  }
}); */

// Task 13
// Get all books based on title using promises
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  new Promise((resolve, reject) => {
    let booksByTitle = [];
    for (let book in books) {
      if (books[book].title.toLowerCase() == title.toLowerCase()) {
        booksByTitle.push(books[book]);
      }
    }
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    }
    else {
      reject({ message: "Book not found" });
    }
  })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(error => {
      console.error(error);
      return res.status(404).json(error);
    });
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
