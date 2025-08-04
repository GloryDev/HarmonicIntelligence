const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for harmonic memory
let harmonicMemory = [];

// GET /api/harmonic-memory - Retrieve all harmonic memory entries
app.get('/api/harmonic-memory', (req, res) => {
  res.json(harmonicMemory);
});

// POST /api/harmonic-memory - Add a new harmonic memory entry
app.post('/api/harmonic-memory', (req, res) => {
  const newEntry = {
    ...req.body,
    id: Date.now(),
    timestamp: new Date().toISOString()
  };
  
  harmonicMemory.push(newEntry);
  
  // Keep only the last 100 entries to prevent memory overflow
  if (harmonicMemory.length > 100) {
    harmonicMemory = harmonicMemory.slice(-100);
  }
  
  res.status(201).json(newEntry);
});

// DELETE /api/harmonic-memory - Clear all memory
app.delete('/api/harmonic-memory', (req, res) => {
  harmonicMemory = [];
  res.json({ message: 'Harmonic memory cleared' });
});

app.listen(PORT, () => {
  console.log(`Harmonic Intelligence API server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET  /api/harmonic-memory - Get all entries`);
  console.log(`  POST /api/harmonic-memory - Add new entry`);
  console.log(`  DELETE /api/harmonic-memory - Clear all entries`);
}); 