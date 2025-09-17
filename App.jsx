import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api/products";

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "", stock: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const res = await axios.get(API_URL);
    setProducts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(editId){
      await axios.put(`${API_URL}/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({ name: "", price: "", category: "", stock: "" });
    fetchProducts();
  };

  const handleEdit = (p) => { setForm(p); setEditId(p.id); };
  const handleDelete = async (id) => { await axios.delete(`${API_URL}/${id}`); fetchProducts(); };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Sistema de Produtos</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
        <input placeholder="Preço" value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} />
        <input placeholder="Categoria" value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} />
        <input placeholder="Estoque" value={form.stock} onChange={(e)=>setForm({...form, stock:e.target.value})} />
        <button type="submit">{editId?"Atualizar":"Adicionar"}</button>
      </form>
      <h2>Lista de Produtos</h2>
      <ul>
        {products.map(p=>(
          <li key={p.id}>
            {p.name} - R${p.price} - {p.category} - Estoque: {p.stock}
            <button onClick={()=>handleEdit(p)}>Editar</button>
            <button onClick={()=>handleDelete(p.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}