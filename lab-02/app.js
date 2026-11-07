const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/books/", async (request, response) => {
  try {
    const getBooksQuery = `SELECT * FROM book ORDER BY id;`;
    const books = await db.all(getBooksQuery);
    response.status(200).json(books);
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  try {
    const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const book = await db.get(getBookQuery, [bookId]);
    if (!book) {
      return response.status(404).json({ message: "Book Not Found" });
    }
    response.status(200).json(book);
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/books/", async (request, response) => {
  const { title, author, price, pages } = request.body;
  try {
    const addBookQuery = `INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?);`;
    const result = await db.run(addBookQuery, [title, author, price, pages]);
    response.status(201).json({
      bookId: result.lastID,
      message: "Book Added Successfully"
    });
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  try {
    const checkQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkQuery, [bookId]);
    if (!existingBook) {
      return response.status(404).json({ message: "Book Not Found" });
    }
    const { title, author, price, pages } = request.body;
    const updateBookQuery = `UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?;`;
    await db.run(updateBookQuery, [title, author, price, pages, bookId]);
    response.status(200).json({ message: "Book Updated Successfully" });
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  try {
    const checkQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkQuery, [bookId]);
    if (!existingBook) {
      return response.status(404).json({ message: "Book Not Found" });
    }
    const deleteBookQuery = `DELETE FROM book WHERE id = ?;`;
    await db.run(deleteBookQuery, [bookId]);
    response.status(200).json({ message: "Book Deleted Successfully" });
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.use((request, response) => {
  response.status(404).json({ message: "Route Not Found" });
});

module.exports = app;
