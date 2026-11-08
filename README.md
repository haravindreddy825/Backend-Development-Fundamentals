| Information | Details | Additional Information |
| --- | --- | --- |
| Student Name | PALLE HARAVIND REDDY | |
| Student Registration Number | 252U1R5119 | Class & Section: 313 AI DE 2B |
| Study Level : UG/PG/Doctorate | UG | Year & Term: 2 & 2 |
| Subject Name | Backend Development Fundamentals | |
| Teacher / Faculty Name | Mr Yugandhar Gurjalwar | |
| Name of the Assessment | LAB REPORTS (1, 2, 3) | |
| Date of Submission | 6/11/2026 | |

# Backend Development Fundamentals

Welcome to the course repository for **Backend Development Fundamentals** (Year 2, Term 2). This repository houses all lab implementations, source code, database scripts, and comprehensive documentation with test outputs and screenshots.

---

## Lab Directory Index

| Lab Folder | Title | Module | Description |
| :--- | :--- | :--- | :--- |
| **[lab-01](./lab-01/)** | Node.js and Express server | Node.js & Express Fundamentals | Project setup, Express server routing (`/`, `/about`, `/time`), and 404 fallback handling. |
| **[lab-02](./lab-02/)** | SQLite database and CRUD routes | SQLite & Relational Operations | Embedded SQLite database setup (`books.db`), relational schema design, async `initializeDBAndServer()`, and full CRUD routes with parameterized queries. |
| **[lab-03](./lab-03/)** | REST API, query parameters, validation, debugging | RESTful API & Validation | Query parameter handling (`search_q`, `order_by`, `order`, `limit`, `offset`, `min_price`, `max_price`), strict payload validation, SQL injection prevention, and debugging notes. |

---

## Repository Structure

```text
Backend-Development-Fundamentals/
├── .gitignore
├── README.md
├── lab-01/
│   ├── .gitignore
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── screenshots/
│       ├── about-status.png
│       ├── about.png
│       ├── home-status.png
│       ├── home.png
│       ├── not-found-status.png
│       ├── not-found.png
│       ├── time-status.png
│       └── time.png
├── lab-02/
│   ├── .gitignore
│   ├── app.js
│   ├── books.db
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── setupDb.js
│   ├── testEndpoints.js
│   └── screenshots/
│       ├── 01_get_all_books.png
│       ├── 02_get_book_by_id.png
│       ├── 03_post_add_book.png
│       ├── 04_put_update_book.png
│       ├── 05_delete_book.png
│       ├── 06_error_book_not_found.png
│       └── 07_sqlite_cli_verification.png
└── lab-03/
    ├── .gitignore
    ├── app.js
    ├── books.db
    ├── package.json
    ├── package-lock.json
    ├── README.md
    ├── setupDb.js
    ├── testEndpoints.js
    └── screenshots/
        ├── 01_get_books_default.png
        ├── 02_get_books_search_query.png
        ├── 03_get_books_price_filter.png
        ├── 04_get_books_sort_pagination.png
        ├── 05_get_book_by_id.png
        ├── 06_get_book_not_found.png
        ├── 07_post_add_book_success.png
        ├── 08_post_validation_error_missing_title.png
        ├── 09_post_validation_error_invalid_price.png
        ├── 10_put_update_book_success.png
        ├── 11_put_book_not_found.png
        ├── 12_delete_book_success.png
        ├── 13_delete_book_not_found.png
        └── 14_sqlite_cli_verification.png
```

---

## Key Development Principles

- **Zero Comment Rule:** All JavaScript implementation files maintain clean, professional production code without inline or multi-line comments.
- **SQL Injection Prevention:** Every query with dynamic parameters strictly uses parameterized bindings (`?` placeholders).
- **Consistent Response Schema:** All endpoints respond with standardized status codes (`200`, `201`, `400`, `404`, `500`) and predictable JSON response structures.
- **Verification & Documentation:** All test cases and execution outputs are documented through comprehensive screenshots covering success cases, edge cases, error validation, and SQLite CLI database verification.
