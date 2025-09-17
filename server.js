const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(path.resolve(__dirname, "products.db"));

db.serialize(()=>{
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    category TEXT,
    stock INTEGER
  )`);
});

app.get("/api/products", (req,res)=>{
  db.all("SELECT * FROM products", [], (err,rows)=>{
    if(err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/api/products", (req,res)=>{
  const {name, price, category, stock} = req.body;
  db.run("INSERT INTO products (name, price, category, stock) VALUES (?,?,?,?)",
    [name, price, category, stock],
    function(err){
      if(err) return res.status(500).json(err);
      res.json({id:this.lastID, name, price, category, stock});
    });
});

app.put("/api/products/:id", (req,res)=>{
  const {id} = req.params;
  const {name, price, category, stock} = req.body;
  db.run("UPDATE products SET name=?, price=?, category=?, stock=? WHERE id=?",
    [name, price, category, stock, id],
    function(err){
      if(err) return res.status(500).json(err);
      res.json({updated: this.changes});
    });
});

app.delete("/api/products/:id", (req,res)=>{
  const {id} = req.params;
  db.run("DELETE FROM products WHERE id=?", [id], function(err){
    if(err) return res.status(500).json(err);
    res.json({deleted: this.changes});
  });
});

app.listen(PORT, ()=>console.log(`Servidor rodando na porta ${PORT}`));