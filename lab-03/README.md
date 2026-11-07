| Information | Details | Additional Information |
| --- | --- | --- |
| Student Name | PALLE HARAVIND REDDY | |
| Student Registration Number | 252U1R5119 | Class & Section: 313 AI DE 2B |
| Study Level : UG/PG/Doctorate | UG | Year & Term: 2 & 2 |
| Subject Name | Backend Development Fundamentals | |
| Teacher / Faculty Name | Mr Yugandhar Gurjalwar | |
| Name of the Assessment | LAB REPORT - 3 | |
| Date of Submission | 6/11/2026 | |

# Lab 3: REST API, query parameters, validation, debugging

## Objective
The objective of this lab is to develop a production-ready RESTful API for book management using Node.js, Express, and SQLite. The lab demonstrates:
- Designing clean RESTful routes utilizing standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`).
- Handling flexible query parameters on collection endpoints for search (`search_q` with SQL `LIKE`), column sorting (`order_by`), sort direction (`order`), pagination (`limit`, `offset`), and range filtering (`min_price`, `max_price` with `BETWEEN`).
- Implementing strict request payload validation with standardized JSON error responses and appropriate HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).
- Using parameterized SQL queries (`?` placeholders) across all user inputs to prevent SQL Injection vulnerabilities.
- Debugging common backend runtime errors including port collision (`EADDRINUSE`), broken module import paths, database table typos, and unawaited asynchronous operations.

---

## How to Run

### 1. Prerequisites
- Node.js (version 18 or higher)
- npm (Node Package Manager)

### 2. Navigate to Project Directory
```bash
cd lab-03
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Initialize and Seed SQLite Database
```bash
node setupDb.js
```
This creates `books.db` with the `book` table and seeds 10 sample book records.

### 5. Start the Express Server
```bash
npm start
```
The application server starts and listens on `http://localhost:3000/`.

---

## Endpoints Table

| Method | Endpoint | Query / Body Parameters | Success Status | Error Status | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/books/` | `search_q`, `order_by`, `order`, `limit`, `offset`, `min_price`, `max_price` | `200 OK` | `500 Internal Server Error` | Retrieve books with optional search, sorting, price range filtering, and pagination. |
| **GET** | `/books/:bookId/` | Path Parameter: `bookId` | `200 OK` | `404 Not Found`, `500` | Fetch details of a single book by primary key ID. |
| **POST** | `/books/` | Body: `{ title, author, price, pages }` | `201 Created` | `400 Bad Request`, `500` | Add a new book with required field and numeric validation. |
| **PUT** | `/books/:bookId/` | Path: `bookId`<br>Body: `{ title, author, price, pages }` | `200 OK` | `400 Bad Request`, `404 Not Found`, `500` | Update an existing book's details after verifying its existence. |
| **DELETE** | `/books/:bookId/` | Path Parameter: `bookId` | `200 OK` | `404 Not Found`, `500` | Delete a book record by ID after verifying existence. |

---

## Complete Clean Source Code

### `package.json`
```json
{
  "name": "lab-03",
  "version": "1.0.0",
  "description": "Lab 3: REST API, query parameters, validation, debugging",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "setup-db": "node setupDb.js"
  },
  "dependencies": {
    "express": "^4.21.2",
    "sqlite": "^5.1.1",
    "sqlite3": "^5.1.7"
  }
}
```

### `setupDb.js`
```javascript
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "books.db");

const setupDatabase = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await db.exec(`
      DROP TABLE IF EXISTS book;
      CREATE TABLE book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      );
    `);

    const books = [
      ["The Great Gatsby", "F. Scott Fitzgerald", 450, 180],
      ["To Kill a Mockingbird", "Harper Lee", 550, 281],
      ["1984", "George Orwell", 350, 328],
      ["The Catcher in the Rye", "J.D. Salinger", 420, 234],
      ["Pride and Prejudice", "Jane Austen", 280, 279],
      ["The Hobbit", "J.R.R. Tolkien", 600, 310],
      ["Fahrenheit 451", "Ray Bradbury", 320, 249],
      ["Brave New World", "Aldous Huxley", 480, 268],
      ["The Alchemist", "Paulo Coelho", 299, 208],
      ["Crime and Punishment", "Fyodor Dostoevsky", 650, 671]
    ];

    for (const book of books) {
      await db.run(
        `INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)`,
        book
      );
    }

    console.log("Database initialized and seeded successfully.");
    await db.close();
  } catch (error) {
    console.error("Database setup failed:", error.message);
    process.exit(1);
  }
};

