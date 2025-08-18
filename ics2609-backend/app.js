require('dotenv').config();
const express = require('express');
const pool = require('./db');
const app = express();

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'up' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/version', (_req, res) => {
  res.json({ app: 'ics2609-backend', version: 'w1' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log('Server listening on :' + port));