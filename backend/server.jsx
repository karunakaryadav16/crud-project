const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite3 module

const app = express();
const port = 3033;

app.use(cors());
app.use(bodyParser.json());

// Create a SQLite database connection
const db = new sqlite3.Database('mydatabase.db'); // Use the name of your SQLite database file

// Create a table to store items if it doesn't already exist
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT)');
});

// Create an item (C - Create)
app.post('/items', (req, res) => {
  const newItemName = req.body.name;
  const sql = 'INSERT INTO items (name) VALUES (?)';
  const params = [newItemName];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name: newItemName });
  });
});

// Read all items (R - Read)
app.get('/items', (req, res) => {
  const sql = 'SELECT * FROM items';

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Read a single item by ID
app.get('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const sql = 'SELECT * FROM items WHERE id = ?';
  const params = [itemId];

  db.get(sql, params, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(row);
  });
});

// Update an item by ID (U - Update)
app.put('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItemName = req.body.name;
  const sql = 'UPDATE items SET name = ? WHERE id = ?';
  const params = [updatedItemName, itemId];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: itemId, name: updatedItemName });
  });
});

// Delete an item by ID (D - Delete)
app.delete('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const sql = 'DELETE FROM items WHERE id = ?';
  const params = [itemId];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: itemId });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
