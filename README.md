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

Welcome to the course repository for **Backend Development Fundamentals** (Year 2, Term 2). This repository houses all lab implementations, source code, database scripts, and comprehensive documentation with IDE-captured outputs.

---

## Lab Directory Index

| Lab Folder | Title | Module | Description |
| :--- | :--- | :--- | :--- |
| **[lab-01](./lab-01/)** | Node.js and Express server | Node.js & Express Fundamentals | Project initialization, native `http` module server, Express rewrite, basic routing (`/`, `/about`, `/time`), 404 fallback handling. |
| **[lab-02](./lab-02/)** | SQLite database and CRUD routes | SQLite & Relational Operations | Embedded SQLite database setup (`books.db`), relational schema design, async `initializeDBAndServer()`, complete CRUD routes with parameterized queries. |
| **[lab-03](./lab-03/)** | REST API, query parameters, validation, debugging | RESTful API & Validation | Query parameter handling (`search_q`, `order_by`, `order`, `limit`, `offset`, `min_price`, `max_price`), strict payload validation, SQL injection prevention, and debugging notes. |

---

## Repository Structure

```text
Backend-Development-Fundamentals/
├── .gitignore
├── README.md
├── lab-01/
│   ├── package.json
│   ├── http_server.js
│   ├── app.js
│   ├── README.md
│   └── screenshots/
│       ├── 01_package_json.png
│       ├── 02_http_server.png
│       ├── 03_express_server.png
│       ├── 04_get_welcome_route.png
│       ├── 05_get_about_route.png
│       ├── 06_get_time_route.png
│       └── 07_get_404_route.png
├── lab-02/
│   ├── package.json
│   ├── setupDb.js
│   ├── books.db
│   ├── app.js
│   ├── README.md
│   └── screenshots/
│       ├── 01_database_setup.png
│       ├── 02_server_code.png
│       ├── 03_get_all_books.png
│       ├── 04_get_single_book.png
│       ├── 05_post_add_book.png
│       ├── 06_put_update_book.png
│       ├── 07_delete_book.png
│       └── 08_sqlite_cli_verification.png
└── lab-03/
    ├── package.json
    ├── setupDb.js
    ├── books.db
    ├── app.js
    ├── README.md
    └── screenshots/
        ├── 01_get_books_default.png
        ├── 02_get_books_search.png
        ├── 03_get_books_price_filter.png
        ├── 04_get_books_sort_pagination.png
        ├── 05_get_single_book_success.png
        ├── 06_get_single_book_not_found.png
        ├── 07_post_book_success.png
        ├── 08_post_book_missing_title.png
        ├── 09_post_book_invalid_price.png
        ├── 10_put_book_success.png
        ├── 11_put_book_not_found.png
        ├── 12_delete_book_success.png
        ├── 13_delete_book_not_found.png
        └── 14_sqlite_cli_verification.png
```

---

## Key Development Principles

- **Zero Comment Rule:** All JavaScript implementation files (`app.js`, `http_server.js`, `setupDb.js`) maintain clean, professional production code without inline or multi-line comments.
- **SQL Injection Prevention:** Every query with dynamic parameters uses parameterized bindings (`?` placeholders).
- **Consistent Response Schema:** All endpoints respond with standardized status codes (`200`, `201`, `400`, `404`, `500`) and predictable JSON response structures.
- **IDE Verification:** All test cases and execution outputs are documented through Visual Studio Code IDE screenshots featuring editor and integrated terminal outputs.
