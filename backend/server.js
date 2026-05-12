const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB = path.join(__dirname, 'expenses.json');
const read = () => { if(!fs.existsSync(DB)) fs.writeFileSync(DB,'[]'); return JSON.parse(fs.readFileSync(DB)); };
const write = (data) => fs.writeFileSync(DB, JSON.stringify(data,null,2));

app.get('/api/expenses', (req,res) => res.json(read()));
app.post('/api/expenses', (req,res) => {
  const data = read();
  const tx = { id: Date.now().toString(), ...req.body };
  data.unshift(tx); write(data); res.status(201).json(tx);
});
app.delete('/api/expenses/:id', (req,res) => {
  write(read().filter(t => t.id !== req.params.id));
  res.json({ message:'Deleted' });
});
app.get('/api/summary', (req,res) => {
  const data = read();
  const income  = data.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expense = data.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  res.json({ income, expense, balance: income-expense, total: data.length });
});
app.get('/health', (req,res) => res.json({ status:'ok', message:'Expense Tracker API Running!' }));

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