setupDatabase();
```

### `app.js`
```javascript
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
```

---

## Working Output & Screenshots

### 1. Default GET Books (`/books/`)
Retrieves the default list of books with limit 10 and ordered by id ascending (`200 OK`).
![Default GET books](screenshots/01_get_books_default.png)

### 2. Search Query Parameter (`/books/?search_q=the`)
Performs partial title matching using SQL `LIKE %the%` returning matching records (`200 OK`).
![Search query](screenshots/02_get_books_search.png)

### 3. Price Range Filter (`/books/?min_price=300&max_price=600`)
Filters books whose price falls between 300 and 600 using `BETWEEN ? AND ?` (`200 OK`).
![Price range filter](screenshots/03_get_books_price_filter.png)

### 4. Sorting & Pagination (`/books/?order_by=price&order=DESC&limit=4`)
Sorts books by price descending with pagination limit of 4 items (`200 OK`).
![Sorting and pagination](screenshots/04_get_books_sort_pagination.png)

### 5. GET Single Book (`/books/3/`)
Retrieves single book by ID with full details (`200 OK`).
![GET single book success](screenshots/05_get_single_book_success.png)

### 6. GET Single Book - Not Found (`/books/999/`)
Handles non-existent ID gracefully returning 404 status (`404 Not Found`).
![GET single book not found](screenshots/06_get_single_book_not_found.png)

### 7. POST Add Book Success (`/books/`)
Successfully creates a new book record and returns generated `bookId` (`201 Created`).
![POST add book success](screenshots/07_post_book_success.png)

### 8. POST Missing Title Error (`/books/`)
Rejects payload missing the required `title` field (`400 Bad Request`).
![POST missing title error](screenshots/08_post_book_missing_title.png)

### 9. POST Invalid Non-Numeric Price Error (`/books/`)
Rejects payload with invalid price format (`400 Bad Request`).
![POST invalid price error](screenshots/09_post_book_invalid_price.png)

### 10. PUT Update Book Success (`/books/3/`)
Updates existing book details after checking record presence (`200 OK`).
![PUT update book success](screenshots/10_put_book_success.png)

### 11. PUT Book Not Found (`/books/999/`)
Returns 404 status when attempting to update a non-existent book ID (`404 Not Found`).
![PUT book not found](screenshots/11_put_book_not_found.png)

### 12. DELETE Book Success (`/books/5/`)
Deletes book record by ID from database (`200 OK`).
![DELETE book success](screenshots/12_delete_book_success.png)

### 13. DELETE Book Not Found (`/books/999/`)
Returns 404 status when attempting to delete a non-existent book ID (`404 Not Found`).
![DELETE book not found](screenshots/13_delete_book_not_found.png)

### 14. SQLite CLI Table Verification
Direct SQLite CLI verification showing table state changes before and after API operations.
![SQLite CLI verification](screenshots/14_sqlite_cli_verification.png)

---

## Viva Questions & Answers

### Q1: What is the difference between a Query Parameter and a Path Parameter?
- **Path Parameters (`req.params`):** Part of the URL path itself (e.g., `/books/:bookId/`). They are used to identify a specific resource or entity hierarchy. They are mandatory for identifying a unique resource.
- **Query Parameters (`req.query`):** Appended to the URL after a question mark `?` as key-value pairs separated by `&` (e.g., `/books?search_q=the&order_by=price`). They are optional and used to sort, filter, paginate, or modify the representation of the collection without changing the resource identifier.

### Q2: What does "stateless" mean in the context of RESTful architecture?
- In REST architecture, **statelessness** means that every HTTP request from the client to the server must contain all the information necessary for the server to understand and process the request.
- The server does not store any client session context between requests.
- Each request is completely independent. This significantly improves scalability, cacheability, and server fault tolerance.

### Q3: When should you return HTTP status code 400 Bad Request vs 404 Not Found?
- **400 Bad Request:** Returned when the client sends an invalid, malformed, or incomplete request (e.g., missing required fields like `title` or `author`, invalid data types such as a string for a numeric `price`, or malformed JSON payload). The problem lies with the request syntax or semantic payload.
- **404 Not Found:** Returned when the client makes a valid request to a URI or resource that does not exist on the server (e.g., requesting `/books/999/` when book ID 999 is not present in the database, or requesting an undefined endpoint path).

---

## Debugging Notes

During development and testing of this lab, four standard backend errors were systematically identified, analyzed, and resolved:

### 1. Port Conflict (`EADDRINUSE`)
- **Symptom:** Error message `Error: listen EADDRINUSE: address already in use :::3000`.
- **Cause:** Another instance of Node.js or a different background process was already bound to port 3000.
- **Resolution:**
  - Located the process PID using Windows PowerShell:
    ```powershell
    Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
    ```
  - Terminated the lingering process:
    ```powershell
    Stop-Process -Id <PID> -Force
    ```
  - Relaunched the server cleanly.

### 2. Broken Import Path
- **Symptom:** `Error: Cannot find module './books.db'` or incorrect path resolution for SQLite database.
- **Cause:** Using relative string paths directly like `open({ filename: "books.db" })`, which resolves relative to the current working directory of the shell rather than the directory of `app.js`.
- **Resolution:** Utilized Node.js `path.join(__dirname, "books.db")` to guarantee absolute path resolution independent of where the node command was executed.

### 3. Table-Name Typo (`no such table`)
- **Symptom:** `DB Error: SQLITE_ERROR: no such table: books`.
- **Cause:** Discrepancy between table creation schema naming (`book` singular) and SQL queries written as `SELECT * FROM books` (plural).
- **Resolution:** Standardized database table definition to `book` across both `setupDb.js` and all SQL query strings in `app.js`.

### 4. Missing `await` in Database Operations
- **Symptom:** Endpoint returning empty objects, unhandled promise rejections, or asynchronous queries completing after the HTTP response was already sent.
- **Cause:** Calling asynchronous SQLite driver methods (such as `db.get()`, `db.all()`, or `db.run()`) without the `await` keyword.
- **Resolution:** Ensured every database call inside route handlers is properly prefixed with `await` within `async (request, response)` functions, wrapped in robust `try...catch` blocks.
