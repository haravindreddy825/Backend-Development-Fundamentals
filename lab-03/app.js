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

  const validColumns = ["id", "title", "author", "price", "pages"];
  const sortColumn = validColumns.includes(order_by) ? order_by : "id";
  const sortOrder = order && order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const conditions = ["title LIKE ?"];
  const queryParams = [`%${search_q}%`];

  if (min_price !== undefined && max_price !== undefined && min_price !== "" && max_price !== "") {
    conditions.push("price BETWEEN ? AND ?");
    queryParams.push(Number(min_price), Number(max_price));
  } else if (min_price !== undefined && min_price !== "") {
    conditions.push("price >= ?");
    queryParams.push(Number(min_price));
  } else if (max_price !== undefined && max_price !== "") {
    conditions.push("price <= ?");
    queryParams.push(Number(max_price));
  }

  const whereClause = conditions.join(" AND ");
  const getBooksQuery = `
    SELECT * FROM book
    WHERE ${whereClause}
    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  queryParams.push(Number(limit), Number(offset));

  try {
    const books = await db.all(getBooksQuery, queryParams);
    response.status(200).json(books);
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  try {
    const getBookQuery = `SELECT * FROM book WHERE id = ?`;
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
  if (!title || typeof title !== "string" || title.trim() === "") {
    return response.status(400).json({ message: "Invalid or missing title" });
  }
  if (!author || typeof author !== "string" || author.trim() === "") {
    return response.status(400).json({ message: "Invalid or missing author" });
  }
  if (price === undefined || typeof price !== "number" || isNaN(price) || price < 0) {
    return response.status(400).json({ message: "Price must be a non-negative number" });
  }
  if (pages !== undefined && (typeof pages !== "number" || isNaN(pages) || pages < 0)) {
    return response.status(400).json({ message: "Pages must be a non-negative number" });
  }
  const pagesCount = pages !== undefined ? pages : 0;
  try {
    const addBookQuery = `INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)`;
    const result = await db.run(addBookQuery, [title.trim(), author.trim(), price, pagesCount]);
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
    const checkQuery = `SELECT * FROM book WHERE id = ?`;
    const existingBook = await db.get(checkQuery, [bookId]);
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
    if (pages !== undefined && (typeof pages !== "number" || isNaN(pages) || pages < 0)) {
      return response.status(400).json({ message: "Pages must be a non-negative number" });
    }
    const pagesCount = pages !== undefined ? pages : existingBook.pages;
    const updateQuery = `UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?`;
    await db.run(updateQuery, [title.trim(), author.trim(), price, pagesCount, bookId]);
    response.status(200).json({ message: "Book Updated Successfully" });
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  try {
    const checkQuery = `SELECT * FROM book WHERE id = ?`;
    const existingBook = await db.get(checkQuery, [bookId]);
    if (!existingBook) {
      return response.status(404).json({ message: "Book Not Found" });
    }
    const deleteQuery = `DELETE FROM book WHERE id = ?`;
    await db.run(deleteQuery, [bookId]);
    response.status(200).json({ message: "Book Deleted Successfully" });
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.use((request, response) => {
  response.status(404).json({ message: "Route Not Found" });
});

module.exports = app;
