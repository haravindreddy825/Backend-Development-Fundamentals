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
