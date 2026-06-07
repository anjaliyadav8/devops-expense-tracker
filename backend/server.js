const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const client = require('prom-client');

const app = express();
app.use(cors());
app.use(express.json());

// Prometheus metrics setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const totalExpenses = new client.Gauge({
  name: 'expense_tracker_total_expenses',
  help: 'Total number of expense transactions',
  registers: [register]
});

const totalIncome = new client.Gauge({
  name: 'expense_tracker_total_income',
  help: 'Total number of income transactions',
  registers: [register]
});

const balanceGauge = new client.Gauge({
  name: 'expense_tracker_balance',
  help: 'Current balance (income - expenses)',
  registers: [register]
});

const incomeAmount = new client.Gauge({
  name: 'expense_tracker_income_amount',
  help: 'Total income amount in rupees',
  registers: [register]
});

const expenseAmount = new client.Gauge({
  name: 'expense_tracker_expense_amount',
  help: 'Total expense amount in rupees',
  registers: [register]
});

const httpRequestsTotal = new client.Counter({
  name: 'expense_tracker_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

// File-based storage
const DB = path.join(__dirname, 'expenses.json');
const read = () => { if(!fs.existsSync(DB)) fs.writeFileSync(DB,'[]'); return JSON.parse(fs.readFileSync(DB)); };
const write = (data) => fs.writeFileSync(DB, JSON.stringify(data,null,2));

// Update gauges from current data
const updateMetrics = () => {
  const data = read();
  const income  = data.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
  const expense = data.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
  totalIncome.set(data.filter(t => t.type === 'income').length);
  totalExpenses.set(data.filter(t => t.type === 'expense').length);
  incomeAmount.set(income);
  expenseAmount.set(expense);
  balanceGauge.set(income - expense);
};

// Middleware to count requests
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsTotal.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

app.get('/api/expenses', (req,res) => res.json(read()));

app.post('/api/expenses', (req,res) => {
  const data = read();
  const tx = { id: Date.now().toString(), ...req.body };
  data.unshift(tx); write(data);
  updateMetrics();
  res.status(201).json(tx);
});

app.delete('/api/expenses/:id', (req,res) => {
  write(read().filter(t => t.id !== req.params.id));
  updateMetrics();
  res.json({ message:'Deleted' });
});

app.get('/api/summary', (req,res) => {
  const data = read();
  const income  = data.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expense = data.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  res.json({ income, expense, balance: income-expense, total: data.length });
});

app.get('/health', (req,res) => res.json({ status:'ok', message:'Expense Tracker API Running!' }));

// Prometheus metrics endpoint
app.get('/metrics', async (req,res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

updateMetrics();
app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
