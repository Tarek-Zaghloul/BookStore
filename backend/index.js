const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");//this incrypt my pass and compare it if it was already in the database when i login 
const jwt = require("jsonwebtoken");//this is used for authentication
const multer = require("multer");//this is used to upload images
const path = require("path");//helps with files for diffrent op system
const fs = require("fs");

const app = express();
const PORT = 3001;
const JWT_SECRET = "your_jwt_secret_key"; // Change this to a secure key

app.use(cors());//allow the rquest to the frontendd
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));//this allow the frontend to display the image 

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },// to know where to upload images
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});//this prevents the collision of image
const upload = multer({ storage: storage });

// MySQL connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "bookstoredb"
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Bookstore Backend running!");
});

// ---------------- USER REGISTRATION ----------------
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    pool.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error POST /register", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ id: result.insertId, username, email });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- USER LOGIN ----------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  pool.query(sql, [email], async (err, rows) => {
    if (err) {
      console.error("Error POST /login", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  });
});

// ---------------- GET CATEGORIES ----------------
app.get("/categories", (req, res) => {
  const sql = "SELECT id, name, description FROM categories";

  pool.query(sql, (err, rows) => {
    if (err) {
      console.error("Error GET /categories", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// ---------------- CREATE CATEGORY ----------------
app.post("/categories", authenticateToken, (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const sql = "INSERT INTO categories (name, description) VALUES (?, ?)";

  pool.query(sql, [name, description || ""], (err, result) => {
    if (err) {
      console.error("Error POST /categories", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ id: result.insertId, name, description });
  });
});

// ---------------- UPDATE CATEGORY ----------------
app.put("/categories/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const sql = "UPDATE categories SET name = ?, description = ? WHERE id = ?";

  pool.query(sql, [name, description || "", id], (err, result) => {
    if (err) {
      console.error("Error PUT /categories/:id", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ id, name, description });
  });
});

// ---------------- DELETE CATEGORY ----------------
app.delete("/categories/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM categories WHERE id = ?";

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error DELETE /categories/:id", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  });
});

// ---------------- GET BOOKS WITH CATEGORY ----------------
app.get("/books", (req, res) => {
  const sql = `
    SELECT
      books.id,
      books.title,
      books.author,
      books.category_id,
      books.price,
      books.description,
      books.image,
      categories.name AS category
    FROM books
    JOIN categories ON books.category_id = categories.id
    ORDER BY books.id DESC
  `;

  pool.query(sql, (err, rows) => {
    if (err) {
      console.error("Error GET /books", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// ---------------- CREATE BOOK ----------------
app.post("/books", authenticateToken, upload.single('image'), (req, res) => {
  const { title, author, category_id, price, description } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !author || !category_id || !price) {
    return res.status(400).json({ error: "Title, author, category_id, and price are required" });
  }

  const sql = "INSERT INTO books (title, author, category_id, price, description, image) VALUES (?, ?, ?, ?, ?, ?)";

  pool.query(sql, [title, author, category_id, price, description || "", image], (err, result) => {
    if (err) {
      console.error("Error POST /books", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ id: result.insertId, title, author, category_id, price, description, image });
  });
});

// ---------------- UPDATE BOOK ----------------
app.put("/books/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, author, category_id, price, description } = req.body;

  if (!title || !author || !category_id || !price) {
    return res.status(400).json({ error: "Title, author, category_id, and price are required" });
  }

  const sql = "UPDATE books SET title = ?, author = ?, category_id = ?, price = ?, description = ? WHERE id = ?";

  pool.query(sql, [title, author, category_id, price, description || "", id], (err, result) => {
    if (err) {
      console.error("Error PUT /books/:id", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ id, title, author, category_id, price, description });
  });
});

// ---------------- DELETE BOOK ----------------
app.delete("/books/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM books WHERE id = ?";

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error DELETE /books/:id", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
