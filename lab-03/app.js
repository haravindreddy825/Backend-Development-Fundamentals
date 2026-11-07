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
  const {
    search_q = "",
    order_by = "id",
    order = "ASC",
    limit = 10,
    offset = 0,
    min_price,
    max_price
  } = request.query;

  let getBooksQuery = "";
  let queryParams = [];

  if (min_price !== undefined && max_price !== undefined) {
    getBooksQuery = `
      SELECT
        *
      FROM
        book
      WHERE
        title LIKE ?
        AND price BETWEEN ? AND ?
      ORDER BY
        ${order_by} ${order}
      LIMIT ? OFFSET ?;
    `;
    queryParams = [`%${search_q}%`, Number(min_price), Number(max_price), Number(limit), Number(offset)];
  } else {
    getBooksQuery = `
      SELECT
        *
      FROM
        book
      WHERE
        title LIKE ?
      ORDER BY
        ${order_by} ${order}
      LIMIT ? OFFSET ?;
    `;
    queryParams = [`%${search_q}%`, Number(limit), Number(offset)];
  }

  const books = await db.all(getBooksQuery, queryParams);
  response.status(200).json(books);
});

app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const getBookQuery = `
    SELECT
      *
    FROM
      book
    WHERE
      id = ?;
  `;
  const book = await db.get(getBookQuery, [bookId]);
  if (!book) {
    return response.status(404).json({ message: "Book Not Found" });
  }
  response.status(200).json(book);
});

app.post("/books/", async (request, response) => {
  const { title, author, price, pages } = request.body;
  if (!title || typeof title !== "string" || title.trim() === "") {
    return response.status(400).json({ message: "Invalid or missing title" });
  }
  if (!author || typeof author !== "string" || author.trim() === "") {
    return response.status(400).json({ message: "Invalid or missing author" });
  }
  if (price === undefined || typeof price !== "number" || isNaN(price) || price < 0) {
    return response.status(400).json({ message: "Price must be a non-negative number" });
  }
  const pagesCount = pages !== undefined && typeof pages === "number" && pages >= 0 ? pages : 0;

  const addBookQuery = `
    INSERT INTO
      book (title, author, price, pages)
    VALUES
      (?, ?, ?, ?);
  `;
  const result = await db.run(addBookQuery, [title.trim(), author.trim(), price, pagesCount]);
  response.status(201).json({
    bookId: result.lastID,
    message: "Book Added Successfully"
  });
});

app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const checkBookQuery = `
    SELECT
      *
    FROM
      book
    WHERE
      id = ?;
  `;
  const existingBook = await db.get(checkBookQuery, [bookId]);
  if (!existingBook) {
    return response.status(404).json({ message: "Book Not Found" });
  }

  const { title, author, price, pages } = request.body;
  if (!title || typeof title !== "string" || title.trim() === "") {
    return response.status(400).json({ message: "Invalid or missing title" });
  }
  if (!author || typeof author !== "string" || author.trim() === "") {
    return response.status(400).json({ message: "Invalid or missing author" });
  }
  if (price === undefined || typeof price !== "number" || isNaN(price) || price < 0) {
    return response.status(400).json({ message: "Price must be a non-negative number" });
  }
  const pagesCount = pages !== undefined && typeof pages === "number" && pages >= 0 ? pages : existingBook.pages;

  const updateBookQuery = `
    UPDATE
      book
    SET
      title = ?,
      author = ?,
      price = ?,
      pages = ?
    WHERE
      id = ?;
  `;
  await db.run(updateBookQuery, [title.trim(), author.trim(), price, pagesCount, bookId]);
  response.status(200).json({ message: "Book Updated Successfully" });
});

app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const checkBookQuery = `
    SELECT
      *
    FROM
      book
    WHERE
      id = ?;
  `;
  const existingBook = await db.get(checkBookQuery, [bookId]);
  if (!existingBook) {
    return response.status(404).json({ message: "Book Not Found" });
  }

  const deleteBookQuery = `
    DELETE FROM
      book
    WHERE
      id = ?;
  `;
  await db.run(deleteBookQuery, [bookId]);
  response.status(200).json({ message: "Book Deleted Successfully" });
});

app.use((request, response) => {
  response.status(404).json({ message: "Route Not Found" });
});

module.exports = app;
